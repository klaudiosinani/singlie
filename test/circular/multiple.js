'use strict';
const test = require('ava');
const {Circular, Node} = require('../../.');

const circular = new Circular();

test('multiple append', t => {
  circular.append('A', 'B');
  t.is(circular.head.value, 'A');
  t.is(circular.last.value, 'B');
});

test('head & last values not equal', t => {
  t.not(circular.head.value, circular.last.value);
});

test('empty check', t => {
  t.false(circular.isEmpty());
});

test('get nodes value', t => {
  t.is(circular.get(0), 'A');
  t.is(circular.get(1), 'B');
});

test('select node', t => {
  const a = new Node('A');
  const b = new Node('B');
  [a.next, b.next] = [b, a];
  t.deepEqual(circular.node(1), b);
});

test('next node', t => {
  const a = new Node('A');
  const b = new Node('B');
  [a.next, b.next] = [b, a];
  t.deepEqual(circular.node(0).next, b);
});

test('next of last is head', t => {
  t.deepEqual(circular.node(circular.length - 1).next, circular.node(0));
});

test('incremented length', t => {
  t.is(circular.length, 2);
});

test('set node value', t => {
  circular.set({index: 0, value: 'C'});
  t.is(circular.head.value, 'C');
});

test('update node value', t => {
  circular.node(0).value = 'A';
  t.is(circular.head.value, 'A');
  t.is(circular.node(circular.length - 1).next.value, 'A');
});

test('arrayify', t => {
  t.deepEqual(circular.toArray(), ['A', 'B']);
});

test('join', t => {
  t.is(circular.join(), 'A,B');
});

test('join with space', t => {
  t.is(circular.join(' '), 'A B');
});

test('reverse', t => {
  const reversed = circular.reverse();
  t.is(reversed.head.value, 'B');
});

test('map', t => {
  const mapped = circular.map(x => x);
  t.is(circular.head.value, mapped.head.value);
  t.is(circular.last.value, mapped.last.value);
});

test('iterate', t => {
  const array = [];
  circular.forEach(x => array.push(x));
  t.is(circular.head.value, array[0]);
  t.is(circular.last.value, array[1]);
});

test('remove node', t => {
  circular.clear().append('A', 'B', 'C');
  circular.remove(0).remove(0);
  t.is(circular.head.value, 'C');
  t.is(circular.node(0).value, 'C');
  t.is(circular.node(0).next.value, 'C');
});

test('decremented length', t => {
  t.is(circular.length, 1);
});

test('clear', t => {
  const cleared = circular.clear();
  t.deepEqual(circular, cleared);
});

test('prepend', t => {
  circular.prepend('A', 'B');
  t.is(circular.head.value, 'B');
  t.is(circular.last.value, 'A');
});

test('insert head', t => {
  circular.clear().prepend('A', 'B');
  circular.insert({value: ['C', 'D'], index: 0});
  t.is(circular.get(0), 'D');
  t.is(circular.get(1), 'C');
  t.is(circular.get(2), 'B');
  t.is(circular.get(3), 'A');
  t.is(circular.node(circular.length - 1).next.value, 'D');
});

test('insert middle', t => {
  circular.clear().prepend('A', 'B');
  circular.insert({value: ['C', 'D'], index: 1});
  t.is(circular.get(0), 'B');
  t.is(circular.get(1), 'D');
  t.is(circular.get(2), 'C');
  t.is(circular.get(3), 'A');
  t.is(circular.node(circular.length - 1).next.value, 'B');
});

test('insert last', t => {
  circular.clear().prepend('A', 'B');
  circular.insert({value: ['C', 'D'], index: 2});
  t.is(circular.get(0), 'B');
  t.is(circular.get(1), 'A');
  t.is(circular.get(2), 'D');
  t.is(circular.get(3), 'C');
  t.is(circular.node(circular.length - 1).next.value, 'B');
});

test('chain', t => {
  const result = circular.clear().append('C', 'D').prepend('B', 'A').map(x => `[${x}]`).reverse();
  t.deepEqual(result.toArray(), ['[D]', '[C]', '[B]', '[A]']);
  t.is(result.join(' '), '[D] [C] [B] [A]');
  t.is(result.node(result.length - 1).next.value, result.head.value);
});
