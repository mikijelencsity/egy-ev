// Háttérzene. A böngészők csak felhasználói érintésre engedik elindítani,
// ezért a start() hívásnak közvetlenül az érintés-kezelőben kell lennie.
export function createMusic(src) {
  const audio = new Audio();
  audio.id = 'music';
  audio.src = src;
  audio.loop = true;
  audio.preload = 'none';
  audio.setAttribute('playsinline', '');
  audio.hidden = true;
  document.body.appendChild(audio);

  let wanted = false;
  let muted = false;

  const tryPlay = () => audio.play().catch(() => {
    // Ha mégsem indult el, a következő érintésre újrapróbálja.
    document.addEventListener('pointerdown', () => { if (wanted && !muted) audio.play().catch(() => {}); }, { once: true });
  });

  // Halk felúsztatás (iPhone-on a hangerő nem állítható, ott rögtön teljes hangerővel szól).
  function fadeIn() {
    let t0 = null;
    const step = t => {
      t0 ??= t;
      const p = Math.min(1, Math.max(0, (t - t0) / 2500));
      audio.volume = 0.85 * p;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  document.addEventListener('visibilitychange', () => {
    if (!wanted || muted) return;
    if (document.hidden) audio.pause();
    else tryPlay();
  });

  return {
    warm() { audio.preload = 'auto'; audio.load(); },
    start() {
      if (wanted) return;
      wanted = true;
      audio.volume = 0;
      tryPlay();
      fadeIn();
    },
    setMuted(v) {
      muted = v;
      audio.muted = v;
      if (!v && wanted && audio.paused) tryPlay();
    },
  };
}
