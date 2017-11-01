[![Build Status](https://travis-ci.org/webdeveloperpr/draft-js-raw-content-state.svg?branch=master)](https://travis-ci.org/webdeveloperpr/draft-js-raw-content-state)
# draft-js-raw-content-state

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

```sh
  npm i draft-js-raw-content-state --save
```

## Usage

```javascript
import Raw from 'draft-js-raw-content-state';
const rawContentState = new Raw();
```

### API

- .addBlock(text, type, data) 
Adds a new block.

- setKey(key)
Adds a blockKey

- toRawContentState()
Exports content as a rawContentState

- isBackward()
Sets isBackward SelectionState property to true

- .addEntity(entity, offset, length)
Creates a new entity.

- .addInlineStyle(style, offset, length)
Creates a new inline style.

- .anchorKey(offset)
- .setAnchorKey(offset)
Sets the anchorKey, you can also provide an offset.

- .focusKey(offset)
- .setFocusKey(offset)
Sets the focusKey, you can also provide an offset.

- .collapse(offset)
Sets focus and anchorKey, you may provide an offset.

- .setData(data)
Sets the data on the block. 

- .log()
console.logs the rawContentState.

- .toContentState()
Converts the raw contentState into a ContentState type object.

- .toEditorState(decorator)
Converts the raw contentState into an EditorState type object.

### Example

To convert to a raw contentState 

```javascript
const newEntity = {
  type: 'CUSTOM_COLOR',
  mutability: 'MUTABLE',
  data: { color: 'red' }
};

const contentState = new Raw()
  // first block
  .addBlock('block 1')
  setKey('edr45')
  addEntity(newEntity, 2, 4) 
  
  // second block
  .addBlock('block 2')
  .addInlineStyle('COLOR_RED', 0, 6)
  .anchorKey(2)
  .focusKey(4)
  .toEditorState(); 
```

Generates
```json
 {
  "entityMap": {
    "0": {
      "data": {
        "color": "red"
      },
      "type": "CUSTOM_COLOR",
      "mutability": "MUTABLE"
    }
  },
  "blocks": [
    {
      "key": "edr45",
      "text": "block 1",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "key": 0,
          "offset": 2,
          "length": 4
        }
      ],
      "data": {}
    },
    {
      "key": "b6ar6",
      "text": "block 2",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [
        {
          "offset": 0,
          "length": 6,
          "style": "COLOR_RED"
        }
      ],
      "entityRanges": [],
      "data": {}
    }
  ]
}
```

You an also generate EditorState and ContentStates typed objects.

## Support

Please [open an issue](https://github.com/webdeveloperpr/draft-js-raw-content-state/issues) for support.

## Contributing

Feel free to fork this project, make changes and submit pull requests.
