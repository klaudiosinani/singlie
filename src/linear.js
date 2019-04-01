'use strict';
const List = require('./list');
const Node = require('./node');

class Linear extends List {
  _addHead(value) {
    const {_head} = this;
    this._head = new Node(value);
    this._head.next = _head;
    this._length++;
    return this;
  }

  _addNode(value, index = this.length) {
    const node = new Node(value);
    const prev = this._getNode(index - 1);
    node.next = prev.next;
    prev.next = node;
    this._length++;
    return this;
  }

  _removeHead() {
    const {_head} = this;
    this._head = _head.next;
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
    return node.next ? this._map(fn, node.next) : this;
  }

  prepend(...values) {
    values.forEach(value => this._addHead(value));
    return this;
  }

  reduce(fn, acc) {
    let result = acc;

    this.forEach(x => {
      result = fn(result, x);
    });

    return result;
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

    return (index === 0) ? this._removeHead() : this._removeNode(index);
  }

  forEach(fn) {
    let {_head: node} = this;

    while (node) {
      fn(node.value);
      node = node.next;
    }

    return this;
  }

  toArray() {
    const array = [];
    this.forEach(x => array.push(x));
    return array;
  }

  toCircular() {
    const Circular = require('./circular');
    const list = new Circular();
    this.forEach(x => list.append(x));
    return list;
  }

  map(fn) {
    const list = new Linear();
    this.forEach(x => list.append(fn(x)));
    return list;
  }

  join(separator = ',') {
    let result = '';
    let {_head: node} = this;

    while (node) {
      result += node.value;

      if (node.next) {
        result += separator;
      }

      node = node.next;
    }

    return result;
  }

  reverse() {
    if (this.isEmpty()) {
      return this;
    }

    const swaps = Math.floor(this.length / 2) - 1;
    return this._swap(this._head, this.length, swaps);
  }
}

module.exports = Linear;
