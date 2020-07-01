/* eslint-disable @typescript-eslint/no-explicit-any */

export type IndexedObject<T = any> = { [key: string]: T };
export type NestedType<T, U> = {
  [K in keyof T]: T[K] extends Array<infer R>
    ? Array<NestedType<R, U>>
    : T[K] extends Record<string, unknown>
    ? NestedType<T[K], U>
    : U;
};
