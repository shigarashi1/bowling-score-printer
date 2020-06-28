import { NormarizeConfig, normarizeLines } from '../lib/utils';

type NormarizedData = {
  numberOfLane: unknown; // [0, 0]
  playedDate: unknown; // [0, 1]
  numberOfPlayer: unknown; // [0, 2]
  numberOfGame: unknown; // [0, 3]
  playerInformations: unknown[]; // {start: 1, end: [0, 2]}
  gameStartAtTimes: unknown[]; // {start: [0, 2], end: [0, 3]}
  playerResults: unknown[]; // {start: [[0, 2], [0, 3]]}
};

const NORMARIZE_CONFIG: NormarizeConfig<NormarizedData> = {
  numberOfLane: [0, 0],
  playedDate: [0, 1],
  numberOfPlayer: [0, 2],
  numberOfGame: [0, 3],
  playerInformations: { start: 1, end: [0, 2] },
  gameStartAtTimes: { start: [0, 2], end: [0, 3] },
  playerResults: {
    start: [
      [0, 2],
      [0, 3],
    ],
  },
};

export const normarize = normarizeLines(NORMARIZE_CONFIG, ' ');
