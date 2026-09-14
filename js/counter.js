import { elapsed } from './lib/time.js';

const pad = n => String(n).padStart(2, '0');

// Napszámláló: felpörög a valós értékig, alatta másodpercre pontos óra.
export function mountCounter(el, { start, reduce }) {
  const { gsap } = window;
  const daysEl = el.querySelector('#counter-days');
  const clockEl = el.querySelector('#counter-clock');
  const state = { v: 0, counting: true };

  const tick = () => {
    const e = elapsed(start, new Date());
    clockEl.textContent = `${pad(e.hours)} óra · ${pad(e.minutes)} perc · ${pad(e.seconds)} mp`;
    if (!state.counting) daysEl.textContent = e.days;
    return e;
  };
  const { days } = tick();

  gsap.from(el.querySelectorAll('.counter-pre, .counter-post, .counter-clock, .scroll-cue'), {
    opacity: 0, y: 16, duration: 0.8, stagger: 0.25, delay: 0.2,
  });
  gsap.to(state, {
    v: days,
    duration: reduce ? 0.01 : 2.4,
    delay: 0.5,
    ease: 'power3.out',
    onUpdate: () => { daysEl.textContent = Math.round(state.v); },
    onComplete: () => { state.counting = false; tick(); },
  });
  setInterval(tick, 1000);
}
