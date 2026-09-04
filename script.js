const loader = document.querySelector('.site-loader');
const loaderProgress = document.querySelector('.loader-status strong');

if (loader) {
  let progress = 0;
  const progressTimer = window.setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 14) + 7, 100);
    loaderProgress.textContent = `${progress}%`;
    if (progress === 100) {
      window.clearInterval(progressTimer);
      window.setTimeout(() => {
        loader.classList.add('is-complete');
        document.body.classList.add('site-ready');
      }, 350);
    }
  }, 90);
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => revealObserver.observe(item));
