
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Reads correctly', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'read_test', 'foo'));

  // takes the value 1
  hot_stash.set_cache('./build/testrun/', 'read_test', 'foo', 1);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'read_test', 'foo'));
  t.is(1,    hot_stash.get_cache('./build/testrun/', 'read_test', 'foo').value);

  // overrides with the value 2
  hot_stash.set_cache('./build/testrun/', 'read_test', 'foo', 2);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'read_test', 'foo'));
  t.is(2,    hot_stash.get_cache('./build/testrun/', 'read_test', 'foo').value);

});
