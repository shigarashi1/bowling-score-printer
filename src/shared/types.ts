/**
 * ガターのenum値
 */
export const EGutter = {
  first: 'G',
  miss: '-',
} as const;
export type TGutter = typeof EGutter[keyof typeof EGutter];

export type TFoul = 'F';
/** 倒したピンの数 */
export type TKnockedDownPin = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** 投球結果 */
export type TThrowResult = TGutter | TFoul | TKnockedDownPin;
/** 1投球目の投球結果 */
export type TThrowResultExcludeGutter1st = Exclude<TThrowResult, typeof EGutter.miss>;
/** 2投球目の投球結果 */
export type TThrowResultExcludeGutter2nd = Exclude<TThrowResult, typeof EGutter.first>;
/** 3投球目の投球結果 */
export type TThrowResultExcludeGutter3nd = TThrowResultExcludeGutter2nd;

/**
 * 性別のEnum値
 */
export const ESex = {
  /** 男 */
  male: 'male',
  /** 女 */
  female: 'female',
} as const;
/**
 * 性別のtype
 */
export type TSex = typeof ESex[keyof typeof ESex];

/**
 * 性別のEnum値（Input用）
 */
export const ESexInputType = {
  /** 男 */
  [ESex.male]: 'M',
  /** 女 */
  [ESex.female]: 'W',
} as const;
/**
 * 性別のtype（Input用）
 */
export type TSexForImput = typeof ESexInputType[keyof typeof ESex];

/**
 * スコアシート用のEnum値
 */
export const EScoreSymble = {
  /** ストライク */
  strike: 'X',
  /** スペア */
  spare: '/',
  /** ファール */
  foul: 'F',
  /** ガター（1投目） */
  gutter: EGutter.first,
  /** ガター（1投目以外） */
  miss: EGutter.miss,
  /** 投球なし（3投目） */
  noThrow: ' ',
} as const;

/**
 * フレーム数（1~10）
 */
export type TFrameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * フレームのtype
 */
export type TFrame = {
  /** フレーム数 */
  no: TFrameNumber;
  /** 1投目の投球結果 */
  firstThrowResult: TThrowResultExcludeGutter1st;
  /** 2投目の投球結果 */
  secondThrowResult: TThrowResultExcludeGutter2nd;
  /** 3投目の投球結果 */
  thirdThrowResult?: TThrowResultExcludeGutter2nd;
};

/**
 * ゲームのtype
 */
export type TGame = {
  /** ゲーム数 */
  no: number;
  /** 各フレームの結果 */
  flames: TFrame[];
  /** ゲームの開始時間 */
  startAt: Date;
};

/**
 * プレイヤーのtype
 */
export type TPlayer = {
  /** プレイヤー名 */
  name: string;
  /** ハンディキャップ */
  handicap: number;
  /** 年齢 */
  age: number;
  /** 性別 */
  sex: TSex;
  /** 各ゲームの結果 */
  games: TGame[];
};

/**
 * レーンのtype
 */
export type TLane = {
  /** レーンNo */
  no: number;
  /** 遊んだ日付 */
  date: Date;
  /** 遊んだプレイヤー一覧 */
  players: TPlayer[];
};
