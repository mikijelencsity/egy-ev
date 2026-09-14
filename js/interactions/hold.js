import { polaroid } from '../chapters.js';

// Lenyomva tartott kép: mancsnyomok sétálnak át, és előbukkan a titkos kép.
export function mount(el, { sound, chapter }) {
  const { gsap } = window;
  const cfg = chapter.interaction;
  const fig = el.querySelectorAll('.polaroid')[cfg.target ?? 0];
  if (!fig) return;
  fig.classList.add('is-holdable');

  const ns = 'http://www.w3.org/2000/svg';
  const ring = document.createElementNS(ns, 'svg');
  ring.setAttribute('class', 'hold-ring');
  ring.setAttribute('viewBox', '0 0 100 100');
  ring.innerHTML = '<circle cx="50" cy="50" r="44"/>';
  fig.querySelector('.ph').appendChild(ring);
  const circle = ring.querySelector('circle');
  const len = 2 * Math.PI * 44;
  gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });

  const holder = document.createElement('div');
  holder.innerHTML = polaroid({ ...cfg.secret, rot: 6 }, 99);
  const secret = holder.firstElementChild;
  secret.classList.add('secret');
  secret.style.alignSelf = 'center';
  fig.after(secret);

  let fill = null;
  let x0 = 0;
  let y0 = 0;
  let done = false;

  const cancel = () => {
    if (!fill || done) return;
    fill.kill();
    fill = null;
    ring.classList.remove('on');
    gsap.to(circle, { strokeDashoffset: len, duration: 0.25 });
  };

  fig.addEventListener('contextmenu', e => e.preventDefault());
  fig.addEventListener('pointerdown', e => {
    if (done) return;
    x0 = e.clientX;
    y0 = e.clientY;
    ring.classList.add('on');
    fill = gsap.to(circle, {
      strokeDashoffset: 0, duration: 0.7, ease: 'none',
      onComplete: () => { done = true; ring.classList.remove('on'); reveal(); },
    });
  });
  fig.addEventListener('pointermove', e => {
    if (fill && Math.hypot(e.clientX - x0, e.clientY - y0) > 12) cancel();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => fig.addEventListener(t, cancel));

  function reveal() {
    const layer = document.createElement('div');
    layer.className = 'paws';
    el.appendChild(layer);
    const steps = 7;
    for (let i = 0; i < steps; i++) {
      const p = document.createElement('span');
      p.textContent = '🐾';
      p.style.left = `${6 + i * 12}%`;
      p.style.top = `${18 + i * 8 + (i % 2 ? 4 : 0)}%`;
      layer.appendChild(p);
      gsap.fromTo(p, { opacity: 0, scale: 0.4 }, {
        opacity: 0.9, scale: 1, duration: 0.25, delay: i * 0.16, onStart: () => sound.pop(),
      });
      gsap.to(p, { opacity: 0, duration: 0.6, delay: 1.8 + i * 0.08 });
    }
    setTimeout(() => layer.remove(), 3400);

    secret.classList.add('show');
    gsap.fromTo(secret, { scale: 0.2, rotation: -40, opacity: 0 }, {
      scale: 1, rotation: 6, opacity: 1, duration: 1.1, delay: steps * 0.16, ease: 'elastic.out(1, 0.55)',
    });
    el.closest('.chapter').classList.add('solved');
    window.ScrollTrigger.refresh();
  }
}
