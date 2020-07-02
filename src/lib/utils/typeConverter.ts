import { NormarizeReturnType } from './normarizeLines';
import { map, keys, prop, reduce } from 'ramda';

type ValidatorFn1 = (x: unknown) => boolean;
type ValidatorFn2<T, P extends keyof T> = (x: unknown | unknown[]) => x is T[P];
type TypeConverterFormat<T, P extends keyof T> = {
  validator: ValidatorFn1 | ValidatorFn2<T, P>;
  converter?: (x: unknown | unknown[]) => T[P];
};
export type TypeConverterConfig<T> = { [P in keyof T]: TypeConverterFormat<T, P> };

const _typeConverter4Array = <T, P extends keyof T>(conf: TypeConverterFormat<T, P>, key: keyof T, value: string[]) => {
  const { validator, converter } = conf;
  if (!value.every(validator)) {
    throw Error(`invalid value: ${key}, ${value}`);
  }
  if (!converter) {
    return value;
  }
  return map(converter, value);
};

const _typeConverter = <T>(data: NormarizeReturnType<T>) => (
  key: keyof T,
  conf: TypeConverterConfig<T>[typeof key],
) => {
  const value = prop(key, data);
  if (Array.isArray(value)) {
    return _typeConverter4Array(conf, key, value);
  }
  const { validator, converter } = conf;
  if (!validator(value)) {
    throw Error(`invalid value: ${key}, ${value}`);
  }
  if (!converter) {
    return value;
  }
  return converter(value as string);
};

export const typeConverter = <T>(config: TypeConverterConfig<T>) => (data: NormarizeReturnType<T>): T => {
  const pairs = map((key) => ({ key, conf: config[key] }), keys(config));
  const fn = _typeConverter(data);
  return reduce(
    (acc, { key, conf }) => ({ ...acc, [key]: fn(key, conf) }),
    {} as T, //
    pairs,
  );
};
