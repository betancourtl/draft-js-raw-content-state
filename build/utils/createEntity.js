'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEntity = undefined;

var _types = require('./types');

var _mutability = require('./mutability');

var createEntity = exports.createEntity = function createEntity() {
  var entity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    data: entity.data || {},
    type: entity.type || _types.DEFAULT_TYPE,
    mutability: [_mutability.MUTABLE, _mutability.IMMUTABLE, _mutability.SEGMENTED].find(function (x) {
      return x === entity.mutability;
    }) || _mutability.MUTABLE
  };
};