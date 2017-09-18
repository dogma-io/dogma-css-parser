# dogma-css-parser

CSS parser and compiler.

```bash
npm install dogma-css-parser
```

## Usage

### Parser

To parse a CSS string into an AST you can do the following:

```js
import {parse} from 'dogma-css-parser'

const css = '.foo {color: red;}'
const ast = parse(css)
```

The above example will set the constant **ast** to the following AST:

```json

```

### Compiler
