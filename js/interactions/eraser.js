import { erasedRatio } from '../lib/erase.js';

// Letörölhető réteg (kaparás, pára) egy polaroid képe fölé. Csak akkor rajzol, ha a kép a képernyő közelébe ér.
export function attachEraser(fig, opts) {
  const ph = fig.querySelector('.ph');
  const canvas = document.createElement('canvas');
  canvas.className = 'eraser';
  ph.appendChild(canvas);
  fig.classList.add('has-eraser');

  const io = new IntersectionObserver(async entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    io.disconnect();
    try { await document.fonts.load('700 34px Caveat'); } catch { /* betűtípus nélkül is megy */ }
    createEraser(canvas, {
      ...opts,
      onDone: () => { fig.classList.add('revealed'); opts.onDone?.(); },
    });
  }, { rootMargin: '400px 0px' });
  io.observe(fig);
}

export function createEraser(canvas, { paint, radius = 26, doneAt = 0.5, onStroke, onDone }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let w = 0;
  let touched = false;
  let done = false;
  let last = null;
  let lastCheck = 0;

  function setup() {
    w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    paint(ctx, w, h);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = radius * 2;
  }
  setup();
  new ResizeObserver(() => {
    if (!touched && !done && canvas.offsetWidth !== w) setup();
  }).observe(canvas);

  // offsetX/offsetY a vászon saját (elforgatás nélküli) koordinátarendszerében van.
  const at = e => [e.offsetX, e.offsetY];

  function check(force) {
    const now = performance.now();
    if (done || (!force && now - lastCheck < 180)) return;
    lastCheck = now;
    const ratio = erasedRatio(ctx.getImageData(0, 0, canvas.width, canvas.height), 10);
    if (ratio >= doneAt) {
      done = true;
      canvas.classList.add('erased');
      onDone?.();
    }
  }

  canvas.addEventListener('pointerdown', e => {
    if (done) return;
    touched = true;
    canvas.setPointerCapture(e.pointerId);
    last = at(e);
    ctx.beginPath();
    ctx.arc(last[0], last[1], radius, 0, Math.PI * 2);
    ctx.fill();
    onStroke?.();
  });
  canvas.addEventListener('pointermove', e => {
    if (!last || done) return;
    const p = at(e);
    ctx.beginPath();
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();
    last = p;
    onStroke?.();
    check(false);
  });
  const end = () => {
    if (!last) return;
    last = null;
    check(true);
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
}
