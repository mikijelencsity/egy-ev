import { attachEraser } from './eraser.js';

// Bepárásodott képek, ujjal letörölhetők.
export function mount(el, { sound }) {
  let lastSound = 0;
  el.querySelectorAll('.polaroid').forEach(fig => attachEraser(fig, {
    radius: 30,
    doneAt: 0.45,
    paint(ctx, w, h) {
      ctx.fillStyle = 'rgba(228,233,233,0.94)';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 14; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 40 + Math.random() * 90;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,.55)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 1 + Math.random() * 3.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160,178,184,.5)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(80,96,102,.75)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 32px Caveat, cursive';
      ctx.fillText('töröld le', w / 2, h / 2);
    },
    onStroke() {
      const now = performance.now();
      if (now - lastSound > 260) {
        lastSound = now;
        sound.paper();
      }
    },
    onDone: () => sound.pop(),
  }));
}
