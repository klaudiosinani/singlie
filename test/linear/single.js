'use strict';
const test = require('ava');
const {Circular, Linear, Node} = require('../../.');

const linear = new Linear();

test('append', t => {
  linear.append('A');
  t.is(linear.head.value, 'A');
});

test('head & last values equal', t => {
  t.is(linear.head.value, linear.last.value);
});

test('empty check', t => {
  t.false(linear.isEmpty());
});

test('get node value', t => {
  t.is(linear.get(0), 'A');
});

test('next node', t => {
  t.is(linear.node(0).next, null);
});

test('select node', t => {
  const node = new Node('A');
  t.deepEqual(linear.node(0), node);
});

test('incremented length', t => {
  t.is(linear.length, 1);
});

test('set node value', t => {
  linear.set({index: 0, value: 'B'});
  t.is(linear.head.value, 'B');
});

test('update node value', t => {
  linear.node(0).value = 'A';
  t.is(linear.head.value, 'A');
});

test('arrayify', t => {
  t.deepEqual(linear.toArray(), ['A']);
});

test('join', t => {
  t.is(linear.join(), 'A');
});

test('reverse', t => {
  const reversed = linear.reverse();
  t.is(reversed.head.value, 'A');
});

test('map', t => {
  const mapped = linear.map(x => x);
  t.is(linear.head.value, mapped.head.value);
});

test('iterate', t => {
  const array = [];
  linear.forEach(x => array.push(x));
  t.is(linear.head.value, array[0]);
});

test('remove node', t => {
  linear.remove(0);
  t.is(linear.head, null);
});

test('decremented length', t => {
  t.is(linear.length, 0);
});

test('prepend', t => {
  linear.prepend('A');
  t.is(linear.head.value, 'A');
});

test('clear', t => {
  const cleared = linear.clear();
  t.deepEqual(linear, cleared);
});

test('insert', t => {
  linear.insert({value: 'A', index: 0});
  t.is(linear.head.value, 'A');
});

test('reduce', t => {
  t.is(linear.reduce((x, y) => x + y, ''), 'A');
});

test('filter', t => {
  t.deepEqual(linear.filter(x => x.startsWith('A')), linear);
});

test('toString', t => {
  t.is(linear.toString(), 'A');
});

test('toCircular', t => {
  const circular = new Circular();
  circular.append('A');
  t.deepEqual(linear.toCircular(), circular);
});

test('isLinear', t => {
  t.is(linear.isLinear(), true);
});

test('isCircular', t => {
  t.is(linear.isCircular(), false);
});

test('includes', t => {
  linear.clear().append(5);
  t.is(linear.includes(), false);
  t.is(linear.includes(0), false);
  t.is(linear.includes(5), true);
});
