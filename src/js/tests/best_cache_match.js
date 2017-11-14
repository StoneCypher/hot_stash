
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Reads correctly', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'best_cache_match', 'foo'));

  // takes the value 1
  hot_stash.set_cache('./build/testrun/', 'best_cache_match', 'foo', 1);
  t.is(true, hot_stash.has_cache('./build/testrun/', 'best_cache_match', 'foo'));
  t.is(1,    hot_stash.get_cache('./build/testrun/', 'best_cache_match', 'foo').value);

  const expectHead = './build/testrun/best_cache_match',
        expectMid  = 'foo',
        expectTail = 'hot_stash',
        expects    = hot_stash.best_cache_match_for('./build/testrun', 'best_cache_match', 'foo').split('___'),
        expectsNum = expects[3].split('.'); // get rid of the timestamp

  t.is(expectHead, expects[0]);
  t.is(expectMid,  expects[1]);
  t.is(expectTail, expectsNum[1]);

});





test('Throw on no match', t => {
  t.throws(() => { hot_stash.best_cache_match_for('./build/testrun', 'best_cache_match', 'whargarbl'); });
});





test('Throws on illegal write', t => {

  // nothing there initially
  t.is(false, hot_stash.has_cache('./build/testrun/', 'best_cache_match', 'no_match'));

  t.throws(() => { throw new Error('test works'); });

});
