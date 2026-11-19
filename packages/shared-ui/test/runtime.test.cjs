const { test } = require('node:test');
const assert = require('node:assert/strict');
test('runtime formats minutes, hours and rounded values', async () => {
  const { formatRuntime } = await import('../src/runtime.js');
  assert.equal(formatRuntime(112), '1h 52m');
  assert.equal(formatRuntime(60), '1h');
  assert.equal(formatRuntime(45), '45m');
  assert.equal(formatRuntime(119.8), '2h');
});
test('missing and invalid runtimes have an explicit fallback', async () => {
  const { formatRuntime } = await import('../src/runtime.js');
  for (const value of [undefined, null, 0, -1, NaN, Infinity, '112']) {
    assert.equal(formatRuntime(value), 'Runtime unavailable');
  }
});
