'use strict';
const test = require('ava');
const {Circular} = require('../../.');

const circular = new Circular();

test('empty check', t => {
  t.true(circular.isEmpty());
});

test('head node value', t => {
  t.is(circular.head, null);
});

test('last node value', t => {
  t.is(circular.last, null);
});

test('head & last values equal', t => {
  t.is(circular.head, circular.last);
});

test('get node value', t => {
  t.throws(() => circular.get(0), 'List index out of bounds');
});

test('next node', t => {
  t.throws(() => circular.node(0).next, 'List index out of bounds');
});

test('select node', t => {
  t.throws(() => circular.node(0), 'List index out of bounds');
});

test('remove node', t => {
  t.throws(() => circular.remove(0), 'List index out of bounds');
});

test('set node value', t => {
  t.throws(() => circular.set({index: 0, value: ''}), 'List index out of bounds');
});

test('zero length', t => {
  t.is(circular.length, 0);
});

test('arrayify', t => {
  t.deepEqual(circular.toArray(), []);
});

test('join', t => {
  t.deepEqual(circular.join(), '');
});

test('map', t => {
  const mapped = circular.map(x => x);
  t.deepEqual(circular, mapped);
});

test('reverse', t => {
  const mapped = circular.reverse();
  t.deepEqual(circular, mapped);
});

test('clear', t => {
  const cleared = circular.clear();
  t.deepEqual(circular, cleared);
});

test('iterate', t => {
  const arr = [];
  circular.forEach(x => arr.push(x));
  t.deepEqual(arr, []);
});
