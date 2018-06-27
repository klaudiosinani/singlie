<h1 align="center">
  Singlie
</h1>

<h4 align="center">
  ⚡ Singly circular & linear linked lists for ES6
</h4>

<div align="center">
  <img alt="Header" src="media/header.png" width="88%">
</div>

<p align="center">
  <a href="https://travis-ci.com/klauscfhq/singlie">
    <img alt="Build Status" src="https://travis-ci.com/klauscfhq/singlie.svg?branch=master">
  </a>
  <a href='https://coveralls.io/github/klauscfhq/singlie?branch=master'>
    <img alt="Coverage Status" src="https://coveralls.io/repos/github/klauscfhq/singlie/badge.svg?branch=master">
  </a>
</p>

## Description

Progressive and minimal implementation of the circular and linear singly linked list data structures in modern ES6.

Come over to [Gitter](https://gitter.im/klauscfhq/singlie) or [Twitter](https://twitter.com/klauscfhq) to share your thoughts on the project.

## Contents

- [Description](#description)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Development](#development)
- [Team](#team)
- [License](#license)

## Install

```bash
npm install singlie
```

## Usage

```js
const {Circular, Linear} = require('singlie');

const linear = new Linear();
const circular = new Circular();
```

Singlie exposes a progressive and serializable API, that can be utilized through a simple and minimal syntax, allowing you to combine and chain methods effectively.

Usage examples can be also found at the [`test`](https://github.com/klauscfhq/singlie/tree/master/test) directory.

### Linear Singly Linked List

Linear singly linked lists can contain multiple nodes, where each node has only a `value` and a `next` attribute. The `value` attribute holds the value stored inside of the node, and the `next` attribute points to the next node in line. The only exception, is that the last node of the list has `null` stored to its `next` attribute, which indicates the lack of further nodes down the line, thus the end of the list. The following example demonstrates the operations that can be performed on any linear singly linked list.

```js
const {Linear} = require('singlie');

const linear = new Linear();
const {log} = console;

// Append a node holding the value `E`
linear.append('E');
log(linear.head); // => E
log(linear.last); // => E
log(linear.get(0)); // => E

// Return the node corresponding to the index
log(linear.node(0)); // => Node {value: 'E', next: null}
log(linear.node(0).value); // => E
log(linear.node(0).next); // => null

// Append multiple nodes at once
linear.append('F', 'G');
log(linear.length); // => 3
log(linear.node(0).next.value); // => F
log(linear.node(0).next.next.value); // => G
log(linear.toArray()); // => [ 'E', 'F', 'G' ]

// Prepend multiple nodes at once
linear.prepend('B', 'A');
log(linear.join(' ')); // => A B E F G

// Insert multiple nodes to the given index
linear.insert({value: ['D', 'C', 'X'], index: 2});
log(linear.join(' ')); // => A B X C D E F G

// Remove the node corresponding to the index
linear.remove(2);
log(linear.join(' ')); // => A B C D E F G

// Update the value of the node corresponding to the index
linear.node(linear.length - 1).value = '!';
log(linear.join(' ')); // => A B C D E F !
linear.set({value: 'G', index: linear.length - 1});
log(linear.join(' ')); // => A B C D E F G

// Iterate over the list
const array = [];
linear.forEach(x => array.push(x));
log(array);
// => [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]

// Chain multiple methods
log(linear.reverse().map(x => `[${x}]`).join('->'));
// => [G]->[F]->[E]->[D]->[C]->[B]->[A]

// Clear the list
log(linear.clear()); // => Linear {head: null, length: 0}
```

### Circular Singly Linked List

Circular singly linked lists can also contain multiple nodes, where again each node has the same `value` and `next` attributes. The only difference compared to linear lists, is that the last node always points back to the first node / head of the list, thus the list is said to be circular or circularly linked. The following example demonstrates the operations that can be performed on any circular singly linked list.

```js
const {Circular} = require('singlie');

const circular = new Circular();
const {log} = console;

// Append a node holding the value `E`
circular.append('E');
log(circular.head); // => E
log(circular.last); // => E
log(circular.get(0)); // => E

// Return the node corresponding to the index
log(circular.node(0)); // => Node {value: 'E', next: [Circular]}
log(circular.node(0).value); // => E
log(circular.node(0).next.value); // => E
log(circular.node(0).next.next.value); // => E

// Append multiple nodes at once
circular.append('F', 'G');
log(circular.length); // => 3
log(circular.node(0).next.value); // => F
log(circular.node(0).next.next.value); // => G
log(circular.node(0).next.next.next.value); // => E
log(circular.toArray()); // => [ 'E', 'F', 'G' ]

// Prepend multiple nodes at once
circular.prepend('B', 'A');
log(circular.join(' ')); // => A B E F G

// Insert multiple nodes to the given index
circular.insert({value: ['D', 'C', 'X'], index: 2});
log(circular.join(' ')); // => A B X C D E F G

// Remove the node corresponding to the index
circular.remove(2);
log(circular.join(' ')); // => A B C D E F G

// Update the value of the node corresponding to the index
circular.node(circular.length - 1).value = '!';
log(circular.join(' ')); // => A B C D E F !
circular.set({value: 'G', index: circular.length - 1});
log(circular.join(' ')); // => A B C D E F G

// Iterate over the list
const array = [];
circular.forEach(x => array.push(x));
log(array);
// => [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]

// Chain multiple methods
log(circular.reverse().map(x => `[${x}]`).join('->'));
// => [G]->[F]->[E]->[D]->[C]->[B]->[A]

// Clear the list
log(circular.clear()); // => Circular {head: null, length: 0}
```

## API

The following documentation holds for both circular & linear lists. The described `list` instance is used to depict the same methods that are applicable to both a linear and a circular linked list, without overlooking their above described differences and unique qualities.

#### list.`append(value[, value])`

- Return Type: `Linked List`

Appends one of more nodes to the list.

##### **`value`**

- Type: `any`

Can be one or more comma delimited values. Each value corresponds to a single node.

```js
list.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
```

#### list.`prepend(value[, value])`

- Return Type: `Linked List`

Prepends one of more nodes to the list.

##### **`value`**

- Type: `any`

Can be one or more comma delimited values. Each value corresponds to a single node.

```js
list.append('C');
// => {value: 'C', next: null}
list.prepend('B', 'A');
// => {value: 'A', next: {value: 'B', next: {value: 'C', next: null}}}
```

#### list.`head`

- Return Type: `any`

Returns the value of the first node / head on the list.

```js
list.append('A', 'B');
console.log(list.head);
// => A
```

#### list.`last`

- Return Type: `any`

Returns the value of the last node on the list.

```js
list.append('A', 'B');
console.log(list.last);
// => B
```

#### list.`length`

- Return Type: `Integer`

Returns the length of the list.

```js
list.append('A', 'B');
console.log(list.length);
// => 2
```

#### list.`isEmpty()`

- Return Type: `Boolean`

Checks whether or not the list is empty.

```js
list.append('A', 'B');
console.log(list.isEmpty());
// => false
```

#### list.`insert({value[, value], index})`

- Return Type: `Linked List`

Inserts one or more nodes to the given index.

##### **`value`**

- Type: `any`

Can be one or more comma delimited values. Each value corresponds to a single node.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```js
list.append('A', 'B');
list.insert({value: ['C', 'D'], index: 1});
// => {value: 'A', next: {value: 'D', next: {value: 'C', next: { value: 'B', next: null}}}}
```

#### list.`node(index)`

- Return Type: `Node`

Return the node corresponding to the given index.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```js
list.append('A', 'B', 'C', 'D');
const node = list.node(0);
console.log(node);
// => {value: 'A', next: {value: 'B', next: [List]}}
console.log(node.value);
// => A
console.log(node.next);
// => {value: 'B', next: [List]}
```

#### list.`get(index)`

- Return Type: `any`

Return the value of node corresponding to the given index.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```js
list.append('A', 'B');
console.log(list.get(0))
// => A
console.log(list.get(0))
// => B
```

#### list.`remove(index)`

- Return Type: `Linked List`

Removes from the list the node located to the given index.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```js
list.append('A', 'B', 'C', 'D');
// => {value: 'A', next: [List]}
list.remove(0);
// => {value: 'B', next: [List]}
list.remove(0);
// => {value: 'C', next: [List]}
```

#### list.`toArray()`

- Return Type: `Array`

Converts the list into an array.

```js
linear.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
const array = linear.toArray();
console.log(array);
// => [ 'A', 'B' ]
```

#### list.`clear()`

- Return Type: `Empty Linked List`

Removes all nodes from the list.

```js
linear.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
linear.clear();
// => null
```

#### list.`join([separator])`

- Return Type: `String`

Joins the values of all nodes on the list into a string and returns the string.

##### **`separator`**

- Type: `String`
- Default: `Comma ','`

Specifies a string to separate each pair of adjacent node values of the array. 

If omitted, the node values are separated with a `comma ','`.

```js
list.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
console.log(list.join());
// => 'A,B'
console.log(list.join(''));
// => 'AB'
console.log(list.join(' '));
// => 'A B'
```

#### list.`forEach(function)`

- Return Type: `undefined`

Executes a provided function once for each node value.

##### **`function`**

- Type: `Function`

Function to execute for each node value.

```js
const array = [];
list.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
list.forEach(x => array.push(x));
console.log(array);
// => ['A', 'B'];
```

#### list.`map(function)`

- Return Type: `Linked List`

Executes a provided function once for each node value.

##### **`function`**

- Type: `Function`

Function that produces a new node value for the new list.

```js
list.append('A', 'B');
// => {value: 'A', next: {value: 'B', next: null}}
const mapped = list.map(x => `[${x}]`);
console.log(array.join(' '));
// => '[A] [B]'
```

## Development

For more info on how to contribute to the project, please read the [contributing guidelines](https://github.com/klauscfhq/singlie/blob/master/contributing.md).

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd singlie`
- Install the project dependencies: `npm install` or `yarn install`
- Lint the code and run the tests: `npm test` or `yarn test`

## Team

- Klaus Sinani [(@klauscfhq)](https://github.com/klauscfhq)

## License

[MIT](https://github.com/klauscfhq/singlie/blob/master/license.md)
