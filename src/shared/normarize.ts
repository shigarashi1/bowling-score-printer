import { NormarizeConfig, normarizeLines } from '../lib/utils';

type NormarizedData = {
  numberOfLane: unknown;
  playedDate: unknown;
  numberOfPlayer: unknown;
  numberOfGame: unknown;
  playerInformations: {
    name: unknown;
    hdcp: unknown;
    age: unknown;
    sex: unknown;
  }[];
  gameTimes: {
    startAt: unknown;
  }[];
  playerResults: unknown[];
};

const NORMARIZE_CONFIG: NormarizeConfig<NormarizedData> = {
  numberOfLane: [0, 0],
  playedDate: [0, 1],
  numberOfPlayer: [0, 2],
  numberOfGame: [0, 3],
  playerInformations: {
    start: 1,
    end: [0, 2],
    convert: {
      name: 0,
      hdcp: 1,
      age: 2,
      sex: 3,
    },
  },
  gameTimes: {
    start: [1, [0, 2]],
    end: [
      [0, 2],
      [0, 3],
    ],
    convert: {
      startAt: 0,
    },
  },
  playerResults: {
    start: [1, [0, 2], [0, 3]],
  },
};

export const normarize = normarizeLines(NORMARIZE_CONFIG, ' ');
