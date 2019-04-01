'use strict';

class List {
  constructor() {
    this._head = null;
    this._last = null;
    this._length = 0;
  }

  get head() {
    return this._head;
  }

  get last() {
    return this._last;
  }

  get length() {
    return this._length;
  }

  _arrayify(value) {
    return Array.isArray(value) ? value : [value];
  }

  _isValid(index) {
    return index >= 0 && index < this.length;
  }

  clear() {
    this._head = null;
    this._length = 0;
    return this;
  }

  get(index) {
    const {value} = this.node(index);
    return value;
  }

  isCircular() {
    return this.constructor.name === 'Circular';
  }

  isEmpty() {
    return !this._head && this._length === 0;
  }

  isLinear() {
    return this.constructor.name === 'Linear';
  }

  node(index) {
    if (!this._isValid(index)) {
      throw new RangeError('List index out of bounds');
    }

    let count = 0;
    let {_head: node} = this;

    while (index !== count) {
      node = node.next;
      count++;
    }

    return node;
  }

  set({value, index}) {
    const node = this.node(index);
    node.value = value;
    return this;
  }
}

module.exports = List;
