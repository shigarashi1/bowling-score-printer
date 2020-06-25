import { toPairs, find, pathEq } from 'ramda';
import { IndexesObject } from './type';
import { getOrElse } from './getOrElse';
import { isEnum } from './typeGuard';

/**
 * EnumからEnumへの変換を行う
 * @param fromEnum 変換元のenum
 * @param toEnum 変換後のenum
 * @param defaultValue 変換後のenumにmatchしない場合に設定する変換後のenum
 */
export const enum2enum = <T, K>(fromEnum: IndexesObject<T>, toEnum: IndexesObject<K>, defaultValue: K) => (
  value: T,
): K => {
  if (isEnum(fromEnum)(value)) {
    return defaultValue;
  }
  const fromKey = getOrElse('', find(pathEq(['1'], value), toPairs(fromEnum))?.[0]);
  const toValue = getOrElse(defaultValue, find(pathEq(['0'], fromKey), toPairs(toEnum))?.[1]);
  return toValue;
};
