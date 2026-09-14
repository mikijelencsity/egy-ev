// ============================================================
//  Az oldal teljes tartalma. Szöveget, képet, sorrendet itt írj át.
//  (Hosszú gondolatjelet ne használj, a teszt jelez rá.)
// ============================================================

export const START_DATE = new Date(2025, 8, 14, 0, 0, 0); // 2025. szeptember 14.

export const NAMES = 'Jázmin & Miki';

const img = name => `images/web/${name}`;

export const chapters = [
  {
    id: 'kezdet',
    title: 'Kezdet',
    subtitle: '2025. szeptember 14.',
    photos: [
      { src: img('IMG_0125.jpg'), caption: 'mi ketten, a tükör előtt', rot: -4 },
      { src: img('IMG_2739.jpg'), caption: 'még egy gyors kép az előszobában', rot: 5 },
    ],
    interaction: { type: 'spread', hint: 'húzd szét a képeket' },
  },
  {
    id: 'mr-cica',
    title: 'Mr. Cica',
    subtitle: 'és akkor jött ő',
    photos: [
      { src: img('IMG_2831.jpg'), caption: 'a legkomolyabb utasunk', rot: -3 },
      { src: img('3C30B8D2-BB94-44AE-9905-C7D29B850743.jpg'), caption: 'puszi a legszőrösebb családtagnak', rot: 4 },
      { src: img('IMG_6461.jpg'), caption: 'ő mindig középen akar lenni', rot: -2 },
    ],
    interaction: {
      type: 'hold',
      target: 0,
      hint: 'tartsd lenyomva a cicát 🐾',
      secret: { src: img('354993DE-2934-499B-A307-53176BEB310B.jpg'), caption: 'a hivatalos portréja', wide: true },
    },
  },
  {
    id: 'randik',
    title: 'Randik',
    subtitle: 'vacsorák, esték, séták',
    photos: [
      { src: img('IMG_4422.jpg'), caption: 'ebéd kettesben', rot: 3 },
      { src: img('att.jpg'), caption: 'esti séta a téren', rot: -4, wide: true },
      { src: img('IMG_5685.jpg'), caption: 'sapkában is a legszebb', rot: 2 },
    ],
    interaction: null,
  },
  {
    id: 'halloween',
    title: 'Halloween',
    subtitle: 'zárolt emlék',
    photos: [
      { src: img('IMG_3631.jpg'), caption: 'Joker és Harley', rot: -2 },
    ],
    interaction: { type: 'quiz' },
  },
  {
    id: 'wellness',
    title: 'Wellness',
    subtitle: 'csak mi ketten',
    photos: [
      { src: img('IMG_4079.jpg'), caption: 'medence, csend, te', rot: -3 },
      { src: img('IMG_4043.jpg'), caption: 'a plafonon is tükör volt 🙈', rot: 4 },
    ],
    interaction: { type: 'fog', hint: 'bepárásodtak, töröld le őket' },
  },
  {
    id: 'tukor',
    title: 'Tükrös képeink',
    subtitle: 'a tükör mindent tud',
    photos: [
      { src: img('IMG_3279.jpg'), caption: 'csók a bolt közepén', rot: -5 },
      { src: img('IMG_4773.jpg'), caption: 'fürdőszobai klasszikus', rot: 6 },
    ],
    interaction: { type: 'scatter', hint: 'pöccintsd szét a kupacot' },
  },
  {
    id: 'meglepetes',
    title: 'Meglepetés',
    subtitle: 'amikor hazaértél',
    photos: [
      { src: img('IMG_4133.jpg'), caption: 'a lufi mindent elmondott', rot: 2 },
    ],
    interaction: { type: 'scratch', photo: 0, hint: 'kapard le' },
  },
  {
    id: 'nyar',
    title: 'Nyár',
    subtitle: 'amit sosem felejtünk el',
    photos: [
      { src: img('IMG_7680.jpg'), caption: 'a tengerparton', rot: -3, wide: true },
      { src: img('IMG_1320.jpg'), caption: 'esti csók vacsora közben', rot: 4 },
      { src: img('IMG_6239.jpg'), caption: 'cowboykalapban is te vagy a legszebb', rot: -4 },
      { src: img('IMG_7735.jpg'), caption: 'fent az óriáskeréken', rot: 3, wide: true },
    ],
    interaction: { type: 'scratch', photo: 3, hint: 'az utolsót kapard le' },
  },
  {
    id: 'csak-te-es-en',
    title: 'Csak te és én',
    subtitle: 'ennyi az egész',
    photos: [
      { src: img('IMG_2434.jpg'), caption: '', rot: 0 },
    ],
    interaction: null,
  },
];

export const quiz = {
  question: 'Minek öltöztünk Halloweenkor?',
  options: ['Batman és Macskanő', 'Joker és Harley Quinn', 'Vámpírok'],
  correct: 1,
  hint: 'zöld haj és piros rúzs...',
};

export const letter = {
  placeholder: true,
  paragraphs: [
    'Ide jön a levél, amit Miki ír.',
    'Ezt a szöveget a js/content.js fájlban kell lecserélni, és a placeholder értékét false-ra állítani.',
  ],
  signature: 'Miki',
};
