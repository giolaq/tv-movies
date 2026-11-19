const { test } = require('node:test');
const assert = require('node:assert/strict');

test('pointer focus requires changed viewport coordinates', async () => {
  const { createPointerMovementTracker } = await import('../src/pointerMovement.js');
  const moved = createPointerMovementTracker();
  assert.equal(moved(100, 200), true);
  assert.equal(moved(100, 200), false);
  assert.equal(moved(101, 200), true);
  assert.equal(moved(101, 201), true);
  assert.equal(moved(101, 201), false);
});

test('missing or invalid coordinates do not count as movement or reset tracking', async () => {
  const { createPointerMovementTracker } = await import('../src/pointerMovement.js');
  const moved = createPointerMovementTracker();
  assert.equal(moved(), false);
  assert.equal(moved(NaN, 0), false);
  assert.equal(moved(0, Infinity), false);
  assert.equal(moved(0, 0), true);
  assert.equal(moved(undefined, undefined), false);
  assert.equal(moved(0, 0), false);
});
