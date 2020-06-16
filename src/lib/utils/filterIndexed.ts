import { clone } from 'ramda';

/**
 * filterIndexed
 * @param fn filterで判定する関数
 */
export const filterIndexed = <T>(fn: (v: T, i: number) => boolean) => (lists: T[]): T[] => clone(lists.filter(fn));
