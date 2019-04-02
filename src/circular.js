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

  filter(fn) {
    const list = new Circular();

    this.forEach(x => {
      if (fn(x)) {
        list.append(x);
      }
    });

    return list;
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

  insert({value, index}) {
    this._arrayify(value).forEach(x => {
      if (index === 0) {
        return this.prepend(x);
      }

      if (index === this.length) {
        return this.append(x);
      }

      return this._addNode(x, index);
    });
    return this;
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

  map(fn) {
    const list = new Circular();
    this.forEach(x => list.append(fn(x)));
    return list;
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

  remove(index = this.length - 1) {
    if (!this._isValid(index)) {
      return undefined;
    }

    if (index === 0) {
      return (this.length === 1) ? this.clear() : this._removeHead();
    }

    return this._removeNode(index);
  }

  reverse() {
    const list = new Circular();
    this.forEach(x => list.prepend(x));
    return list;
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

  toString() {
    return this.join(',');
  }
}

module.exports = Circular;
