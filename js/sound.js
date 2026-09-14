// Hanghatások fájl nélkül, Web Audio-val generálva.
let ctx = null;
let noiseBuf = null;
let muted = false;

function ready() {
  if (muted) return false;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return true;
}

// Szűrt zajfoszlány (papír, kaparás).
function noise({ dur, freq, q = 1, peak = 0.2, type = 'bandpass', sweepTo }) {
  if (!ready()) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + dur * 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t, Math.random() * 0.5, dur + 0.05);
}

function tone(freq, dur, { type = 'sine', peak = 0.12, delay = 0 } = {}) {
  if (!ready()) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

let lastScratch = 0;

export const sound = {
  unlock() { ready(); },
  page() { noise({ dur: 0.55, freq: 1800, sweepTo: 500, q: 0.7, peak: 0.35 }); },
  paper() { noise({ dur: 0.22, freq: 3200, q: 0.9, peak: 0.12 }); },
  scratch() {
    const now = performance.now();
    if (now - lastScratch < 70) return;
    lastScratch = now;
    noise({ dur: 0.09, freq: 5000 + Math.random() * 2000, q: 2, peak: 0.07, type: 'highpass' });
  },
  pop() { tone(620, 0.12, { type: 'triangle', peak: 0.14 }); tone(930, 0.1, { type: 'triangle', peak: 0.08, delay: 0.06 }); },
  chime() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.7, { type: 'triangle', peak: 0.09, delay: i * 0.09 })); },
  whoosh() { noise({ dur: 0.5, freq: 400, sweepTo: 2500, q: 0.6, peak: 0.1 }); },
  setMuted(v) { muted = v; if (v && ctx) ctx.suspend(); if (!v && ctx) ctx.resume(); },
  get muted() { return muted; },
};
