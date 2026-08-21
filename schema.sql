CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  no_urut INTEGER,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '213117',
  nip TEXT UNIQUE NOT NULL,
  nip_full TEXT,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  golongan TEXT NOT NULL DEFAULT 'BLUD',
  role TEXT NOT NULL DEFAULT 'Petugas Puskesmas',
  avatar TEXT DEFAULT 'MF',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jadwal_kegiatan (
  id TEXT PRIMARY KEY,
  tanggal DATE NOT NULL,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  nama_kegiatan TEXT NOT NULL,
  keterangan TEXT,
  lokasi TEXT,
  petugas_nip TEXT NOT NULL,
  petugas_nama TEXT NOT NULL,
  petugas_jabatan TEXT,
  rekan_kolaborasi TEXT,
  status TEXT NOT NULL DEFAULT 'Disetujui',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poa_bulanan (
  id TEXT PRIMARY KEY,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  petugas_nip TEXT NOT NULL,
  petugas_nama TEXT NOT NULL,
  program_kesehatan TEXT NOT NULL,
  uraian_kegiatan TEXT NOT NULL,
  target_sasaran TEXT,
  lokasi_pelaksanaan TEXT,
  vol_kegiatan INTEGER DEFAULT 1,
  satuan TEXT DEFAULT 'Kegiatan',
  anggaran_bok REAL DEFAULT 0,
  sumber_dana TEXT DEFAULT 'BOK Puskesmas',
  status TEXT DEFAULT 'Aktif',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tppol_jaspel (
  id TEXT PRIMARY KEY,
  bulan INTEGER NOT NULL,
  tahun INTEGER NOT NULL,
  petugas_nip TEXT NOT NULL,
  petugas_nama TEXT NOT NULL,
  petugas_jabatan TEXT NOT NULL,
  skor_kehadiran REAL DEFAULT 100.0,
  skor_pelayanan REAL DEFAULT 95.0,
  skor_administrasi REAL DEFAULT 90.0,
  skor_perilaku REAL DEFAULT 95.0,
  total_skor REAL DEFAULT 95.0,
  catatan TEXT,
  status_verifikasi TEXT DEFAULT 'Terverifikasi',
  verified_by TEXT,
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sppd_lpt (
  id TEXT PRIMARY KEY,
  no_surat TEXT NOT NULL,
  tanggal_surat DATE NOT NULL,
  petugas_nip TEXT NOT NULL,
  petugas_nama TEXT NOT NULL,
  maksud_perjalanan TEXT NOT NULL,
  tempat_tujuan TEXT NOT NULL,
  tanggal_berangkat DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  lama_hari INTEGER DEFAULT 1,
  alat_angkut TEXT DEFAULT 'Kendaraan Pribadi / Umum',
  hasil_kegiatan TEXT,
  kendala_masalah TEXT,
  saran_tindak_lanjut TEXT,
  foto_dokumentasi TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_nip TEXT,
  user_nama TEXT,
  category TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'SUCCESS',
  ip_address TEXT DEFAULT '127.0.0.1'
);

INSERT OR REPLACE INTO users (no_urut, username, password_hash, nip, nip_full, nama, jabatan, golongan, role, avatar) VALUES
(1, 'rina', '213117', '19740404 201411 2 001', 'NIP. 19740404 201411 2 001', 'dr. Rina Indriati', 'Kepala Puskesmas', 'III/d', 'Kepala Puskesmas', 'RI'),
(2, 'teti', '213117', '19750816 200701 2 012', 'NIP. 19750816 200701 2 012', 'Teti Nuryati, S.Keb, Bdn', 'Satker/Bidan Mahir', 'III/b', 'PJ Klaster', 'TN'),
(3, 'satrianita', '213117', '19730908 199403 2 006', 'NIP. 19730908 199403 2 006', 'Satrianita, SKM', 'Sanitarian Ahli Muda', 'IV/b', 'Admin', 'SN'),
(4, 'asepyanto', '213117', '19690623 199103 1 002', 'NIP. 19690623 199103 1 002', 'Asep Yanto, AMKG', 'Perawat Gigi Penyelia', 'III/d', 'Petugas Puskesmas', 'AY'),
(5, 'yayat', '213117', '19690613 198903 2 005', 'NIP. 19690613 198903 2 005', 'N. Yayat Rohayati, AM.Keb', 'Bidan Penyelia', 'III/d', 'Petugas Puskesmas', 'YR'),
(6, 'tetimulyati', '213117', '19680825 199003 2 008', 'NIP. 19680825 199003 2 008', 'Rd Teti Mulyati, Amd.Kep', 'Perawat Penyelia', 'III/d', 'Petugas Puskesmas', 'TM'),
(7, 'indri', '213117', '19681004 199103 2 007', 'NIP. 19681004 199103 2 007', 'Indri Yusiana, Amd.Kep', 'Perawat Penyelia', 'III/d', 'Petugas Puskesmas', 'IY'),
(8, 'santi', '213117', '19781014 200501 2 007', 'NIP. 19781014 200501 2 007', 'Santi Sentri Yanti, S.Keb', 'Bidan Pelaksana', 'III/d', 'Petugas Puskesmas', 'SS'),
(9, 'imas', '213117', '19690524 200604 2 004', 'NIP. 19690524 200604 2 004', 'Imas Winarti, AM.Keb', 'Bidan Pelaksana', 'III/a', 'Petugas Puskesmas', 'IW'),
(10, 'eva', '213117', '19840508 201704 2 011', 'NIP. 19840508 201704 2 011', 'Eva Farida, S.Keb', 'Bidan Mahir', 'III/a', 'Petugas Puskesmas', 'EF'),
(11, 'nengyulia', '213117', '19860725 201704 2 007', 'NIP. 19860725 201704 2 007', 'Neng Yulia Ernawati, S.Keb', 'Bidan Pelaksana', 'III/a', 'Petugas Puskesmas', 'NY'),
(12, 'evasolina', '213117', '19821219 201704 2 003', 'NIP. 19821219 201704 2 003', 'Eva Solina, S.Keb', 'Bidan Pelaksana', 'III/a', 'Petugas Puskesmas', 'ES'),
(13, 'riza', '213117', '19910127 202203 2 010', 'NIP. 19910127 202203 2 010', 'Riza Nur Multiani, A.Md.AK', 'Penata Laboratorium Kesehatan Terampil', 'II/c', 'Petugas Puskesmas', 'RN'),
(14, 'drg_regina', '213117', '19930805 202505 2 002', 'NIP. 19930805 202505 2 002', 'drg. Regina Desi Gresiana Simamora', 'Dokter Gigi Ahli Pertama', 'III/b', 'Petugas Puskesmas', 'RG'),
(15, 'nurul', '213117', '20001224 202505 2 002', 'NIP. 20001224 202505 2 002', 'Nurul Hidayah, Amd.Kes', 'Terapis Gigi dan Mulut Terampil', 'II/c', 'Petugas Puskesmas', 'NH'),
(16, 'dadi', '213117', '19840525 202221 1 001', 'NIP. 19840525 202221 1 001', 'Dadi Permadi, SKM', 'Penyuluh Kesehatan Ahli Pertama', 'IX', 'PJ Klaster', 'DP'),
(17, 'anisa', '213117', '19880321 202321 2 001', 'NIP. 19880321 202321 2 001', 'Anisa Rohmatunisa, AM.Keb', 'Bidan Terampil', 'VII', 'Petugas Puskesmas', 'AR'),
(18, 'nina', '213117', '19960728 202321 2 005', 'NIP. 19960728 202321 2 005', 'Nina Mariyana, Amd.Kep', 'Perawat Terampil', 'VII', 'Petugas Puskesmas', 'NM'),
(19, 'sheila', '213117', '19930713 202321 2 003', 'NIP. 19930713 202321 2 003', 'Sheila Nurlaila, A.Md.Gz', 'Nutrisionis Terampil', 'VII', 'Petugas Puskesmas', 'SN'),
(20, 'debby', '213117', '19921004 202521 2 044', 'NIP. 19921004 202521 2 044', 'Debby Nadia Lofika, S.Farm. Apt', 'Apoteker', 'IX', 'Petugas Puskesmas', 'DL'),
(21, 'lutfiyatun', '213117', '873.3204.10.02.005', 'NRP. 873.3204.10.02.005', 'Lutfiyatun Oktaviana, S.Kep.Ners', 'Perawat', 'PPTK PW', 'Petugas Puskesmas', 'LO'),
(22, 'dr_dinar', '213117', '873.3204.07.05.005', 'NRP. 873.3204.07.05.005', 'dr. Dinar Dwi Restika Agustin', 'Dokter Umum', 'BLUD', 'Petugas Puskesmas', 'DD'),
(23, 'dr_putri', '213117', '873.3204.08.06.029', 'NRP. 873.3204.08.06.029', 'dr. Putri Tasya Afifah', 'Dokter Umum', 'BLUD', 'Petugas Puskesmas', 'PT'),
(24, 'drg_intan', '213117', '873.3204.08.06.019', 'NRP. 873.3204.08.06.019', 'drg. Intan Nur Atsila', 'Dokter Gigi', 'BLUD', 'Petugas Puskesmas', 'IN'),
(25, 'rini', '213117', '873.06.02.021', 'NRP. 873.06.02.021', 'Rini Julianti, SE', 'Akuntan', 'BLUD', 'Petugas Puskesmas', 'RJ'),
(26, 'andriana', '213117', '873.120.10.03', 'NRP. 873.120.10.03', 'Andriana Mahardhytia, Amd.Kes', 'Rekam Medis', 'BLUD', 'Petugas Puskesmas', 'AM'),
(27, 'dilla', '213117', '873.3204.13.03.012', 'NRP. 873.3204.13.03.012', 'Dilla Anggraeni Pratiwi, A.Md.Akun', 'Admin BOK', 'BLUD', 'Admin', 'DA'),
(28, 'ozie', '213117', '873.3204.16.02.008', 'NRP. 873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', 'BLUD', 'Super Admin', 'MF'),
(29, 'ilham', '213117', '873.3204.11.06.011', 'NRP. 873.3204.11.06.011', 'Ilham Ardiansyah Isnandar, SKM', 'Epidemiolog', 'BLUD', 'Petugas Puskesmas', 'IA'),
(30, 'rian', '213117', '873.3204.12.06.007', 'NRP. 873.3204.12.06.007', 'Rian Sidik Sudiana, Amd.Kes', 'Rekam Medis', 'BLUD', 'Petugas Puskesmas', 'RS'),
(31, 'fahri', '213117', '873.3204.13.07.037', 'NRP. 873.3204.13.07.037', 'Fahri Dzulfikar Rismayanto, A.Md. Bns', 'Admin BLUD', 'BLUD', 'Admin', 'FD'),
(32, 'mutiara', '213117', '873.3204.05.05.005', 'NRP. 873.3204.05.05.005', 'Mutiara Sofiatussirri, Amd.', 'ATLM', 'BLUD', 'Petugas Puskesmas', 'MS'),
(33, 'faridz', '213117', '873.3204.14.05.040', 'NRP. 873.3204.14.05.040', 'Muhamad Faridz Alparizy, Amd.Kep', 'Perawat', 'BLUD', 'Petugas Puskesmas', 'FA'),
(34, 'nengsafitri', '213117', '873.3204.09.06.106', 'NRP. 873.3204.09.06.106', 'Neng Safitri Nur Ladyawati, AM.Keb', 'Bidan Desa', 'BLUD', 'Petugas Puskesmas', 'NS'),
(35, 'dani', '213117', '873.3204.18.01.002', 'NRP. 873.3204.18.01.002', 'Dani Setiadi, S.Farm', 'TTK', 'BLUD', 'Petugas Puskesmas', 'DS'),
(36, 'ripan', '213117', 'BLUD-SEC-01', 'NRP. BLUD-SEC-01', 'Ripan Sutiana', 'Petugas Keamanan', 'BLUD', 'Petugas Puskesmas', 'RS'),
(37, 'mevi', '213117', 'BLUD-CL-01', 'NRP. BLUD-CL-01', 'Mevi Riyanayasti', 'Petugas Kebersihan', 'BLUD', 'Petugas Puskesmas', 'MR'),
(38, 'adeboy', '213117', 'BLUD-DRV-01', 'NRP. BLUD-DRV-01', 'Ade Boy', 'Supir', 'BLUD', 'Petugas Puskesmas', 'AB'),
(39, 'suhara', '213117', 'BLUD-SEC-02', 'NRP. BLUD-SEC-02', 'Suhara', 'Petugas Keamanan', 'BLUD', 'Petugas Puskesmas', 'SH');

INSERT OR REPLACE INTO jadwal_kegiatan (id, tanggal, bulan, tahun, nama_kegiatan, keterangan, lokasi, petugas_nip, petugas_nama, petugas_jabatan, rekan_kolaborasi, status) VALUES
('bok-seed-1', '2026-08-04', 8, 2026, 'Pelaksanaan Surveilans Gizi dan Penimbangan Posyandu', 'Pemantauan status gizi balita & stunting', 'Posyandu Melati 1, Desa Banjaran', '873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', '[]', 'Disetujui'),
('bok-seed-2', '2026-08-08', 8, 2026, 'Pemberian Makanan Tambahan (PMT) Berbahan Pangan Lokal Balita', 'Intervensi pemulihan gizi balita resti stunting', 'Posyandu Mawar 3, Desa Tarajusari', '873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', '[]', 'Disetujui'),
('bok-seed-3', '2026-08-11', 8, 2026, 'Pemeriksaan Kesehatan Berkala dan Skrining PTM Usila', 'Pemeriksaan tekanan darah, gula darah, dan edukasi', 'Posbindu Teratai 2, Desa Sindangpanon', '19730908 199403 2 006', 'Satrianita, SKM', 'Sanitarian Ahli Muda', '[]', 'Disetujui'),
('bok-seed-4', '2026-08-15', 8, 2026, 'Edukasi Gizi Seimbang dan Pencegahan Anemia Remaja Putri', 'Pemberian Tablet Tambah Darah (TTD) di sekolah', 'SMPN 1 Banjaran', '873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', '[]', 'Disetujui'),
('bok-seed-5', '2026-08-19', 8, 2026, 'Kunjungan Rumah Balita Stunting & Pendampingan Keluarga', 'Pemantauan konsumsi makan & sanitasi lingkungan keluarga', 'Desa Banjaran Wetan', '873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', '[]', 'Disetujui'),
('bok-seed-6', '2026-08-25', 8, 2026, 'Kelas Ibu Balita dan Praktik Pengolahan PMT Lokal', 'Pemberdayaan ibu balita dalam penyusunan MP-ASI gizi seimbang', 'Posyandu Anggrek 4, Desa Kamasan', '873.3204.16.02.008', 'Mochamad Fauzie, S.Gz', 'Nutrisionis', '[]', 'Disetujui');

