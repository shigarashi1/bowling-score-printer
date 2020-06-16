/**
 * valueがfalsyならdefaultValue、それ以外ならvalueを返却
 * @param defaultValue valueがfalsyの場合に返却する値
 * @param value 値
 */
export const getOrElse = <T = string>(defaultValue: T, value: T | null | undefined): T =>
  value ? value : defaultValue;
