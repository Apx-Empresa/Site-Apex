const plans = {
  basico: {
    name: 'Site Básico',
    title: 'Uma presença digital objetiva e profissional.',
    description: 'Ideal para apresentar sua empresa, seus serviços e os principais canais de contato em uma página clara e responsiva.',
    features: ['Página única', 'Design personalizado', 'Botão do WhatsApp']
  },
  profissional: {
    name: 'Site Profissional',
    title: 'Mais espaço para sua marca conquistar clientes.',
    description: 'Uma estrutura completa para contar sua história, apresentar seus serviços e facilitar o contato com novos clientes.',
    features: ['Até 5 páginas', 'Formulário de contato', 'Animações e SEO básico']
  },
  premium: {
    name: 'Site Premium',
    title: 'Uma experiência digital completa para sua empresa.',
    description: 'Um projeto robusto, com visual exclusivo e recursos avançados para destacar sua marca em cada detalhe.',
    features: ['Até 10 páginas', 'Galeria de imagens', 'Suporte por 60 dias']
  }
};

const planKey = new URLSearchParams(window.location.search).get('plano') || 'profissional';
const plan = plans[planKey] || plans.profissional;

document.title = `${plan.name} | ApexSite`;
document.querySelector('#demo-kicker').textContent = `Demonstração · ${plan.name}`;
document.querySelector('#demo-title').textContent = plan.title;
document.querySelector('#demo-description').textContent = plan.description;
document.querySelector('#preview-brand').textContent = plan.name;

const featureContainer = document.querySelector('#demo-features');
plan.features.forEach((feature) => {
  const item = document.createElement('article');
  item.className = 'demo-feature';
  item.innerHTML = `<strong>${feature}</strong><span>Configurado de acordo com o objetivo do seu negócio.</span>`;
  featureContainer.appendChild(item);
});
