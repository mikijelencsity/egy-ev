import { elapsed } from './lib/time.js';

// Napszámláló: felpörög a valós értékig.
export function mountCounter(el, { start, reduce }) {
  const { gsap } = window;
  const daysEl = el.querySelector('#counter-days');
  const days = () => elapsed(start, new Date()).days;
  const state = { v: 0 };

  gsap.from(el.querySelectorAll('.counter-pre, .counter-post, .scroll-cue'), {
    opacity: 0, y: 16, duration: 0.8, stagger: 0.25, delay: 0.2,
  });
  gsap.to(state, {
    v: days(),
    duration: reduce ? 0.01 : 2.4,
    delay: 0.5,
    ease: 'power3.out',
    onUpdate: () => { daysEl.textContent = Math.round(state.v); },
    onComplete: () => setInterval(() => { daysEl.textContent = days(); }, 60000),
  });
}
