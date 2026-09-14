# Évforduló-napló — implementációs terv

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A régi kártyás `index.html` lecserélése egy telefonra szabott, analóg naplós, görgetésre mozgó évforduló-oldalra interaktív megállókkal (spec: `docs/superpowers/specs/2026-09-14-evfordulo-naplo-design.md`).

**Architecture:** Statikus oldal, build nélkül. Az összes tartalom a `js/content.js`-ben van; a `js/main.js` ebből építi fel a fejezetek DOM-ját, beköti a GSAP ScrollTrigger-jeleneteket, és típus szerint felcsatolja az interakciós modulokat. A tiszta logika (időszámítás, tartalom-épség, kvíz, radírozott arány) külön, DOM nélküli modulokban van, `node --test`-tel tesztelve; a látványt és az érintést böngészőben ellenőrizzük.

**Tech Stack:** HTML/CSS, natív ES modulok, GSAP 3.12.5 + ScrollTrigger (cdnjs), Google Fonts (Caveat, Inter), Web Audio API, Canvas 2D, getUserMedia, Node 24 beépített tesztfuttató, `http-server` (5500-as port).

---

## Fájlszerkezet és felelősségek

| Fájl | Felelősség |
|---|---|
| `index.html` | Váz: töltőképernyő, borító, számláló-szekció, `#chapters` konténer, finálé, némítógomb, gerinc-haladásjelző. Betölti a GSAP-ot és a `js/main.js` modult |
| `css/style.css` | Teljes stílus: papír, szemcse, polaroid, szalag, tipográfia, jelenetek, interakciók, finálé, reduced-motion |
| `js/content.js` | `START_DATE`, `chapters[]`, `quiz`, `letter` — az egyetlen szerkeszthető tartalomforrás |
| `js/lib/time.js` | `elapsed(start, now) → {days, hours, minutes, seconds}` |
| `js/lib/quiz.js` | `checkAnswer(quiz, index) → boolean` |
| `js/lib/erase.js` | `erasedRatio(imageData, step) → 0..1` (átlátszó pixelek aránya) |
| `js/sound.js` | `sound.unlock()`, `.page()`, `.paper()`, `.scratch()`, `.pop()`, `.chime()`, `.setMuted(bool)`, `.muted` |
| `js/loader.js` | `preload(srcs, onProgress) → Promise` |
| `js/cover.js` | `mountCover(el, {sound, onOpen})` — görgetés-zár a kinyitásig |
| `js/counter.js` | `mountCounter(el, {start, sound})` |
| `js/chapters.js` | `renderChapters(root, chapters) → HTMLElement[]` (DOM építés), `animateChapters(sections)` (ScrollTrigger) |
| `js/interactions/eraser.js` | `createEraser(canvas, {paint, radius, onProgress, onDone, doneAt})` — közös vászon-radír (kaparás, pára) |
| `js/interactions/scratch.js` | `mount(el, ctx)` |
| `js/interactions/fog.js` | `mount(el, ctx)` |
| `js/interactions/spread.js` | `mount(el, ctx)` — két kép széthúzása |
| `js/interactions/hold.js` | `mount(el, ctx)` — lenyomás → mancsnyomok + titkos kép |
| `js/interactions/quiz.js` | `mount(el, ctx)` — zárolt kép + kérdés |
| `js/interactions/scatter.js` | `mount(el, ctx)` — kupac szétdobása |
| `js/interactions/index.js` | `registry = {scratch, fog, spread, hold, quiz, scatter}` |
| `js/finale.js` | `mountFinale(el, {letter, sound})` — levél, gyertya (mikrofon + koppintás), papírkonfetti |
| `js/main.js` | Összekötés, dupla koppintásos szív, gerinc-haladásjelző |
| `tests/*.test.mjs` | Node-tesztek a tiszta logikára és a tartalom épségére |

Interakció-modul szerződés: `mount(el, ctx)`, ahol `el` a fejezet interakciós konténere (`[data-interaction]`), `ctx = { sound, chapter }`. A modul csak az `el`-en belül dolgozik, nem blokkolja a görgetést (a `touch-action: none` csak a saját vásznán / húzható elemén van).

---

### Task 1: Tiszta logika tesztekkel

**Files:** Create `js/lib/time.js`, `js/lib/quiz.js`, `js/lib/erase.js`, `tests/logic.test.mjs`, `package.json` (`{"type":"module","scripts":{"test":"node --test tests/"}}`)

- [x] Step 1: teszt írása:

```js
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
  const d = new Uint8ClampedArray(4 * 4); // 4 pixel
  d[3] = 255; d[7] = 255; d[11] = 0; d[15] = 0;
  assert.equal(erasedRatio({ data: d }, 1), 0.5);
});
```

