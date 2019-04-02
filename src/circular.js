'use strict';
const List = require('./list');
const Node = require('./node');

class Circular extends List {
  _addHead(value) {
    const {_head} = this;
    const node = new Node(value);
    node.next = _head;
    this._last.next = node;
    this._head = node;
    this._length++;
  }

  _addLast(value) {
    const {_head} = this;
    const node = new Node(value);
    node.next = _head;
    this._last.next = node;
    this._last = node;
    this._length++;
  }

  _addNode(value, index) {
    const node = new Node(value);
    const prev = this.node(index - 1);
    node.next = prev.next;
    prev.next = node;
    this._length++;
  }

  _initializeList(value) {
    const node = new Node(value);
    node.next = node;
    this._head = node;
    this._last = node;
    this._length++;
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

  append(...values) {
    values.forEach(value => {
      if (this.isEmpty()) {
        return this._initializeList(value);
      }

      return this._addLast(value);
    });
    return this;
  }

  prepend(...values) {
    values.forEach(value => {
      if (this.isEmpty()) {
        return this._initializeList(value);
      }

      return this._addHead(value);
    });
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
    let {_head: node} = this;

    if (node) {
      do {
        fn(node.value);
        node = node.next;
      } while (node !== this._head);
    }

    return this;
  }

  toArray() {
    const array = [];
    this.forEach(x => array.push(x));
    return array;
  }

  toLinear() {
    const Linear = require('./linear');
    const list = new Linear();
    this.forEach(x => list.append(x));
    return list;
  }

  map(fn) {
    const list = new Circular();
    this.forEach(x => list.append(fn(x)));
    return list;
  }

  join(separator = ',') {
    let result = '';
    let {_head: node} = this;

    if (node) {
      do {
        result += node.value;

        if (node.next !== this._head) {
          result += separator;
        }

        node = node.next;
      } while (node !== this._head);
    }

    return result;
  }

  reverse() {
    const list = new Circular();
    this.forEach(x => list.prepend(x));
    return list;
  }
}

module.exports = Circular;
