"use strict";
// @flow
Object.defineProperty(exports, "__esModule", { value: true });
// Todo:
//
// 1. Convert to TypeScript (sorry, just don't know it yet)
/***
 *
 *  Generic cacher
 *
 *  This is a generic low-quality live disk cacher.  This checks current disk
 *  state, and either returns it or creates a new one, stores it, then returns
 *  that.  This makes no effort to remember previous disk state (yet.)
 *
 *  For the most part, it is expected that people will work with `has_cache/3`,
 *  `get_cache/3`, and `get_or_gen_set/4`
 *
 *  All functions other than `make_cacher/2` start with `path` and `name` in
 *  their arglist.  Path is where the cacher is looking on disk; name is the
 *  name that the cacher is using as an instance name (two instances should not
 *  share a name.)  In the lifetime of a cacher instance, these two values
 *  generally should not change.
 *
 *  `make_cacher` just creates an object with lambdas that partially apply those
 *  two values for you as a convenience.
 *
 *  This cache is not atomic.  It is possible, though not likely, that the
 *  disk state could change under this cacher's feet while it's working.  More
 *  testing is warranted; this thing should be made more durable around those
 *  sorts of situations.
 *
 *  Because of its mechanism of storage, this cacher is currently only able to
 *  store JSON.
 */
var path_1 = require("path");
var glob_1 = require("glob");
var fs_1 = require("fs");
;
;
var build_count = 0; // prevents the same filename from being written because of a nonincremented clock
/***
 *
 *  Base of make_fname and make_fname_glob, which are almost the same thing
 */
var _make_fname_base = function (uPath, uName, uItem, center, count) {
    var final_path = '';
    // if      ([undefined, null, ''].includes(uPath)) { throw new Error('must specify a path'); }  // typescript faults this as string not having includes
    if (uPath === null) {
        throw new Error('must specify a path');
    }
    else if (uPath === undefined) {
        throw new Error('must specify a path');
    }
    else if (uPath === '') {
        throw new Error('must specify a path');
    }
    else if (uPath[uPath.length - 1] !== '/') {
        final_path = uPath + path_1.sep;
    }
    else {
        final_path = uPath;
    }
    return "" + final_path + uName + "___" + uItem + "___" + center + "___" + count + ".hot_stash";
};
/***
 *
 *  Makes a filename given a path, a name, and an item.
 *
 *  Controls for trailing slashes in paths.
 */
var make_fname = function (uPath, uName, uItem) {
    var ts = (new Date()).getTime()
        .toString();
    return _make_fname_base(uPath, uName, uItem, ts, build_count++);
};
exports.make_fname = make_fname;
/***
 *
 *  Makes a glob for finding files matching a filename given a path, a name, and an item, disregarding the timestamp.
 *
 *  Controls for trailing slashes in paths.
 *
 *  @param {string} uPath - Path on disk of the cache storage
 *  @param {string} uName - Name of the caller
 *  @param {string} uItem - Name of the item being cached
 *
 *  @returns {string} - The glob to be used to match files for this cache
 *
 *  @see _make_fname_base
 *
 *  @example - const cache_tgt = make_fname_glob('./cache/', 'general cache', 'parse tree');
 */
var make_fname_glob = function (uPath, uName, uItem) {
    return _make_fname_base(uPath, uName, uItem, '*', '*');
}; // * as the glob wildcard, where the timestamp would be, y'see
exports.make_fname_glob = make_fname_glob;
/***
 *
 *  Looks up the on-disk cache for a given item, under a given path/name.
 */
var cache_contents_for = function (uPath, uName, uItem) {
    return glob_1.sync(make_fname_glob(uPath, uName, uItem));
};
exports.cache_contents_for = cache_contents_for;
/***
 *
 *  Looks up the on-disk cache for a given item, under a given path/name, and returns the most recent entry.
 */
var best_cache_match_for = function (uPath, uName, uItem) {
    var candidates = cache_contents_for(uPath, uName, uItem);
    if (candidates.length === 0) {
        throw new Error("'no best cache match - no cache entries for '" + uPath + "' '" + uName + "' '" + uItem + "'");
    }
    // unix microtimes Just Sort (tm); last is latest
    candidates.sort();
    return candidates[candidates.length - 1];
};
exports.best_cache_match_for = best_cache_match_for;
/***
 *
 *  An internal descriptive method.  Do not use externally, please.
 */
