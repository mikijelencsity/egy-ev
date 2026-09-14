# Évforduló-napló — tervdokumentum

Dátum: 2026-09-14 · Állapot: jóváhagyva (brainstorming)

## Cél

Egy év közös emlékeiről szóló, telefonra készült oldal (Jázmin & Miki, 2025-09-14 óta együtt). Jázmin egyedül nyitja meg a telefonján, QR-kódról; Miki mellette ül. Legyen látványos és emlékezetes, ne csak kattintgatós: görgetésre mozgó „film”, közben olyan pontokkal, ahol ő maga csinál valamit.

A jelenlegi `index.html` (kinyitható kártyás idővonal) teljesen lecserélődik. Az eredeti a `Downloads\evfordulo-oldal.zip`-ben megmarad.

## Döntések

| Téma | Döntés |
|---|---|
| Koncepció | Görgetős film (gerinc) + interaktív megállók |
| Stílus | Analóg napló: krémszínű papír, polaroidok, ragasztószalag, kézírás (Caveat), enyhe filmszemcse, rozsdavörös kiemelőszín (`#b5452b`) |
| Zene | Nincs. Csak generált hanghatások (lapozás, papírsuhogás, kaparás, koppanás), némítógombbal |
| Szövegek | A fejezetfeliratokat Claude írja piszkozatnak (csak a fotón látható dolgokra építve, kitalált tény nélkül). A záró levelet Miki írja, addig jól látható helykitöltő |
| Közzététel | GitHub Pages (HTTPS), QR-kóddal. Nyilvános vs. privát repó kérdése a feltöltés előtt a userrel tisztázandó |
| Eszköz | Álló telefon, elsődleges nézet 390×844. Asztali gépen középre igazított, telefonszélességű oszlop |

## Élményfolyam

### 0. Borító
Bőrkötéses napló, rajta „1 év” és „Jázmin & Miki” kézírással. Jázmin felfelé húzással vagy koppintással kinyitja: 3D lapfordulás, papírhang. Ez az első felhasználói gesztus, ezért itt indul el a hangmotor. A borító kinyitásáig az oldal nem görgethető.

### 1. Számláló
Kézírással kiíródik: „Ma pontosan … napja vagyunk együtt”, a szám felpörög a valós értékig. Kezdő időpont: 2025-09-14 00:00 helyi idő. (Az alatta lévő óra user kérésére kikerült, 2026-09-14.)

### 2. Fejezetek
Minden fejezet egy „napló-oldalpár”: kézzel kirajzolódó fejezetcím (SVG vonal + Caveat felirat), a polaroidok görgetésre beesnek és „ráragadnak” (ragasztószalag, enyhe elforgatás), a képek lassan ráközelítenek. Minden képhez egy rövid, kézírásos felirat tartozik.

| # | Fejezet | Képek (`images/web/`) | Interakció |
|---|---|---|---|
| 1 | Kezdet | `IMG_0125` (tükrös szelfi otthon), `IMG_2739` (előszobai tükör) | **Széthúzás:** a két kép egymáson fekszik, oldalra húzással szétválnak |
| 2 | Mr. Cica | `IMG_2831` (cica a kocsiban), `3C30B8D2-…` (cica a karban), `IMG_6461` (közeli cicás kép) | **Lenyomva tartás** a cicás polaroidon → mancsnyomok sétálnak át a lapon, és előbukkan a titkos mém (`354993DE-…`) |
| 3 | Randik | `IMG_4422` (étterem), `att` (esti tér), `IMG_5685` (sapkás vacsora) | Görgetésre egymás fölé csúszó képek (nincs külön feladat) |
| 4 | Halloween | `IMG_3631` (Joker & Harley) | nincs (a kvízzár user kérésére kikerült, 2026-09-14) |
| 5 | Gyulán | `IMG_4079` (medence), `IMG_4043` (tükrös plafon) | **Pára-letörlés:** a képek bepárásodtak, ujjal letörölhetők |
| 6 | Tükrös képeink | `IMG_3279` (bolt), `IMG_4773` (fürdőszoba) | **Kupac-szétdobás:** a polaroidok kupacban vannak, pöccintésre szétrepülnek |
| 7 | Meglepetés | `IMG_4133` (lufi, ajándékok) | **Kaparós kép** |
| 8 | Nyár | `IMG_7680` (tengerparti csók), `IMG_1320` (esti étterem), `IMG_6239` (cowboykalap), `IMG_7735` (óriáskerék) | A papír háttere görgetésre naplemente-színűre vált. Az utolsó kép **kaparós** |
| 9 | Csak te és én | `IMG_2434` (kupak) | Görgetésre ráközelítés a „CSAK TE ÉS ÉN” feliratra |

