document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const pullCord = document.getElementById('pullCord');
  const cordLine = document.getElementById('cordLine');
  const cordBead = document.getElementById('cordBead');
  const loginCard = document.getElementById('loginCard');
  const lightBeam = document.getElementById('lightBeam');
  const lampBulb = document.getElementById('lampBulb');
  const lampShade = document.getElementById('lampShade');
  const ambientGlow = document.getElementById('ambientGlow');
  const appHeader = document.getElementById('appHeader');
  const logoWrapper = document.getElementById('logoWrapper');
  const appLogo = document.getElementById('appLogo');
  const hintBadge = document.getElementById('hintBadge');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const btnSignIn = document.getElementById('btnSignIn');
  const loginForm = document.getElementById('loginForm');

  let isOn = false;
  let isPulling = false;

  // Function to make logo 100% transparent by removing black/dark background pixels
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

        // Loop pixels and make dark/black background pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Brightness threshold for black/dark texture removal
          const maxColor = Math.max(r, g, b);
          if (maxColor < 50) {
            const alphaFactor = Math.max(0, (maxColor - 18) / 32);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        appLogo.src = canvas.toDataURL('image/png');
      };
    } catch (e) {
      console.warn('Canvas transparency fallback applied', e);
    }
  };

  processLogoTransparency();

  // Initialize initial state cleanly with GSAP (all hidden in complete darkness)
  gsap.set(appHeader, { opacity: 0, visibility: 'hidden', y: -16 });
  gsap.set(lightBeam, { opacity: 0, visibility: 'hidden', scaleX: 0.85 });
  gsap.set(loginCard, { opacity: 0, visibility: 'hidden', y: 15, scale: 0.98, pointerEvents: 'none' });
  gsap.set(ambientGlow, { opacity: 0 });
  gsap.set(body, { backgroundColor: '#0a0c0f' });

  // Web Audio API for realistic mechanical switch sound
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOn ? 950 : 700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  // Toggle Lamp State
  const toggleLamp = () => {
    isOn = !isOn;
    playClickSound();

    if (isOn) {
      // Light is ON
      if (hintBadge) hintBadge.classList.add('active');

      // GSAP Background Color
      gsap.to(body, {
        backgroundColor: '#1c1f24',
        duration: 0.6,
        ease: 'power2.out'
      });

      // Bulb and Shade Glow
      gsap.to(lampBulb, {
        backgroundColor: '#ffe89e',
        boxShadow: '0 0 22px 8px rgba(255, 232, 158, 0.95), 0 0 45px 18px rgba(255, 190, 60, 0.7)',
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      });

      gsap.to(lampShade, {
        boxShadow: 'inset 0 -4px 10px rgba(255, 220, 120, 0.35), 0 8px 30px rgba(0, 0, 0, 0.5)',
        duration: 0.3
      });

      // Ambient Room Glow
      gsap.to(ambientGlow, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Conical Light Beam emergence (visible & opaque)
      gsap.to(lightBeam, {
        visibility: 'visible',
        opacity: 1,
        scaleX: 1,
        duration: 0.45,
        ease: 'power2.out'
      });

      // Reveal Header with Logo & Title Animation
      gsap.to(appHeader, {
        visibility: 'visible',
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Logo entry pop effect
      if (logoWrapper) {
        gsap.fromTo(logoWrapper,
          { scale: 0.75, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }
        );
      }

      // Light burst flare on title
      const titleGlow = document.querySelector('.title-glow-effect');
      if (titleGlow) {
        gsap.fromTo(titleGlow, 
          { scale: 0.4, opacity: 0 }, 
          { scale: 1, opacity: 0.85, duration: 0.6, ease: 'back.out(2)' }
        );
      }

      // Reveal Login Card
      gsap.to(loginCard, {
        visibility: 'visible',
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: 'auto',
        duration: 0.55,
        ease: 'power2.out'
      });

    } else {
      // Light is OFF
      if (hintBadge) hintBadge.classList.remove('active');

      // GSAP Background Color
      gsap.to(body, {
        backgroundColor: '#0a0c0f',
        duration: 0.6,
        ease: 'power2.out'
      });

      // Bulb and Shade Off
      gsap.to(lampBulb, {
        backgroundColor: '#33373f',
        boxShadow: 'none',
        opacity: 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(lampShade, {
        boxShadow: 'inset 0 -4px 8px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.5)',
        duration: 0.3
      });

      // Ambient Room Glow Off
      gsap.to(ambientGlow, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Hide Header & Logo (Completely Hidden)
      gsap.to(appHeader, {
        opacity: 0,
        y: -16,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (!isOn) {
            gsap.set(appHeader, { visibility: 'hidden' });
          }
        }
      });

      // Conical Light Beam Off (Completely Hidden)
      gsap.to(lightBeam, {
        opacity: 0,
        scaleX: 0.85,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (!isOn) {
            gsap.set(lightBeam, { visibility: 'hidden' });
          }
        }
      });

      // Hide Login Card (Completely Hidden)
      gsap.to(loginCard, {
        opacity: 0,
        y: 15,
        scale: 0.98,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (!isOn) {
            gsap.set(loginCard, { visibility: 'hidden' });
          }
        }
      });
    }
  };

  // Pull Cord Interaction with spring physics
  const triggerCordPull = () => {
    if (isPulling) return;
    isPulling = true;

    // Pull down animation with elastic spring return
    const tl = gsap.timeline({
      onComplete: () => {
        isPulling = false;
      }
    });

    tl.to(pullCord, {
      y: 26,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        toggleLamp();
      }
    })
    .to(pullCord, {
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1.4, 0.35)'
    });
  };

  // Event Listeners for Pull Cord & Lamp Shade Click
  pullCord.addEventListener('click', triggerCordPull);
  lampShade.addEventListener('click', triggerCordPull);

  // Toggle Password Visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      togglePassword.innerHTML = isPassword ? `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ` : `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      `;
    });
  }

  // Sign in submit feedback & redirect to dashboard
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username') || document.querySelector('input[type="text"]');
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!username || !password) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'warning',
            title: 'Lengkapi Data Login',
            text: 'Harap masukkan username dan kata sandi Anda.',
            confirmButtonText: 'OK',
            customClass: { popup: 'sicekas-swal-modal', confirmButton: 'btn-swal-gold' }
          });
        } else {
          alert('Harap masukkan username dan kata sandi Anda.');
        }
        return;
      }

      // Button loading state
      const originalText = btnSignIn.innerHTML;
      btnSignIn.disabled = true;
      btnSignIn.innerHTML = '<span>Memverifikasi Akun...</span>';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            localStorage.setItem('SICEKAS_CURRENT_USER', JSON.stringify(data.user));
            if (typeof Swal !== 'undefined') {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
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
            }, 700);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct API offline fallback', err);
      }

      // Offline / Localhost fallback login
      if (username === 'ozie' && password === '213117') {
        const fallbackUser = {
          username: 'ozie',
          nama: 'Mochamad Fauzie, S.Gz',
          jabatan: 'Nutrisionis',
          nip: '873.3204.16.02.008',
          role: 'Super Admin',
          avatar: 'MF'
        };
        localStorage.setItem('SICEKAS_CURRENT_USER', JSON.stringify(fallbackUser));
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 300);
      } else {
        btnSignIn.disabled = false;
        btnSignIn.innerHTML = originalText;
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Autentikasi Gagal',
            text: 'Username atau kata sandi yang Anda masukkan salah.',
            confirmButtonText: 'Coba Lagi',
            customClass: { popup: 'sicekas-swal-modal', confirmButton: 'btn-swal-gold' }
          });
        } else {
          alert('Username atau kata sandi yang Anda masukkan salah.');
        }
      }
    });
  }

  // Initial gentle nudge animation for the cord after 0.8s
  setTimeout(() => {
    if (!isOn) {
      gsap.to(pullCord, {
        y: 6,
        duration: 0.25,
        yoyo: true,
        repeat: 3,
        ease: 'power1.inOut'
      });
    }
  }, 800);
});
