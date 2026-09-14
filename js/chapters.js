const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function polaroid(p, index) {
  return `<figure class="polaroid${p.wide ? ' wide' : ''}" data-i="${index}" style="--rot:${p.rot ?? 0}deg">
    <span class="tape" aria-hidden="true"></span>
    <div class="ph"><img src="${p.src}" alt="${esc(p.caption || '')}" loading="lazy" decoding="async" draggable="false"></div>
    ${p.caption ? `<figcaption class="hand">${esc(p.caption)}</figcaption>` : ''}
  </figure>`;
}

// A fejezetek DOM-ja a content.js alapján.
export function renderChapters(root, chapters) {
  return chapters.map((ch, i) => {
    const s = document.createElement('section');
    s.className = `chapter chapter--${ch.id}`;
    s.id = `ch-${ch.id}`;
    s.innerHTML = `
      <header class="ch-head">
        <span class="ch-num">${i + 1}. fejezet</span>
        <h2 class="ch-title hand">${esc(ch.title)}</h2>
        <svg class="ch-underline" viewBox="0 0 300 24" aria-hidden="true"><path d="M6 14 C 60 4, 120 22, 180 11 S 272 6, 294 14"/></svg>
        ${ch.subtitle ? `<p class="ch-sub hand">${esc(ch.subtitle)}</p>` : ''}
      </header>
      <div class="ch-body" data-interaction="${ch.interaction?.type ?? ''}">
        ${ch.photos.map(polaroid).join('')}
      </div>
      ${ch.interaction?.hint ? `<p class="ch-hint hand">${esc(ch.interaction.hint)}</p>` : ''}`;
    root.appendChild(s);
    return s;
  });
}

const MANAGED = new Set(['spread', 'scatter']);

// Görgetésre induló jelenetek.
export function animateChapters(sections, chapters, { sound, reduce }) {
  const { gsap, ScrollTrigger } = window;

  sections.forEach((s, i) => {
    const ch = chapters[i];
    const head = s.querySelector('.ch-head');
    const body = s.querySelector('.ch-body');
    const hint = s.querySelector('.ch-hint');

    if (reduce) {
      gsap.from([head, body, hint].filter(Boolean), {
        opacity: 0, duration: 0.8, stagger: 0.15,
        scrollTrigger: { trigger: s, start: 'top 80%', once: true },
      });
      return;
    }

    const path = head.querySelector('.ch-underline path');
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const headTl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 82%', once: true } })
      .from(head.querySelector('.ch-num'), { opacity: 0, y: 10, duration: 0.4 })
      .from(head.querySelector('.ch-title'), { opacity: 0, y: 28, rotation: -4, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.15')
      .to(path, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.35');
    const sub = head.querySelector('.ch-sub');
    if (sub) headTl.from(sub, { opacity: 0, duration: 0.5 }, '-=0.3');

    if (MANAGED.has(body.dataset.interaction)) {
      gsap.from(body, {
        opacity: 0, y: 70, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: body, start: 'top 90%', once: true, onEnter: () => sound.paper() },
      });
    } else if (ch.id !== 'csak-te-es-en') {
      body.querySelectorAll('.polaroid').forEach((fig, j) => {
        const rot = parseFloat(fig.style.getPropertyValue('--rot')) || 0;
        gsap.from(fig, {
          y: 90, rotation: rot + (j % 2 ? 16 : -16), scale: 0.86, opacity: 0, duration: 1, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: fig, start: 'top 90%', once: true, onEnter: () => sound.paper() },
        });
        gsap.fromTo(fig.querySelector('img'), { scale: 1.22 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    }

    if (hint) {
      gsap.from(hint, { opacity: 0, y: 12, duration: 0.6, scrollTrigger: { trigger: hint, start: 'top 94%', once: true } });
    }
  });

  // Nyár: naplemente-színű papír.
  const nyar = document.getElementById('ch-nyar');
  if (nyar) {
    ScrollTrigger.create({
      trigger: nyar, start: 'top 55%', end: 'bottom 45%',
      toggleClass: { targets: document.body, className: 'sunset' },
    });
  }

  // Csak te és én: kitűzve ráközelít a kupak feliratára.
  const last = document.getElementById('ch-csak-te-es-en');
  if (last && !reduce) {
    const fig = last.querySelector('.polaroid');
    gsap.timeline({ scrollTrigger: { trigger: last, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } })
      .fromTo(fig, { scale: 0.75, rotation: -8 }, { scale: 1, rotation: 0, duration: 1 })
      .to(fig.querySelector('img'), { scale: 2.3, transformOrigin: '62% 42%', duration: 1.4 }, '>-0.2');
  }
}
