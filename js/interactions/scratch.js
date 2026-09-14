import { attachEraser } from './eraser.js';

// Kaparós sorsjegy-réteg a megadott képen.
export function mount(el, { sound, chapter }) {
  const fig = el.querySelectorAll('.polaroid')[chapter.interaction.photo ?? 0];
  if (!fig) return;
  attachEraser(fig, {
    radius: 24,
    doneAt: 0.55,
    paint(ctx, w, h) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#c49b5f');
      g.addColorStop(0.5, '#ecd29a');
      g.addColorStop(1, '#b68b50');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 320; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.6, 1.6);
      }
      ctx.fillStyle = '#5b3f22';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 38px Caveat, cursive';
      ctx.fillText('kapard le', w / 2, h / 2 - 10);
      ctx.font = '600 22px Caveat, cursive';
      ctx.fillText('✦ ujjal ✦', w / 2, h / 2 + 24);
    },
    onStroke: () => sound.scratch(),
    onDone: () => sound.chime(),
  });
}
