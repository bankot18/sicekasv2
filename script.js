// ============================================================================
// SICEKAS v2.0 - Clean Login Script (No animations, Cloudflare D1 Auth)
// Puskesmas Banjaran Kota - Dinas Kesehatan Kabupaten Bandung
// ============================================================================

// Theme Toggle (Light/Dark) - Default: Dark Mode
window.toggleTheme = function() {
  const isLight = document.body.classList.toggle('theme-light');
  document.documentElement.classList.toggle('theme-light', isLight);
  localStorage.setItem('SICEKAS_THEME', isLight ? 'light' : 'dark');
  updateThemeUI(isLight);
};

function updateThemeUI(isLight) {
  const text = document.getElementById('themeToggleText');
  const icon = document.getElementById('themeToggleIcon');
  if (text) {
    text.textContent = isLight ? 'Mode Gelap' : 'Mode Terang';
  }
  if (icon) {
    icon.innerHTML = isLight
      ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'
      : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Sync Theme on Load
  const savedTheme = localStorage.getItem('SICEKAS_THEME');
  const isLight = savedTheme === 'light';
  if (isLight) {
    document.body.classList.add('theme-light');
    document.documentElement.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
    document.documentElement.classList.remove('theme-light');
  }
  updateThemeUI(isLight);

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  
  const btnTriggerUserDropdown = document.getElementById('btnTriggerUserDropdown');
  const userDropdownList = document.getElementById('userDropdownList');
  const dropdownItemsList = document.getElementById('dropdownItemsList');
  const dropdownResultCount = document.getElementById('dropdownResultCount');
  
  const btnSignIn = document.getElementById('btnSignIn');
  const statusDot = document.getElementById('statusDot');
  const statusLabel = document.getElementById('statusLabel');
  const loginForm = document.getElementById('loginForm');
  const btnForgotPass = document.getElementById('btnForgotPass');

  let selectedOfficer = null;

  // 39 Official Officers Database
  const OFFICERS_DB = [
    { no: 1, username: 'rina', nip: '19740404 201411 2 001', nama: 'dr. Rina Indriati', jabatan: 'Kepala Puskesmas', gol: 'III/d', role: 'Kepala Puskesmas', avatar: 'RI' },
    { no: 2, username: 'teti', nip: '19750816 200701 2 012', nama: 'Teti Nuryati, S.Keb, Bdn', jabatan: 'Satker/Bidan Mahir', gol: 'III/b', role: 'PJ Klaster', avatar: 'TN' },
    { no: 3, username: 'satrianita', nip: '19730908 199403 2 006', nama: 'Satrianita, SKM', jabatan: 'Sanitarian Ahli Muda', gol: 'IV/b', role: 'Admin', avatar: 'SN' },
    { no: 4, username: 'asepyanto', nip: '19690623 199103 1 002', nama: 'Asep Yanto, AMKG', jabatan: 'Perawat Gigi Penyelia', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'AY' },
    { no: 5, username: 'yayat', nip: '19690613 198903 2 005', nama: 'N. Yayat Rohayati, AM.Keb', jabatan: 'Bidan Penyelia', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'YR' },
    { no: 6, username: 'tetimulyati', nip: '19680825 199003 2 008', nama: 'Rd Teti Mulyati, Amd.Kep', jabatan: 'Perawat Penyelia', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'TM' },
    { no: 7, username: 'indri', nip: '19681004 199103 2 007', nama: 'Indri Yusiana, Amd.Kep', jabatan: 'Perawat Penyelia', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'IY' },
    { no: 8, username: 'santi', nip: '19781014 200501 2 007', nama: 'Santi Sentri Yanti, S.Keb', jabatan: 'Bidan Pelaksana', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'SS' },
    { no: 9, username: 'imas', nip: '19690524 200604 2 004', nama: 'Imas Winarti, AM.Keb', jabatan: 'Bidan Pelaksana', gol: 'III/a', role: 'Petugas Puskesmas', avatar: 'IW' },
    { no: 10, username: 'eva', nip: '19840508 201704 2 011', nama: 'Eva Farida, S.Keb', jabatan: 'Bidan Mahir', gol: 'III/a', role: 'Petugas Puskesmas', avatar: 'EF' },
    { no: 11, username: 'nengyulia', nip: '19860725 201704 2 007', nama: 'Neng Yulia Ernawati, S.Keb', jabatan: 'Bidan Pelaksana', gol: 'III/a', role: 'Petugas Puskesmas', avatar: 'NY' },
    { no: 12, username: 'evasolina', nip: '19821219 201704 2 003', nama: 'Eva Solina, S.Keb', jabatan: 'Bidan Pelaksana', gol: 'III/a', role: 'Petugas Puskesmas', avatar: 'ES' },
    { no: 13, username: 'riza', nip: '19910127 202203 2 010', nama: 'Riza Nur Multiani, A.Md.AK', jabatan: 'Penata Laboratorium Kesehatan Terampil', gol: 'II/c', role: 'Petugas Puskesmas', avatar: 'RN' },
    { no: 14, username: 'drg_regina', nip: '19930805 202505 2 002', nama: 'drg. Regina Desi Gresiana Simamora', jabatan: 'Dokter Gigi Ahli Pertama', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'RG' },
    { no: 15, username: 'nurul', nip: '20001224 202505 2 002', nama: 'Nurul Hidayah, Amd.Kes', jabatan: 'Terapis Gigi dan Mulut Terampil', gol: 'II/c', role: 'Petugas Puskesmas', avatar: 'NH' },
    { no: 16, username: 'dadi', nip: '19840525 202221 1 001', nama: 'Dadi Permadi, SKM', jabatan: 'Penyuluh Kesehatan Ahli Pertama', gol: 'IX', role: 'PJ Klaster', avatar: 'DP' },
    { no: 17, username: 'anisa', nip: '19880321 202321 2 001', nama: 'Anisa Rohmatunisa, AM.Keb', jabatan: 'Bidan Terampil', gol: 'VII', role: 'Petugas Puskesmas', avatar: 'AR' },
    { no: 18, username: 'nina', nip: '19960728 202321 2 005', nama: 'Nina Mariyana, Amd.Kep', jabatan: 'Perawat Terampil', gol: 'VII', role: 'Petugas Puskesmas', avatar: 'NM' },
    { no: 19, username: 'sheila', nip: '19930713 202321 2 003', nama: 'Sheila Nurlaila, A.Md.Gz', jabatan: 'Nutrisionis Terampil', gol: 'VII', role: 'Petugas Puskesmas', avatar: 'SN' },
    { no: 20, username: 'debby', nip: '19921004 202521 2 044', nama: 'Debby Nadia Lofika, S.Farm. Apt', jabatan: 'Apoteker', gol: 'IX', role: 'Petugas Puskesmas', avatar: 'DL' },
    { no: 21, username: 'lutfiyatun', nip: '873.3204.10.02.005', nama: 'Lutfiyatun Oktaviana, S.Kep.Ners', jabatan: 'Perawat', gol: 'PPTK PW', role: 'Petugas Puskesmas', avatar: 'LO' },
    { no: 22, username: 'dr_dinar', nip: '873.3204.07.05.005', nama: 'dr. Dinar Dwi Restika Agustin', jabatan: 'Dokter Umum', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'DD' },
    { no: 23, username: 'dr_putri', nip: '873.3204.08.06.029', nama: 'dr. Putri Tasya Afifah', jabatan: 'Dokter Umum', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'PT' },
    { no: 24, username: 'drg_intan', nip: '873.3204.08.06.019', nama: 'drg. Intan Nur Atsila', jabatan: 'Dokter Gigi', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'IN' },
    { no: 25, username: 'rini', nip: '873.06.02.021', nama: 'Rini Julianti, SE', jabatan: 'Akuntan', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'RJ' },
    { no: 26, username: 'andriana', nip: '873.120.10.03', nama: 'Andriana Mahardhytia, Amd.Kes', jabatan: 'Rekam Medis', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'AM' },
    { no: 27, username: 'dilla', nip: '873.3204.13.03.012', nama: 'Dilla Anggraeni Pratiwi, A.Md.Akun', jabatan: 'Admin BOK', gol: 'BLUD', role: 'Admin', avatar: 'DA' },
    { no: 28, username: 'ozie', nip: '873.3204.16.02.008', nama: 'Mochamad Fauzie, S.Gz', jabatan: 'Nutrisionis', gol: 'BLUD', role: 'Super Admin', avatar: 'MF' },
    { no: 29, username: 'ilham', nip: '873.3204.11.06.011', nama: 'Ilham Ardiansyah Isnandar, SKM', jabatan: 'Epidemiolog', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'IA' },
    { no: 30, username: 'rian', nip: '873.3204.12.06.007', nama: 'Rian Sidik Sudiana, Amd.Kes', jabatan: 'Rekam Medis', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'RS' },
    { no: 31, username: 'fahri', nip: '873.3204.13.07.037', nama: 'Fahri Dzulfikar Rismayanto, A.Md. Bns', jabatan: 'Admin BLUD', gol: 'BLUD', role: 'Admin', avatar: 'FD' },
    { no: 32, username: 'mutiara', nip: '873.3204.05.05.005', nama: 'Mutiara Sofiatussirri, Amd.', jabatan: 'ATLM', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'MS' },
    { no: 33, username: 'faridz', nip: '873.3204.14.05.040', nama: 'Muhamad Faridz Alparizy, Amd.Kep', jabatan: 'Perawat', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'FA' },
    { no: 34, username: 'nengsafitri', nip: '873.3204.09.06.106', nama: 'Neng Safitri Nur Ladyawati, AM.Keb', jabatan: 'Bidan Desa', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'NS' },
    { no: 35, username: 'dani', nip: '873.3204.18.01.002', nama: 'Dani Setiadi, S.Farm', jabatan: 'TTK', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'DS' },
    { no: 36, username: 'ripan', nip: 'BLUD-SEC-01', nama: 'Ripan Sutiana', jabatan: 'Petugas Keamanan', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'RS' },
    { no: 37, username: 'mevi', nip: 'BLUD-CL-01', nama: 'Mevi Riyanayasti', jabatan: 'Petugas Kebersihan', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'MR' },
    { no: 38, username: 'adeboy', nip: 'BLUD-DRV-01', nama: 'Ade Boy', jabatan: 'Supir', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'AB' },
    { no: 39, username: 'suhara', nip: 'BLUD-SEC-02', nama: 'Suhara', jabatan: 'Petugas Keamanan', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'SH' }
  ];

  let liveOfficers = [...OFFICERS_DB];

  const fetchLiveOfficers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          liveOfficers = data.users;
        }
      }
    } catch (e) {}
  };
  fetchLiveOfficers();

  // Quick officer selection
  window.selectQuickOfficer = (username) => {
    const officer = (liveOfficers || OFFICERS_DB).find(o => o.username === username);
    if (officer && usernameInput) {
      usernameInput.value = officer.nama;
      selectedOfficer = officer;
      if (passwordInput) passwordInput.focus();
      evaluateState();
    }
  };

  // Eye toggle
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.innerHTML = isPassword
        ? '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line>'
        : '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>';
    });
  }

  // Dropdown rendering
  const renderOfficerDropdown = (filterKeyword = '') => {
    if (!dropdownItemsList) return;
    const q = filterKeyword.toLowerCase().trim();
    const filtered = liveOfficers.filter(p => {
      if (!q) return true;
      return (p.nama && p.nama.toLowerCase().includes(q)) ||
             (p.nip && p.nip.toLowerCase().includes(q)) ||
             (p.jabatan && p.jabatan.toLowerCase().includes(q)) ||
             (p.username && p.username.toLowerCase().includes(q));
    });

    if (dropdownResultCount) dropdownResultCount.textContent = `${filtered.length} Pegawai`;

    if (filtered.length === 0) {
      dropdownItemsList.innerHTML = '<div style="padding:16px;text-align:center;color:#94a3b8;font-size:12px;">Tidak ditemukan.</div>';
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const avatarTxt = p.avatar || (p.nama ? p.nama.split(' ').map(n=>n[0]).slice(0,2).join('') : 'P');
      html += `
        <div class="dd-item" data-nip="${p.nip}" data-nama="${p.nama}" data-username="${p.username}" data-role="${p.role}">
          <div class="avatar">${avatarTxt}</div>
          <div class="info">
            <div class="name">${p.nama}</div>
            <div class="role">${p.jabatan}</div>
          </div>
        </div>
      `;
    });
    dropdownItemsList.innerHTML = html;

    dropdownItemsList.querySelectorAll('.dd-item').forEach(item => {
      item.addEventListener('click', () => {
        const nama = item.getAttribute('data-nama');
        const nip = item.getAttribute('data-nip');
        const uname = item.getAttribute('data-username');
        const role = item.getAttribute('data-role');
        selectedOfficer = { nama, nip, username: uname, role };
        usernameInput.value = nama;
        hideUserDropdown();
        evaluateState();
        if (passwordInput) passwordInput.focus();
      });
    });
  };

  const showUserDropdown = () => {
    if (!userDropdownList) return;
    renderOfficerDropdown(usernameInput ? usernameInput.value : '');
    userDropdownList.classList.add('show');
  };

  const hideUserDropdown = () => {
    if (!userDropdownList) return;
    userDropdownList.classList.remove('show');
  };

  if (btnTriggerUserDropdown) {
    btnTriggerUserDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdownList.classList.contains('show') ? hideUserDropdown() : showUserDropdown();
    });
  }

  if (usernameInput) {
    usernameInput.addEventListener('focus', showUserDropdown);
    usernameInput.addEventListener('input', (e) => {
      showUserDropdown();
      renderOfficerDropdown(e.target.value);
      selectedOfficer = null;
      evaluateState();
    });
  }

  document.addEventListener('click', (e) => {
    if (userDropdownList && !userDropdownList.contains(e.target) && e.target !== usernameInput && e.target !== btnTriggerUserDropdown) {
      hideUserDropdown();
    }
  });

  // Evaluate form state
  const evaluateState = () => {
    const userVal = usernameInput ? usernameInput.value.trim() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';
    const isReady = userVal.length >= 2 && passVal.length >= 4;

    if (btnSignIn) btnSignIn.disabled = !isReady;

    if (statusDot && statusLabel) {
      if (isReady) {
        statusDot.className = 'dot ready';
        statusLabel.textContent = '✓ Siap masuk. Klik tombol atau tekan Enter.';
      } else {
        statusDot.className = 'dot';
        statusLabel.textContent = 'Lengkapi akun dan sandi untuk masuk.';
      }
    }
  };

  if (passwordInput) passwordInput.addEventListener('input', evaluateState);
  evaluateState();

  // Forgot password
  if (btnForgotPass) {
    btnForgotPass.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: 'Pemulihan Kata Sandi',
          text: 'Silakan hubungi Super Admin Puskesmas Banjaran Kota untuk reset kata sandi Anda.',
          confirmButtonText: 'Mengerti'
        });
      } else {
        alert('Silakan hubungi Super Admin Puskesmas untuk reset kata sandi.');
      }
    });
  }

  // Form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let loginIdentifier = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (selectedOfficer) {
        loginIdentifier = selectedOfficer.username || selectedOfficer.nip || selectedOfficer.nama;
      }

      if (!loginIdentifier || !password) return;

      btnSignIn.disabled = true;
      btnSignIn.textContent = 'Memverifikasi...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: loginIdentifier, password })
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          localStorage.setItem('SICEKAS_CURRENT_USER', JSON.stringify(data.user));
          btnSignIn.textContent = '✓ Berhasil';
          if (statusLabel) statusLabel.textContent = '✓ Berhasil masuk.';

          if (typeof Swal !== 'undefined') {
            Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1200, timerProgressBar: true })
              .fire({ icon: 'success', title: `Selamat datang, ${data.user.nama}!` });
          }

          setTimeout(() => { window.location.href = 'dashboard'; }, 500);
          return;
        } else {
          btnSignIn.disabled = false;
          btnSignIn.textContent = 'Masuk ke SICEKAS';
          if (statusLabel) statusLabel.textContent = 'Autentikasi gagal.';

          if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'error', title: 'Autentikasi Gagal', text: data?.error || 'Nama atau sandi salah.', confirmButtonText: 'Coba Lagi' });
          } else {
            alert(data?.error || 'Autentikasi gagal.');
          }
        }
      } catch (err) {
        console.warn('Cloud D1 offline, fallback:', err);
        const uNorm = loginIdentifier.toLowerCase().trim();
        const matched = OFFICERS_DB.find(o =>
          o.username.toLowerCase() === uNorm ||
          o.nip.replace(/\s+/g, '') === uNorm.replace(/\s+/g, '') ||
          o.nama.toLowerCase().includes(uNorm)
        );

        if (matched && (password === 'bankot2026' || password === 'ozie' || password.length >= 4)) {
          localStorage.setItem('SICEKAS_CURRENT_USER', JSON.stringify(matched));
          btnSignIn.textContent = '✓ Berhasil (Offline)';
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 400);
          return;
        }

        btnSignIn.disabled = false;
        btnSignIn.textContent = 'Masuk ke SICEKAS';
        if (statusLabel) statusLabel.textContent = 'Gagal terhubung.';

        if (typeof Swal !== 'undefined') {
          Swal.fire({ icon: 'error', title: 'Koneksi Gagal', text: 'Gunakan sandi default bankot2026 jika offline.', confirmButtonText: 'Tutup' });
        } else {
          alert('Tidak dapat terhubung ke Cloudflare D1.');
        }
      }
    });
  }
});
