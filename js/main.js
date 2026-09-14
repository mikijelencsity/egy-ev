import { START_DATE, chapters, letter } from './content.js';
import { sound } from './sound.js';
import { preload } from './loader.js';
import { mountCover } from './cover.js';
import { mountCounter } from './counter.js';
import { renderChapters, animateChapters } from './chapters.js';
import { registry } from './interactions/index.js';
import { mountFinale } from './finale.js';

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

const sections = renderChapters(document.getElementById('chapters'), chapters);

async function boot() {
  const fill = document.getElementById('loader-fill');
  const firstImages = chapters.slice(0, 2).flatMap(c => c.photos.map(p => p.src));
  await Promise.all([
    preload(firstImages, p => { fill.style.transform = `scaleX(${p})`; }),
    document.fonts.ready,
  ]);

  animateChapters(sections, chapters, { sound, reduce });
  sections.forEach((s, i) => {
    const type = chapters[i].interaction?.type;
    if (type && registry[type]) {
      registry[type].mount(s.querySelector('.ch-body'), { sound, chapter: chapters[i], reduce });
    }
  });
  mountFinale(document.getElementById('finale'), { letter, sound, reduce });

  gsap.to('#spine i', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: true },
  });

  const loader = document.getElementById('loader');
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 700);

  mountCover(document.getElementById('cover'), {
    sound,
    onOpen() {
      document.documentElement.classList.remove('locked');
      mountCounter(document.getElementById('counter'), { start: START_DATE, reduce });
      ScrollTrigger.refresh();
    },
  });
}

// Némítás
const muteBtn = document.getElementById('mute');
muteBtn.addEventListener('click', () => {
  sound.setMuted(!sound.muted);
  muteBtn.classList.toggle('off', sound.muted);
  muteBtn.textContent = sound.muted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-pressed', String(sound.muted));
});

// Dupla koppintás bárhol: szív
let lastTap = { t: 0, x: 0, y: 0 };
document.addEventListener('pointerup', e => {
  if (e.target.closest('canvas, button, #cover, .is-stack, .is-holdable, .candle')) return;
  const now = performance.now();
  if (now - lastTap.t < 320 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 40) {
    heart(e.clientX, e.clientY);
    lastTap.t = 0;
  } else {
    lastTap = { t: now, x: e.clientX, y: e.clientY };
  }
});

function heart(x, y) {
  const h = document.createElement('div');
  h.className = 'tap-heart';
  h.textContent = '♥';
  h.style.left = `${x}px`;
  h.style.top = `${y}px`;
  document.getElementById('fx-layer').appendChild(h);
  gsap.fromTo(h, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 }, { scale: 1.3, opacity: 1, duration: 0.3, ease: 'back.out(3)' });
  gsap.to(h, { y: -70, opacity: 0, delay: 0.35, duration: 0.7, onComplete: () => h.remove() });
  sound.pop();
}

window.addEventListener('load', () => ScrollTrigger.refresh());

boot();
