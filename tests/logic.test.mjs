import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elapsed } from '../js/lib/time.js';
import { checkAnswer } from '../js/lib/quiz.js';
import { erasedRatio } from '../js/lib/erase.js';

test('elapsed: pontosan egy év = 365 nap', () => {
  const s = new Date(2025, 8, 14, 0, 0, 0);
  const n = new Date(2026, 8, 14, 0, 0, 0);
  assert.deepEqual(elapsed(s, n), { days: 365, hours: 0, minutes: 0, seconds: 0 });
});

test('elapsed: órák, percek, másodpercek', () => {
  const s = new Date(2025, 8, 14, 0, 0, 0);
  const n = new Date(2025, 8, 15, 13, 5, 9);
  assert.deepEqual(elapsed(s, n), { days: 1, hours: 13, minutes: 5, seconds: 9 });
});

test('elapsed: jövőbeli kezdetnél nulla', () => {
  const s = new Date(2030, 0, 1);
  assert.deepEqual(elapsed(s, new Date(2026, 0, 1)), { days: 0, hours: 0, minutes: 0, seconds: 0 });
});

test('checkAnswer', () => {
  const q = { options: ['a', 'b', 'c'], correct: 1 };
  assert.equal(checkAnswer(q, 1), true);
  assert.equal(checkAnswer(q, 0), false);
  assert.equal(checkAnswer(q, 9), false);
});

test('erasedRatio: alfa-csatorna alapján', () => {
  const d = new Uint8ClampedArray(4 * 4);
  d[3] = 255; d[7] = 255; d[11] = 0; d[15] = 0;
  assert.equal(erasedRatio({ data: d }, 1), 0.5);
});
