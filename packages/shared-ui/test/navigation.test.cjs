const { test } = require('node:test');
const assert = require('node:assert/strict');
test('measured grid width determines columns at exact wrapping boundaries', async () => {
  const { columnsForWidth, CARD_WIDTH, CARD_MARGIN, nextIndex } = await import('../src/navigation.js');
  const footprint = CARD_WIDTH + 2 * CARD_MARGIN;
  assert.equal(columnsForWidth(0), 1);
  assert.equal(columnsForWidth(footprint - 1), 1);
  assert.equal(columnsForWidth(4 * footprint - 0.01), 3);
  assert.equal(columnsForWidth(4 * footprint), 4);
  assert.equal(columnsForWidth(864 - 66), 4);
  assert.equal(columnsForWidth(864 - 66 - 15), 3);
  assert.equal(nextIndex(0, 'ArrowDown', 20, columnsForWidth(798)), 4);
  assert.equal(nextIndex(4, 'ArrowUp', 20, columnsForWidth(798)), 0);
  assert.equal(nextIndex(0, 'ArrowDown', 20, columnsForWidth(783)), 3);
});

test('arrows navigate a grid and clamp edges', async () => {
  const { nextIndex } = await import('../src/navigation.js');
  assert.equal(nextIndex(0, 'ArrowRight', 20, 4), 1);
  assert.equal(nextIndex(1, 'ArrowDown', 20, 4), 5);
  assert.equal(nextIndex(5, 'ArrowUp', 20, 4), 1);
  assert.equal(nextIndex(1, 'ArrowLeft', 20, 4), 0);
  assert.equal(nextIndex(0, 'ArrowLeft', 20, 4), 0);
  assert.equal(nextIndex(19, 'ArrowDown', 20, 4), 19);
});
test('empty lists and unsupported keys are safe', async () => {
  const { nextIndex } = await import('../src/navigation.js');
  assert.equal(nextIndex(0, 'ArrowRight', 0, 4), -1);
  assert.equal(nextIndex(2, 'Escape', 20, 4), 2);
});
