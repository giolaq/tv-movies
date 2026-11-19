export function formatRuntime(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return 'Runtime unavailable';
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const remainder = rounded % 60;
  return hours ? `${hours}h${remainder ? ` ${remainder}m` : ''}` : `${remainder}m`;
}
