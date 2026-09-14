import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heartPoints } from '../js/lib/heart.js';
import { createShakeDetector } from '../js/lib/shake.js';

test('heartPoints: kért darabszám, korlátok között', () => {
  const pts = heartPoints(19);
  assert.equal(pts.length, 19);
  for (const [x, y] of pts) {
    assert.ok(Math.abs(x) <= 1.0001, `x=${x}`);
    assert.ok(y >= -0.8 && y <= 1.1, `y=${y}`);
  }
});

test('heartPoints: szimmetrikus és egyenletes', () => {
  const pts = heartPoints(19);
  const sumX = pts.reduce((s, [x]) => s + x, 0);
  assert.ok(Math.abs(sumX) < 0.01, `sumX=${sumX}`);
  const gaps = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  assert.ok(Math.max(...gaps) / Math.min(...gaps) < 1.5, 'egyenetlen eloszlás');
});

test('heartPoints: a felső bemélyedés üres, a csúcson egy kép van', () => {
  const pts = heartPoints(19);
  const notch = [0, -0.3125];
  const tip = [0, 1.0625];
  const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  assert.ok(pts.every(p => near(p, notch) > 0.15), 'kép ül a bemélyedésben');
  assert.equal(pts.filter(p => near(p, tip) < 0.03).length, 1);
});

test('shake: nyugalomban nincs jelzés', () => {
  const feed = createShakeDetector({ threshold: 13, minGap: 110 });
  for (let t = 0; t < 2000; t += 16) assert.equal(feed(0.3, -0.2, 0.5, t, false), false);
});

test('shake: erős gyorsulás jelez, túl sűrűn nem', () => {
  const feed = createShakeDetector({ threshold: 13, minGap: 110 });
  assert.equal(feed(18, 2, 1, 0, false), true);
  assert.equal(feed(-18, 2, 1, 50, false), false);
  assert.equal(feed(-18, 2, 1, 130, false), true);
});

test('shake: gravitációval együtt mért értéknél levonja a gravitációt', () => {
  const feed = createShakeDetector({ threshold: 13, minGap: 110 });
  assert.equal(feed(0, 9.81, 0, 0, true), false);
  assert.equal(feed(0, 26, 0, 200, true), true);
});

test('shake: hiányzó adatra nem jelez', () => {
  const feed = createShakeDetector();
  assert.equal(feed(null, null, null, 0, false), false);
});
