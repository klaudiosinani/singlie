'use strict';
const List = require('./list');
const Node = require('./node');

class Linear extends List {
  _addHead(value) {
    const {_head} = this;
    const node = new Node(value);
    node.next = _head;
    this._head = node;
    this._length++;
  }

  _addLast(value) {
    const node = new Node(value);
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
    this._head = node;
    this._last = node;
    this._length++;
  }

  _removeHead() {
    const {next} = this._head;

    if (!next) {
      return this.clear();
    }

    this._head = next;
    this._length--;
    return this;
  }

  _removeLast() {
    const prev = this.node(this.length - 2);
    prev.next = null;
    this._last = prev;
    this._length--;
    return this;
  }

  _removeNode(index) {
    const prev = this.node(index - 1);
    const {next: node} = prev;
    prev.next = node.next;
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
    const list = new Linear();

    this.forEach(x => {
      if (fn(x)) {
        list.append(x);
      }
    });

    return list;
  }

  forEach(fn) {
    let {_head: node} = this;

    while (node) {
      fn(node.value);
      node = node.next;
    }

    return this;
  }

  includes(value) {
    let {_head: node} = this;

    while (node) {
      if (node.value === value) {
        return true;
      }

      node = node.next;
    }

    return false;
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

    while (node) {
      result += node.value;

      if (node.next) {
        result += separator;
      }

      node = node.next;
    }

    return result;
  }

  map(fn) {
    const list = new Linear();
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

  remove(index) {
    if (!this._isValid(index)) {
      throw new RangeError('List index out of bounds');
    }

    if (index === 0) {
      return this._removeHead();
    }

    if (index === this.length - 1) {
      return this._removeLast();
    }

    return this._removeNode(index);
  }

  reverse() {
    const list = new Linear();
    this.forEach(x => list.prepend(x));
    return list;
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

  toString() {
    return this.join(',');
  }
}

module.exports = Linear;
