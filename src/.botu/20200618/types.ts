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
export type TThrowResult = TKnockedDownPin | typeof EScoreMark.gutter | typeof EScoreMark.foul;

/** Boxの型 */
export type TBox = Exclude<TThrowResult | TScoreMark, 10>;
/** 1投球目のBoxの型 */
export type TBox1st = Exclude<TBox, typeof EScoreMark.spare | typeof EScoreMark.miss | typeof EScoreMark.noThrow>;
/** 2投球目のBoxの型 */
export type TBox2nd = Exclude<TBox, typeof EScoreMark.gutter>;
/** 3投球目のBoxの型 */
export type TBox3rd = Exclude<TBox, typeof EScoreMark.gutter>;

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
  box1st: TBox1st;
  /** 2投目の投球結果 */
  box2nd: TBox2nd;
};

export type TLastFrame = TFrame & {
  /** 3投目の投球結果 */
  box3rd: TBox3rd;
};

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
  frames: (TFrame | TLastFrame)[];
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
