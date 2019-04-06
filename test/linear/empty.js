'use strict';
const test = require('ava');
const {Circular, Linear} = require('../../.');

const linear = new Linear();

test('empty check', t => {
  t.true(linear.isEmpty());
});

test('head node value', t => {
  t.is(linear.head, null);
});

test('last node value', t => {
  t.is(linear.last, null);
});

test('head & last values equal', t => {
  t.is(linear.head, linear.last);
});

test('get node value', t => {
  t.throws(() => linear.get(0), 'List index out of bounds');
});

test('select node', t => {
  t.throws(() => linear.node(0), 'List index out of bounds');
});

test('remove node', t => {
  t.throws(() => linear.remove(0), 'List index out of bounds');
});

test('set node value', t => {
  t.throws(() => linear.set({index: 0, value: ''}), 'List index out of bounds');
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
  const arr = [];
  linear.forEach(x => x);
  t.deepEqual(arr, []);
});

test('reduce', t => {
  t.is(linear.reduce((x, y) => x + y, 0), 0);
});

test('filter', t => {
  t.deepEqual(linear.filter(x => x % 2 === 0), linear);
});

test('toString', t => {
  t.is(linear.toString(), '');
});

test('toCircular', t => {
  const circular = new Circular();
  t.deepEqual(linear.toCircular(), circular);
});

test('isLinear', t => {
  t.is(linear.isLinear(), true);
});

test('isCircular', t => {
  t.is(linear.isCircular(), false);
});

test('includes', t => {
  t.is(linear.includes(), false);
  t.is(linear.includes(1), false);
});

test('indexOf', t => {
  t.is(linear.indexOf(), -1);
  t.is(linear.indexOf(0), -1);
});
