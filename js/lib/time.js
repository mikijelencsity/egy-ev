// Eltelt idő két időpont között, faliórához igazítva (a nyári/téli időszámítás
// váltása nem csúsztatja el az órákat).
export function elapsed(start, now) {
  const offsetFix = (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000;
  let total = Math.floor((now - start - offsetFix) / 1000);
  if (!(total > 0)) total = 0;
  const days = Math.floor(total / 86400);
  total -= days * 86400;
  const hours = Math.floor(total / 3600);
  total -= hours * 3600;
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return { days, hours, minutes, seconds };
}
