// Szív alakú görbe n pontja, ívhossz szerint egyenletesen elosztva.
// Koordináták: x ∈ [-1, 1], y lefelé nő (kb. -0.75 és 1.06 között).
// A felső bemélyedés körül rés marad (ott a képek egymásra csúsznának),
// páratlan n esetén a középső pont pontosan az alsó csúcsra esik.
export function heartPoints(n, samples = 600) {
  const raw = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    raw.push([x / 16, y / 16]);
  }

  const acc = [0];
  for (let i = 1; i < raw.length; i++) {
    acc.push(acc[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]));
  }
  const total = acc[acc.length - 1];

  if (n === 1) return [[0, 1.0625]];
  const notchGap = 0.7 * (total / n);
  const step = (total - 2 * notchGap) / (n - 1);

  const pts = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const target = notchGap + k * step;
    while (j < acc.length - 2 && acc[j + 1] < target) j++;
    const span = acc[j + 1] - acc[j] || 1;
    const f = Math.min(1, Math.max(0, (target - acc[j]) / span));
    pts.push([
      raw[j][0] + (raw[j + 1][0] - raw[j][0]) * f,
      raw[j][1] + (raw[j + 1][1] - raw[j][1]) * f,
    ]);
  }
  return pts;
}
