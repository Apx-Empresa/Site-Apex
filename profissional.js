const menuButton = document.querySelector('.pro-menu');
const navigation = document.querySelector('.pro-nav');
const form = document.querySelector('#pro-form');
const status = document.querySelector('#form-status');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.pro-reveal').forEach((element) => revealObserver.observe(element));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = `Olá! Meu nome é ${data.get('nome')}. Meu e-mail é ${data.get('email')}. Projeto: ${data.get('mensagem')}`;
  const whatsappUrl = `https://wa.me/5511932230010?text=${encodeURIComponent(message)}`;
  status.textContent = 'Abrindo o WhatsApp para concluir o contato...';
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
