import { pipe, multiply, divide, __ } from 'ramda';

/**
 * 桁数を指定し、切り捨てを行う
 * @param digits 桁数を指定（1の位の場合:1、小数点第1位の場合:-1を指定）
 */
export const mathFloor = (digits: number): ((n: number) => number) =>
  pipe(multiply(Math.pow(10, digits)), Math.floor, divide(__, Math.pow(10, digits)));
