'use strict';
const Circular = require('./circular');
const Linear = require('./linear');

module.exports = Object.assign(new Linear(), {Linear}, {Circular});
