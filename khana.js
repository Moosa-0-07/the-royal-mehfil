const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const menuTabs = document.querySelectorAll('.menu-tab');
const menuPanels = document.querySelectorAll('.menu-panel');
const revealItems = document.querySelectorAll('.reveal');
const backToTopButton = document.querySelector('.back-to-top');
const reservationForm = document.getElementById('reservationForm');
const formSuccess = document.getElementById('formSuccess');
const yearEl = document.getElementById('year');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item img');
const menuCards = document.querySelectorAll('.menu-card');

menuCards.forEach((card) => {
  const cardImage = card.querySelector('img');
  if (cardImage) {
    cardImage.remove();
  }
  card.classList.add('no-image');
});

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const topOffset = targetId === '#home' ? 0 : 72;
      window.scrollTo({
        top: targetSection.offsetTop - topOffset,
        behavior: 'smooth',
      });
    }
  });
});

const setActiveLink = () => {
  const sections = document.querySelectorAll('main section[id]');
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 160 && rect.bottom >= 160) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const linkId = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', linkId === currentId);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;

    menuTabs.forEach((item) => item.classList.toggle('is-active', item === tab));
    menuPanels.forEach((panel) => {
      const matches = panel.dataset.panel === filter;
      panel.classList.toggle('is-visible', matches);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const showBackToTop = () => {
  if (window.scrollY > 300) {
    backToTopButton?.classList.add('visible');
  } else {
    backToTopButton?.classList.remove('visible');
  }
};

window.addEventListener('scroll', showBackToTop, { passive: true });
showBackToTop();

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (galleryItems.length) {
  galleryItems.forEach((image) => {
    image.addEventListener('click', () => {
      if (lightbox && lightboxImage) {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

if (lightboxClose && lightbox) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  });
}

const validateReservationForm = () => {
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const date = document.getElementById('date');
  const time = document.getElementById('time');
  const guests = document.getElementById('guests');

  if (!fullName || !phone || !email || !date || !time || !guests) {
    return false;
  }

  const phonePattern = /^\+?[0-9\s-]{7,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName.value.trim()) {
    fullName.focus();
    return false;
  }

  if (!phonePattern.test(phone.value.trim())) {
    phone.focus();
    return false;
  }

  if (!emailPattern.test(email.value.trim())) {
    email.focus();
    return false;
  }

  if (!date.value) {
    date.focus();
    return false;
  }

  if (!time.value) {
    time.focus();
    return false;
  }

  if (Number(guests.value) < 1 || Number(guests.value) > 20) {
    guests.focus();
    return false;
  }

  return true;
};

if (reservationForm) {
  reservationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateReservationForm()) {
      formSuccess.textContent = 'Please complete all required reservation details correctly.';
      formSuccess.style.color = '#b4282d';
      return;
    }

    formSuccess.textContent = 'Reservation request received. Our team will contact you shortly.';
    formSuccess.style.color = '#087f68';
    reservationForm.reset();
  });
}
