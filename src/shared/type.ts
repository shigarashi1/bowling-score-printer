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
export const ESexInput = {
  /** 男 */
  [ESex.male]: 'M',
  /** 女 */
  [ESex.female]: 'W',
} as const;
/**
 * 性別のtype（Input用）
 */
export type TSexInput = typeof ESexInput[keyof typeof ESex];

/**
 * スコアシート用のEnum値
 */
export const EScoreMark = {
  /** ストライク */
  strike: 'X',
  /** スペア */
  spare: '/',
  /** ファール */
  foul: 'F',
  /** ガター（1投目） */
  gutter: 'G',
  /** ガター（2、3投目） */
  miss: '-',
  /** 投球なし（2、3投目） */
  noThrow: ' ',
} as const;
export type TScoreMark = typeof EScoreMark[keyof typeof EScoreMark];

/** 倒したピンの数 */
export type TKnockedDownPin = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** 投球結果 */
export type TThrowResult =
  | TKnockedDownPin
  | typeof EScoreMark.gutter
  | typeof EScoreMark.foul
  | typeof EScoreMark.noThrow;

/** 1投目の結果 */
export type TThrowResult1st = Exclude<TThrowResult, typeof EScoreMark.noThrow>;

/** 2投目の結果 */
export type TThrowResult2nd = TThrowResult;

/** 3投目の結果 */
export type TThrowResult3rd = TThrowResult2nd;

/**
 * フレーム数（1~10）
 */
export type TFrameNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * 1~9フレーム
 */
export type TBasicFrame = {
  /** フレーム数 */
  no: TFrameNumber;
  /** 1投目の投球結果 */
  throwResult1st: TThrowResult1st;
  /** 2投目の投球結果 */
  throwResult2nd: TThrowResult2nd;
};

/**
 * 最終フレーム
 */
export type TLastFrame = TBasicFrame & {
  /** 3投目の投球結果 */
  throwResult3rd: TThrowResult3rd;
};

export type TFrame = TBasicFrame | TLastFrame;

/**
 * スコアのプロパティを追加する
 */
export type ExtendScore<T> = T & {
  score: number;
};

/**
 * ゲームのtype
 */
export type TGame = {
  /** ゲーム数 */
  no: number;
  /** 各フレームの結果 */
  frames: TFrame[];
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
  /** 遊んだプレイヤー */
  players: TPlayer[];
};
