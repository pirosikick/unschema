const test = require('ava');
const unschema = require('../src');
const schema = require('./schema.json');

test(t => {
  t.deepEqual(unschema(schema), {
    id: '01234567-0123-0123-0123-0123456789ab',
    name: 'some string',
    age: 18,
    sex: 'male',
    email: 'example@example.com',
    homepage: 'http://example.com',
    twitter: 'https://twitter.com/pirosikick',
    created_at: '2017-01-01T00:00:00+09:00',
  });
});