var _as_get_success = function (item, value) {
    return ({ success: true, item: item, value: value });
};
/***
 *
 *  Looks up the on-disk cache for a given item, under a given path/name.
 *
 *  @param uPath {string} - where on disk the cache is stored
 *  @param uName {string} - the name of the logger (not the item!)
 *  @param uItem {string} - the name of the thing being stored at the time
 *
 *  @returns {GetResult} - The gotten cache, which may be new
 */
var get_cache = function (uPath, uName, uItem) {
    return _as_get_success(uItem, JSON.parse(fs_1.readFileSync(best_cache_match_for(uPath, uName, uItem), 'utf8')));
};
exports.get_cache = get_cache;
var has_cache = function (uPath, uName, uItem) {
    return cache_contents_for(uPath, uName, uItem).length > 0;
};
exports.has_cache = has_cache;
var set_keep_cache = function (uPath, uName, uItem, uValue) {
    var fname = make_fname(uPath, uName, uItem);
    var val;
    try {
        val = JSON.stringify(uValue);
    }
    catch (e) {
        throw new TypeError("Could not convert 'uValue' to JSON string - " + e);
    }
    try {
        fs_1.writeFileSync(fname, val, 'utf8');
    }
    catch (e) {
        throw new Error("Could not write to disk - " + e);
    }
};
exports.set_keep_cache = set_keep_cache;
var set_cache = function (uPath, uName, uItem, uValue) {
    // take the candidate list before writing, so it won't contain our new one
    var candidates = cache_contents_for(uPath, uName, uItem);
    // write a new one
    set_keep_cache(uPath, uName, uItem, uValue);
    // the one we just wrote is the one that isn't in the candidate list, so, nuke the others
    del_file_list(candidates);
};
exports.set_cache = set_cache;
var del_file_list = function (uFileList) {
    return uFileList.map(fs_1.unlinkSync);
};
/***
 *
 *  Deletes all applicable entries from `uName` cache in `uPath`
 *
 *  @param uPath {string} - where on disk the cache is stored
 *  @param uName {string} - the name of the logger (not the item!)
 *  @param uItem {string} - the name of the thing being stored at the time
 *
 *  @returns {void}
 */
var del_cache = function (uPath, uName, uItem) {
    return del_file_list(cache_contents_for(uPath, uName, uItem));
};
exports.del_cache = del_cache;
/***
 *
 *  Checks the on-disk cache.  If there's something, return that.  If not, call
 *  maker, store the result, and use that instead.
 *
 *  @param path {string} - where on disk the cache is stored
 *  @param name {string} - the name of the logger (not the item!)
 *  @param item {string} - the name of the thing being stored at the time
 *  @param maker {function} - the function that will be called to create this cached item if not present
 *
 *  @returns {GetResult} - The gotten cache, which may be new
 */
var get_or_gen_set = function (path, name, item, maker) {
    if (has_cache(path, name, item)) {
        return get_cache(path, name, item);
    }
    else {
        var made = maker();
        set_cache(path, name, item, made);
        return _as_get_success(item, made);
    }
};
exports.get_or_gen_set = get_or_gen_set;
/***
 *
 *  Always passes data to disk.  Does not remove old stores; allows a user to
 *  measure over time whether the cached items are actually stable.  Keeps the
 *  `get_or_gen_set` API for easy swap in when ready.
 *
 *  @param path {string} - where on disk the cache is stored
 *  @param name {string} - the name of the logger (not the item!)
 *  @param item {string} - the name of the thing being stored at the time
 *  @param maker {function} - the function that will be called to create this cached item if not present
 *
 *  @returns {GetResult} - The gotten cache, which may be new
 */
var logging_passthrough = function (path, name, item, maker) {
    var made = maker();
    set_keep_cache(path, name, item, made);
    return _as_get_success(item, made);
};
exports.logging_passthrough = logging_passthrough;
//# sourceMappingURL=hot_stash.js.map