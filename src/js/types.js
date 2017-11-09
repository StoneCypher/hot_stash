
// @flow

type GetSuccess = {| item: string, value: string |};
type GetResult  = GetSuccess | false;

type HotStashCacher = {|

  has_cache           : (string)                        => boolean,
  set_cache           : (item: string, value: any)      => GetResult,               // eslint-disable-line flowtype/no-weak-types
  get_cache           : (item: string)                  => GetResult,
  del_cache           : (item: string)                  => GetResult,
  get_or_make_and_set : (item: string, maker: Function) => GetResult

|};





export type { GetResult, GetSuccess, HotStashCacher };
