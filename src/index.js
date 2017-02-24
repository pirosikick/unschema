// @flow
const result = require('lodash.result');

type PrimitiveType =
  | 'null'
  | 'string'
  | 'number'
  | 'integer'
  | 'object'
  | 'array'
  | 'boolean'

type StringFormat =
  | 'uri'
  | 'email'
  | 'date-time'
  | 'uuid'

type ObjectProperties = {
  [id: string]: Schema; // eslint-disable-line no-use-before-define
};

type ArrayItems =
  | Schema // eslint-disable-line no-use-before-define
  | Array<Schema> // eslint-disable-line no-use-before-define

type Schema = {
  type: ?PrimitiveType;
  properties: ?ObjectProperties;
  items: ?ArrayItems;
  minimum: ?number;
  maximum: ?number;
  multipleOf: ?number;
  exclusiveMinimum: ?boolean;
  exclusiveMaximum: ?boolean;
  minLength: ?number;
  maxLength: ?number;
  $ref: ?string;
  example: ?any;
  format: ?StringFormat;
};

function is(schema: Schema, type: PrimitiveType): boolean {
  if (Array.isArray(schema.type)) {
    return schema.type.indexOf(type) !== -1;
  }
  return schema.type === type;
}

function resolvePointer(schema: Schema, rootSchema: Schema): Schema {
  if (typeof schema.$ref === 'string') {
    const matched = schema.$ref.match(/^#\/(.+)/);
    if (matched) {
      const path = matched[1].replace(/\//g, '.');
      return result(rootSchema, path);
    }
  }
  return schema;
}

function toNumber(schema: Schema): number {
  const { minimum, exclusiveMinimum, maximum, exclusiveMaximum } = schema;
  const multipleOf = schema.multipleOf || 1;
  if (minimum) {
    if (exclusiveMinimum || (minimum % multipleOf !== 0)) {
      // min: 9, exclusiveMinimum true, multipleOf: 2 => 10
      // min: 10, exclusiveMinimum true, multipleOf: 2 => 12
      return multipleOf * (Math.floor(minimum / multipleOf) + 1);
    }
    return minimum;
  } else if (maximum) {
    if (exclusiveMaximum || (maximum % multipleOf !== 0)) {
      // max: 9, exclusiveMaximum: true, multipleOf: 2 => 8
      // max: 10, exclusiveMaximum: true, multipleOf: 2 => 8
      return multipleOf * (Math.ceil(maximum / multipleOf) - 1);
    }
    return maximum;
  }
  return 0;
}

function toString(schema: Schema): string {
  let length = 10;
  if (schema.minLength) {
    length = schema.minLength;
  } else if (schema.maxLength) {
    length = schema.maxLength;
  }
  let str = '';
  for (let i = 0; i < length; i += 1) {
    str += String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  }
  return str;
}

function toExample(schema: Schema, rootSchema: Schema): any {
  if (schema.example) {
    return schema.example;
  }

  if (is(schema, 'object')) {
    const properties = schema.properties || {};
    const example = {};
    Object.keys(properties).forEach(field => {
      if (properties[field]) {
        example[field] = toExample(
          resolvePointer(properties[field], rootSchema),
          rootSchema
        );
      }
    });
    return example;
  }

  if (is(schema, 'array') && schema.items) {
    const items = Array.isArray(schema.items) ? schema.items : [schema.items];
    return items.map(item => {
      const subSchema = resolvePointer(item, rootSchema);
      return toExample(subSchema, rootSchema);
    });
  }

  if (Array.isArray(schema.enum)) {
    return schema.enum[0];
  }

  if (is(schema, 'string')) {
    switch (schema.format) {
      case 'uuid':
        return '01234567-0123-0123-0123-0123456789ab';
      case 'email':
        return 'example@example.com';
      case 'uri':
        return 'http://example.com';
      case 'date-time':
        return '2017-01-01T00:00:00+09:00';
      default:
        return toString(schema);
    }
  }

  if (is(schema, 'integer') || is(schema, 'number')) {
    return toNumber(schema);
  }

  if (is(schema, 'boolean')) {
    return true;
  }

  return null;
}

function unschema(schema: Schema, rootSchema: ?Schema): any {
  if (rootSchema) {
    return toExample(schema, rootSchema);
  }
  return toExample(schema, schema);
}

module.exports = unschema;
