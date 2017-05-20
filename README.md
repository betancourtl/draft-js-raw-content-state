# draft-js-raw-content-state
# README Boilerplate

A template of README best practices to make your README simple to understand and easy to use. 

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

- .addEntity(entity, offset, length)
Creates a new entity.

- .anchorKey(<offset>)
Sets the anchorKey, you can also provide an offset.

- .focusKey(<offset>)
Sets the focusKey, you can also provide an offset.

- .collapse(<offset>)
Sets focus and anchorKey, you may provide an offset.

- .setData(<data>)
Sets the data on the block. 

- .log()
console.logs the rawContentState.

- .toContentState()
Converts the raw contentState into a ContentState type object.

- .toEditorState()
Converts the raw contentState into an EditorState type object.

### Example

```javascript
const contentState = new Raw()
  .addBlock('block 1').addEntity({}, 2, 4)
  .addBlock('block 3')
  .log()
//.toEditorState(); // to convert to an EditorState 
```
outputs
```javascript
{
  "selection": {},
  "entityMap": {
    "0": {
      "data": {},
      "type": "DEFAULT_TYPE",
      "mutability": "MUTABLE"
    }
  },
  "blocks": [
    {
      "key": "9rnhh",
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
      "key": "6j027",
      "text": "block 3",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
}

```

## Support

Please [open an issue](https://github.com/webdeveloperpr/draft-js-raw-content-state/issues) for support.

## Contributing

Feel free to fork this project, make changes and submit pull requests.
