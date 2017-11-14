
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Extancy chain works correctly', t => {

  let   val         = 0;
  const incrementor = () => val++;

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));

  // generates a missing value
  hot_stash.get_or_gen_set('./build/testrun/', 'get_or_gen_set_test', 'foo', incrementor);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));
  t.is(0,    hot_stash.get_cache('./build/testrun/', 'get_or_gen_set_test', 'foo').value);

  // fetches an existing value
  hot_stash.get_or_gen_set('./build/testrun/', 'get_or_gen_set_test', 'foo', incrementor);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));
  t.is(0,    hot_stash.get_cache('./build/testrun/', 'get_or_gen_set_test', 'foo').value);

  // nukes
  hot_stash.del_cache('./build/testrun/', 'get_or_gen_set_test', 'foo');
  t.is(false, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));

  // generates a different missing value
  hot_stash.get_or_gen_set('./build/testrun/', 'get_or_gen_set_test', 'foo', incrementor);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));
  t.is(1,    hot_stash.get_cache('./build/testrun/', 'get_or_gen_set_test', 'foo').value);

  // fetches an updated existing value
  hot_stash.get_or_gen_set('./build/testrun/', 'get_or_gen_set_test', 'foo', incrementor);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));
  t.is(1,    hot_stash.get_cache('./build/testrun/', 'get_or_gen_set_test', 'foo').value);

  // nukes
  hot_stash.del_cache('./build/testrun/', 'get_or_gen_set_test', 'foo');
  t.is(false, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));

  // generates another different missing value
  hot_stash.get_or_gen_set('./build/testrun/', 'get_or_gen_set_test', 'foo', incrementor);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'get_or_gen_set_test', 'foo'));
  t.is(2,    hot_stash.get_cache('./build/testrun/', 'get_or_gen_set_test', 'foo').value);

});
