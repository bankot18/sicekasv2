// ============================================================================
// SICEKAS v2.0 - CLOUDFLARE PAGES FUNCTIONS (EDGE REST API GATEWAY)
// Database Engine: Cloudflare D1 (Serverless SQLite)
// ============================================================================

const jsonResponse = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
};

async function handleApiRequest(request, env, ctx) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const pathname = url.pathname;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Database Binding check
  const db = env.DB;
  if (!db) {
    return jsonResponse({
      success: false,
      error: 'Cloudflare D1 Database binding [DB] tidak ditemukan pada environment ini.',
      edge_engine: 'Cloudflare Pages Functions'
    }, 503);
  }

  try {
    // ------------------------------------------------------------------------
    // 1. HEALTH & DIAGNOSTICS ENDPOINT (/api/health)
    // ------------------------------------------------------------------------
    if (pathname === '/api/health' || pathname === '/api/ping') {
      const start = Date.now();
      const countRes = await db.prepare('SELECT COUNT(*) AS total FROM users').first();
      const latency = Date.now() - start;

      return jsonResponse({
        success: true,
        status: 'ONLINE',
        app: 'SICEKAS v2.0',
        platform: 'Cloudflare Pages & D1 Database',
        edge_colo: request.cf?.colo || 'CGK',
        edge_country: request.cf?.country || 'ID',
        d1_connected: true,
        total_registered_users: countRes?.total || 0,
        latency_ms: latency,
        timestamp: new Date().toISOString()
      });
    }

    // ------------------------------------------------------------------------
    // 2. AUTH LOGIN (/api/auth/login)
    // ------------------------------------------------------------------------
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await request.json();
      const { username, password } = body;

      if (!username || !password) {
        return jsonResponse({ success: false, error: 'Username dan kata sandi wajib diisi!' }, 400);
      }

      const user = await db.prepare(
        'SELECT * FROM users WHERE (username = ? OR nip = ?) AND is_active = 1'
      ).bind(username, username).first();

      if (!user || user.password_hash !== password) {
        return jsonResponse({ success: false, error: 'Username atau kata sandi tidak valid!' }, 401);
      }

      // Log successful login
      await db.prepare(
        'INSERT INTO audit_logs (user_nip, user_nama, category, action, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(user.nip, user.nama, 'AUTH', 'LOGIN_SUCCESS', `Login sukses akun ${user.nama} (${user.role})`, request.headers.get('CF-Connecting-IP') || '127.0.0.1').run();

      const { password_hash, ...userProfile } = user;
      return jsonResponse({
        success: true,
        message: `Selamat datang, ${user.nama}!`,
        user: userProfile
      });
    }

    // ------------------------------------------------------------------------
    // 3. USERS MANAGEMENT (/api/users, /api/users/update-role, /api/users/reset-pass)
    // ------------------------------------------------------------------------
    if (pathname === '/api/users' && method === 'GET') {
      const { results } = await db.prepare('SELECT id, no_urut, username, nip, nip_full, nama, jabatan, golongan, role, avatar, is_active, updated_at FROM users ORDER BY no_urut ASC').all();
      return jsonResponse({ success: true, total: results.length, users: results });
    }

    if (pathname === '/api/users/update-role' && method === 'POST') {
      const body = await request.json();
      const { nip, role } = body;

      if (!nip || !role) {
        return jsonResponse({ success: false, error: 'NIP dan role wajib diisi!' }, 400);
      }

      await db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE nip = ?').bind(role, nip).run();

      await db.prepare(
        'INSERT INTO audit_logs (user_nip, user_nama, category, action, details) VALUES (?, ?, ?, ?, ?)'
      ).bind(nip, 'System', 'AUTH', 'UPDATE_ROLE', `Hak akses pegawai NIP ${nip} diubah menjadi ${role}`).run();

      return jsonResponse({ success: true, message: `Hak akses pegawai [${nip}] berhasil diubah menjadi: ${role}` });
    }

    if (pathname === '/api/users/reset-pass' && method === 'POST') {
      const body = await request.json();
      const { nip } = body;

      if (!nip) {
        return jsonResponse({ success: false, error: 'NIP pegawai wajib diisi!' }, 400);
      }

      await db.prepare('UPDATE users SET password_hash = "213117", updated_at = CURRENT_TIMESTAMP WHERE nip = ?').bind(nip).run();
      return jsonResponse({ success: true, message: `Kata sandi pegawai [${nip}] berhasil di-reset ke default.` });
    }

    if (pathname === '/api/users/change-password' && method === 'POST') {
      const body = await request.json();
      const { nip, username, oldPassword, newPassword } = body;

      if (!oldPassword || !newPassword) {
        return jsonResponse({ success: false, error: 'Password saat ini dan password baru wajib diisi!' }, 400);
      }

      if (newPassword.length < 6) {
        return jsonResponse({ success: false, error: 'Password baru minimal 6 karakter!' }, 400);
      }

      let user = null;
      if (nip) {
        user = await db.prepare('SELECT * FROM users WHERE nip = ?').bind(nip).first();
      } else if (username) {
        user = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
      }

      if (!user) {
        return jsonResponse({ success: false, error: 'Akun pegawai tidak ditemukan di database!' }, 404);
      }

      if (user.password_hash !== oldPassword) {
        return jsonResponse({ success: false, error: 'Password saat ini yang Anda masukkan salah!' }, 401);
      }

      await db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(newPassword, user.id).run();

      await db.prepare(
        'INSERT INTO audit_logs (user_nip, user_nama, category, action, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(user.nip, user.nama, 'AUTH', 'CHANGE_PASSWORD', `Password akun ${user.nama} berhasil diperbarui`, request.headers.get('CF-Connecting-IP') || '127.0.0.1').run();

      return jsonResponse({
        success: true,
        message: `Kata sandi akun [${user.nama}] berhasil diperbarui di Cloudflare D1 Database!`
      });
    }

    // ------------------------------------------------------------------------
    // 4. JADWAL KEGIATAN (/api/jadwal, /api/jadwal/save, /api/jadwal/delete)
    // ------------------------------------------------------------------------
    if (pathname === '/api/jadwal' && method === 'GET') {
      const bulan = url.searchParams.get('bulan');
      const tahun = url.searchParams.get('tahun');

      let query = 'SELECT * FROM jadwal_kegiatan';
      const params = [];

      if (bulan && tahun) {
        query += ' WHERE bulan = ? AND tahun = ?';
        params.push(parseInt(bulan), parseInt(tahun));
      }

      query += ' ORDER BY tanggal ASC';
      const stmt = db.prepare(query);
      const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

      const parsed = results.map(r => ({
        ...r,
        rekan_kolaborasi: typeof r.rekan_kolaborasi === 'string' ? JSON.parse(r.rekan_kolaborasi || '[]') : (r.rekan_kolaborasi || [])
      }));

      return jsonResponse({ success: true, total: parsed.length, data: parsed });
    }

    if (pathname === '/api/jadwal/save' && method === 'POST') {
      const item = await request.json();
      const id = item.id || `bok-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const dateObj = new Date(item.tanggal);
      const bulan = item.bulan || (dateObj.getMonth() + 1);
      const tahun = item.tahun || dateObj.getFullYear();
      const collabJson = typeof item.rekan_kolaborasi === 'string' ? item.rekan_kolaborasi : JSON.stringify(item.rekan_kolaborasi || []);

      await db.prepare(`
        INSERT INTO jadwal_kegiatan (id, tanggal, bulan, tahun, nama_kegiatan, keterangan, lokasi, petugas_nip, petugas_nama, petugas_jabatan, rekan_kolaborasi, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          tanggal = excluded.tanggal,
          bulan = excluded.bulan,
          tahun = excluded.tahun,
          nama_kegiatan = excluded.nama_kegiatan,
          keterangan = excluded.keterangan,
          lokasi = excluded.lokasi,
          petugas_nip = excluded.petugas_nip,
          petugas_nama = excluded.petugas_nama,
          petugas_jabatan = excluded.petugas_jabatan,
          rekan_kolaborasi = excluded.rekan_kolaborasi,
          status = excluded.status,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        item.tanggal,
        bulan,
        tahun,
        item.nama_kegiatan || item.kegiatan || '',
        item.keterangan || item.uraian || '',
        item.lokasi || '',
        item.petugas_nip || item.nip || '',
        item.petugas_nama || item.nama || '',
        item.petugas_jabatan || item.jabatan || '',
        collabJson,
        item.status || 'Disetujui'
      ).run();

      return jsonResponse({ success: true, message: 'Jadwal kegiatan berhasil disimpan ke Cloudflare D1!', id });
    }

    if (pathname === '/api/jadwal/delete' && (method === 'DELETE' || method === 'POST')) {
      const body = await request.json();
      const { id } = body;

      if (!id) {
        return jsonResponse({ success: false, error: 'ID jadwal kegiatan wajib disertakan!' }, 400);
      }

      await db.prepare('DELETE FROM jadwal_kegiatan WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true, message: `Jadwal [${id}] berhasil dihapus dari Cloudflare D1.` });
    }

    // ------------------------------------------------------------------------
    // 5. POA BULANAN (/api/poa, /api/poa/save)
    // ------------------------------------------------------------------------
    if (pathname === '/api/poa' && method === 'GET') {
      const bulan = url.searchParams.get('bulan');
      const tahun = url.searchParams.get('tahun');
      const nip = url.searchParams.get('nip');

      let query = 'SELECT * FROM poa_bulanan WHERE 1=1';
      const params = [];

      if (bulan && tahun) {
        query += ' AND bulan = ? AND tahun = ?';
        params.push(parseInt(bulan), parseInt(tahun));
      }
      if (nip) {
        query += ' AND petugas_nip = ?';
        params.push(nip);
      }

      query += ' ORDER BY created_at DESC';
      const { results } = await db.prepare(query).bind(...params).all();
      return jsonResponse({ success: true, total: results.length, data: results });
    }

    if (pathname === '/api/poa/save' && method === 'POST') {
      const item = await request.json();
      const id = item.id || `poa-${Date.now()}`;
      const bulan = parseInt(item.bulan) || (new Date().getMonth() + 1);
      const tahun = parseInt(item.tahun) || new Date().getFullYear();

      await db.prepare(`
        INSERT INTO poa_bulanan (id, bulan, tahun, petugas_nip, petugas_nama, program_kesehatan, uraian_kegiatan, target_sasaran, lokasi_pelaksanaan, vol_kegiatan, satuan, anggaran_bok, sumber_dana, status, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          bulan = excluded.bulan,
          tahun = excluded.tahun,
          program_kesehatan = excluded.program_kesehatan,
          uraian_kegiatan = excluded.uraian_kegiatan,
          target_sasaran = excluded.target_sasaran,
          lokasi_pelaksanaan = excluded.lokasi_pelaksanaan,
          vol_kegiatan = excluded.vol_kegiatan,
          satuan = excluded.satuan,
          anggaran_bok = excluded.anggaran_bok,
          sumber_dana = excluded.sumber_dana,
          status = excluded.status,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        bulan,
        tahun,
        item.petugas_nip || item.nip || '',
        item.petugas_nama || item.nama || '',
        item.program_kesehatan || item.program || '',
        item.uraian_kegiatan || item.uraian || '',
        item.target_sasaran || '',
        item.lokasi_pelaksanaan || '',
        parseInt(item.vol_kegiatan) || 1,
        item.satuan || 'Kegiatan',
        parseFloat(item.anggaran_bok) || 0,
        item.sumber_dana || 'BOK Puskesmas',
        item.status || 'Aktif'
      ).run();

      return jsonResponse({ success: true, message: 'POA Bulanan berhasil disimpan ke Cloudflare D1!', id });
    }

    // ------------------------------------------------------------------------
    // 6. TP POL JASPEL (/api/tppol, /api/tppol/save)
    // ------------------------------------------------------------------------
    if (pathname === '/api/tppol' && method === 'GET') {
      const bulan = url.searchParams.get('bulan');
      const tahun = url.searchParams.get('tahun');
      const nip = url.searchParams.get('nip');

      let query = 'SELECT * FROM tppol_jaspel WHERE 1=1';
      const params = [];

      if (bulan && tahun) {
        query += ' AND bulan = ? AND tahun = ?';
        params.push(parseInt(bulan), parseInt(tahun));
      }
      if (nip) {
        query += ' AND petugas_nip = ?';
        params.push(nip);
      }

      query += ' ORDER BY created_at DESC';
      const { results } = await db.prepare(query).bind(...params).all();
      return jsonResponse({ success: true, total: results.length, data: results });
    }

    if (pathname === '/api/tppol/save' && method === 'POST') {
      const item = await request.json();
      const id = item.id || `tppol-${item.petugas_nip || 'user'}-${item.bulan || '0'}-${item.tahun || '2026'}`;
      const bulan = parseInt(item.bulan) || (new Date().getMonth() + 1);
      const tahun = parseInt(item.tahun) || new Date().getFullYear();

      await db.prepare(`
        INSERT INTO tppol_jaspel (id, bulan, tahun, petugas_nip, petugas_nama, petugas_jabatan, skor_kehadiran, skor_pelayanan, skor_administrasi, skor_perilaku, total_skor, catatan, status_verifikasi, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          bulan = excluded.bulan,
          tahun = excluded.tahun,
          skor_kehadiran = excluded.skor_kehadiran,
          skor_pelayanan = excluded.skor_pelayanan,
          skor_administrasi = excluded.skor_administrasi,
          skor_perilaku = excluded.skor_perilaku,
          total_skor = excluded.total_skor,
          catatan = excluded.catatan,
          status_verifikasi = excluded.status_verifikasi,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        bulan,
        tahun,
        item.petugas_nip || item.nip || '',
        item.petugas_nama || item.nama || '',
        item.petugas_jabatan || item.jabatan || '',
        parseFloat(item.skor_kehadiran) || 100.0,
        parseFloat(item.skor_pelayanan) || 95.0,
        parseFloat(item.skor_administrasi) || 90.0,
        parseFloat(item.skor_perilaku) || 95.0,
        parseFloat(item.total_skor) || 95.0,
        item.catatan || '',
        item.status_verifikasi || 'Terverifikasi'
      ).run();

      return jsonResponse({ success: true, message: 'Scoring TP POL berhasil disimpan ke Cloudflare D1!', id });
    }

    // ------------------------------------------------------------------------
    // 7. SPPD & LPT (/api/sppd, /api/sppd/save)
    // ------------------------------------------------------------------------
    if (pathname === '/api/sppd' && method === 'GET') {
      const id = url.searchParams.get('id');
      const nip = url.searchParams.get('nip');

      let query = 'SELECT * FROM sppd_lpt WHERE 1=1';
      const params = [];
      if (id) { query += ' AND id = ?'; params.push(id); }
      if (nip) { query += ' AND petugas_nip = ?'; params.push(nip); }

      query += ' ORDER BY created_at DESC';
      const { results } = await db.prepare(query).bind(...params).all();
      return jsonResponse({ success: true, total: results.length, data: results });
    }

    if (pathname === '/api/sppd/save' && method === 'POST') {
      const item = await request.json();
      const id = item.id || `sppd-${Date.now()}`;
      const fotoJson = typeof item.foto_dokumentasi === 'string' ? item.foto_dokumentasi : JSON.stringify(item.foto_dokumentasi || []);

      await db.prepare(`
        INSERT INTO sppd_lpt (id, no_surat, tanggal_surat, petugas_nip, petugas_nama, maksud_perjalanan, tempat_tujuan, tanggal_berangkat, tanggal_kembali, lama_hari, alat_angkut, hasil_kegiatan, kendala_masalah, saran_tindak_lanjut, foto_dokumentasi, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          no_surat = excluded.no_surat,
          tanggal_surat = excluded.tanggal_surat,
          maksud_perjalanan = excluded.maksud_perjalanan,
          tempat_tujuan = excluded.tempat_tujuan,
          tanggal_berangkat = excluded.tanggal_berangkat,
          tanggal_kembali = excluded.tanggal_kembali,
          lama_hari = excluded.lama_hari,
          alat_angkut = excluded.alat_angkut,
          hasil_kegiatan = excluded.hasil_kegiatan,
          kendala_masalah = excluded.kendala_masalah,
          saran_tindak_lanjut = excluded.saran_tindak_lanjut,
          foto_dokumentasi = excluded.foto_dokumentasi,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        item.no_surat || '090/001/PKM-BK/2026',
        item.tanggal_surat || new Date().toISOString().slice(0, 10),
        item.petugas_nip || '',
        item.petugas_nama || '',
        item.maksud_perjalanan || '',
        item.tempat_tujuan || '',
        item.tanggal_berangkat || new Date().toISOString().slice(0, 10),
        item.tanggal_kembali || new Date().toISOString().slice(0, 10),
        parseInt(item.lama_hari) || 1,
        item.alat_angkut || 'Kendaraan Pribadi',
        item.hasil_kegiatan || '',
        item.kendala_masalah || '',
        item.saran_tindak_lanjut || '',
        fotoJson
      ).run();

      return jsonResponse({ success: true, message: 'SPPD & LPT berhasil disimpan ke Cloudflare D1!', id });
    }

    // ------------------------------------------------------------------------
    // 8. SUPER ADMIN SQL RUNNER CONSOLE (/api/sql)
    // ------------------------------------------------------------------------
    if (pathname === '/api/sql' && method === 'POST') {
      const body = await request.json();
      const { sql, secret_key } = body;

      if (!sql) {
        return jsonResponse({ success: false, error: 'Query SQL wajib disertakan!' }, 400);
      }

      const isSelect = sql.trim().toLowerCase().startsWith('select');
      const stmt = db.prepare(sql);

      if (isSelect) {
        const { results } = await stmt.all();
        return jsonResponse({ success: true, type: 'SELECT', row_count: results.length, rows: results });
      } else {
        const info = await stmt.run();
        return jsonResponse({ success: true, type: 'MUTATE', info });
      }
    }

    // ------------------------------------------------------------------------
    // 9. DATABASE BACKUP EXPORT (/api/export-db)
    // ------------------------------------------------------------------------
    if (pathname === '/api/export-db' && method === 'GET') {
      const [users, jadwal, poa, tppol, sppd] = await Promise.all([
        db.prepare('SELECT * FROM users').all(),
        db.prepare('SELECT * FROM jadwal_kegiatan').all(),
        db.prepare('SELECT * FROM poa_bulanan').all(),
        db.prepare('SELECT * FROM tppol_jaspel').all(),
        db.prepare('SELECT * FROM sppd_lpt').all()
      ]);

      return jsonResponse({
        success: true,
        app: 'SICEKAS v2.0',
        database_engine: 'Cloudflare D1',
        exported_at: new Date().toISOString(),
        tables: {
          users: users.results,
          jadwal_kegiatan: jadwal.results,
          poa_bulanan: poa.results,
          tppol_jaspel: tppol.results,
          sppd_lpt: sppd.results
        }
      });
    }

    // 404 Route Not Found
    return jsonResponse({ success: false, error: `Endpoint API tidak ditemukan: ${method} ${pathname}` }, 404);

  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message || 'Internal Server Error pada Cloudflare & D1 Database'
    }, 500);
  }
}

// 1. Support Cloudflare Pages Functions
export async function onRequest(context) {
  return handleApiRequest(context.request, context.env, context);
}

// 2. Support Cloudflare Workers (Format ES Module - Wajib untuk D1 Database Binding)
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Routes Handler
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(request, env, ctx);
    }

    // Static Assets Handler (Cloudflare Workers Assets)
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      const res = await env.ASSETS.fetch(request);
      if (res.status === 404) {
        if (url.pathname === '/dashboard') {
          return env.ASSETS.fetch(new Request(new URL('/dashboard.html', request.url), request));
        }
        if (url.pathname === '/login') {
          return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
        }
      }
      return res;
    }

    return handleApiRequest(request, env, ctx);
  }
};
