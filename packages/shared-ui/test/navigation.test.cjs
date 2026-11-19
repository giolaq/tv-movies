const { test } = require('node:test');
const assert = require('node:assert/strict');
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
test('columns follow the measured grid width', async () => {
  const { columnsFor, CARD_OUTER_WIDTH } = await import('../src/navigation.js');
  assert.equal(columnsFor(819, CARD_OUTER_WIDTH), 4);
  assert.equal(columnsFor(792, CARD_OUTER_WIDTH), 4);
  assert.equal(columnsFor(791, CARD_OUTER_WIDTH), 3);
  assert.equal(columnsFor(100, CARD_OUTER_WIDTH), 1);
  assert.equal(columnsFor(0, CARD_OUTER_WIDTH), 1);
});
