import { IndexesObject } from './types';
import { toPairs, propEq } from 'ramda';

export const isEnum = <T>(fromEnum: IndexesObject<T>) => (x: unknown): x is T => toPairs(fromEnum).some(propEq('1', x));
