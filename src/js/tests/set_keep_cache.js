
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Keeps cache correctly', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'set_keep_cache_test', 'foo'));

  // takes the value 1
  hot_stash.set_keep_cache('./build/testrun/', 'set_keep_cache_test', 'foo', 1);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'set_keep_cache_test', 'foo'));
  t.is(1,    hot_stash.get_cache('./build/testrun/', 'set_keep_cache_test', 'foo').value);

  // cache_contents_for sees one opportunity
  t.is(1, hot_stash.cache_contents_for('./build/testrun/', 'set_keep_cache_test', 'foo').length);

  // overrides with the value 2
  hot_stash.set_keep_cache('./build/testrun/', 'set_keep_cache_test', 'foo', 2);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'set_keep_cache_test', 'foo'));
  t.is(2,    hot_stash.get_cache('./build/testrun/', 'set_keep_cache_test', 'foo').value);

  // cache_contents_for sees two opportunities
  t.is(2, hot_stash.cache_contents_for('./build/testrun/', 'set_keep_cache_test', 'foo').length);

  // switch to set_cache
  hot_stash.set_cache('./build/testrun/', 'set_keep_cache_test', 'foo', 3);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'set_keep_cache_test', 'foo'));
  t.is(3,    hot_stash.get_cache('./build/testrun/', 'set_keep_cache_test', 'foo').value);

  // back down to one opportunity
  t.is(1, hot_stash.cache_contents_for('./build/testrun/', 'set_keep_cache_test', 'foo').length);

});





test('Throws on illegal value write', t => {

  let a = {}, b = { loop: a };
  a.loop = b;

  // can't json serialize a circular structure
  t.throws(() => { hot_stash.set_keep_cache('./build/testrun/', 'set_keep_cache_illegal_test', 'illegal', a); });

});





test('Throws on illegal location write', t => {

  // can't write to a file named ///\\\
  t.throws(() => { hot_stash.set_keep_cache('./build/testrun/', 'set_keep_cache_illegal_test', '///\\\\\\', 1); });

});
