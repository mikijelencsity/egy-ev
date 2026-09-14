// Polaroid-kupac: pöccintésre szétrepül, újabb koppintásra visszarendeződik.
export function mount(el, { sound }) {
  const { gsap } = window;
  const figs = [...el.querySelectorAll('.polaroid')];
  if (!figs.length) return;
  el.classList.add('is-stack');

  const pile = [{ x: -8, y: 8, rotation: -9 }, { x: 10, y: -6, rotation: 7 }];
  const flung = [{ x: -42, y: -165, rotation: -11 }, { x: 42, y: 165, rotation: 9 }];
  figs.forEach((f, i) => gsap.set(f, pile[i % 2]));

  let open = false;
  let start = null;

  function toggle() {
    open = !open;
    sound.whoosh();
    figs.forEach((f, i) => gsap.to(f, {
      ...(open ? flung : pile)[i % 2],
      duration: open ? 0.9 : 0.6,
      ease: open ? 'back.out(1.5)' : 'power3.inOut',
      delay: i * 0.07,
    }));
    if (open) el.closest('.chapter').classList.add('solved');
  }

  el.addEventListener('pointerdown', e => { start = e.clientX; });
  el.addEventListener('pointerup', () => {
    if (start === null) return;
    start = null;
    toggle();
  });
  el.addEventListener('pointercancel', () => { start = null; });
}
