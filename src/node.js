'use strict';

class Node {
  constructor(value) {
    this._next = null;
    this._value = value;
  }

  get next() {
    return this._next;
  }

  set next(node) {
    this._next = node;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}

module.exports = Node;
