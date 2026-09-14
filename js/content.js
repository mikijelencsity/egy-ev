// ============================================================
//  Az oldal teljes tartalma. Szöveget, képet, sorrendet itt írj át.
//  (Hosszú gondolatjelet ne használj, a teszt jelez rá.)
//  Az alcím és a képaláírás elhagyható (üres szöveg).
// ============================================================

export const START_DATE = new Date(2025, 8, 14, 0, 0, 0); // 2025. szeptember 14.

const img = name => `images/web/${name}`;

export const chapters = [
  {
    id: 'kezdet',
    title: 'Kezdet',
    subtitle: '2025. szeptember 14.',
    photos: [
      { src: img('IMG_0125.jpg'), caption: 'mi ketten', rot: -4 },
      { src: img('IMG_2739.jpg'), caption: 'az előszobában', rot: 5 },
    ],
    interaction: { type: 'spread', hint: 'húzd szét a képeket' },
  },
  {
    id: 'mr-cica',
    title: 'Mr. Cica',
    subtitle: 'a harmadik tag',
    photos: [
      { src: img('IMG_2831.jpg'), caption: 'a kocsiban', rot: -3 },
      { src: img('3C30B8D2-BB94-44AE-9905-C7D29B850743.jpg'), caption: 'ölben', rot: 4 },
      { src: img('IMG_6461.jpg'), caption: 'közelről', rot: -2 },
    ],
    interaction: {
      type: 'hold',
      target: 0,
      hint: 'tartsd lenyomva a cicás képet',
      secret: { src: img('354993DE-2934-499B-A307-53176BEB310B.jpg'), caption: 'titkos kép', wide: true },
    },
  },
  {
    id: 'randik',
    title: 'Randik',
    subtitle: 'vacsorák és esték',
    photos: [
      { src: img('IMG_4422.jpg'), caption: 'volt hogy nem ízlett..', rot: 3 },
      { src: img('att.jpg'), caption: '', rot: -4, wide: true },
      { src: img('IMG_5685.jpg'), caption: 'harleys sapkában', rot: 2 },
    ],
    interaction: null,
  },
  {
    id: 'halloween',
    title: 'Halloween',
    subtitle: '',
    photos: [
      { src: img('IMG_3631.jpg'), caption: 'Joker és Harley', rot: -2 },
    ],
    interaction: null,
  },
  {
    id: 'gyula',
    title: 'Gyulán',
    subtitle: 'kikapcsolódás',
    photos: [
      { src: img('IMG_4079.jpg'), caption: 'a medence', rot: -3 },
      { src: img('IMG_4043.jpg'), caption: 'a szoba', rot: 4 },
    ],
    interaction: { type: 'fog', hint: 'töröld le a párát' },
  },
  {
    id: 'tukor',
    title: 'Tükrös képek',
    subtitle: 'a szokásos',
    photos: [
      { src: img('IMG_3279.jpg'), caption: 'a boltban', rot: -5 },
      { src: img('IMG_4773.jpg'), caption: 'a fürdőben', rot: 6 },
    ],
    interaction: { type: 'scatter', hint: 'koppints a képekre' },
  },
  {
    id: 'meglepetes',
    title: 'Meglepetés',
    subtitle: 'egy este',
    photos: [
      { src: img('IMG_4133.jpg'), caption: 'karácsony', rot: 2 },
    ],
    interaction: { type: 'scratch', photo: 0, hint: 'kapard le' },
  },
  {
    id: 'nyar',
    title: 'Nyár',
    subtitle: '2026 nyara',
    photos: [
      { src: img('IMG_7680.jpg'), caption: 'a tengerparton', rot: -3, wide: true },
      { src: img('IMG_1320.jpg'), caption: 'este a parton', rot: 4 },
      { src: img('IMG_6239.jpg'), caption: 'cowboykalapban', rot: -4 },
      { src: img('IMG_7735.jpg'), caption: 'az óriáskeréken', rot: 3, wide: true },
    ],
    interaction: { type: 'scratch', photo: 3, hint: 'kapard le az utolsót' },
  },
  {
    id: 'csak-te-es-en',
    title: 'Csak te és én',
    subtitle: 'ami a kupakon áll',
    photos: [
      { src: img('IMG_2434.jpg'), caption: '', rot: 0 },
    ],
    interaction: null,
  },
];

// Amíg placeholder: true, a levél nem jelenik meg az oldalon.
export const letter = {
  placeholder: true,
  paragraphs: [
    'Ide jön a levél szövege.',
  ],
  signature: 'Miki',
};
