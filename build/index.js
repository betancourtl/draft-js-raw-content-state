'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RawContentState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _draftJs = require('draft-js');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Helper library for manipulating raw contentStates, the intention is to
 * reduce the boilerplate code being generated using the native draft-js API.
 * This makes testing way easier and more enjoyable.
 */

var RawContentState = exports.RawContentState = function RawContentState(rawContentState) {
  this.selection = {};
  this.entityMap = {};
  this.blocks = [];
  if (rawContentState) {
    this.blocks = rawContentState.blocks;
    this.entityMap = rawContentState.entityMap;
  }
};

RawContentState.prototype.addBlock = function () {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unstyled';
  var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var block = {
    key: (0, _draftJs.genKey)(),
    text: text,
    type: type,
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: data
  };

  this.blocks.push(block);

  return this;
};

RawContentState.prototype.addEntity = function () {
  var entityData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var entityOffset = arguments[1];
  var entityLength = arguments[2];

  var data = entityData.data || {};
  var type = entityData.type || 'DEFAULT_TYPE';
  var mutability = entityData.motability || 'MUTABLE';

  if (entityOffset !== 0 && !entityOffset || !entityLength) {
    console.log('Entity will be applied to the whole block because\n       no entityOffset or entityLength where provided.');
  }
  var blockLength = this.blocks.length;
  var entityKey = Object.keys(this.entityMap).length;

  // new entity to be added to the entityMap
  var newEntity = _defineProperty({}, entityKey, { data: data, type: type, mutability: mutability });

  // new entity to be added to the block
  var entityRange = {
    key: entityKey,
    offset: entityOffset || 0,
    length: entityLength || this.blocks[blockLength - 1].text.length
  };

  this.entityMap = _extends({}, this.entityMap, newEntity);
  this.blocks[blockLength - 1].entityRanges.push(entityRange);

  return this;
};

RawContentState.prototype.anchorKey = function () {
  var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var length = this.blocks.length;
  if (length) {
    this.selection.anchorKey = this.blocks[length - 1].key;
    this.selection.anchorOffset = offset;
  }

  return this;
};

RawContentState.prototype.focusKey = function () {
  var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var length = this.blocks.length;
  if (length) {
    this.selection.focusKey = this.blocks[length - 1].key;
    this.selection.focusOffset = offset;
  }

  return this;
};

RawContentState.prototype.collapse = function () {
  var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var length = this.blocks.length;
  if (length) {
    this.selection = {
      focusKey: this.blocks[length - 1].key,
      anchorKey: this.blocks[length - 1].key,
      focusOffset: offset,
      anchorOffset: offset
    };
  }

  return this;
};

RawContentState.prototype.setData = function (data) {
  var length = this.blocks.length;
  if (length) {
    this.blocks[length - 1].data = data;
  }

  return this;
};

RawContentState.prototype.setDepth = function (depth) {
  var length = this.blocks.length;
  if (length) {
    this.blocks[length - 1].depth = depth;
  }

  return this;
};

// TODO: [] Test
RawContentState.prototype.addInlineStyle = function (style) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var blockLength = this.raw.blocks.length;
  var inlineRange = {
    offset: offset,
    length: length,
    style: style
  };
  this.raw.blocks[blockLength - 1].inlineStyleRanges.push(inlineRange);

  return this;
};

// TODO: [] Test
RawContentState.prototype.isBackward = function () {
  var isBackward = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var length = this.raw.blocks.length;

  if (length) {
    this.selection.isBackward = isBackward;
  }

  return this;
};

// TODO: [] Test
RawContentState.prototype.setKey = function (key) {
  var blockLength = this.raw.blocks.length;
  this.raw.blocks[blockLength - 1].key = key;

  return this;
};

// TODO: [] Test
RawContentState.prototype.toRawContentState = function () {
  return this.raw;
};

RawContentState.prototype.log = function () {
  console.log(JSON.stringify(this.selection, null, 2));
  console.log(JSON.stringify(this, null, 2));

  return this;
};

RawContentState.prototype.toContentState = function () {
  return (0, _draftJs.convertFromRaw)({ entityMap: this.entityMap, blocks: this.blocks });
};

RawContentState.prototype.toEditorState = function (decorator) {
  var editorState = _draftJs.EditorState.createWithContent(this.toContentState({ entityMap: this.entityMap, blocks: this.blocks }), decorator);
  var selection = editorState.getSelection().merge(this.selection);

  return _draftJs.EditorState.acceptSelection(editorState, selection);
};

exports.default = RawContentState;