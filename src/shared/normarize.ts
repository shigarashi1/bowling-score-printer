import { NormarizeConfig, normarizeLines } from '../lib/utils';
import { TSexInput, TThrowResult } from './type';

type NormarizedData = {
  numberOfLane: number;
  playedDate: Date;
  numberOfPlayer: number;
  numberOfGame: number;
  playerInformations: {
    name: string;
    hdcp: number;
    age: number;
    sex: TSexInput;
  }[];
  gameStartAtTimes: Date[];
  playerResults: TThrowResult[][];
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
  gameStartAtTimes: {
    start: [1, [0, 2]],
    end: [
      [0, 2],
      [0, 3],
    ],
    convert: 0,
  },
  playerResults: {
    start: [1, [0, 2], [0, 3]],
  },
};

export const normarize = normarizeLines(NORMARIZE_CONFIG, ' ');
