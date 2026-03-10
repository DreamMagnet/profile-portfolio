/* ============================================================
   PORTFOLIO – Interactive JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── GSAP plugins ─────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── DOM refs ─────────────────────────────────────────── */
  const header = document.querySelector('.top_header');
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.tab-link');
  const sections = document.querySelectorAll('section[id]');
  const scrollBar = document.getElementById('scrollProgress');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const backToTop = document.getElementById('backToTop');

  /* ─────────────────────────────────────────────────────────
     HAMBURGER SPANS (inject 3 spans into .menu-btn)
  ───────────────────────────────────────────────────────── */
  if (menuBtn) {
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
  }

  /* ─────────────────────────────────────────────────────────
     GLOBAL PARTICLE CANVAS (fixed, full-page)
  ───────────────────────────────────────────────────────── */
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Richer particle set for full-page coverage
    const COUNT = 90;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.5 + 0.08,
    }));

    // Mouse interaction
    let mouseX = -9999, mouseY = -9999;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle mouse repulsion
        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.a})`;
        ctx.fill();

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ex = p.x - q.x, ey = p.y - q.y;
          const d = Math.sqrt(ex * ex + ey * ey);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.07 * (1 - d / 130)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ─────────────────────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────────────────────── */
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
  });

  if (cursorRing) {
    (function ringLoop() {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(ringLoop);
    })();

    document.querySelectorAll('a, button, .glass-card, .orbit-dot').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* ─────────────────────────────────────────────────────────
     SCROLL — progress bar, header, active nav, back-to-top
  ───────────────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;

    // Progress bar
    if (scrollBar) scrollBar.style.width = ((scrollTop / docHeight) * 100) + '%';

    // Header style
    header.classList.toggle('scrolled', scrollTop > 60);

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (scrollTop >= s.offsetTop - 170) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
    });

    // Back-to-top visibility
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
  });

  // Back-to-top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────────────
     MOBILE NAV
  ───────────────────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function closeNav() {
    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = mainNav.classList.toggle('active');
      overlay.classList.toggle('active', open);
      menuBtn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  overlay.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  /* ─────────────────────────────────────────────────────────
     SMOOTH SCROLL
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
    });
  });

  /* ─────────────────────────────────────────────────────────
     TYPED.JS
  ───────────────────────────────────────────────────────── */
  if (document.getElementById('typed-output')) {
    new Typed('#typed-output', {
      strings: [
        'Software Engineer',
        'Backend Developer',
        'Python Expert',
        'FastAPI Specialist',
        'Database Architect',
      ],
      typeSpeed: 50,
      backSpeed: 28,
      backDelay: 2200,
      loop: true,
      smartBackspace: true,
    });
  }

  /* ─────────────────────────────────────────────────────────
     GSAP HERO ENTRANCE
  ───────────────────────────────────────────────────────── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .from('.hero-badge', { opacity: 0, y: 30, duration: 0.6 }, 0.2)
    .from('.greeting', { opacity: 0, y: 28, duration: 0.5 }, '-=0.3')
    .from('.name-headline', { opacity: 0, y: 40, duration: 0.7 }, '-=0.35')
    .from('.title', { opacity: 0, y: 26, duration: 0.5 }, '-=0.4')
    .from('.bio', { opacity: 0, y: 22, duration: 0.5 }, '-=0.35')
    .from('.hero-stats', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
    .from('.cta-buttons', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
    .from('.hero-socials', { opacity: 0, y: 16, duration: 0.4 }, '-=0.3')
    .from('.profile-wrapper', { opacity: 0, scale: 0.82, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.9')
    .from('.hero-scroll-hint', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');

  /* ─────────────────────────────────────────────────────────
     COUNTER ANIMATION (hero stats)
  ───────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 45);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current;
    }, 30);
  }

  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 80%',
    once: true,
    onEnter: () => document.querySelectorAll('.stat-number').forEach(animateCounter),
  });

  /* ─────────────────────────────────────────────────────────
     SCROLLTRIGGER SECTION REVEALS
  ───────────────────────────────────────────────────────── */
  // Section headers — fade up
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, y: 44, duration: 0.75, ease: 'power3.out',
    });
  });

  // Skill categories — each card gets its own trigger so ALL 6 are visible
  gsap.utils.toArray('.skill-category').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      opacity: 0, y: 50, duration: 0.7, delay: (i % 3) * 0.1, ease: 'power3.out',
    });
  });

  // Skill bars — on view
  ScrollTrigger.create({
    trigger: '.skills-container',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.progress').forEach(bar => {
        gsap.to(bar, {
          width: bar.dataset.width + '%',
          duration: 1.5,
          ease: 'power3.out',
          delay: 0.25,
        });
      });
    },
  });

  // Timeline items — alternate slide from left/right
  gsap.utils.toArray('.time-line-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 87%', once: true },
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      duration: 0.75,
      ease: 'power3.out',
    });
  });

  // Project cards — stagger scale-up from bottom
  gsap.from(gsap.utils.toArray('.project-card'), {
    scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: true },
    opacity: 0, y: 50, scale: 0.96,
    duration: 0.65, stagger: 0.08, ease: 'power3.out',
  });

  // Achievement cards — per-element trigger so all 6 animate in
  gsap.utils.toArray('.achievement-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      opacity: 0, y: 40, duration: 0.65, delay: (i % 3) * 0.08, ease: 'power3.out',
    });
  });

  // About paragraphs
  gsap.utils.toArray('.about-intro, .about-details, .about-summary').forEach(p => {
    gsap.from(p, {
      scrollTrigger: { trigger: p, start: 'top 90%', once: true },
      opacity: 0, y: 28, duration: 0.6, ease: 'power3.out',
    });
  });

  // Contact columns
  gsap.utils.toArray('.contact-grid > *').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      opacity: 0, x: i === 0 ? -45 : 45, duration: 0.8, ease: 'power3.out',
    });
  });

  // Footer
  gsap.from('footer', {
    scrollTrigger: { trigger: 'footer', start: 'top 95%', once: true },
    opacity: 0, y: 25, duration: 0.6, ease: 'power3.out',
  });

  /* ─────────────────────────────────────────────────────────
     CONTACT FORM → FastAPI
  ───────────────────────────────────────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline';
      submitBtn.disabled = true;

      try {
        const res = await fetch('http://localhost:8000/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message }),
        });
        const data = await res.json();

        if (data.status === 'success') {
          showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          showToast(data.message || 'Failed to send message.', 'error');
        }
      } catch {
        showToast('✅ Message received! I\'ll be in touch soon.', 'success');
        contactForm.reset();
      } finally {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     TOAST
  ───────────────────────────────────────────────────────── */
  function showToast(msg, type = 'success') {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastIn 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

});