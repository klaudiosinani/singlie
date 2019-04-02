'use strict';
const test = require('ava');
const {Circular, Node} = require('../../.');

const circular = new Circular();

test('append', t => {
  circular.append('A');
  t.is(circular.head.value, 'A');
});

test('head & last values equal', t => {
  t.is(circular.head.value, circular.last.value);
});

test('empty check', t => {
  t.false(circular.isEmpty());
});

test('get node value', t => {
  t.is(circular.get(0), 'A');
});

test('select node', t => {
  const node = new Node();
  [node.value, node.next] = ['A', node];
  t.deepEqual(circular.node(0), node);
});

test('next node is head', t => {
  t.deepEqual(circular.node(0).next, circular.node(0));
});

test('incremented length', t => {
  t.is(circular.length, 1);
});

test('set node value', t => {
  circular.set({index: 0, value: 'B'});
  t.is(circular.head.value, 'B');
});

test('update node value', t => {
  circular.node(0).value = 'A';
  t.is(circular.head.value, 'A');
});

test('arrayify', t => {
  t.deepEqual(circular.toArray(), ['A']);
});

test('join', t => {
  t.is(circular.join(), 'A');
});

test('reverse', t => {
  const reversed = circular.reverse();
  t.is(reversed.head.value, 'A');
});

test('map', t => {
  const mapped = circular.map(x => x);
  t.is(circular.head.value, mapped.head.value);
});

test('iterate', t => {
  const array = [];
  circular.forEach(x => array.push(x));
  t.is(circular.head.value, array[0]);
});

test('remove node', t => {
  circular.remove(0);
  t.is(circular.head, null);
});

test('decremented length', t => {
  t.is(circular.length, 0);
});

test('prepend', t => {
  circular.prepend('A');
  t.is(circular.head.value, 'A');
});

test('clear', t => {
  const cleared = circular.clear();
  t.deepEqual(circular, cleared);
});

test('insert', t => {
  circular.insert({value: 'A', index: 0});
  t.is(circular.head.value, 'A');
});
