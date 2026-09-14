// Papírfecni-konfetti a teljes képernyőn.
export function confetti(count = 70) {
  const { gsap } = window;
  const layer = document.getElementById('fx-layer');
  const colors = ['#b5452b', '#efe6d6', '#e7c98f', '#fffdf8', '#7a6655', '#d98b6a'];
  for (let i = 0; i < count; i++) {
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
