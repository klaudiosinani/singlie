'use strict';
const Circular = require('./src/circular');
const Linear = require('./src/linear');
const Node = require('./src/node');

module.exports = Object.assign({}, {Circular}, {Linear}, {Node});
