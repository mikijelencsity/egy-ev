const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Levél, elfújható gyertya, papírkonfetti.
export function mountFinale(el, { letter, sound, reduce }) {
  const { gsap } = window;

  // --- Levél ---
  const letterEl = el.querySelector('#letter');
  letterEl.classList.toggle('is-placeholder', !!letter.placeholder);
  letterEl.innerHTML = letter.paragraphs.map(p => `<p class="hand">${esc(p)}</p>`).join('')
    + `<p class="signature hand">${esc(letter.signature)}</p>`;
  letterEl.querySelectorAll('p').forEach(p => {
    gsap.fromTo(p, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', duration: reduce ? 0.01 : 1.8, ease: 'power1.inOut',
      scrollTrigger: { trigger: p, start: 'top 88%', once: true },
    });
  });

  // --- Gyertya ---
  const candle = el.querySelector('#candle');
  const flame = el.querySelector('#flame');
  const flameWrap = el.querySelector('.flame-wrap');
  const startBtn = el.querySelector('#candle-start');
  const help = el.querySelector('#candle-help');
  const end = el.querySelector('#the-end');
  let out = false;
  let stream = null;
  let actx = null;
  let raf = 0;
  let fallbackTimer = 0;
  const say = t => { help.textContent = t; };

  async function listen() {
    startBtn.classList.add('hide');
    say('fújj bele a telefon aljába');
    fallbackTimer = setTimeout(() => { if (!out) say('ha nem megy, koppints a lángra'); }, 4000);
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = actx.createAnalyser();
      analyser.fftSize = 1024;
      actx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let loudSince = 0;
      const loop = t => {
        if (out) return;
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        flameWrap.style.transform = `skewX(${Math.min(rms * 160, 28)}deg) scaleY(${1 - Math.min(rms * 2, 0.35)})`;
        if (rms > 0.12) {
          loudSince ||= t;
          if (t - loudSince > 220) { blowOut(); return; }
        } else {
          loudSince = 0;
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } catch {
      clearTimeout(fallbackTimer);
      say('koppints a lángra, és elfújod');
    }
  }

  function stopMic() {
    cancelAnimationFrame(raf);
    clearTimeout(fallbackTimer);
    stream?.getTracks().forEach(t => t.stop());
    actx?.close();
    stream = null;
    actx = null;
  }

  function blowOut() {
    if (out) return;
    out = true;
    stopMic();
    flameWrap.style.transform = '';
    startBtn.classList.add('hide');
    flame.classList.add('out');
    candle.classList.add('is-out');
    say('');
    sound.whoosh();
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('span');
      s.className = 'smoke';
      candle.appendChild(s);
      gsap.fromTo(s, { opacity: 0.7, y: 0, x: 0, scale: 0.6 }, {
        opacity: 0, y: -140 - Math.random() * 60, x: (Math.random() - 0.5) * 50, scale: 2.4,
        duration: 2.2, delay: i * 0.12, ease: 'power1.out', onComplete: () => s.remove(),
      });
    }
    setTimeout(() => {
      confetti();
      sound.chime();
      end.classList.add('show');
      gsap.from(end, { opacity: 0, y: 40, duration: 1.4, ease: 'power2.out' });
      window.ScrollTrigger.refresh();
      window.scrollTo({ top: end.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
    }, 1000);
  }

  startBtn.addEventListener('click', listen);
  candle.addEventListener('click', blowOut);

  function confetti() {
    const layer = document.getElementById('fx-layer');
    const colors = ['#b5452b', '#efe6d6', '#e7c98f', '#fffdf8', '#7a6655', '#d98b6a'];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i');
      c.className = 'bit';
      c.style.background = colors[i % colors.length];
      c.style.left = `${Math.random() * 100}vw`;
      c.style.width = `${6 + Math.random() * 8}px`;
      c.style.height = `${8 + Math.random() * 10}px`;
      layer.appendChild(c);
      gsap.fromTo(c, { y: -30, rotation: Math.random() * 360 }, {
        y: window.innerHeight + 40,
        x: (Math.random() - 0.5) * 160,
        rotation: `+=${360 + Math.random() * 720}`,
        duration: 2.4 + Math.random() * 2,
        delay: Math.random() * 0.6,
        ease: 'power1.in',
        onComplete: () => c.remove(),
      });
    }
  }
}
