import { quiz } from '../content.js';
import { checkAnswer } from '../lib/quiz.js';

// Zárolt emlék: a kép csak a helyes válaszra tisztul ki.
export function mount(el, { sound }) {
  const { gsap } = window;
  const fig = el.querySelector('.polaroid');
  if (!fig) return;
  fig.classList.add('locked');

  const lock = document.createElement('div');
  lock.className = 'lock';
  lock.textContent = '🔒';
  fig.querySelector('.ph').appendChild(lock);

  const card = document.createElement('div');
  card.className = 'quiz';
  card.innerHTML = `
    <p class="quiz-q hand">${quiz.question}</p>
    ${quiz.options.map((o, i) => `<button type="button" class="quiz-opt hand" data-i="${i}">${o}</button>`).join('')}
    <p class="quiz-hint hand" aria-live="polite"></p>`;
  el.appendChild(card);
  const hintEl = card.querySelector('.quiz-hint');

  card.addEventListener('click', e => {
    const btn = e.target.closest('.quiz-opt');
    if (!btn || card.classList.contains('done')) return;

    if (checkAnswer(quiz, Number(btn.dataset.i))) {
      card.classList.add('done');
      btn.classList.add('ok');
      sound.chime();
      gsap.to(lock, { y: -90, rotation: 35, opacity: 0, duration: 0.8, ease: 'power2.in' });
      fig.classList.add('unlocked');
      fig.classList.remove('locked');
      hintEl.textContent = 'feloldva ♡';
      el.closest('.chapter').classList.add('solved');
    } else {
      btn.classList.add('wrong');
      navigator.vibrate?.(60);
      gsap.fromTo(card, { x: -12 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.3)' });
      hintEl.textContent = `nem egészen... tipp: ${quiz.hint}`;
    }
  });
}
