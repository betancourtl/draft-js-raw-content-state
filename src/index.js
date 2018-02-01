import { EditorState, genKey, convertFromRaw } from 'draft-js';
import { unstyled } from './utils/blockTypes';
import { createEntity } from "./utils/createEntity";

/**
 * Helper library for manipulating raw contentStates, the intention is to
 * reduce the boilerplate code being generated using the native draft-js API.
 * This makes testing way easier and more enjoyable.
 */

export const RawContentState = function (rawContentState) {
  this.selection = {};
  this.entityMap = {};
  this.blocks = [];
  if (rawContentState) {
    this.blocks = rawContentState.blocks;
    this.entityMap = rawContentState.entityMap;
  }
};

// Content Block
RawContentState.prototype.addBlock = function (text = '', type = unstyled, data = {}) {
  const block = () =>({
    key: genKey(),
    text,
    type,
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data,
  });

  this.blocks.push(block());

  return this;
};

RawContentState.prototype.setKey = function (key) {
  const blockLength = this.blocks.length;

  this.blocks[blockLength - 1].key = key;

  return this;
};

RawContentState.prototype.addInlineStyle = function (
  styles,
  offset = 0,
  length
) {
  const blockLength = this.blocks.length;

  const block = this.blocks[blockLength - 1];

  const newRanges = []
    .concat(styles)
    .map(style => ({
        offset,
        length: length >= 0 ? length : block.text.length,
        style,
      })
    );

  block.inlineStyleRanges = block.inlineStyleRanges.concat(newRanges);
  return this;
};

RawContentState.prototype.addEntity = function (
  entityData,
  entityOffset,
  entityLength
) {

  if ((entityOffset !== 0 && !entityOffset) || !entityLength) {
    console.log(
      `Entity will be applied to the whole block because
       no entityOffset or entityLength where provided.`
    );
  }

  const blockLength = this.blocks.length;

  const entityKey = Object.keys(this.entityMap).length;

  const entity = createEntity({
    data: entityData.data,
    type: entityData.type,
    mutability: entityData.mutability,
  });

  const newEntity = { [entityKey]: entity };

  const entityRange = {
    key: entityKey,
    offset: entityOffset || 0,
    length: entityLength || this.blocks[blockLength - 1].text.length,
  };

  this.entityMap = { ...this.entityMap, ...newEntity };

  this.blocks[blockLength - 1].entityRanges.push(entityRange);

  return this;
};

RawContentState.prototype.setData = function (data) {
  const length = this.blocks.length;

  if (length) {
    this.blocks[length - 1].data = data;
  }

  return this;
};

RawContentState.prototype.setDepth = function (depth) {
  const length = this.blocks.length;

  if (length) {
    this.blocks[length - 1].depth = depth;
  }

  return this;
};

// Selection
RawContentState.prototype.anchorKey = function (offset = 0) {
  const length = this.blocks.length;

  if (length) {
    this.selection.anchorKey = this.blocks[length - 1].key;
    this.selection.anchorOffset = offset;
  }

  return this;
};

RawContentState.prototype.focusKey = function (offset = 0) {
  const length = this.blocks.length;
  if (length) {
    this.selection.focusKey = this.blocks[length - 1].key;
    this.selection.focusOffset = offset;
  }

  return this;
};

RawContentState.prototype.setAnchorKey = RawContentState.prototype.anchorKey;

RawContentState.prototype.setFocusKey = RawContentState.prototype.focusKey;

RawContentState.prototype.collapse = function (offset = 0) {
  const length = this.blocks.length;

  if (length) {
    this.selection = {
      focusKey: this.blocks[length - 1].key,
      anchorKey: this.blocks[length - 1].key,
      focusOffset: offset,
      anchorOffset: offset,
    };
  }

  return this;
};

RawContentState.prototype.isBackward = function (isBackward = true) {
  const length = this.blocks.length;

  if (length) {
    this.selection.isBackward = isBackward;
  }

  return this;
};

// Data conversion
RawContentState.prototype.toRawContentState = function () {
  return {
    entityMap: this.entityMap,
    blocks: this.blocks
  };
};

RawContentState.prototype.toContentState = function () {
  return convertFromRaw({ entityMap: this.entityMap, blocks: this.blocks });
};

RawContentState.prototype.toEditorState = function (decorator) {
  const editorState = EditorState.createWithContent(
    this.toContentState(this.toRawContentState()),
    decorator
  );

  const selection = editorState.getSelection().merge(this.selection);

  return EditorState.acceptSelection(editorState, selection);
};

RawContentState.prototype.log = function () {
  console.log(JSON.stringify(this.selection, null, 2));
  console.log(JSON.stringify(this, null, 2));

  return this;
};

export default RawContentState;
