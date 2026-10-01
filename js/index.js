function getCompletedExperience(startDate, now = new Date()) {
  const start = new Date(`${startDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== startDate) {
    throw new RangeError('Experience requires a valid YYYY-MM-DD start date.');
  }
  const calendar = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(now);
  const part = type => Number(calendar.find(value => value.type === type).value);
  const totalMonths = Math.max(0,
    (part('year') - start.getUTCFullYear()) * 12 + part('month') - start.getUTCMonth() - 1 -
    (part('day') < start.getUTCDate() ? 1 : 0));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearLabel = `${years} ${years === 1 ? 'year' : 'years'}`;
  const monthLabel = `${months} ${months === 1 ? 'month' : 'months'}`;
  const label = [
    years ? yearLabel : '',
    months || !years ? monthLabel : '',
  ].filter(Boolean).join(' ');
  const shortLabel = [years ? `${years}y` : '', months || !years ? `${months}m` : '']
    .filter(Boolean).join(' ');
  return { years, months, totalMonths, label, shortLabel };
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('headers');
  const menuButton = document.getElementById('menuBtn');
  const navigation = document.getElementById('mainNav');
  const navigationLinks = Array.from(document.querySelectorAll('.tab-link'));
  const sections = Array.from(document.querySelectorAll('main > section[id]'));
  const overlay = document.getElementById('menuOverlay');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const backToTop = document.getElementById('backToTop');
  const mobileViewport = window.matchMedia('(max-width: 900px)');
  const contactForm = document.getElementById('contactForm');
  const submitButton = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const draftLink = document.getElementById('emailDraft');
  const localPreview = window.location.protocol === 'file:' ||
    ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  let menuOpen = false;
  let scrollPending = false;

  document.documentElement.classList.add('js-ready');
  document.querySelectorAll('.bx').forEach(icon => icon.setAttribute('aria-hidden', 'true'));

  function setMenu(open, restoreFocus = false) {
    menuOpen = open && mobileViewport.matches;
    navigation.classList.toggle('active', menuOpen);
    navigation.inert = mobileViewport.matches && !menuOpen;
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    menuButton.setAttribute('aria-label', menuOpen ? 'Close navigation' : 'Open navigation');
    menuButton.querySelector('i').className = menuOpen ? 'bx bx-x' : 'bx bx-menu';
    overlay.hidden = !menuOpen;
    main.inert = menuOpen;
    footer.inert = menuOpen;
    document.documentElement.classList.toggle('menu-open', menuOpen);
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  overlay.addEventListener('click', () => setMenu(false, true));
  document.querySelectorAll('.tab-link, .logo').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  mobileViewport.addEventListener('change', () => {
    const focusInNavigation = navigation.contains(document.activeElement);
    setMenu(false, mobileViewport.matches && focusInNavigation);
  });

  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
    }
    if (event.key === 'Tab') {
      const first = menuButton;
      const last = navigationLinks.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function updateScrollState() {
    const position = window.scrollY;
    const offset = header.offsetHeight + 48;
    let current = sections[0].id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    if (position + window.innerHeight >= document.documentElement.scrollHeight - 8) {
      current = sections.at(-1).id;
    }
    navigationLinks.forEach(link => {
      const active = link.hash === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    header.classList.toggle('scrolled', position > 16);
    backToTop.hidden = position < 600 || current === 'contacts';
    scrollPending = false;
  }

  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener('resize', updateScrollState);
  window.addEventListener('pageshow', () => {
    setMenu(false);
    updateScrollState();
  });
  setMenu(false);
  updateScrollState();

  function updateExperience() {
    const now = new Date();
    document.querySelectorAll('[data-experience-start]').forEach(element => {
      const duration = getCompletedExperience(element.dataset.experienceStart, now);
      element.textContent = element.dataset.experienceStyle === 'short' ? duration.shortLabel : duration.label;
      element.setAttribute('aria-label', duration.label);
    });
    const year = document.getElementById('copyrightYear');
    if (year) year.textContent = now.getFullYear();
  }

  updateExperience();
  window.setInterval(updateExperience, 60000);
  window.addEventListener('pageshow', updateExperience);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateExperience();
  });

  function showStatus(message, state) {
    formStatus.textContent = message;
    formStatus.dataset.state = state;
    formStatus.hidden = false;
  }

  if (contactForm) {
    const buttonText = submitButton.querySelector('.btn-text');
    const defaultLabel = localPreview && !contactForm.dataset.endpoint ? 'Create email draft' : 'Send message';
    buttonText.textContent = defaultLabel;

    contactForm.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
      draftLink.hidden = true;
      formStatus.hidden = true;
    });

    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitButton.disabled) return;

      const values = new FormData(contactForm);
      const readField = name => {
        const value = values.get(name);
        return typeof value === 'string' ? value.trim() : '';
      };
      const message = {
        name: readField('name'),
        email: readField('email'),
        subject: readField('subject') || 'Portfolio enquiry',
        message: readField('message'),
      };

      for (const field of ['name', 'email', 'message']) {
        if (!message[field]) {
          contactForm.elements.namedItem(field).setCustomValidity('Please complete this field.');
        }
      }
      if (!contactForm.reportValidity() || values.get('bot-field')) return;

      const endpoint = contactForm.dataset.endpoint;
      draftLink.hidden = true;
      formStatus.hidden = true;

      if (localPreview && !endpoint) {
        const body = `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`;
        draftLink.href = `mailto:githuvarghese97@gmail.com?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(body)}`;
        draftLink.hidden = false;
        showStatus('Your email draft is ready. No message has been sent yet.', 'draft');
        draftLink.focus();
        return;
      }

      submitButton.disabled = true;
      contactForm.setAttribute('aria-busy', 'true');
      buttonText.textContent = 'Sending...';
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(endpoint || contactForm.getAttribute('action'), {
          method: 'POST',
          headers: {
            'Content-Type': endpoint ? 'application/json' : 'application/x-www-form-urlencoded',
          },
          body: endpoint ? JSON.stringify(message) : new URLSearchParams(values).toString(),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Message request failed');
        if (endpoint) {
          const result = await response.json();
          if (result.status !== 'success') throw new Error('Message was not accepted');
        }
        showStatus('Your message has been sent.', 'success');
        contactForm.reset();
      } catch {
        showStatus('Your message could not be sent. Please try again or use the direct email link below.', 'error');
      } finally {
        window.clearTimeout(timeout);
        submitButton.disabled = false;
        contactForm.removeAttribute('aria-busy');
        buttonText.textContent = defaultLabel;
      }
    });
  }
});