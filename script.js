
// =========================================
// SCRIPT.JS - Undangan Pernikahan Elegan
// =========================================

document.addEventListener('DOMContentLoaded', function() {

  // ===== LOADING SCREEN =====
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', function() {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 800);
  });

  // ===== BUKA UNDANGAN (Hero) =====
  const openBtn = document.getElementById('open-invitation');
  const invitationContent = document.getElementById('invitation-content');

  if (openBtn && invitationContent) {
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Animasi membuka amplop: fade + zoom
      invitationContent.classList.remove('hidden');
      // trigger reflow untuk animasi ulang
      void invitationContent.offsetWidth;
      invitationContent.classList.add('visible');
      // scroll ke undangan setelah animasi
      setTimeout(() => {
        invitationContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      // efek ripple pada tombol
      createRipple(e, this);
    });
  }

  // ===== FUNGSI RIPPLE EFFECT =====
  function createRipple(e, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // aplikasikan ripple ke semua tombol .btn-gold
  document.querySelectorAll('.btn-gold').forEach(btn => {
    btn.addEventListener('click', function(e) {
      createRipple(e, this);
    });
  });

  // ===== NAVBAR SCROLL & TOGGLE =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
    // tutup menu saat link diklik
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  // ===== COUNTDOWN =====
  const targetDate = new Date('2026-08-30T00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '55';
      document.getElementById('hours').textContent = '1337';
      document.getElementById('minutes').textContent = '80.175';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== MUSIK =====
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  let isMusicPlaying = false;

  if (musicBtn && audio) {
    musicBtn.addEventListener('click', function() {
      if (isMusicPlaying) {
        audio.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
      } else {
        audio.play().catch(() => {});
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
      isMusicPlaying = !isMusicPlaying;
    });

    // otomatis play jika memungkinkan (user gesture nanti)
    document.addEventListener('click', function autoPlay() {
      if (!isMusicPlaying && audio) {
        audio.play().catch(() => {});
        isMusicPlaying = true;
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.removeEventListener('click', autoPlay);
      }
    }, { once: true });
  }

  // ===== BACK TO TOP =====
  const backBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== RSVP =====
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpMessages = document.getElementById('rsvp-messages');

  if (rsvpForm && rsvpMessages) {
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const attend = document.getElementById('rsvp-attend').value;
      const guests = document.getElementById('rsvp-guests').value || '0';
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name) {
        alert('Silakan isi nama Anda.');
        return;
      }

      // buat elemen ucapan
      const msgDiv = document.createElement('div');
      msgDiv.className = 'msg-item';
      const now = new Date();
      const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      msgDiv.innerHTML = `
        <strong>${escapeHTML(name)}</strong> 
        <small>${attend} • ${guests} tamu • ${timeStr}</small>
        ${message ? `<p style="margin-top:6px; font-size:0.9rem;">${escapeHTML(message)}</p>` : ''}
      `;

      rsvpMessages.prepend(msgDiv);

      // reset form
      rsvpForm.reset();
    });
  }

  // helper escape HTML
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== COPY ACCOUNT (Clipboard API) =====
  const copyBtn = document.getElementById('copy-account');
  const accountSpan = document.getElementById('account-number');

  if (copyBtn && accountSpan) {
    copyBtn.addEventListener('click', function() {
      const text = accountSpan.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Nomor rekening disalin!');
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Nomor rekening disalin!');
    } catch (e) {
      alert('Gagal menyalin, silakan salin manual.');
    }
    document.body.removeChild(textarea);
  }

  // ===== TOAST NOTIFICATION =====
  function showToast(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.style.cssText = `
        position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
        background: rgba(30,30,30,0.8); backdrop-filter: blur(8px);
        color: #fff; padding: 0.8rem 2rem; border-radius: 50px;
        font-size: 0.9rem; z-index: 9999;
        transition: opacity 0.4s ease, transform 0.4s ease;
        opacity: 0; transform: translateX(-50%) translateY(20px);
        pointer-events: none; font-family: 'Inter', sans-serif;
        border: 1px solid rgba(212,175,55,0.3);
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  // ===== SPARKLE CURSOR EFEK =====
  const sparkleContainer = document.createElement('div');
  sparkleContainer.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9998;';
  document.body.appendChild(sparkleContainer);

  let sparkleTimeout;
  document.addEventListener('mousemove', function(e) {
    clearTimeout(sparkleTimeout);
    sparkleTimeout = setTimeout(() => {
      createSparkle(e.clientX, e.clientY);
    }, 60);
  });

  function createSparkle(x, y) {
    const el = document.createElement('div');
    const size = 4 + Math.random() * 6;
    el.style.cssText = `
      position: absolute; left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: radial-gradient(circle, #ffd966, #d4af37);
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 8px rgba(212,175,55,0.8);
      transform: translate(-50%, -50%) scale(0);
      animation: sparkleAnim 0.6s ease forwards;
    `;
    sparkleContainer.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }

  // inject keyframes untuk sparkle
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes sparkleAnim {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);

  // ===== KELOPAK BUNGA JATUH (DEKORASI) =====
  function createFallingPetal() {
    const petal = document.createElement('div');
    const size = 10 + Math.random() * 14;
    const startX = Math.random() * window.innerWidth;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 10;
    const rotate = Math.random() * 360;

    petal.style.cssText = `
      position: fixed; top: -20px; left: ${startX}px;
      width: ${size}px; height: ${size * 0.7}px;
      background: rgba(212, 175, 55, 0.25);
      border-radius: 50% 50% 0 50%;
      transform: rotate(${rotate}deg);
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
      animation: fallPetal ${duration}s linear ${delay}s infinite;
    `;
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), (duration + delay) * 1000 + 500);
  }

  // inject keyframes untuk kelopak
  const petalStyle = document.createElement('style');
  petalStyle.textContent = `
    @keyframes fallPetal {
      0% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0.6; }
      100% { transform: translateY(${window.innerHeight + 50}px) rotate(720deg) scale(0.2); opacity: 0; }
    }
  `;
  document.head.appendChild(petalStyle);

  // spawn kelopak secara periodik
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      createFallingPetal();
    }
  }, 2500);

  // tambahkan beberapa kelopak awal
  for (let i = 0; i < 6; i++) {
    setTimeout(createFallingPetal, i * 300);
  }

  // ===== KILAUAN EMAS (background bergerak) =====
  const goldGlow = document.createElement('div');
  goldGlow.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(circle at 20% 30%, rgba(212,175,55,0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(212,175,55,0.04) 0%, transparent 50%);
    animation: goldShimmer 12s ease-in-out infinite alternate;
  `;
  document.body.prepend(goldGlow);

  const shimmerStyle = document.createElement('style');
  shimmerStyle.textContent = `
    @keyframes goldShimmer {
      0% { background-position: 0% 0%; opacity: 0.4; }
      100% { background-position: 100% 100%; opacity: 1; }
    }
  `;
  document.head.appendChild(shimmerStyle);

  // ===== SPARKLE SAAT SCROLL (efek tambahan) =====
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const currentScroll = window.scrollY;
    if (Math.abs(currentScroll - lastScroll) > 80) {
      // buat sparkle kecil di posisi scroll
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.4;
      createSparkle(x, y);
      lastScroll = currentScroll;
    }
  });

  // ===== SMOOTH SCROLL UNTUK NAV LINK =====
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== INISIALISASI: pastikan konten undangan tersembunyi =====
  // (sudah diatur di HTML dengan class hidden)

// ===== PROMOSI - ORDER BUTTON =====
const orderBtn = document.getElementById('order-btn');
if (orderBtn) {
  orderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // efek ripple
    createRipple(e, this);
    
    // Tampilkan modal atau aksi
    showToast('📩 Hubungi kami: 0877-5476-6011');
    
    // Bisa juga langsung buka WhatsApp
    // window.open('https://wa.me/6281234567890?text=Halo%20saya%20ingin%20pesan%20undangan', '_blank');
  });
}

// ===== PROMO - Klik kontak =====
document.querySelectorAll('.promo-contact i').forEach(icon => {
  icon.parentElement.addEventListener('click', function(e) {
    e.preventDefault();
    const text = this.textContent.trim();
    if (text.includes('@')) {
      showToast('📱 Kunjungi Instagram : @Arfan_dev');
    } else if (text.includes('0812')) {
      showToast('📞 Hubungi kami di: ' + text);
    }
  });
});

  console.log('✨ Undangan Pernikahan Elegan siap!');
});
````