export const EGutter = {
  first: 'G',
  second: '-',
  third: '-',
} as const;
export type TGutter = typeof EGutter[keyof typeof EGutter];
export type TFoul = 'F';
export type TKnockedDownPin = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TThrowResult = TGutter | TFoul | TKnockedDownPin;
export type TThrowResultExcludeGutter1st = Exclude<TThrowResult, typeof EGutter.second>;
export type TThrowResultExcludeGutter2nd = Exclude<TThrowResult, typeof EGutter.first>;
export type TThrowResultExcludeGutter3nd = TThrowResultExcludeGutter2nd;

export const EScoreSymble = {
  strike: 'X',
  spare: '/',
  gutter: EGutter.first,
  miss: EGutter.second,
  noThrow: ' ',
} as const;

export const ESex = {
  male: 'male',
  female: 'female',
} as const;
export type TSex = typeof ESex[keyof typeof ESex];
export const ESexInputType = {
  [ESex.male]: 'M',
  [ESex.female]: 'W',
} as const;
export type TSexForImput = typeof ESexInputType[keyof typeof ESex];

export type TFrameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type TFrame = {
  no: TFrameNumber;
  firstThrowResult: TThrowResultExcludeGutter1st;
  secondThrowResult: TThrowResultExcludeGutter2nd;
  thirdThrowResult?: TThrowResultExcludeGutter2nd;
};

export type TGame = {
  no: number;
  flames: TFrame[];
  startAt: Date;
};

export type TPlayer = {
  name: string;
  handicap: number;
  age: number;
  sex: TSex;
  games: TGame[];
};

export type TLane = {
  no: number;
  date: Date;
  players: TPlayer[];
};
