// ============================================================================
// SICEKAS v2.0 - RUNAWAY LOGIN (Settigation Component 95 Interactive Script)
// Puskesmas Banjaran Kota - Dinas Kesehatan Kabupaten Bandung
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const boxUser = document.getElementById('boxUser');
  const boxPass = document.getElementById('boxPass');
  const badgeValidUser = document.getElementById('badgeValidUser');
  const badgeValidPass = document.getElementById('badgeValidPass');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  
  const btnTriggerUserDropdown = document.getElementById('btnTriggerUserDropdown');
  const userDropdownList = document.getElementById('userDropdownList');
  const dropdownItemsList = document.getElementById('dropdownItemsList');
  const dropdownResultCount = document.getElementById('dropdownResultCount');
  
  const dockContainer = document.getElementById('dockContainer');
  const btnSignIn = document.getElementById('btnSignIn');
  const ctaText = document.getElementById('ctaText');
  const ctaSpinner = document.getElementById('ctaSpinner');
  const ctaCheck = document.getElementById('ctaCheck');
  const bandLine = document.getElementById('bandLine');
  
  const statusDot = document.getElementById('statusDot');
  const statusLabel = document.getElementById('statusLabel');
  const loginForm = document.getElementById('loginForm');
  const appLogo = document.getElementById('appLogo');
  const btnForgotPass = document.getElementById('btnForgotPass');

  let buttonPosition = 'left'; // 'left' | 'right' | 'center'
  let isLocked = false;
  let isKeyboardFocused = false;
  let currentX = 0;
  let selectedOfficer = null;

  // 39 Official Officers Database
  const OFFICERS_DB = [
    { no: 1, username: 'rina', nip: '19740404 201411 2 001', nama: 'dr. Rina Indriati', jabatan: 'Kepala Puskesmas', gol: 'III/d', role: 'Kepala Puskesmas', avatar: 'RI' },
    { no: 2, username: 'teti', nip: '19750816 200701 2 012', nama: 'Teti Nuryati, S.Keb, Bdn', jabatan: 'Satker/Bidan Mahir', gol: 'III/b', role: 'PJ Klaster', avatar: 'TN' },
    { no: 3, username: 'satrianita', nip: '19730908 199403 2 006', nama: 'Satrianita, SKM', jabatan: 'Sanitarian Ahli Muda', gol: 'IV/b', role: 'Admin', avatar: 'SN' },
    { no: 4, username: 'asepyanto', nip: '19690623 199103 1 002', nama: 'Asep Yanto, AMKG', jabatan: 'Perawat Gigi Penyelia', gol: 'III/d', role: 'Petugas Puskesmas', avatar: 'AY' },
    { no: 5, username: 'cucu', nip: '19690807 199203 2 007', nama: 'Cucu Jubaedah, A.Md.Keb', jabatan: 'Bidan Penyelia', gol: 'III/c', role: 'Petugas Puskesmas', avatar: 'CJ' },
    { no: 6, username: 'wiwi', nip: '19740209 200604 2 010', nama: 'Wiwi Widaningsih, A.Md.Keb', jabatan: 'Bidan Penyelia', gol: 'III/c', role: 'Petugas Puskesmas', avatar: 'WW' },
    { no: 7, username: 'nuraini', nip: '19790408 200701 2 008', nama: 'Nuraini Siti S, A.Md.Keb', jabatan: 'Bidan Penyelia', gol: 'III/c', role: 'Petugas Puskesmas', avatar: 'NS' },
    { no: 8, username: 'anissa', nip: '19870710 200902 2 002', nama: 'Anissa Novianty, A.Md.Keb', jabatan: 'Bidan Penyelia', gol: 'III/c', role: 'Petugas Puskesmas', avatar: 'AN' },
    { no: 9, username: 'dini', nip: '19750508 200701 2 008', nama: 'Dini Suryani, A.Md.Keb', jabatan: 'Bidan Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'DS' },
    { no: 10, username: 'iwan', nip: '19830504 200701 1 004', nama: 'Iwan Hermawan, S.Kep., Ners', jabatan: 'Perawat Ahli Muda', gol: 'III/c', role: 'PJ Klaster', avatar: 'IH' },
    { no: 11, username: 'imastati', nip: '19770514 200801 2 006', nama: 'Imas Tati H, A.Md.Kep', jabatan: 'Perawat Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'IT' },
    { no: 12, username: 'wulandari', nip: '19811009 200801 2 008', nama: 'Wulandari, A.Md.Keb', jabatan: 'Bidan Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'WL' },
    { no: 13, username: 'henny', nip: '19830303 200801 2 005', nama: 'Henny Hendrayani, A.Md.Kep', jabatan: 'Perawat Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'HH' },
    { no: 14, username: 'sri', nip: '19830805 200801 2 005', nama: 'Sri Nurhayati, A.Md.Keb', jabatan: 'Bidan Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'SN' },
    { no: 15, username: 'herlina', nip: '19860627 201101 2 002', nama: 'Herlina, A.Md.Keb', jabatan: 'Bidan Terampil', gol: 'II/c', role: 'Petugas Puskesmas', avatar: 'HL' },
    { no: 16, username: 'nengsusi', nip: '19860309 201411 2 001', nama: 'Neng Susi K, A.Md.Keb', jabatan: 'Bidan Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'NS' },
    { no: 17, username: 'nita', nip: '19830425 201411 2 002', nama: 'Nita Pujianti, A.Md.Kep', jabatan: 'Perawat Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'NP' },
    { no: 18, username: 'irna', nip: '19861215 201903 2 007', nama: 'Irna Suminar, A.Md.Keb', jabatan: 'Bidan Mahir', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'IS' },
    { no: 19, username: 'deden', nip: '19800728 200902 1 001', nama: 'Deden Sopian', jabatan: 'Pengadministrasi Umum', gol: 'II/d', role: 'Petugas Puskesmas', avatar: 'DS' },
    { no: 20, username: 'dr_dini', nip: '19950711 202203 2 010', nama: 'dr. Dini Sri Wahyuni', jabatan: 'Dokter Ahli Pertama', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'DW' },
    { no: 21, username: 'drg_rani', nip: '19960207 202203 2 006', nama: 'drg. Rani Septiani', jabatan: 'Dokter Gigi Ahli Pertama', gol: 'III/b', role: 'Petugas Puskesmas', avatar: 'RS' },
    { no: 22, username: 'dr_fauzan', nip: '19940121 202321 1 006', nama: 'dr. Fauzan Rahman T', jabatan: 'Dokter Ahli Pertama', gol: 'PPPK', role: 'Petugas Puskesmas', avatar: 'FR' },
    { no: 23, username: 'apt_marisa', nip: '19880112 202321 2 011', nama: 'Apt. Marisa Tri H, S.Farm', jabatan: 'Apoteker Ahli Pertama', gol: 'PPPK', role: 'Petugas Puskesmas', avatar: 'MT' },
    { no: 24, username: 'tika', nip: '19910526 202321 2 014', nama: 'Tika Kartika, S.Kep., Ners', jabatan: 'Perawat Ahli Pertama', gol: 'PPPK', role: 'Petugas Puskesmas', avatar: 'TK' },
    { no: 25, username: 'kristina', nip: '19940502 202321 2 026', nama: 'Kristina S, S.Tr.Kes', jabatan: 'Promosi Kesehatan', gol: 'PPPK', role: 'PJ Klaster', avatar: 'KS' },
    { no: 26, username: 'dian', nip: '19830501 202421 2 023', nama: 'Dian Rosdiana, A.Md.Keb', jabatan: 'Bidan Terampil', gol: 'PPPK', role: 'Petugas Puskesmas', avatar: 'DR' },
    { no: 27, username: 'dilla', nip: '873.3204.13.03.012', nama: 'Dilla Anggraeni Pratiwi, A.Md.Akun', jabatan: 'Admin BOK', gol: 'BLUD', role: 'Admin', avatar: 'DA' },
    { no: 28, username: 'ozie', nip: '873.3204.16.02.008', nama: 'Mochamad Fauzie, S.Gz', jabatan: 'Nutrisionis', gol: 'BLUD', role: 'Super Admin', avatar: 'MF' },
    { no: 29, username: 'ilham', nip: '873.3204.11.06.011', nama: 'Ilham Ardiansyah Isnandar, SKM', jabatan: 'Epidemiolog', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'IA' },
    { no: 30, username: 'rian', nip: '873.3204.12.06.007', nama: 'Rian Sidik Sudiana, Amd.Kes', jabatan: 'Rekam Medis', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'RS' },
    { no: 31, username: 'fahri', nip: '873.3204.13.07.037', nama: 'Fahri Dzulfikar Rismayanto, A.Md. Bns', jabatan: 'Admin BLUD', gol: 'BLUD', role: 'Admin', avatar: 'FD' },
    { no: 32, username: 'mutiara', nip: '873.3204.05.05.005', nama: 'Mutiara Sofiatussirri, Amd.', jabatan: 'ATLM', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'MS' },
    { no: 33, username: 'faridz', nip: '873.3204.14.05.040', nama: 'Muhamad Faridz Alparizy, Amd.Kep', jabatan: 'Perawat', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'MF' },
    { no: 34, username: 'nengsafitri', nip: '873.3204.09.06.106', nama: 'Neng Safitri Nur Ladyawati, AM.Keb', jabatan: 'Bidan Desa', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'NS' },
    { no: 35, username: 'widi', nip: '873.3204.15.06.001', nama: 'Widi Astuti, A.Md.Kes', jabatan: 'Sanitarian', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'WA' },
    { no: 36, username: 'gina', nip: '873.3204.16.06.009', nama: 'Gina Fitriani, A.Md.Gz', jabatan: 'Nutrisionis', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'GF' },
    { no: 37, username: 'cahya', nip: '873.3204.10.05.008', nama: 'Cahya Gumilar', jabatan: 'Perekam Medis', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'CG' },
    { no: 38, username: 'silvia', nip: '873.3204.09.05.080', nama: 'Silvia Febriyanti, A.Md.Keb', jabatan: 'Bidan', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'SF' },
    { no: 39, username: 'salma', nip: '873.3204.14.05.039', nama: 'Salma Sukma S, A.Md.Kep', jabatan: 'Perawat', gol: 'BLUD', role: 'Petugas Puskesmas', avatar: 'SS' }
  ];

  let liveOfficers = [...OFFICERS_DB];

  // Try fetching live users from Cloudflare D1
  const fetchLiveOfficers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          liveOfficers = data.users;
        }
      }
    } catch (e) {
      // Use fallback
    }
  };

  fetchLiveOfficers();

  // Process Logo Transparency
  const processLogoTransparency = () => {
    if (!appLogo) return;
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = appLogo.getAttribute('src');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const maxColor = Math.max(data[i], data[i + 1], data[i + 2]);
          if (maxColor < 50) {
            const alphaFactor = Math.max(0, (maxColor - 18) / 32);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        appLogo.src = canvas.toDataURL('image/png');
      };
    } catch (e) {
      console.warn('Canvas transparency fallback', e);
    }
  };

  processLogoTransparency();

  // Eye Password Toggle
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      if (isPassword) {
        eyeIcon.innerHTML = `
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
          <line x1="2" y1="2" x2="22" y2="22"></line>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    });
  }

  // Render Officer Dropdown
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

    if (dropdownResultCount) {
      dropdownResultCount.textContent = `${filtered.length} Pegawai`;
    }

    if (filtered.length === 0) {
      dropdownItemsList.innerHTML = '<div style="padding: 18px; text-align: center; color: #94a3b8; font-size: 12px;">Tidak ditemukan pegawai dengan kata kunci tersebut.</div>';
      return;
    }

    let html = '';
    filtered.forEach(p => {
      let roleClass = 'petugas';
      if (p.role === 'Super Admin') roleClass = 'super-admin';
      else if (p.role === 'Admin') roleClass = 'admin';
      else if (p.role === 'Kepala Puskesmas') roleClass = 'kepala';
      else if (p.role === 'PJ Klaster') roleClass = 'pj';

      const avatarTxt = p.avatar || (p.nama ? p.nama.split(' ').map(n=>n[0]).slice(0,2).join('') : 'P');

      html += `
        <div class="user-dropdown-item" data-nip="${p.nip}" data-nama="${p.nama}" data-username="${p.username}" data-role="${p.role}">
          <div class="item-avatar-mini">${avatarTxt}</div>
          <div class="item-info-col">
            <span class="item-nama">${p.nama}</span>
            <span class="item-sub">${p.jabatan} • ${p.nip}</span>
          </div>
          <span class="item-role-pill ${roleClass}">${p.role}</span>
        </div>
      `;
    });

    dropdownItemsList.innerHTML = html;

    // Attach click listeners to items
    const items = dropdownItemsList.querySelectorAll('.user-dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const nama = item.getAttribute('data-nama');
        const nip = item.getAttribute('data-nip');
        const uname = item.getAttribute('data-username');
        const role = item.getAttribute('data-role');

        selectedOfficer = { nama, nip, username: uname, role };
        usernameInput.value = nama;
        
        hideUserDropdown();
        evaluateState();

        if (passwordInput) {
          passwordInput.focus();
        }
      });
    });
  };

  const showUserDropdown = () => {
    if (!userDropdownList) return;
    renderOfficerDropdown(usernameInput ? usernameInput.value : '');
    userDropdownList.style.display = 'block';
  };

  const hideUserDropdown = () => {
    if (!userDropdownList) return;
    userDropdownList.style.display = 'none';
  };

  // Dropdown Triggers
  if (btnTriggerUserDropdown) {
    btnTriggerUserDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      if (userDropdownList.style.display === 'none' || !userDropdownList.style.display) {
        showUserDropdown();
      } else {
        hideUserDropdown();
      }
    });
  }

  if (usernameInput) {
    usernameInput.addEventListener('focus', () => {
      showUserDropdown();
    });

    usernameInput.addEventListener('input', (e) => {
      showUserDropdown();
      renderOfficerDropdown(e.target.value);
      selectedOfficer = null; // reset until picked or matching
      evaluateState();
    });
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (userDropdownList && !userDropdownList.contains(e.target) && e.target !== usernameInput && e.target !== btnTriggerUserDropdown) {
      hideUserDropdown();
    }
  });

  // Get dimensions inside dock
  const getDockMetrics = () => {
    if (!dockContainer || !btnSignIn) return { minX: 0, maxX: 200, centerX: 100 };
    const containerW = dockContainer.offsetWidth;
    const btnW = btnSignIn.offsetWidth;
    const padding = 4;
    const minX = 0;
    const maxX = containerW - btnW - (padding * 2);
    const centerX = (containerW - btnW) / 2 - padding;
    return { minX, maxX, centerX };
  };

  // Update Rubber Band SVG line
  const updateRubberBand = (btnX) => {
    if (!bandLine || !dockContainer || !btnSignIn) return;
    const { centerX } = getDockMetrics();
    const btnW = btnSignIn.offsetWidth;
    const containerH = dockContainer.offsetHeight;

    if (isLocked) {
      bandLine.setAttribute('opacity', '0');
      return;
    }

    const startX = centerX + btnW / 2 + 4;
    const startY = containerH / 2;
    const endX = btnX + btnW / 2 + 4;
    const endY = containerH / 2;

    bandLine.setAttribute('x1', `${startX}`);
    bandLine.setAttribute('y1', `${startY}`);
    bandLine.setAttribute('x2', `${endX}`);
    bandLine.setAttribute('y2', `${endY}`);
    bandLine.setAttribute('opacity', Math.abs(btnX - centerX) > 10 ? '0.6' : '0');
  };

  // Evaluate Input States
  const evaluateState = () => {
    const userVal = usernameInput ? usernameInput.value.trim() : '';
    const passVal = passwordInput ? passwordInput.value.trim() : '';

    const isUserValid = userVal.length >= 2;
    const isPassValid = passVal.length >= 4;

    const fieldUserStatus = document.getElementById('fieldUserStatus');
    if (fieldUserStatus) {
      if (selectedOfficer) {
        fieldUserStatus.textContent = `✓ ${selectedOfficer.role}`;
        fieldUserStatus.style.color = '#34d399';
      } else if (isUserValid) {
        fieldUserStatus.textContent = '✓ Akun terpilih';
        fieldUserStatus.style.color = '#34d399';
      } else {
        fieldUserStatus.textContent = 'Pilih / cari nama pegawai';
        fieldUserStatus.style.color = '#64748b';
      }
    }

    if (boxUser) boxUser.classList.toggle('is-valid', isUserValid);
    if (badgeValidUser) badgeValidUser.classList.toggle('show', isUserValid);
    
    if (boxPass) boxPass.classList.toggle('is-valid', isPassValid);
    if (badgeValidPass) badgeValidPass.classList.toggle('show', isPassValid);

    const filledCount = (isUserValid ? 1 : 0) + (isPassValid ? 1 : 0);
    const { minX, maxX, centerX } = getDockMetrics();

    if (filledCount === 2 || isKeyboardFocused) {
      // STATE 3: LOCKED IN CENTER SOCKET
      isLocked = true;
      btnSignIn.classList.add('is-locked');
      
      statusDot.className = 'status-dot state-2';
      statusLabel.textContent = '✓ Kredensial siap! Klik Log in atau tekan Enter.';
      statusLabel.classList.add('ready');

      currentX = centerX;
      buttonPosition = 'center';
      gsap.to(btnSignIn, {
        x: centerX,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onUpdate: () => updateRubberBand(currentX)
      });
      updateRubberBand(centerX);
    } else if (filledCount === 1) {
      // STATE 2: PARTIALLY FILLED - SLOWED DOWN
      isLocked = false;
      btnSignIn.classList.remove('is-locked');

      statusDot.className = 'status-dot state-1';
      statusLabel.textContent = 'Satu langkah lagi — tombol mulai melambat...';
      statusLabel.classList.remove('ready');

      if (buttonPosition === 'center') {
        buttonPosition = 'left';
        currentX = minX;
        gsap.to(btnSignIn, { x: minX, duration: 0.3 });
      }
    } else {
      // STATE 1: EMPTY FORM - FULL EVASION
      isLocked = false;
      btnSignIn.classList.remove('is-locked');

      statusDot.className = 'status-dot state-0';
      statusLabel.textContent = 'Lengkapi username dan sandi untuk membuka tombol.';
      statusLabel.classList.remove('ready');

      if (buttonPosition === 'center') {
        buttonPosition = 'left';
        currentX = minX;
        gsap.to(btnSignIn, { x: minX, duration: 0.3 });
      }
    }
  };

  // Runaway Move Logic on Cursor Hover
  const handleRunawayMove = (e) => {
    if (isLocked || isKeyboardFocused) return;

    const btnRect = btnSignIn.getBoundingClientRect();
    const cursorX = e.clientX;
    const { minX, maxX } = getDockMetrics();

    const filledCount = ((usernameInput.value.trim().length >= 2 ? 1 : 0) + 
                         (passwordInput.value.trim().length >= 4 ? 1 : 0));

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const dist = Math.abs(cursorX - btnCenterX);
    const threshold = filledCount === 0 ? 85 : 50;

    if (dist < threshold) {
      if (buttonPosition === 'left' || currentX <= minX + 20) {
        // Dodge to right
        buttonPosition = 'right';
        currentX = maxX;
        gsap.to(btnSignIn, {
          x: maxX,
          duration: filledCount === 0 ? 0.2 : 0.4,
          ease: 'power2.out',
          onUpdate: () => updateRubberBand(currentX)
        });
      } else {
        // Dodge to left
        buttonPosition = 'left';
        currentX = minX;
        gsap.to(btnSignIn, {
          x: minX,
          duration: filledCount === 0 ? 0.2 : 0.4,
          ease: 'power2.out',
          onUpdate: () => updateRubberBand(currentX)
        });
      }
    }
  };

  // Event Listeners for Track
  if (dockContainer) {
    dockContainer.addEventListener('mousemove', handleRunawayMove);
    dockContainer.addEventListener('mouseenter', handleRunawayMove);
  }

  if (passwordInput) passwordInput.addEventListener('input', evaluateState);

  // Keyboard accessibility
  if (btnSignIn) {
    btnSignIn.addEventListener('focus', () => {
      isKeyboardFocused = true;
      evaluateState();
    });
    btnSignIn.addEventListener('blur', () => {
      isKeyboardFocused = false;
      evaluateState();
    });
  }

  // Initial evaluation
  evaluateState();

  // Forgot password links
  if (btnForgotPass) {
    btnForgotPass.addEventListener('click', () => {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'info',
          title: 'Pemulihan Kata Sandi',
          text: 'Untuk keamanan akun, silakan hubungi Super Admin Puskesmas Banjaran Kota untuk melakukan reset kata sandi Anda melalui Developer Web.',
          confirmButtonText: 'Mengerti',
          customClass: { popup: 'sicekas-swal-modal' }
        });
      } else {
        alert('Silakan hubungi Super Admin Puskesmas untuk reset kata sandi akun Anda.');
      }
    });
  }

  // Form Submission (100% Cloudflare D1 Database Integration)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let loginIdentifier = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (selectedOfficer) {
        loginIdentifier = selectedOfficer.username || selectedOfficer.nip || selectedOfficer.nama;
      }

      if (!loginIdentifier || !password) {
        return;
      }

      // STATE 4: SUBMITTING (Loading Spinner)
      btnSignIn.disabled = true;
      ctaText.style.display = 'none';
      ctaSpinner.style.display = 'inline-block';
      statusLabel.textContent = 'Memverifikasi akun di Cloud Database...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: loginIdentifier, password })
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          localStorage.setItem('SICEKAS_CURRENT_USER', JSON.stringify(data.user));
          
          // STATE 5: SUBMITTED (Success Checkmark)
          ctaSpinner.style.display = 'none';
          ctaCheck.style.display = 'inline-block';
          statusLabel.textContent = '✓ Berhasil masuk.';

          if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1200,
              timerProgressBar: true,
              customClass: { popup: 'sicekas-swal-toast' }
            });
            Toast.fire({
              icon: 'success',
              title: `Selamat datang, ${data.user.nama}!`
            });
          }

          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 500);
          return;
        } else {
          // Cloud auth failed
          btnSignIn.disabled = false;
          ctaSpinner.style.display = 'none';
          ctaText.style.display = 'inline-block';
          statusLabel.textContent = 'Autentikasi gagal. Coba lagi.';

          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'error',
              title: 'Autentikasi Gagal',
              text: data?.error || 'Nama pegawai atau kata sandi yang Anda masukkan tidak sesuai. Silakan periksa kembali kredensial Anda.',
              confirmButtonText: 'Coba Lagi',
              customClass: { popup: 'sicekas-swal-modal' }
            });
          } else {
            alert(data?.error || 'Autentikasi gagal.');
          }
        }
      } catch (err) {
        console.error('Cloud D1 Connection Error:', err);
        btnSignIn.disabled = false;
        ctaSpinner.style.display = 'none';
        ctaText.style.display = 'inline-block';
        statusLabel.textContent = 'Gagal terhubung ke Cloud Database.';

        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Koneksi Cloud Gagal',
            text: 'Tidak dapat terhubung ke Cloudflare D1 Database. Pastikan koneksi internet Anda aktif.',
            confirmButtonText: 'Tutup',
            customClass: { popup: 'sicekas-swal-modal' }
          });
        } else {
          alert('Tidak dapat terhubung ke Cloudflare D1 Database.');
        }
      }
    });
  }

  // Ambient Orbs Parallax on Mouse Move
  const orbTeal = document.querySelector('.orb-teal');
  const orbGold = document.querySelector('.orb-gold');
  if (orbTeal && orbGold) {
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xNorm = (clientX / window.innerWidth - 0.5) * 40;
      const yNorm = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to(orbTeal, { x: xNorm * 1.5, y: yNorm * 1.5, duration: 1.2, ease: 'power1.out' });
      gsap.to(orbGold, { x: -xNorm * 1.2, y: -yNorm * 1.2, duration: 1.5, ease: 'power1.out' });
    });
  }
});