- [x] Step 2: `npm test` → FAIL (a modulok nem léteznek)
- [x] Step 3: implementáció (`elapsed` a különbség ms-ból, negatívnál 0; `checkAnswer` = `index === quiz.correct`; `erasedRatio` minden `step`-edik pixel alfáját nézi, `alpha < 128` = radírozott)
- [x] Step 4: `npm test` → PASS
- [x] Step 5: commit

### Task 2: Tartalom + épség-teszt

**Files:** Create `js/content.js`, `tests/content.test.mjs`

- [x] Step 1: teszt: minden `images/web/*` fájlra pontosan egy hivatkozás van a `chapters` képeiben (a `hold` interakció `secret` képe is számít); minden hivatkozott fájl létezik; 9 fejezet; az interakció-típusok a `{null, spread, hold, quiz, fog, scatter, scratch}` halmazból; a kvíz `correct` indexe érvényes; `START_DATE` = 2025-09-14 00:00 helyi idő.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { START_DATE, chapters, quiz, letter } from '../js/content.js';

const files = readdirSync(new URL('../images/web/', import.meta.url));
const refs = chapters.flatMap(c => [
  ...c.photos.map(p => p.src),
  ...(c.interaction?.secret ? [c.interaction.secret] : []),
]).map(s => s.replace('images/web/', ''));

test('9 fejezet', () => assert.equal(chapters.length, 9));
test('minden kép pontosan egyszer szerepel', () => {
  assert.deepEqual([...refs].sort(), [...files].sort());
});
test('interakció-típusok', () => {
  const ok = new Set([null, 'spread', 'hold', 'quiz', 'fog', 'scatter', 'scratch']);
  for (const c of chapters) assert.ok(ok.has(c.interaction?.type ?? null), c.id);
});
test('kvíz érvényes', () => {
  assert.ok(quiz.correct >= 0 && quiz.correct < quiz.options.length);
});
test('kezdődátum', () => {
  assert.equal(START_DATE.getFullYear(), 2025);
  assert.equal(START_DATE.getMonth(), 8);
  assert.equal(START_DATE.getDate(), 14);
});
test('levél', () => assert.ok(Array.isArray(letter.paragraphs) && letter.signature));
```

- [x] Step 2: `npm test` → FAIL
- [x] Step 3: `content.js` a spec fejezettáblázata szerint, feliratok em-dash nélkül, csak a fotón látható dolgokra építve; levél: helykitöltő `placeholder: true`
- [x] Step 4: `npm test` → PASS
- [x] Step 5: commit

### Task 3: Váz, stílus, töltőképernyő, hang

**Files:** Replace `index.html`; Create `css/style.css`, `js/loader.js`, `js/sound.js`, `js/main.js` (kezdeti)

- [x] Step 1: `index.html` váz (`lang="hu"`, `noindex`, viewport `viewport-fit=cover`, GSAP 3.12.5 `gsap.min.js` + `ScrollTrigger.min.js` a cdnjs-ről, `<script type="module" src="js/main.js">`)
- [x] Step 2: `style.css` alap: papír-tokenek (`--paper #efe6d6`, `--ink #3b2f26`, `--accent #b5452b`, `--tape rgba(230,210,160,.75)`), SVG-zaj szemcse fixed rétegen, `max-width: 480px` középre, `100svh` jelenetek, polaroid és szalag komponens, `prefers-reduced-motion`
- [x] Step 3: `loader.js` + `sound.js` (zajpuffer-alapú papírsuhogás/kaparás, oszcillátoros koppanás/csengés; `unlock()` első gesztusnál)
- [x] Step 4: ellenőrzés: `http://localhost:5500` betölt, a töltőképernyő 100%-ra fut és eltűnik, a konzol hibamentes
- [x] Step 5: commit

### Task 4: Borító + számláló

**Files:** Create `js/cover.js`, `js/counter.js`; Modify `js/main.js`, `css/style.css`

- [x] Step 1: borító: bőrkötés-textúra CSS-ből, „1 év” + nevek Caveat-tel, „húzd fel / koppints” jelzés; koppintás vagy >60 px felhúzás → `rotateY(-160deg)` lapfordulás (perspective), `sound.unlock(); sound.page()`, `html.locked` levétele, `onOpen()`
- [x] Step 2: számláló: ScrollTrigger belépéskor 0-ról felpörgő napszám (1,6 s easeOut), utána másodpercenként frissülő `óó : pp : mm` sor `elapsed()`-del
- [x] Step 3: ellenőrzés böngészőben (390×844): nyitás előtt nem görget, nyitás után igen; a számláló 365-öt mutat; képernyőkép
- [x] Step 4: commit

### Task 5: Fejezetek renderelése + görgetős animáció

