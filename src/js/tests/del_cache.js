
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Deletes correctly', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'delete_test', 'foo'));

  // takes the value 1
  hot_stash.set_cache('./build/testrun/', 'delete_test', 'foo', 1);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'delete_test', 'foo'));

  // and bamf
  hot_stash.del_cache('./build/testrun/', 'delete_test', 'foo');
  t.is(false, hot_stash.has_cache('./build/testrun/', 'delete_test', 'foo'));

});
