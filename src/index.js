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
        return 'some string';
    }
  }

  if (is(schema, 'integer') || is(schema, 'number')) {
    if (schema.minimum) {
      return schema.minimum;
    } else if (schema.maximum) {
      return schema.maximum;
    }
    return 0;
  }

  return null;
}

function unschema(schema: Schema): any {
  return toExample(schema, schema);
}

module.exports = unschema;
