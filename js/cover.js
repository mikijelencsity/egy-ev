// Borító: koppintásra vagy felfelé húzásra kinyílik, addig az oldal nem görgethető.
export function mountCover(el, { sound, onOpen }) {
  const { gsap } = window;
  const cover = el.querySelector('#book-cover');
  const book = el.querySelector('.book');
  let opened = false;
  let y0 = null;

  function open() {
    if (opened) return;
    opened = true;
    sound.unlock();
    sound.page();
    el.classList.add('opening');
    gsap.timeline({ onComplete: () => el.remove() })
      .to(cover, { rotationY: -168, duration: 1.3, ease: 'power2.inOut' })
      .to(book, { scale: 1.5, opacity: 0, duration: 0.7, ease: 'power2.in' }, '-=0.25')
      .add(() => onOpen?.(), '-=0.35')
      .to(el, { opacity: 0, duration: 0.5 }, '-=0.4');
  }

  el.addEventListener('pointerdown', e => { y0 = e.clientY; });
  el.addEventListener('pointerup', e => {
    if (y0 === null) return;
    const dy = e.clientY - y0;
    y0 = null;
    if (dy < -40 || Math.abs(dy) < 12) open();
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') open();
  });
}
