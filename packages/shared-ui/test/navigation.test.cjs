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
