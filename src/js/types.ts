
// @flow

interface GetSuccess { success: true;  item: string; value: string; };
interface GetFailure { success: false; item: string; value: string; };

type      GetResult  = GetSuccess | GetFailure;

type HotStashCacher = {

  has_cache           : (title: string)                 => boolean,
  set_cache           : (item: string, value: any)      => GetResult,               // eslint-disable-line flowtype/no-weak-types
  get_cache           : (item: string)                  => GetResult,
  del_cache           : (item: string)                  => GetResult,
  get_or_make_and_set : (item: string, maker: Function) => GetResult

};





export { GetResult, GetSuccess, GetFailure, HotStashCacher };
