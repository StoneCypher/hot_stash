
/* eslint-disable max-len */

import { test } from 'ava-spec';

const hot_stash = require('../../../build/hot_stash.js');





test('Makes fnames correctly', t => {

  t.is('./build/testrun/make_fname_test', hot_stash.make_fname('./build/testrun/', 'make_fname_test', 'foo').split('___')[0]);

});





test('Makes fnames correctly without item names', t => {

  t.is('./build/testrun/make_fname_test', hot_stash.make_fname('./build/testrun/', 'make_fname_test', '').split('___')[0]);

});





test('Throws without a path', t => {

  t.throws(() => { hot_stash.make_fname(undefined, 'make_fname_test', '').split('___')[0]; });

});





test('Throws with a null path', t => {

  t.throws(() => { hot_stash.make_fname(null, 'make_fname_test', '').split('___')[0]; });

});





test('Throws with an empty path', t => {

  t.throws(() => { hot_stash.make_fname('', 'make_fname_test', '').split('___')[0]; });

});
