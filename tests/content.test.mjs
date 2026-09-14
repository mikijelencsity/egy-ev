import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { START_DATE, chapters, letter } from '../js/content.js';

const files = readdirSync(new URL('../images/web/', import.meta.url));
const refs = chapters
  .flatMap(c => [
    ...c.photos.map(p => p.src),
    ...(c.interaction?.secret ? [c.interaction.secret.src] : []),
  ])
  .map(s => s.replace('images/web/', ''));

test('9 fejezet', () => assert.equal(chapters.length, 9));

test('minden kép pontosan egyszer szerepel', () => {
  assert.deepEqual([...refs].sort(), [...files].sort());
});

test('interakció-típusok', () => {
  const ok = new Set([null, 'spread', 'hold', 'fog', 'scatter', 'scratch']);
  for (const c of chapters) assert.ok(ok.has(c.interaction?.type ?? null), c.id);
});

test('egyedi fejezet-azonosítók', () => {
  assert.equal(new Set(chapters.map(c => c.id)).size, chapters.length);
});

test('kezdődátum 2025-09-14 00:00', () => {
  assert.equal(START_DATE.getFullYear(), 2025);
  assert.equal(START_DATE.getMonth(), 8);
  assert.equal(START_DATE.getDate(), 14);
  assert.equal(START_DATE.getHours(), 0);
});

test('levél szerkezete', () => {
  assert.ok(Array.isArray(letter.paragraphs) && letter.paragraphs.length > 0);
  assert.ok(letter.signature);
});

test('nincs em-dash a szövegekben', () => {
  const text = JSON.stringify({ chapters, letter });
  assert.ok(!text.includes('—'), 'em-dash található');
});
