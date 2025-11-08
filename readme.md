<h1 align="center">
  Singlie
</h1>

<h4 align="center">
  Singly circular and linear linked lists
</h4>

## Description

TypeScript implementation of singly circular and linear linked list data-structures with comprehensive property-based test coverage

Visit the [contributing guidelines](https://github.com/klaudiosinani/singlie/blob/master/contributing.md#translating-documentation) to learn more on how to translate this document into more languages.

## Contents

- [Description](#description)
- [Install](#install)
- [Usage](#usage)
- [In Depth](#in-depth)
- [API](#api)
- [Development](#development)
- [Related](#related)
- [Team](#team)
- [License](#license)

## Install

```bash
npm install singlie
```

## Usage

Singlie exposes a fluent API that can be utilized through a simple and minimal syntax, allowing you to combine methods
effectively.

Usage examples can be also found at the [`test`](https://github.com/klaudiosinani/singlie/tree/master/test) directory.

```typescript
import {Circular, Linear} from 'singlie';

const linear = new Linear<string>();
linear.prepend('A').append('B');
linear.head;
// => Node { value: 'A', next: Node { value: 'B', next: null } }
linear.head.next;
// => Node { value: 'B', next: null }
linear.head.next.next;
// => null
linear.map(x => `[${x}]`).reverse().join(' -> ');
// => [B] -> [A]

const circular = new Circular<string>();
circular.append('B').prepend('A');
circular.head;
// => Node { value: 'A', next: Node { value: 'B', next: [Circular] } }
circular.head.next;
// => Node { value: 'B', next: Node { value: 'A', next: [Circular] } }
circular.head.next.next;
// => Node { value: 'A', next: Node { value: 'B', next: [Circular] } }
circular.map(x => `[${x}]`).reverse().toArray();
// => [ '[B]', '[A]' ]
```

## In Depth

### Linear Singly Linked List

Linear singly linked lists can contain multiple nodes, where each node has only a `value` and a `next` attribute. The
`value` attribute holds the value stored inside the node, and the `next` attribute points to the next node in line.
The only exception, is that the last node of the list has `null` stored to its `next` attribute, which indicates the
lack of further nodes down the line, thus the end of the list. The following example demonstrates the operations that
can be performed on any linear singly linked list.

```typescript
import {Linear} from 'singlie';

const linear = new Linear<string>();

// Append a node holding the value `E`
linear.append('E');
linear.head; // => Node { value: 'E', next: null }
linear.last; // => Node { value: 'E', next: null }
linear.get(0); // => E

// Return the node corresponding to the index
linear.node(0); // => Node { value: 'E', next: null }
linear.node(0).value; // => E
linear.node(0).next; // => null

// Append multiple nodes at once
linear.append('F', 'G');
linear.length; // => 3
linear.node(0).next.value; // => F
linear.node(0).next.next.value; // => G
linear.toArray(); // => [ 'E', 'F', 'G' ]

// Prepend multiple nodes at once
linear.prepend('B', 'A');
linear.join(' '); // => A B E F G

// Insert multiple nodes to the given index
linear.insert({value: ['D', 'C', 'X'], index: 2});
linear.join(' '); // => A B X C D E F G

// Remove the node corresponding to the index
linear.remove(2);
linear.join(' '); // => A B C D E F G

// Update the value of the node corresponding to the index
linear.node(linear.length - 1).value = '!';
linear.join(' '); // => A B C D E F !
linear.set({value: 'G', index: linear.length - 1});
linear.join(' '); // => A B C D E F G

// Iterate over the list
const array: string[] = [];
linear.forEach(x => array.push(x));
console.log(array);
// => [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]

// Chain multiple methods
linear.reverse().map(x => `[${x}]`).join('->');
// => [G]->[F]->[E]->[D]->[C]->[B]->[A]

// Clear the list
linear.clear(); // => Linear { head: null, length: 0 }
```

### Circular Singly Linked List

Circular singly linked lists can also contain multiple nodes, where again each node has the same `value` and `next`
attributes. The only difference compared to linear lists is that the last node always points back to the first node /
head of the list, thus the list is said to be circular or circularly linked. The following example demonstrates the
operations that can be performed on any circular singly linked list.

```typescript
import {Circular} from 'singlie';

const circular = new Circular<string>();

// Append a node holding the value `E`
circular.append('E');
circular.head; // => Node { value: 'E', next: [Circular] }
circular.last; // => Node { value: 'E', next: [Circular] }
circular.get(0); // => E

// Return the node corresponding to the index
circular.node(0); // => Node { value: 'E', next: [Circular] }
circular.node(0).value; // => E
circular.node(0).next.value; // => E
circular.node(0).next.next.value; // => E

// Append multiple nodes at once
circular.append('F', 'G');
circular.length; // => 3
circular.node(0).next.value; // => F
circular.node(0).next.next.value; // => G
circular.node(0).next.next.next.value; // => E
circular.toArray(); // => [ 'E', 'F', 'G' ]

// Prepend multiple nodes at once
circular.prepend('B', 'A');
circular.join(' '); // => A B E F G

// Insert multiple nodes to the given index
circular.insert({value: ['D', 'C', 'X'], index: 2});
circular.join(' '); // => A B X C D E F G

// Remove the node corresponding to the index
circular.remove(2);
circular.join(' '); // => A B C D E F G

// Update the value of the node corresponding to the index
circular.node(circular.length - 1).value = '!';
circular.join(' '); // => A B C D E F !
circular.set({value: 'G', index: circular.length - 1});
circular.join(' '); // => A B C D E F G

// Iterate over the list
const array: string[] = [];
circular.forEach(x => array.push(x));
console.log(array);
// => [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]

// Chain multiple methods
circular.reverse().map(x => `[${x}]`).join('->');
// => [G]->[F]->[E]->[D]->[C]->[B]->[A]

// Clear the list
circular.clear(); // => Circular { head: null, length: 0 }
```

## API

The following documentation holds for both circular and linear lists. The described `list` instance is used to depict the
same methods that are applicable to both a linear and a circular linked list, without overlooking their above-described
differences and unique qualities.

#### list.`append(value[, value])`

- Return Type: `Linked List`

Appends one of more nodes to the list.

##### **`value`**

- Type: `any`

Can be one or more comma-delimited values. Each value corresponds to a single node.

```typescript
list.append('A', 'B', 'C', 'D');
// => { value: 'A', next: { value: 'B', next: [List] } }
```

#### list.`prepend(value[, value])`

- Return Type: `Linked List`

Prepends one of more nodes to the list.

##### **`value`**

- Type: `any`

Can be one or more comma-delimited values. Each value corresponds to a single node.

```typescript
list.append('C', 'D');
// => { value: 'C', next: [List] }
list.prepend('B', 'A');
// => { value: 'A', next: { value: 'B', next: { value: 'C', next: [List] } } }
```

#### list.`head`

- Return Type: `Node | null`

Returns the first node / head on the list.

```typescript
list.append('A', 'B');
list.head;
// => Node { value: 'A', next: [Node] }
```

#### list.`last`

- Return Type: `Node | null`

Returns the last node on the list.

```typescript
list.append('A', 'B');
list.last;
// => Node { value: 'B', next: [Node] }
```

#### list.`length`

- Return Type: `Integer`

Returns the length of the list.

```typescript
list.append('A', 'B');
list.length;
// => 2
```

#### list.`isEmpty()`

- Return Type: `Boolean`

Checks whether the list is empty.

```typescript
list.append('A', 'B');
list.isEmpty();
// => false
```

#### list.`insert({value[, value], index})`

- Return Type: `Linked List`

Inserts one or more nodes to the given index.

##### **`value`**

- Type: `any`

Can be one or more comma-delimited values. Each value corresponds to a single node.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```typescript
list.append('A', 'B', 'E');
list.insert({value: ['C', 'D'], index: 1});
// => { value: 'A', next: { value: 'D', next: { value: 'C', next: { value: 'B', next: [List] } } } }
```

#### list.`node(index)`

- Return Type: `Node`

Return the node corresponding to the given index.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```typescript
list.append('A', 'B', 'C', 'D');
const node = list.node(0);
// => { value: 'A', next: { value: 'B', next: [List] } }
node.value;
// => A
node.next;
// => { value: 'B', next: [List] }
```

#### list.`get(index)`

- Return Type: `any`

Return the value of the node corresponding to the given index.

##### **`index`**

- Type: `Integer`

Can be an integer corresponding to a list index.

```typescript
list.append('A', 'B');

list.get(0);
// => A
list.get(0);
// => B
```

#### list.`remove(index)`

- Return Type: `Linked List`

Removes from the list the node located to the given index.

##### **`index`**

- Type: `Integer`
- Default: `list.length - 1`

Can be an integer corresponding to a list index.

If not provided, the last node of the list will be removed.

```typescript
list.append('A', 'B', 'C', 'D');
// => { value: 'A', next: [List] }
list.remove(0);
// => { value: 'B', next: [List] }
list.remove(0);
// => { value: 'C', next: [List] }
```

#### list.`toArray()`

- Return Type: `Array`

Converts the list into an array.

```typescript
list.append('A', 'B', 'C');
// => { value: 'A', next: { value: 'B', next: [List] } }
const array = list.toArray();
// => [ 'A', 'B', 'C' ]
```

#### list.`clear()`

- Return Type: `Linked List`

Removes all nodes from the list.

```typescript
list.append('A', 'B', 'C');
// => { value: 'A', next: { value: 'B', next: [List] } }
list.clear();
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

```typescript
list.append('A', 'B', 'C');
// => { value: 'A', next: { value: 'B', next: [List] } }
list.join();
// => 'A,B,C'
list.join('');
// => 'ABC'
list.join(' ');
// => 'A B C'
```

#### list.`forEach(function)`

- Return Type: `Linked List`

Executes a provided function once for each node value.

##### **`function`**

- Type: `Function`

Function to execute for each node value.

```typescript
const array = [];
list.append('A', 'B', 'C');
// => { value: 'A', next: { value: 'B', next: [List] } }
list.forEach(x => array.push(x));
console.log(array);
// => [ 'A', 'B', 'C' ];
```

#### list.`map(function)`

- Return Type: `Linked List`

Executes a provided function once for each node value.

##### **`function`**

- Type: `Function`

Function that produces a new node value for the new list.

```typescript
list.append('A', 'B', 'C');
// => { value: 'A', next: { value: 'B', next: [List] } }
const mapped = list.map(x => `[${x}]`);
array.join(' ');
// => '[A] [B] [C]'
```

#### list.`filter(function)`

- Return Type: `Linked List`

Creates a new liked list with all elements that pass the test implemented by the provided function.

##### **`function`**

- Type: `Function`

Function is a predicate, to test each element of the list. Return true to keep the element, false otherwise.

```typescript
list.append(1, 2, 3, 4, 5, 6);
// => { value: 1, next: { value: 2, next: [List] } }
const filtered = list.filter(x => x % 2 > 0);
filtered.toArray();
// => [ 1, 3, 5 ]
```

#### list.`reduce(function, initialValue)`

- Return Type: `Any`

Executes a reducer function on each member of the list resulting in a single output value.

##### **`function`**

- Type: `Function`

The reducer function takes two arguments: accumulator and current value. The reducer function's returned value is assigned
to the accumulator, whose value is remembered across each iteration throughout the list and ultimately becomes the
final, single resulting value.

```typescript
list.append(20, 50, 35, 41, 5, 67);
// => { value: 20, next: { value: 50, next: [List] } }
const reducer: Reducer<number[], number> = (acc, x) => acc + x;
list.reduce((acc, x) => acc > x ? acc : x, -Infinity);
// => 67
```

#### list.`includes(value)`

- Return Type: `Boolean`

The method determines whether a list, circular or linear, includes a certain value among its nodes, returning `true` or
`false` as appropriate.

##### **`value`**

- Type: `Any`

The value to search for.

```typescript
list.append(20, 50, 35, 41, 5, 67);
// => { value: 20, next: { value: 50, next: [List] } }
list.includes();
// => false
list.includes(0);
// => false
list.includes(50);
// => true
```

#### list.`indexOf(value)`

- Return Type: `Number`

The method returns the first index at which a given element can be found in the circular/linear linked list, or -1 if it
is not present.

##### **`value`**

- Type: `Any`

Element to locate in the array.

```typescript
list.append(20, 50, 35, 41, 5, 67);
// => { value: 20, next: { value: 50, next: [List] } }
list.indexOf();
// => -1
list.indexOf(0);
// => -1
list.indexOf(41);
// => 3
```

#### list.`toString()`

- Return Type: `String`

Returns a string representing the specified list and its elements.

```typescript
list.append(20, 50, 35, 41, 5, 67);
// => '20,50,35,41,5,67'
```

#### linear.`toCircular()`

- Return Type: `Circular Linked List`

Returns a new circular linked list containing all elements of the original linear linked list.

```typescript
import {Linear} from 'singlie';

const list = new Linear();

list.toCircular().isLinear();
// => false
```

#### circular.`toLinear()`

- Return Type: `Linear Linked List`

Returns a new linear linked list containing all elements of the original circular linked list.

```typescript
import {Circular} from 'singlie';

const list = new Circular();

list.toLinear().isLinear();
// => true
```

Also available, along with the `Circular` and `Linear` exposed classes, is the `Node` class, mainly useful for testing
purposes, since it can be utilized to compare nodes residing in linear & circular linked lists. The class has a unary
constructor method, with a `'value'` parameter, corresponding to the data stored in the created instance.

Additionally, each `Node` instance has the following two public properties:

#### node.`value`

- Return Type: `any`

The value that the node contains.

```typescript
import {Node} from 'singlie';

const node = new Node('A');
// => { value: 'A', next: null }

node.value;
//=> 'A'

node.value = 'B' // Update the `value` attribute to 'B'
// => { value: 'B', next: null }
```

#### node.`next`

- Return Type: `Node | null`

The next node in line, that the targeted node instance points to.

```typescript
const {Node} = require('singlie');

const node1 = new Node('A');
// => { value: 'A', next: null }

node1.next
//=> null

const node2 = new Node('B');

node1.next = node2; // `node1` now points to `node2`
//=> { value: 'A', next: { value: 'B', next: null } }
```

## Development

For more info on how to contribute to the project, please read
the [contributing guidelines](https://github.com/klaudiosinani/singlie/blob/master/contributing.md).

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd singlie`
- Install the project dependencies: `npm install`
- Build the TypeScript source code: `npm run build`
- Run the tests: `npm test`

## Related

- [avlbinstree](https://github.com/klaudiosinani/avlbinstree) - AVL self-balancing binary search trees
- [binoheap](https://github.com/klaudiosinani/binoheap) - Binomial heaps
- [binstree](https://github.com/klaudiosinani/binstree) - Binary search trees
- [doublie](https://github.com/klaudiosinani/doublie) - Doubly circular & linear linked lists
- [dsforest](https://github.com/klaudiosinani/dsforest) - Disjoint-set forests
- [kiu](https://github.com/klaudiosinani/kiu) - FIFO Queues
- [mheap](https://github.com/klaudiosinani/mheap) - Binary min and max heaps
- [prioqueue](https://github.com/klaudiosinani/prioqueue) - Priority queues
- [shtack](https://github.com/klaudiosinani/shtack) - LIFO Stacks

## Team

- Klaudio Sinani [(@klaudiosinani)](https://github.com/klaudiosinani)

## License

[MIT](https://github.com/klaudiosinani/singlie/blob/master/license.md)