**Files:** Create `js/chapters.js`; Modify `js/main.js`, `css/style.css`

- [x] Step 1: `renderChapters`: fejezetenként `<section class="chapter" id>` fejezetszám, kézírásos cím + SVG aláhúzás (`stroke-dashoffset` kirajzolás), alcím, polaroidok (`rot` elforgatással, szalaggal, felirattal), `[data-interaction]` konténer az interakciónak
- [x] Step 2: `animateChapters`: cím-kirajzolás, polaroidok „beesése” (y, rotate, scale, `scrub`), lassú ráközelítés a képen; a Nyár fejezetnél a `body` háttérszíne naplemente-árnyalatra vált (ScrollTrigger `onUpdate`); a „Csak te és én” fejezet pin + scale ráközelítés
- [x] Step 3: gerinc-haladásjelző (`scaleY` a teljes görgetésre) + dupla koppintásos szív
- [x] Step 4: ellenőrzés: mind a 9 fejezet megjelenik, a képek a helyükön, képernyőkép fejezetenként, konzol tiszta
- [x] Step 5: commit

### Task 6: Radír-alapú interakciók (kaparás, pára)

**Files:** Create `js/interactions/eraser.js`, `scratch.js`, `fog.js`, `index.js`; Modify `js/main.js`, `css/style.css`

- [x] Step 1: `createEraser`: DPR-helyes vászon, `paint(ctx,w,h)` az induló réteg, pointer eventek, `destination-out` vonalhúzás az előző pontból, 250 ms-onként `erasedRatio`, `doneAt` (kaparás 0,55, pára 0,45) átlépésekor a maradék elhalványul és `onDone()`
- [x] Step 2: `scratch`: arany-bézs „kaparós sorsjegy” réteg „kapard le” felirattal, `sound.scratch()` húzás közben (throttle)
- [x] Step 3: `fog`: fehéres, elmosott párás réteg csepp-mintával, „töröld le” felirat
- [x] Step 4: ellenőrzés: egérrel lekaparva a kép előtűnik, a vásznon kívül a görgetés működik
- [x] Step 5: commit

### Task 7: Mozgás-alapú interakciók (széthúzás, lenyomás, kvíz, szétdobás)

**Files:** Create `js/interactions/spread.js`, `hold.js`, `quiz.js`, `scatter.js`; Modify `index.js`, `css/style.css`

- [x] Step 1: `spread`: a két polaroid egymáson; vízszintes húzásra (`touch-action: pan-y`) szétcsúsznak a húzás arányában, 80 px felett a helyükre pattannak
- [x] Step 2: `hold`: 600 ms lenyomás a cicás képen (körkörös töltődés-jelző) → 6 mancsnyom sétál át, `sound.pop()`, előbukkan a titkos polaroid a felirattal
- [x] Step 3: `quiz`: homályos kép (`filter: blur(14px)`) + lakat; 3 gomb; rossz → rázás + tipp, jó → lakat lepattan, blur 0, `sound.chime()`
- [x] Step 4: `scatter`: kupac; koppintásra/húzásra a polaroidok előre számolt helyekre repülnek (GSAP), újra koppintva visszarendeződnek
- [x] Step 5: ellenőrzés böngészőben mind a négyre, képernyőképpel
- [x] Step 6: commit

### Task 8: Finálé

**Files:** Create `js/finale.js`; Modify `js/main.js`, `css/style.css`

- [x] Step 1: levél: bekezdésenként és soronként beúszó Caveat szöveg görgetésre; ha `letter.placeholder`, szaggatott keretes, jól látható helykitöltő
- [x] Step 2: gyertya: CSS-gyertya animált lánggal; „Fújd el a gyertyát” gomb → `getUserMedia({audio:true})`, `AnalyserNode` RMS > 0,18 legalább 250 ms-ig → kialszik (füst-animáció); hiba/elutasítás esetén azonnal, egyébként 4 s után „vagy koppints rá” és a lángra koppintás is elfújja; a mikrofonfolyam leállítása
- [x] Step 3: kialváskor papírfecni-konfetti (DOM, 60 db, GSAP) és „folytatás következik…” utolsó lap
- [x] Step 4: ellenőrzés: koppintásos ág böngészőben; mikrofonos ág a telefonos teszten
- [x] Step 5: commit

### Task 9: Teljes végigjátszás és takarítás

- [x] Step 1: `npm test` → PASS
- [x] Step 2: 390×844 nézetben végiggörgetés elejétől a végéig, minden interakció kipróbálva, képernyőképek, `read_console_messages` hibamentes
- [x] Step 3: reduced-motion és asztali szélesség gyors ellenőrzése
- [x] Step 4: régi, már nem használt kód/fájl nem maradhat; commit
