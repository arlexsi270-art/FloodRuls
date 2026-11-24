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

// мини-игра: лови сердечки
const gameEl = document.getElementById('game');
const gStart = document.getElementById('gStart');
const gTime = document.getElementById('gTime');
const gScore = document.getElementById('gScore');
const gBest = document.getElementById('gBest');
let score = 0, timeLeft = 20, playing = false, tick, spawn, best = 0;

try {
  best = parseInt(localStorage.getItem('heartBest'), 10) || 0;
} catch (e) {}
gBest.textContent = best;

function floatText(x, y, text) {
  const t = document.createElement('span');
  t.className = 'gain';
  t.textContent = text;
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  gameEl.appendChild(t);
  setTimeout(function () { t.remove(); }, 700);
}

function addFalling() {
  if (!playing) return;
  const r = Math.random();
  const kind = r < 0.7 ? ['💖', 1] : r < 0.85 ? ['✨', 3] : ['💔', -2];
  const el = document.createElement('div');
  el.className = 'fall';
  el.textContent = kind[0];
  el.style.left = Math.random() * (gameEl.clientWidth - 50) + 'px';
  el.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
  el.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (!playing || el.dataset.hit) return;
    el.dataset.hit = '1';
    score = Math.max(0, score + kind[1]);
    gScore.textContent = score;
    const rect = gameEl.getBoundingClientRect();
    floatText(e.clientX - rect.left, e.clientY - rect.top, (kind[1] > 0 ? '+' : '') + kind[1]);
    if (kind[1] < 0) {
      gameEl.classList.remove('shake');
      void gameEl.offsetWidth;
      gameEl.classList.add('shake');
      if (navigator.vibrate) navigator.vibrate(40);
    }
    el.remove();
  });
  el.addEventListener('animationend', function () { el.remove(); });
  gameEl.appendChild(el);
}

function endGame() {
  playing = false;
  clearInterval(tick);
  clearInterval(spawn);
  gameEl.querySelectorAll('.fall').forEach(function (n) { n.remove(); });
  if (score > best) {
    best = score;
    gBest.textContent = best;
    try { localStorage.setItem('heartBest', String(best)); } catch (e) {}
    gStart.textContent = 'Новый рекорд: ' + score + '! 🎉 Ещё раз';
  } else {
    gStart.textContent = 'Итого ' + score + ' ♡ Ещё раз';
  }
  gStart.style.display = '';
}

gStart.addEventListener('click', function () {
  score = 0;
  timeLeft = 20;
  playing = true;
  gScore.textContent = 0;
  gTime.textContent = timeLeft;
  gStart.style.display = 'none';
  let speed = 650;
  spawn = setInterval(addFalling, speed);
  tick = setInterval(function () {
    timeLeft--;
    gTime.textContent = timeLeft;
    if (timeLeft % 5 === 0 && speed > 300) {
      speed -= 120;
      clearInterval(spawn);
      spawn = setInterval(addFalling, speed);
    }
    if (timeLeft <= 0) endGame();
  }, 1000);
});
