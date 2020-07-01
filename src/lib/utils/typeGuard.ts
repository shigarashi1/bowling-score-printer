import { IndexedObject } from './type';
import { toPairs, propEq } from 'ramda';

/**
 * enumか？
 * @param fromEnum EnumライクなObject
 */
export const isEnum = <T>(fromEnum: IndexedObject<T>) => (x: unknown): x is T => toPairs(fromEnum).some(propEq('1', x));

/**
 * number型か?
 * @param x 型検定したい値
 */
export const isNumber = (x: unknown): x is number => typeof x === 'number' && !Number.isNaN(x);

/**
 * numberに変換可能な文字列型か?
 * @param x 型検定したい値
 */
export const isNumberStr = (x: unknown): x is number => typeof x === 'string' && !Number.isNaN(x);
