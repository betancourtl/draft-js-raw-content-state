"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var findStyleRanges = exports.findStyleRanges = function findStyleRanges(block, style) {
  var range = [];
  block.findStyleRanges(function (char) {
    return char.hasStyle(style);
  }, function (start, end) {
    return range.push({ start: start, end: end });
  });

  return range;
};