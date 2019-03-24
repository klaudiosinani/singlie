'use strict';
const List = require('./list');
const Node = require('./node');

class Circular extends List {
  get _last() {
    return this._traverse(this._head, this.length - 1);
  }

  get last() {
    return this.isEmpty() ? undefined : this._last.value;
  }

  _traverse(node, index) {
    return (node.next !== this._head && index > 0) ? this._traverse(node.next, index - 1) : node;
  }

  _getNode(index) {
    return this._traverse(this._head, index);
  }

  _addHead(value) {
    const {_head} = this;
    const node = new Node(value);
    this._head = node;
    this._head.next = this.length === 0 ? node : _head;
    this._length++;
    this._last.next = this._head;
    return this;
  }

  _addNode(value, index = this.length) {
    const node = new Node(value);
    const prev = this._getNode(index - 1);
    node.next = prev.next;
    this._length++;
    prev.next = node;
    return this;
  }

  _removeHead() {
    const {_head} = this;
    this._last.next = _head.next;
    this._head = this._last.next;
    _head.next = null;
    this._length--;
    return this;
  }

  _removeNode(index) {
    const node = this._getNode(index);
    this._getNode(index - 1).next = node.next;
    node.next = null;
    this._length--;
    return this;
  }

  _swap(x, index, swaps) {
    const y = this._getNode(index - 1);
    [x.value, y.value] = [y.value, x.value];
    return swaps > 0 ? this._swap(x.next, index - 1, swaps - 1) : this;
  }

  _map(fn, node = this._head) {
    node.value = fn(node.value);
    return node.next === this._head ? this : this._map(fn, node.next);
  }

  _forEach(fn, node = this._head) {
    if (node.next !== this._head) {
      fn(node.value);
      return this._forEach(fn, node.next);
    }

    return fn(node.value);
  }

  prepend(...values) {
    values.forEach(value => this._addHead(value));
    return this;
  }

  insert({value, index = this.length}) {
    this._arrayify(value).forEach(value => {
      return (index <= 0) ? this._addHead(value) : this._addNode(value, index);
    });
    return this;
  }

  append(...values) {
    values.forEach(value => {
      return this.isEmpty() ? this._addHead(value) : this._addNode(value);
    });
    return this;
  }

  node(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    return this._getNode(index);
  }

  set({value, index}) {
    if (!this._isValid(index)) {
      throw new Error('List index out of bounds');
    }

    const target = this._getNode(index);
    target.value = value;
    return this;
  }

  get(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    const {value} = this._getNode(index);
    return value;
  }

  remove(index = this.length - 1) {
    if (!this._isValid(index)) {
      return undefined;
    }

    if (index === 0) {
      return (this.length === 1) ? this.clear() : this._removeHead();
    }

    return this._removeNode(index);
  }

  forEach(fn) {
    if (this.length === 0) {
      return;
    }

    return this._forEach(fn);
  }

  toArray() {
    const array = [];
    this.forEach(x => array.push(x));
    return array;
  }

  map(fn) {
    const list = new Circular();

    if (this.length === 0) {
      return list;
    }

    list.append(...this.toArray());
    return list._map(fn);
  }

  join(string) {
    return this.toArray().join(string);
  }

  reverse() {
    if (this.isEmpty()) {
      return this;
    }

    const swaps = Math.floor(this.length / 2) - 1;
    return this._swap(this._head, this.length, swaps);
  }

  clear() {
    this._head = null;
    this._length = 0;
    return this;
  }
}

module.exports = Circular;
