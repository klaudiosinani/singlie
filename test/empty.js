'use strict';
const test = require('ava');
const {Linear} = require('../.');

const linear = new Linear();

test('empty check', t => {
  t.true(linear.isEmpty());
});

test('head node value', t => {
  t.is(linear.head, undefined);
});

test('last node value', t => {
  t.is(linear.last, undefined);
});

test('head & last values equal', t => {
  t.is(linear.head, linear.last);
});

test('get node value', t => {
  t.is(linear.get(0), undefined);
});

test('next node', t => {
  t.throws(() => linear.node(0).next, `Cannot read property 'next' of undefined`);
});

test('select node', t => {
  t.is(linear.node(0), undefined);
});

test('remove node', t => {
  t.is(linear.remove(0), undefined);
});

test('set node value', t => {
  t.throws(() => linear.set({index: 0, value: ''}), `List index out of bounds`);
});

test('zero length', t => {
  t.is(linear.length, 0);
});

test('arrayify', t => {
  t.deepEqual(linear.toArray(), []);
});

test('join', t => {
  t.deepEqual(linear.join(), '');
});

test('map', t => {
  const mapped = linear.map(x => x);
  t.deepEqual(linear, mapped);
});

test('reverse', t => {
  const mapped = linear.reverse();
  t.deepEqual(linear, mapped);
});

test('clear', t => {
  const cleared = linear.clear();
  t.deepEqual(linear, cleared);
});

test('iterate', t => {
  const iterated = linear.forEach(x => x);
  t.is(iterated, undefined);
});
