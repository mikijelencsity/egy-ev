const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Levél: amíg helykitöltő, rejtve marad.
export function mountFinale(el, { letter, reduce }) {
  const { gsap } = window;
  const letterEl = el.querySelector('#letter');

  if (letter.placeholder) {
    letterEl.hidden = true;
    el.querySelector('#letter-head').hidden = true;
    return;
  }

  letterEl.innerHTML = letter.paragraphs.map(p => `<p class="hand">${esc(p)}</p>`).join('')
    + `<p class="signature hand">${esc(letter.signature)}</p>`;
  letterEl.querySelectorAll('p').forEach(p => {
    gsap.fromTo(p, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', duration: reduce ? 0.01 : 1.8, ease: 'power1.inOut',
      scrollTrigger: { trigger: p, start: 'top 88%', once: true },
    });
  });
}
