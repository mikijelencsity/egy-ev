// Két egymáson fekvő kép: vízszintes húzással (vagy koppintással) szétválnak.
export function mount(el, { sound }) {
  const { gsap } = window;
  const [a, b] = el.querySelectorAll('.polaroid');
  if (!a || !b) return;
  el.classList.add('is-stack');

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', duration: 1 } })
    .fromTo(a, { x: 6, y: 0, rotation: -3 }, { x: -40, y: -165, rotation: -7 }, 0)
    .fromTo(b, { x: -6, y: 10, rotation: 4 }, { x: 40, y: 165, rotation: 6 }, 0);

  let x0 = null;
  let base = 0;
  let solved = false;

  el.addEventListener('pointerdown', e => {
    x0 = e.clientX;
    base = tl.progress();
  });
  el.addEventListener('pointermove', e => {
    if (x0 === null) return;
    tl.progress(Math.min(1, base + Math.abs(e.clientX - x0) / 150));
  });
  el.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const moved = Math.abs(e.clientX - x0);
    x0 = null;
    const target = moved < 8 ? (tl.progress() > 0.5 ? 0 : 1) : (tl.progress() > 0.35 ? 1 : 0);
    gsap.to(tl, { progress: target, duration: 0.6, ease: 'power3.out' });
    if (target === 1) {
      sound.paper();
      if (!solved) {
        solved = true;
        el.closest('.chapter').classList.add('solved');
      }
    }
  });
  el.addEventListener('pointercancel', () => {
    if (x0 === null) return;
    x0 = null;
    gsap.to(tl, { progress: tl.progress() > 0.5 ? 1 : 0, duration: 0.4 });
  });
}
