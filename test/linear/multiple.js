'use strict';
const test = require('ava');
const {Circular, Linear, Node} = require('../../.');

const linear = new Linear();

test('multiple append', t => {
  linear.append('A', 'B');
  t.is(linear.head.value, 'A');
  t.is(linear.last.value, 'B');
});

test('head & last values not equal', t => {
  t.not(linear.head.value, linear.last.value);
});

test('empty check', t => {
  t.false(linear.isEmpty());
});

test('get nodes value', t => {
  t.is(linear.get(0), 'A');
  t.is(linear.get(1), 'B');
});

test('select node', t => {
  const node = new Node('B');
  t.deepEqual(linear.node(1), node);
});

test('next node', t => {
  const node = new Node('B');
  t.deepEqual(linear.node(0).next, node);
});

test('incremented length', t => {
  t.is(linear.length, 2);
});

test('set node value', t => {
  linear.set({index: 0, value: 'C'});
  t.is(linear.head.value, 'C');
});

test('update node value', t => {
  linear.node(0).value = 'A';
  t.is(linear.head.value, 'A');
});

test('arrayify', t => {
  t.deepEqual(linear.toArray(), ['A', 'B']);
});

test('join', t => {
  t.is(linear.join(), 'A,B');
});

test('join with space', t => {
  t.is(linear.join(' '), 'A B');
});

test('reverse', t => {
  const reversed = linear.reverse();
  t.is(reversed.head.value, 'B');
});

test('map', t => {
  const mapped = linear.map(x => x);
  t.is(linear.head.value, mapped.head.value);
});

test('iterate', t => {
  const array = [];
  linear.forEach(x => array.push(x));
  t.is(linear.head.value, array[0]);
  t.is(linear.last.value, array[1]);
});

test('remove node', t => {
  linear.clear().append('A', 'B', 'C', 'D', 'E');
  linear.remove(0);
  t.is(linear.head.value, 'B');
  t.is(linear.node(0).value, 'B');
  t.is(linear.node(0).next.value, 'C');
  linear.remove(1);
  t.is(linear.head.next.value, 'D');
  linear.remove(linear.length - 1);
  t.is(linear.last.value, 'D');
});

test('decremented length', t => {
  t.is(linear.length, 2);
});

test('clear', t => {
  const cleared = linear.clear();
  t.deepEqual(linear, cleared);
});

test('prepend', t => {
  linear.prepend('A', 'B');
  t.is(linear.head.value, 'B');
  t.is(linear.last.value, 'A');
});

test('insert head', t => {
  linear.clear().prepend('A', 'B');
  linear.insert({value: ['C', 'D'], index: 0});
  t.is(linear.get(0), 'D');
  t.is(linear.get(1), 'C');
  t.is(linear.get(2), 'B');
  t.is(linear.get(3), 'A');
});

test('insert middle', t => {
  linear.clear().prepend('A', 'B');
  linear.insert({value: ['C', 'D'], index: 1});
  t.is(linear.get(0), 'B');
  t.is(linear.get(1), 'D');
  t.is(linear.get(2), 'C');
  t.is(linear.get(3), 'A');
});

test('insert last', t => {
  linear.clear().prepend('A', 'B');
  linear.insert({value: ['C', 'D'], index: 2});
  t.is(linear.get(0), 'B');
  t.is(linear.get(1), 'A');
  t.is(linear.get(2), 'D');
  t.is(linear.get(3), 'C');
});

test('toString', t => {
  linear.clear().prepend('A', 'B', 'C', 'D');
  t.is(linear.toString(), 'D,C,B,A');
});

test('reduce', t => {
  linear.clear().append(5, 10, 15, 20, 25);
  t.is(linear.reduce((x, y) => x + y, 0), 75);
  t.is(linear.reduce((x, y) => x > y ? x : y, -Infinity), 25);
});

test('filter', t => {
  linear.clear().append(1, 2, 3, 4, 5, 6, 7);
  const oddList = new Linear();
  oddList.append(1, 3, 5, 7);
  t.deepEqual(linear.filter(x => x % 2 > 0), oddList);
});

test('toCircular', t => {
  linear.clear().append('A', 'B', 'C');
  const circular = new Circular();
  circular.append('A', 'B', 'C');
  t.deepEqual(linear.toCircular(), circular);
});

test('isLinear', t => {
  t.is(linear.isLinear(), true);
});

test('isCircular', t => {
  t.is(linear.isCircular(), false);
});

test('chain', t => {
  const result = linear.clear().append('C', 'D').prepend('B', 'A').map(x => `[${x}]`).reverse();
  t.deepEqual(result.toArray(), ['[D]', '[C]', '[B]', '[A]']);
  t.is(result.join(' '), '[D] [C] [B] [A]');
});

test('includes', t => {
  linear.clear().append(5, 10, 15, 20, 25, 30);
  t.is(linear.includes(), false);
  t.is(linear.includes(0), false);
  t.is(linear.includes(25), true);
});

test('indexOf', t => {
  t.is(linear.indexOf(), -1);
  t.is(linear.indexOf(0), -1);
  t.is(linear.indexOf(15), 2);
  t.is(linear.indexOf(30), 5);
});
