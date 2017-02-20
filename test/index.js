const test = require('ava');
const unschema = require('../src');
const schema = require('./schema.json');

test(t => {
  t.deepEqual(unschema(schema), {
    id: '01234567-0123-0123-0123-0123456789ab',
    name: 'ABCDEFGHIJ',
    is_admin: true,
    age: 18,
    sex: 'male',
    email: 'example@example.com',
    homepage: 'http://example.com',
    twitter: 'https://twitter.com/pirosikick',
    created_at: '2017-01-01T00:00:00+09:00',
    friends: ['01234567-0123-0123-0123-0123456789ab'],
  });
});

test('string', t => {
  const actual = unschema({
    type: 'object',
    properties: {
      len10: { type: 'string' },
      len3: { type: 'string', minLength: 3 },
      len30: { type: 'string', maxLength: 30 },
    },
  });
  t.deepEqual(actual, {
    len10: 'ABCDEFGHIJ',
    len3: 'ABC',
    len30: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCD',
  });
});

test('number', t => {
  const actual = unschema({
    type: 'object',
    properties: {
      zero: { type: 'number' },
      max: { type: 'number', maximum: 100 },
      min: { type: 'number', minimum: 10 },
      both: { type: 'number', minimum: 10, maximum: 100 },
      exMin: { type: 'number', minimum: 10, exclusiveMinimum: true },
      exMax: { type: 'number', maximum: 10, exclusiveMaximum: true },
    },
  });
  t.deepEqual(actual, {
    zero: 0,
    max: 100,
    min: 10,
    both: 10,
    exMin: 11,
    exMax: 9,
  });
});

test('null', t => {
  t.is(unschema({}), null);
});
