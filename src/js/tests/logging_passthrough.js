
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Passes through correctly', t => {

  let genIdx = 0,
      gen    = () => genIdx++;

  // back down to one opportunity
  t.is(0, hot_stash.logging_passthrough('./build/testrun/', 'logging_passthrough_test', 'foo', gen).value);
  t.is(1, hot_stash.logging_passthrough('./build/testrun/', 'logging_passthrough_test', 'foo', gen).value);
  t.is(2, hot_stash.logging_passthrough('./build/testrun/', 'logging_passthrough_test', 'foo', gen).value);
  t.is(3, hot_stash.logging_passthrough('./build/testrun/', 'logging_passthrough_test', 'foo', gen).value);
  t.is(4, hot_stash.logging_passthrough('./build/testrun/', 'logging_passthrough_test', 'foo', gen).value);

  t.is(5, hot_stash.cache_contents_for('./build/testrun/', 'logging_passthrough_test', 'foo').length);

});




/*
test('Throws on illegal location write', t => {

  // can't write to a file named ///\\\
  t.throws(() => { hot_stash.set_keep_cache('./build/testrun/', 'logging_passthrough_test', '///\\\\\\', 1); });

});
*/
