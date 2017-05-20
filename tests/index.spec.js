import { expect } from 'chai';
import { ContentState, EditorState } from 'draft-js';
import Raw from '../build/index'

const h1 = 'header-one';
const h2 = 'header-two';
const span = 'unstyled';

describe('should create a contentState', () => {
  const contentState = new Raw();
  it('should have a selection property', () => {
    expect(contentState.selection).to.deep.equal({});
  });

  it('should have a blocks property', () => {
    expect(contentState.blocks).to.deep.equal([]);
  });

  it('should have an entityMap property', () => {
    expect(contentState.entityMap).to.deep.equal({});
  });
});

describe('addBlock', () => {
  it('should add a block with block 1 text', () => {
    const contentState = new Raw().addBlock('block 1');
    expect(contentState.blocks[0].text).to.equal('block 1');
  });
  it('should add a block with block 1 text and h1 type', () => {
    const contentState = new Raw().addBlock('block 1', h1);
    expect(contentState.blocks[0].type).to.equal(h1);
  });
  it('should add a block with block 1 text and unstyled type', () => {
    const contentState = new Raw().addBlock('block 1');
    expect(contentState.blocks[0].type).to.equal(span);
  });
  it('should add a block with block 1 text and h2 type and data', () => {
    const data = { alignment: 'left' };
    const contentState = new Raw().addBlock('block 1', h2, data);
    expect(contentState.blocks[0].type).to.equal(h2);
    expect(contentState.blocks[0].text).to.equal('block 1');
    expect(contentState.blocks[0].data).to.deep.equal(data);
  });
  it('should add multiple blocks', () => {
    const contentState = new Raw()
      .addBlock('block 1')
      .addBlock('block 2');
    expect(contentState.blocks[1].text).to.equal('block 2');
  });
});

describe('setData', () => {
  it('should set data on the content block', () => {
    const data = { alignment: 'left' };
    const contentState = new Raw()
      .addBlock('block 1')
      .setData(data);
    expect(contentState.blocks[0].data).to.deep.equal(data);
  });
});

describe('setDepth', () => {
  it('should set data on the content block', () => {
    const contentState = new Raw()
      .addBlock('block 1')
      .setDepth(1);
    expect(contentState.blocks[0].depth).to.equal(1);
  });
});

describe('toContentState', () => {
  it('should create a ContentState typed object', () => {
    const contentState = new Raw()
      .addBlock('block 1')
      .toContentState();
    expect(contentState instanceof ContentState).to.equal(true);
  });
  it('should create a ContentState typed object with text of block 1', () => {
    const contentState = new Raw()
      .addBlock('block 1')
      .toContentState();
    const text = contentState.getFirstBlock().getText();
    expect(text).to.equal('block 1');
  });
});

describe('toEditorState', () => {
  it('should create a ContentState typed object', () => {
    const editorState = new Raw()
      .addBlock('block 1')
      .toEditorState();
    expect(editorState instanceof EditorState).to.equal(true);
  });
  it('should create a ContentState typed object with text of block 1', () => {
    const editorState = new Raw()
      .addBlock('block 1')
      .toEditorState();
    const text = editorState
      .getCurrentContent()
      .getFirstBlock()
      .getText();
    expect(text).to.equal('block 1');
  });
});

describe('collapse', () => {
  it('should collapse the selection on specified block', () => {
    const contentState = new Raw()
      .addBlock('block 1')
      .addBlock('block 2')
      .addBlock('block 3')
      .collapse(3);
    const block3Key = contentState.blocks[2].key;
    expect(contentState.selection).to.deep.equal({
      anchorOffset: 3,
      focusOffset: 3,
      anchorKey: block3Key,
      focusKey: block3Key,
    });
  });
});

describe('anchorKey and focusKey', () => {
  it('should change the anchor and focus Keys', () => {
    const contentState = new Raw()
      .addBlock('block 1').anchorKey(2)
      .addBlock('block 2')
      .addBlock('block 3').focusKey(7);
    const block1Key = contentState.blocks[0].key;
    const block3Key = contentState.blocks[2].key;
    expect(contentState.selection).to.deep.equal({
      anchorOffset: 2,
      focusOffset: 7,
      anchorKey: block1Key,
      focusKey: block3Key,
    });
  });
});

describe('addEntity', () => {
  it('should add an entity', () => {
    const newEntity = {
      type: 'CUSTOM_COLOR',
      mutability: 'MUTABLE',
      data: { color: 'red' }
    };

    const contentState = new Raw()
      .addBlock('block 1').addEntity(newEntity)
      .addBlock('block 2')
      .addBlock('block 3');
    expect(contentState.entityMap).to.deep.equal({ 0: { ...newEntity, } });
    expect(contentState.blocks[0].entityRanges).to.deep.equal([{
      offset: 0,
      length: 7,
      key: 0,
    }])
  });
  it('should create default entity if none is passed', () => {
    const contentState = new Raw()
      .addBlock('block 1').addEntity({})
      .addBlock('block 2')
      .addBlock('block 3');
    expect(contentState.entityMap).to.deep.equal({
      0: {
        type: 'DEFAULT_TYPE',
        mutability: 'MUTABLE',
        data: {},
      }
    });
    expect(contentState.blocks[0].entityRanges).to.deep.equal([{
      offset: 0,
      length: 7,
      key: 0,
    }]);
  });
  it('should create default entity if with defined offset, and length', () => {
    const contentState = new Raw()
      .addBlock('block 1').addEntity({}, 2, 4)
      .addBlock('block 2')
      .addBlock('block 3');
    expect(contentState.entityMap).to.deep.equal({
      0: {
        type: 'DEFAULT_TYPE',
        mutability: 'MUTABLE',
        data: {},
      }
    });
    expect(contentState.blocks[0].entityRanges).to.deep.equal([{
      offset: 2,
      length: 4,
      key: 0,
    }]);
  });
});



