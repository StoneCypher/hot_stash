
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');

// this is shallow because set_cache is just a wrapper of del_cache and
// set_keep_cache, and most of the things being checked as such are in
// the tests for set_keep_cache





test('Writes correctly', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'set_cache_test', 'foo'));

  // takes the value 1
  hot_stash.set_cache('./build/testrun/', 'set_cache_test', 'foo', 1);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'set_cache_test', 'foo'));

  // overrides with the value 2
  hot_stash.set_cache('./build/testrun/', 'set_cache_test', 'foo', 2);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'set_cache_test', 'foo'));

});
