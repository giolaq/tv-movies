export const CARD_WIDTH = 184;
export const CARD_MARGIN = 7;

export function columnsForWidth(width, cardWidth = CARD_WIDTH) {
  return Math.max(1, Math.floor(width / (cardWidth + 2 * CARD_MARGIN)));
}

export function nextIndex(index, key, count, columns) {
  if (!count) return -1;
  if (key === 'ArrowRight' && (index + 1) % columns === 0) return index;
  if (key === 'ArrowLeft' && index % columns === 0) return index;
  const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns };
  return Math.max(0, Math.min(count - 1, index + (offsets[key] || 0)));
}

export function isBackEvent(key) {
  return ['Escape', 'Backspace', 'hardwareBackPress', 'menu', 'back'].includes(key);
}
