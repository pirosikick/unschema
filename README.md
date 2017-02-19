[![npm version](https://badge.fury.io/js/unschema.svg)](http://badge.fury.io/js/unschema)
[![david](https://david-dm.org/pirosikick/unschema.svg)](https://david-dm.org/pirosikick/unschema)
[![Build Status](https://travis-ci.org/pirosikick/unschema.svg)](https://travis-ci.org/pirosikick/unschema)

unschema
========

Generate JSON from JSON Schema

## Usage

```js
const unschema = require('unschema');
console.log(unschema({ type: 'string' })); // 'some string'
```

## License

[MIT](http://pirosikick.mit-license.org/)
