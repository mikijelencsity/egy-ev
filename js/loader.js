// Képek előtöltése; minden kép (sikeres vagy hibás) után jelzi az előrehaladást.
export function preload(srcs, onProgress) {
  let done = 0;
  const total = srcs.length || 1;
  return Promise.all(
    srcs.map(src => new Promise(resolve => {
      const im = new Image();
      im.onload = im.onerror = () => {
        done++;
        onProgress?.(done / total);
        resolve();
      };
      im.src = src;
    }))
  );
}