Mind a 20 kép szerepel. Egyik interakció sem akasztja meg a görgetést: ha kihagyja, az oldal továbbmegy, a feladat félkész állapotban marad.
### 3. Finálé
1. A záró levél kézírással „íródik ki” a lapra (soronként megjelenő Caveat szöveg), aláírás: Miki.
2. **Rázós zárás** („még egy utolsó dolog”): üres, kézzel rajzolt szív és „kezdjük” gomb (iOS-en ez kéri a mozgásérzékelő-engedélyt). Rázás csak ezen a képernyőn számít, a gomb megnyomása után. 35 rázás tölti meg a szívet (közben „még, még!”, „mindjárt...”, rezgés). Ha nincs mozgásadat 2,5 mp-en belül, vagy nincs engedély: 35 koppintás a szívre.
3. Utána teljes képernyős réteg: a 19 fejezetkép felülről lepotyog és szívvé áll (a felső bemélyedés üresen marad, a csúcson egy kép), közepén „Nagyon szeretlek!” konfettivel, alul „folytatás következik...”. Bármelyik képre koppintva felnagyítódik, újra koppintva visszaáll.

A gyertyafújás user kérésére kikerült (2026-09-14). Amíg a levél nincs megírva (`letter.placeholder: true`), a levél és a fejléce rejtve marad.

### Állandó elemek
- Némítógomb a jobb felső sarokban.
- Vékony, kézzel rajzolt haladásjelző (a napló „gerince”) az oldal szélén.
- A régi rejtett poénok közül a dupla koppintásra megjelenő szív marad. A többi helyére a fejezetek interakciói lépnek.

## Technikai felépítés

Sima statikus oldal, build-lépés nélkül, GitHub Pagesre kész.

```
index.html
css/style.css
js/content.js      — minden szöveg, fejezet, képhozzárendelés, kvíz, levél (egyetlen szerkeszthető forrás)
js/main.js         — betöltés, a fejezetek DOM-jának felépítése a content.js-ből, ScrollTrigger-jelenetek
js/sound.js        — Web Audio hanghatások (zajból/oszcillátorból generálva), némítás
js/cover.js        — borító kinyitása
js/counter.js      — napszámláló
js/interactions/   — spread.js, hold.js, fog.js, scatter.js, scratch.js
js/finale.js       — levél (rejtve, amíg helykitöltő)
js/shake.js        — rázós zárás, képekből kirakott szív, „Nagyon szeretlek!”
js/fx.js           — papírkonfetti
js/lib/heart.js    — szív-pontok ívhossz szerint (tesztelt)
js/lib/shake.js    — rázás-érzékelő (tesztelt)
images/web/        — a meglévő 20 kép
```

- **Könyvtárak:** GSAP 3.12.5 + ScrollTrigger a cdnjs-ről, rögzített verzióval. Google Fonts: Caveat, Inter.
- **Modulok:** natív ES modulok (`<script type="module">`), mindegyik egy dolgot csinál, a `main.js` köti össze.
- **Kaparás és pára:** canvas `destination-out` rajzolással, pointer eventekkel, `touch-action: none` csak magán a vásznon, hogy máshol a görgetés ne akadjon.
- **Betöltés:** valódi töltőképernyő, ami a borító és az első két fejezet képeit várja ki. A többi kép `loading="lazy"`.
- **Mozgáscsökkentés:** `prefers-reduced-motion` esetén nincs ráközelítés és repülés, csak áttűnés. Az interakciók működnek.
- **Adatvédelem:** `<meta name="robots" content="noindex, nofollow">`.
- **Magasság:** `100svh`, hogy az iOS címsora ne ugráltassa a jeleneteket.

## Ellenőrzés

- Helyben: `http-server` a 5500-as porton, Chrome-ban 390×844-es nézetben. Minden fejezetről képernyőkép, minden interakció végigpróbálva (egér-pointerrel), és a konzol hibamentes.
- Feltöltés után: végigmenni a user telefonján (valódi érintés, iOS/Android címsor).

## Nyitott pontok (nem blokkolják az építést)

- A záró levél szövege (Miki küldi).
- GitHub Pages: nyilvános repó (ingyenes, a képek a GitHubon bárki számára láthatók) vs. privát repó (GitHub Pro kell). Döntés a feltöltés előtt.
- QR-kód generálása a végleges Pages-URL-re, nyomtatható PNG-ként.
