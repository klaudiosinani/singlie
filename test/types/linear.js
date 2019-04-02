"use strict";
exports.__esModule = true;
var _1 = require("./../../.");
var linear = new _1.Linear();
// Append a node holding the value `E`
console.log(linear.append('E'));
console.log(linear.head); // => E
console.log(linear.last); // => E
console.log(linear.get(0)); // => E
// Return the node corresponding to the index
console.log(linear.node(0)); // => Node { value: 'E', next: null }
console.log(linear.node(0).value); // => E
console.log(linear.node(0).next); // => null
// Append multiple nodes at once
console.log(linear.append('F', 'G'));
console.log(linear.length); // => 3
console.log(linear.node(0).next.value); // => F
console.log(linear.node(0).next.next.value); // => G
console.log(linear.toArray()); // => [ 'E', 'F', 'G' ]
// Prepend multiple nodes at once
console.log(linear.prepend('B', 'A'));
console.log(linear.join(' ')); // => A B E F G
// Insert multiple nodes to the given index
console.log(linear.insert({ value: ['D', 'C', 'X'], index: 2 }));
console.log(linear.join(' ')); // => A B X C D E F G
// Remove the node corresponding to the index
console.log(linear.remove(2));
console.log(linear.join(' ')); // => A B C D E F G
// Update the value of the node corresponding to the index
console.log(linear.node(linear.length - 1).value = '!');
console.log(linear.join(' ')); // => A B C D E F !
console.log(linear.set({ value: 'G', index: linear.length - 1 }));
console.log(linear.join(' ')); // => A B C D E F G
// Iterate over the list
var array = [];
console.log(linear.forEach(function (x) { return array.push(x); }));
// => [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ]
// Chain multiple methods
console.log(linear
    .reverse()
    .map(function (x) { return "[" + x + "]"; })
    .join('->'));
// => [G]->[F]->[E]->[D]->[C]->[B]->[A]
// Clear the list
console.log(linear.clear()); // => Linear { head: null, length: 0 }
