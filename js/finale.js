const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Levél (ha már meg van írva) és a záró lap papírkonfettivel.
export function mountFinale(el, { letter, sound, reduce }) {
  const { gsap } = window;

  const letterEl = el.querySelector('#letter');
  if (letter.placeholder) {
    letterEl.hidden = true;
    el.querySelector('#letter-head').hidden = true;
  } else {
    letterEl.innerHTML = letter.paragraphs.map(p => `<p class="hand">${esc(p)}</p>`).join('')
      + `<p class="signature hand">${esc(letter.signature)}</p>`;
    letterEl.querySelectorAll('p').forEach(p => {
      gsap.fromTo(p, { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: reduce ? 0.01 : 1.8, ease: 'power1.inOut',
        scrollTrigger: { trigger: p, start: 'top 88%', once: true },
      });
    });
  }

  const end = el.querySelector('#the-end');
  gsap.from(end.children, {
    opacity: 0, y: 30, duration: 1.2, stagger: 0.3, ease: 'power2.out',
    scrollTrigger: {
      trigger: end, start: 'top 70%', once: true,
      onEnter: () => {
        sound.chime();
        if (!reduce) confetti();
      },
    },
  });

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
