'use strict';
const test = require('ava');
const {Linear} = require('../.');

const linear = new Linear();

test('is list empty', t => {
  t.true(linear.isEmpty());
});

test('head node of empty list', t => {
  t.is(linear.head, undefined);
});

test('last node of empty list', t => {
  t.is(linear.head, undefined);
});

test('get first node of empty list', t => {
  t.is(linear.get(0), undefined);
});

test('length of empty list', t => {
  t.is(linear.length, 0);
});
