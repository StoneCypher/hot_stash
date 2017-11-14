
// @flow



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

import { sep }                                     from 'path';
import { sync as globSync }                        from 'glob';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';





interface GetSuccess { success: true;  item: string; value: string; };
interface GetFailure { success: false; item: string; value: string; };

type      GetResult  = GetSuccess | GetFailure;





let build_count = 0; // prevents the same filename from being written because of a nonincremented clock





/***
 *
 *  Base of make_fname and make_fname_glob, which are almost the same thing
 */

const _make_fname_base: Function = (uPath: string, uName: string, uItem: string, center: string, count: number | string): string => {

  let final_path : string = '';

// if      ([undefined, null, ''].includes(uPath)) { throw new Error('must specify a path'); }  // typescript faults this as string not having includes

  if      (uPath === null)                { throw new Error('must specify a path'); }
  else if (uPath === undefined)           { throw new Error('must specify a path'); }
  else if (uPath === '')                  { throw new Error('must specify a path'); }


  else if (uPath[uPath.length-1] !== '/') { final_path = uPath + sep; }
  else                                    { final_path = uPath; }

  return `${final_path}${uName}___${uItem}___${center}___${count}.hot_stash`;

};





/***
 *
 *  Makes a filename given a path, a name, and an item.
 *
 *  Controls for trailing slashes in paths.
 */

const make_fname: Function = (uPath: string, uName: string, uItem: string): string => {

  let ts: string = (new Date()).getTime()
                               .toString();

  return _make_fname_base(uPath, uName, uItem, ts, build_count++);

};





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

const make_fname_glob: Function = (uPath: string, uName: string, uItem: string): string =>

  _make_fname_base(uPath, uName, uItem, '*', '*');  // * as the glob wildcard, where the timestamp would be, y'see





/***
 *
 *  Looks up the on-disk cache for a given item, under a given path/name.
 */

const cache_contents_for: Function = (uPath: string, uName: string, uItem: string): Array<string> =>

  globSync( make_fname_glob(uPath, uName, uItem) );






/***
 *
 *  Looks up the on-disk cache for a given item, under a given path/name, and returns the most recent entry.
 */

const best_cache_match_for: Function = (uPath: string, uName: string, uItem: string): string => {

  const candidates: Array<string> = cache_contents_for(uPath, uName, uItem);

  if (candidates.length === 0) {
  	throw new Error(`'no best cache match - no cache entries for '${uPath}' '${uName}' '${uItem}'`);
  }

  // unix microtimes Just Sort (tm); last is latest
  candidates.sort();

  return candidates[candidates.length - 1];

};





/***
 *
 *  An internal descriptive method.  Do not use externally, please.
 */

const _as_get_success = (item: string, value: any): GetSuccess =>

    ({ success: true, item, value });





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

const get_cache: Function = (uPath: string, uName: string, uItem: string): GetResult =>

  _as_get_success(uItem, JSON.parse(readFileSync(best_cache_match_for(uPath, uName, uItem), 'utf8')));





const has_cache: Function = (uPath: string, uName: string, uItem: string): boolean =>

  cache_contents_for(uPath, uName, uItem).length > 0;





const set_keep_cache: Function = (uPath: string, uName: string, uItem: string, uValue: any) => {         // eslint-disable-line flowtype/no-weak-types

  const fname : string = make_fname(uPath, uName, uItem);
  let   val   : string;

  try {
    val = JSON.stringify(uValue);
  } catch (e) {
    throw new TypeError(`Could not convert 'uValue' to JSON string - ${e}`);
  }

  try {
    writeFileSync(fname, val, 'utf8');
  } catch (e) {
    throw new Error(`Could not write to disk - ${e}`);
  }

};





const set_cache: Function = (uPath: string, uName: string, uItem: string, uValue: any) => {         // eslint-disable-line flowtype/no-weak-types

  // take the candidate list before writing, so it won't contain our new one
  const candidates = cache_contents_for(uPath, uName, uItem);

  // write a new one
  set_keep_cache(uPath, uName, uItem, uValue);

  // the one we just wrote is the one that isn't in the candidate list, so, nuke the others
  del_file_list(candidates);

};






const del_file_list: Function = (uFileList: Array<string>) =>

  uFileList.map(unlinkSync);






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

const del_cache: Function = (uPath: string, uName: string, uItem: string) =>

  del_file_list( cache_contents_for(uPath, uName, uItem) );





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

const get_or_gen_set: Function = (path: string, name: string, item: string, maker: Function): GetResult => {

  if (has_cache(path, name, item)) {

    return get_cache(path, name, item);

  } else {

    const made = maker();
    set_cache(path, name, item, made);
    return _as_get_success(item, made);

  }

}





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

const logging_passthrough: Function = (path: string, name: string, item: string, maker: Function): GetResult => {

  const made = maker();
  set_keep_cache(path, name, item, made);
  return _as_get_success(item, made);

}





/***
 *
 *  This is just a voluntary convenience to let you ditch managing the path and
 *  the name constantly.  This offers no required functionality and you're
 *  welcome to ditch if it isn't convenient.
 *
 *  @param uPath {string} - where on disk the cache is stored
 *  @param uName {string} - the name of the logger (not the item!)
 *
 *  @returns {object} - Utility object with path and name partially applied from the closure
 */

/*
const make_cacher: Function = (uPath: string, uName: string) => ({

  has_cache      : (item: string)                  : boolean   => has_cache(uPath, uName, item),
  set_cache      : (item: string, value: any)      : GetResult => set_cache(uPath, uName, item, value),           // eslint-disable-line flowtype/no-weak-types
  get_cache      : (item: string)                  : GetResult => get_cache(uPath, uName, item),
  del_cache      : (item: string)                  : GetResult => del_cache(uPath, uName, item),
  get_or_gen_set : (item: string, maker: Function) : GetResult => get_or_gen_set(uPath, uName, item, maker)

  // update this list

});
*/




export {

  make_fname,
    make_fname_glob,

  cache_contents_for,
    best_cache_match_for,

  has_cache,

  set_cache,
    set_keep_cache,

  del_cache,

  get_cache,
    get_or_gen_set,

  logging_passthrough
/*
    ,

  make_cacher
*/
};
