// раскрытие и сворачивание разделов
const cards = document.querySelectorAll('.card');

document.querySelectorAll('.head').forEach(function (head) {
  head.addEventListener('click', function () {
    head.parentElement.classList.toggle('open');
    updateAllButton();
  });
});

const allBtn = document.getElementById('all');

function updateAllButton() {
  const everythingOpen = Array.from(cards).every(function (c) {
    return c.classList.contains('open');
  });
  allBtn.textContent = everythingOpen ? 'Свернуть всё' : 'Раскрыть всё';
}

allBtn.addEventListener('click', function () {
  const everythingOpen = Array.from(cards).every(function (c) {
    return c.classList.contains('open');
  });
  cards.forEach(function (c) {
    c.classList.toggle('open', !everythingOpen);
  });
  updateAllButton();
});

// переключение светлой и тёмной темы
document.getElementById('theme').addEventListener('click', function () {
  const root = document.documentElement;
  const saved = root.getAttribute('data-theme');
  const isDark = saved
    ? saved === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// летающие сердечки на фоне
const sparks = document.getElementById('sparks');
const symbols = ['✦', '♡', '✧', '˚', '⋆'];

for (let i = 0; i < 14; i++) {
  const el = document.createElement('span');
  el.className = 'sp';
  el.textContent = symbols[i % symbols.length];
  el.style.left = Math.random() * 100 + '%';
  el.style.top = 100 + Math.random() * 20 + 'vh';
  el.style.fontSize = 12 + Math.random() * 16 + 'px';
  el.style.animationDuration = 14 + Math.random() * 16 + 's';
  el.style.animationDelay = -Math.random() * 20 + 's';
  sparks.appendChild(el);
}
