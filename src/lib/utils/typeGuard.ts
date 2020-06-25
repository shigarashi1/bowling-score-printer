import { IndexesObject } from './type';
import { toPairs, propEq } from 'ramda';

/**
 * enumか？
 * @param fromEnum EnumライクなObject
 */
export const isEnum = <T>(fromEnum: IndexesObject<T>) => (x: unknown): x is T => toPairs(fromEnum).some(propEq('1', x));
