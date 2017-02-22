[![npm version](https://badge.fury.io/js/unschema.svg)](http://badge.fury.io/js/unschema)
[![david](https://david-dm.org/pirosikick/unschema.svg)](https://david-dm.org/pirosikick/unschema)
[![Build Status](https://travis-ci.org/pirosikick/unschema.svg)](https://travis-ci.org/pirosikick/unschema)
[![codecov](https://codecov.io/gh/pirosikick/unschema/branch/master/graph/badge.svg)](https://codecov.io/gh/pirosikick/unschema)

unschema
========

Generate JSON from JSON Schema

## Usage

```js
const unschema = require('unschema');
console.log(unschema({ type: 'string' })); // 'ABCDEFGHIJ'
console.log(unschema({ type: 'number' })); // 0
console.log(unschema({ type: 'boolean' })); // true

console.log(unschema({
  type: 'object',
  properties: {
    a: { type: 'string' },
    b: { type: 'number' }
  }
});
// => { a: 'ABCDEFGHIJ', b: 0 }
```

## License

[MIT](http://pirosikick.mit-license.org/)
