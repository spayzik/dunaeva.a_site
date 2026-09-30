import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemandRenderer } from '../src/demand-renderer.js';

function setup() {
  const callbacks = new Map();
  let next = 0, draws = 0;
  const renderer = createDemandRenderer({
    requestFrame: callback => { callbacks.set(++next, callback); return next; },
    cancelFrame: id => callbacks.delete(id),
    draw: () => draws++,
  });
  const flush = () => { const batch = [...callbacks.values()]; callbacks.clear(); batch.forEach(fn => fn()); };
  return { renderer, callbacks, flush, get draws() { return draws; } };
}

test('a burst of pointer input draws once and leaves no idle frame loop', () => {
  const env = setup();
  env.renderer.setActive(true);
  for (let i = 0; i < 100; i++) env.renderer.request();
  assert.equal(env.callbacks.size, 1);
  env.flush();
  assert.equal(env.draws, 1);
  assert.equal(env.callbacks.size, 0);
  env.flush();
  assert.equal(env.draws, 1);
});

test('offscreen or hidden state cancels a queued frame and ignores input', () => {
  const env = setup();
  env.renderer.setActive(true);
  env.renderer.setActive(false);
  env.renderer.request();
  env.flush();
  assert.equal(env.draws, 0);
  assert.equal(env.callbacks.size, 0);
  env.renderer.setActive(true);
  env.flush();
  assert.equal(env.draws, 1);
});

test('an unmounted renderer cannot restart or draw a stale callback', () => {
  const env = setup();
  env.renderer.setActive(true);
  const stale = [...env.callbacks.values()][0];
  env.renderer.dispose();
  stale();
  env.renderer.setActive(true);
  env.renderer.request();
  env.flush();
  assert.equal(env.draws, 0);
  assert.equal(env.callbacks.size, 0);
});
