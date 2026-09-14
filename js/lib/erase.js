// A vászon hány százaléka lett már letörölve (átlátszó), minden `step`-edik pixelt vizsgálva.
export function erasedRatio(imageData, step = 8) {
  const d = imageData.data;
  let seen = 0;
  let cleared = 0;
  for (let i = 3; i < d.length; i += 4 * step) {
    seen++;
    if (d[i] < 128) cleared++;
  }
  return seen ? cleared / seen : 0;
}
