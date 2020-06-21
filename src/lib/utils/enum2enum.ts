import { IndexesObject } from './types';
import { toPairs, find, pathEq } from 'ramda';
import { getOrElse } from './getOrElse';
import { isEnum } from './typeGuard';

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
