const menuButton = document.querySelector('.premium-menu');
const navigation = document.querySelector('.premium-nav');
const form = document.querySelector('#premium-form');
const status = document.querySelector('#premium-status');
const calendarStatus = document.querySelector('#calendar-status');
const calendarGrid = document.querySelector('#calendar-grid');
const calendarMonth = document.querySelector('#calendar-month');
const dateInput = document.querySelector('#premium-date');
const today = new Date(2026, 8, 4);
const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const roomNames = { jardim: 'Suíte Jardim', mare: 'Suíte Maré', villa: 'Villa Almare' };
const roomOffsets = { jardim: 1, mare: 4, villa: 7 };
let selectedRoom = 'jardim';
let visibleMonth = new Date(currentMonth);

function formatDateBR(dateValue) {
  const [year, month, day] = dateValue.split('-');
  return `${day}/${month}/${year}`;
}

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
}, { threshold: 0.1 });

document.querySelectorAll('.premium-reveal').forEach((element) => revealObserver.observe(element));

function isBusy(day) {
  return (day + visibleMonth.getMonth() + roomOffsets[selectedRoom]) % 7 === 0;
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  calendarMonth.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(visibleMonth);
  calendarGrid.innerHTML = '';

  for (let i = 0; i < firstDay; i += 1) {
    const empty = document.createElement('span');
    empty.className = 'empty';
    calendarGrid.appendChild(empty);
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    const day = document.createElement('button');
    const date = new Date(year, month, dayNumber);
    const dateValue = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const busy = isBusy(dayNumber);
    day.className = `calendar-day ${busy ? 'busy' : 'available'}`;
    day.textContent = dayNumber;
    day.dataset.date = dateValue;
    day.disabled = busy || date < today;
    if (date.toDateString() === today.toDateString()) day.classList.add('today');
    calendarGrid.appendChild(day);
  }

  calendarStatus.textContent = `Agenda da ${roomNames[selectedRoom]}. Selecione uma data livre.`;
}

function updateRoom(room) {
  selectedRoom = room;
  document.querySelectorAll('.room-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.room === room));
  renderCalendar();
}

document.querySelectorAll('.room-tab').forEach((tab) => {
  tab.addEventListener('click', () => updateRoom(tab.dataset.room));
});

document.querySelectorAll('[data-room-link]').forEach((link) => {
  link.addEventListener('click', () => updateRoom(link.dataset.roomLink));
});

document.querySelector('#previous-month').addEventListener('click', () => {
  if (visibleMonth <= currentMonth) return;
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

document.querySelector('#next-month').addEventListener('click', () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

calendarGrid.addEventListener('click', (event) => {
  const day = event.target.closest('.calendar-day.available');
  if (!day) return;
  document.querySelectorAll('.calendar-day.selected').forEach((selectedDay) => selectedDay.classList.remove('selected'));
  day.classList.add('selected');
  dateInput.value = formatDateBR(day.dataset.date);
  calendarStatus.textContent = `${roomNames[selectedRoom]} · ${formatDateBR(day.dataset.date)}. Disponibilidade sujeita à confirmação.`;
});

renderCalendar();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = `Olá! Tenho interesse na ${roomNames[selectedRoom]}. Meu nome é ${document.querySelector('#premium-name').value}. E-mail: ${document.querySelector('#premium-email').value}. Data desejada: ${dateInput.value}. ${document.querySelector('#premium-message').value}`;
  status.textContent = 'Abrindo o WhatsApp para concluir sua solicitação...';
  window.open(`https://wa.me/5511932230010?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
