const GRAVITY = 9.81;

// Rázás-érzékelő: akkor jelez, ha a gyorsulás elég nagy, és az előző jelzés óta eltelt minGap ms.
// includesGravity esetén a gravitációt levonja a mért nagyságból.
export function createShakeDetector({ threshold = 13, minGap = 110 } = {}) {
  let last = -Infinity;
  return function feed(x, y, z, t, includesGravity) {
    if (x == null || y == null || z == null) return false;
    let mag = Math.hypot(x, y, z);
    if (includesGravity) mag = Math.abs(mag - GRAVITY);
    if (mag >= threshold && t - last >= minGap) {
      last = t;
      return true;
    }
    return false;
  };
}
