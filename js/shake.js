import { heartPoints } from './lib/heart.js';
import { createShakeDetector } from './lib/shake.js';
import { confetti } from './fx.js';

const HITS = 10;
const HEART_FILL_H = 90;

// Záró játék: csak a legvégén, sok rázásra telik meg a szív, utána a képekből szív lesz.
export function mountShake(el, { photos, sound, reduce }) {
  const { gsap, ScrollTrigger } = window;
  const btn = el.querySelector('#shake-start');
  const text = el.querySelector('#shake-text');
  const heart = el.querySelector('#shake-heart');
  const fill = el.querySelector('#shake-fill');
  const count = el.querySelector('#shake-count');
  const detect = createShakeDetector({ threshold: 13, minGap: 110 });

  let inView = false;
  let armed = false;
  let done = false;
  let gotMotion = false;
  let hits = 0;

  ScrollTrigger.create({
    trigger: el, start: 'top 60%', end: 'bottom 40%',
    onToggle: self => { inView = self.isActive; },
  });

  function hit() {
    if (!armed || !inView || done) return;
    hits++;
    sound.paper();
    navigator.vibrate?.(15);
    const p = hits / HITS;
    count.textContent = `${hits} / ${HITS}`;
    gsap.fromTo(count, { scale: 1.4 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
    gsap.to(fill, { attr: { y: HEART_FILL_H * (1 - p), height: HEART_FILL_H * p }, duration: 0.2 });
    gsap.fromTo(heart, { rotation: hits % 2 ? -7 : 7 }, { rotation: 0, duration: 0.35, ease: 'elastic.out(1.4, 0.3)' });
    if (hits === Math.round(HITS * 0.5)) text.textContent = 'még, még!';
    if (hits === Math.round(HITS * 0.8)) text.textContent = 'mindjárt...';
    if (hits >= HITS) finish();
  }

  function onMotion(e) {
    const a = e.acceleration;
    const g = e.accelerationIncludingGravity;
    let isHit = false;
    if (a && a.x != null) {
      gotMotion = true;
      isHit = detect(a.x, a.y, a.z, e.timeStamp, false);
    } else if (g && g.x != null) {
      gotMotion = true;
      isHit = detect(g.x, g.y, g.z, e.timeStamp, true);
    }
    if (isHit) hit();
  }

  function useTaps() {
    text.textContent = 'koppints a szívre, sokszor!';
    heart.classList.add('tappable');
  }

  btn.addEventListener('click', async () => {
    sound.unlock();
    let allowed = typeof DeviceMotionEvent !== 'undefined';
    if (allowed && typeof DeviceMotionEvent.requestPermission === 'function') {
      try { allowed = (await DeviceMotionEvent.requestPermission()) === 'granted'; } catch { allowed = false; }
    }
    armed = true;
    btn.hidden = true;
    count.textContent = `0 / ${HITS}`;
    count.hidden = false;
    heart.classList.add('armed');
    if (allowed) {
      text.textContent = 'rázd meg a telefont, erősen!';
      window.addEventListener('devicemotion', onMotion);
      setTimeout(() => { if (!gotMotion && !done) useTaps(); }, 2500);
    } else {
      useTaps();
    }
  });

  heart.addEventListener('pointerdown', () => {
    if (heart.classList.contains('tappable')) hit();
  });

  function finish() {
    done = true;
    window.removeEventListener('devicemotion', onMotion);
    text.textContent = '';
    sound.chime();
    showHeart();
  }

  function showHeart() {
    const overlay = document.getElementById('love');
    const stage = overlay.querySelector('.love-stage');
    const words = overlay.querySelector('.love-words');
    const foot = overlay.querySelector('.love-foot');
    document.documentElement.classList.add('locked');
    overlay.hidden = false;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pts = heartPoints(photos.length);
    // A képméret a szomszédos pontok távolságához igazodik, hogy ne csússzanak egymásra.
    const gapUnit = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
    const fitScale = size => Math.min((vw - size - 28) / 2, (vh * 0.6 - size) / 1.81);
    let size = 56;
    for (let k = 0; k < 3; k++) size = Math.round(Math.min(80, Math.max(42, gapUnit * fitScale(size) * 0.9)));
    const scale = fitScale(size);
    const picH = size + 16;
    const cx = vw / 2;
    const cy = vh * 0.46;
    let zoomed = null;

    photos.forEach((src, i) => {
      const [x, y] = pts[i];
      const pic = document.createElement('div');
      pic.className = 'love-pic';
      pic.style.width = `${size}px`;
      pic.innerHTML = `<img src="${src}" alt="" draggable="false">`;
      stage.appendChild(pic);
      const home = {
        x: cx + x * scale - size / 2,
        y: cy + (y - 0.155) * scale - picH / 2,
        rotation: gsap.utils.random(-10, 10),
        scale: 1,
      };
      pic.home = home;
      gsap.fromTo(pic,
        { x: Math.random() * vw - size / 2, y: -220 - Math.random() * 320, rotation: gsap.utils.random(-90, 90) },
        { ...home, duration: reduce ? 0.01 : 1.1, delay: reduce ? 0 : i * 0.09, ease: 'bounce.out', onStart: () => sound.paper() });
      pic.addEventListener('click', () => toggleZoom(pic));
    });

    function toggleZoom(pic) {
      if (zoomed) {
        const prev = zoomed;
        zoomed = null;
        gsap.to(prev, { ...prev.home, duration: 0.45, ease: 'power3.inOut', onComplete: () => { prev.style.zIndex = ''; } });
        if (prev === pic) return;
      }
      zoomed = pic;
      pic.style.zIndex = 5;
      gsap.to(pic, {
        x: cx - size / 2, y: vh / 2 - picH / 2, rotation: 0,
        scale: Math.min(vw * 0.8, 340) / size, duration: 0.5, ease: 'power3.out',
      });
    }

    const wordsAt = reduce ? 0.2 : photos.length * 0.09 + 1;
    gsap.set(words, { top: cy - 0.05 * scale, xPercent: -50, yPercent: -50 });
    gsap.fromTo(words, { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1.1, delay: wordsAt, ease: 'elastic.out(1, 0.5)',
      onStart: () => { sound.chime(); if (!reduce) confetti(); },
    });
    gsap.fromTo(foot, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: wordsAt + 1.4 });
  }
}
