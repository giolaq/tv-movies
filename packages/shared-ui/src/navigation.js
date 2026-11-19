export function nextIndex(index, key, count, columns) {
  if (!count) return -1;
  const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
  return Math.max(0, Math.min(count - 1, index + (offsets[key] || 0)));
}
