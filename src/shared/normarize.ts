import { NormarizeConfig, normarizeLines, isNumber } from '../lib/utils';
import { TSexInput, TThrowResult } from './type';
import { TypeConverterConfig, typeConverter } from '../lib/utils/typeConverter';
import { pipe, all } from 'ramda';
import { isKnockedDownPin } from './typeGuard';

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

const TYPE_CONVERTER_CONFIG: TypeConverterConfig<NormarizedData> = {
  numberOfLane: {
    validator: isNumber,
  },
  playedDate: {
    validator: isNumber,
  },
  numberOfPlayer: {
    validator: isNumber,
  },
  numberOfGame: {
    validator: isNumber,
  },
  playerInformations: {
    validator: isNumber,
  },
  gameStartAtTimes: {
    validator: isNumber,
  },
  playerResults: {
    validator: all(isKnockedDownPin) as (x: unknown) => boolean,
  },
};

const normarize = normarizeLines(NORMARIZE_CONFIG, ' ');
const converter = typeConverter(TYPE_CONVERTER_CONFIG);
export const parseInputData = pipe(normarize, converter);
