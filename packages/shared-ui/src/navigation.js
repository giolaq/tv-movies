export const CARD_WIDTH = 184;
export const CARD_MARGIN = 7;

export function columnsForWidth(width) {
  return Math.max(1, Math.floor(width / (CARD_WIDTH + 2 * CARD_MARGIN)));
}

export function nextIndex(index, key, count, columns) {
  if (!count) return -1;
  const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
  return Math.max(0, Math.min(count - 1, index + (offsets[key] || 0)));
}
