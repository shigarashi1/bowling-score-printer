import { split, pipe, join } from 'ramda';
// //
import { readTextFile } from '../lib/utils';
import { normarize } from '../shared/normarize';

const LINES = readTextFile('\n')('src/test/test1.txt', 'utf8');
const NORMARIZED_DATA = normarize(LINES);

const TEST_CASE_NAME = 'テストケース1';
describe(`${TEST_CASE_NAME} 1.レーン合計を計算し出力する`, () => {
  console.log(NORMARIZED_DATA);
  it('合計を出力', () => {
    expect(1586).toBe(0);
  });
});
describe(`${TEST_CASE_NAME} 2.プレイヤーをゲームの合計スコアの昇順で出力する`, () => {
  it('Akira, Iori, Usako, Erikaの順で出力', () => {
    // akira 480 + 0 = 480
    // iori 287 + 60 * 3 = 467
    // usako 380 + 30 * 3 = 470
    // erika 439 + 15 * 3 = 484
    const expected = ['Erika', 'Akira', 'Usako', 'Iori'].join('\n');
    expect(expected).toEqual('');
  });
});
describe(`${TEST_CASE_NAME} 3.プレイヤーごとのゲームの合計スコアと平均スコアを出力する`, () => {
  it('akira 合計480を出力', () => {
    expect(480).toBe(0);
  });
  it('akira 平均160を出力', () => {
    expect(160).toBe(0);
  });
  it('iori 合計467を出力', () => {
    expect(467).toBe(0);
  });
  it('iori 平均156.6を出力', () => {
    expect(156.6).toBe(0);
  });
});
describe(`${TEST_CASE_NAME} 4.プレイヤーごとのゲームのストライク数、スペア数、ガター数を出力する`, () => {
  it('akira ストライク数', () => {
    // 1G:2
    // 2G:8
    // 3G:3
    // 13
    expect(13).toBe(0);
  });
  it('akira スペア数', () => {
    // 1G:1
    // 2G:1
    // 3G:2
    // 4
    expect(4).toBe(0);
  });
  it('iori ガター数', () => {
    // 1G:7
    // 2G:5
    // 3G:4
    // 16
    expect(16).toBe(0);
  });
  it('usako スペア数', () => {
    // 1G:4
    // 2G:4
    // 3G:2
    // 10
    expect(10).toBe(0);
  });
  it('erika ストライク数', () => {
    // 1G:3
    // 2G:1
    // 3G:4
    // 7
    expect(7).toBe(0);
  });
});
describe(`${TEST_CASE_NAME} 5.プレイヤー名、ゲーム数、フレーム数、何投目かを指定して、倒したピンの数を出力する`, () => {
  it('akira 1G 1F 1', () => {
    // 0
    expect(0).toBe(1);
  });
  it('akira 2G 4F 2', () => {
    // NO
    expect('No Throw').toBe('');
  });
  it('iori 1G 1F 1', () => {
    // 7
    expect(7).toBe(1);
  });
  it('iori 2G 10F 3', () => {
    // NO
    expect('No Throw').toBe('');
  });
});

const EXPECTED_AKIRA_SCORE_SHEET = `
| Date            | Lane | Name  | Age | Sex  | HDCP | Total | AVG | X         | /       |
|-----------------|------|-------|-----|------|------|-------|-----|-----------|---------|
| 2016/06/13 Sun  | 15   | Akira | 31  | male | 0    | 480   | 160 | 13(25.4%) | 4(7.8%) |

| Start | Game | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10        | SUB/T   | X | / | - |
|-------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-----------|---------|---|---|---|51
| 09:30 | 1    | G | 3 | 6 | - | 9 | - | 7 | - | 8 | - | 3 | 6 | 8 | / | X     | X     | 9 | - |   | 119/119 | 2 | 1 | 6 |18
| 10:45 | 2    | X     | 7 | 1 | X     | X     | X     | X     | X     | X     | 9 | / | X | 6 | 2 | 233/216 | 8 | 1 | 0 |14
| 12:00 | 3    | 8 | - | 7 | 2 | X     | 7 | / | X     | 9 | - | 7 | - | 9 | - | 5 | 2 | X | 8 | / | 128/216 | 3 | 2 | 4 |19
`;
const EXPECTED_IORI_SCORE_SHEET = `
| Date            | Lane | Name | Age | Sex  | HDCP | Total | AVG   | X       | /        |
|-----------------|------|------|-----|------|------|-------|-------|---------|----------|
| 2016/06/13 Sun  | 15   | Iori | 8   | male | 60   | 463   | 154.3 | 2(3.4%) | 4(6.8%)  |

| Start | Game | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10        | SUB/T   | X | / | - |
|-------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-----------|---------|---|---|---|
| 09:30 | 1    | G | 7 | 8 | / | 3 | - | 9 | - | 5 | - | G | 9 | X     | 9 | - | 7 | - | 8 | - |   | 149/149 | 1 | 1 | 8 |
| 10:45 | 2    | 7 | 2 | 7 | - | 1 | 5 | 7 | - | G | 7 | 7 | 2 | 9 | / | X     | 7 | - | 8 | - |   | 157/149 | 1 | 1 | 5 |
| 12:00 | 3    | 8 | - | 3 | 3 | 3 | 3 | 7 | / | 8 | - | 3 | 6 | 4 | 2 | 8 | - | 8 | / | 9 | - |   | 157/149 | 0 | 2 | 4 |
`;
const EXPECTED_USAKO_SCORE_SHEET = `
| Date            | Lane | Name  | Age | Sex    | HDCP | Total | AVG   | X       | /         |
|-----------------|------|-------|-----|--------|------|-------|-------|---------|-----------|
| 2016/06/13 Sun  | 15   | Usako | 28  | female | 30   | 470   | 156.6 | 3(5.1%) | 10(17.2%) |

| Start | Game | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10        | SUB/T   | X | / | - |
|-------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-----------|---------|---|---|---|
| 09:30 | 1    | 9 | - | 6 | / | 9 | - | G | 8 | 9 | / | 7 | 2 | 8 | / | 3 | / | 8 | - | 7 | - |   | 147/117 | 0 | 4 | 4 |
| 10:45 | 2    | G | 7 | 7 | / | 3 | - | 8 | 1 | 9 | / | 8 | / | 7 | - | 9 | - | 6 | / | 6 | 2 |   | 165/216 | 1 | 4 | 3 |
| 12:00 | 3    | 8 | - | X     | 6 | 3 | 9 | / | X     | 8 | - | 9 | - | 6 | / | 9 | - | 8 | 1 |   | 158/216 | 2 | 2 | 4 |
`;
const EXPECTED_ERIKA_SCORE_SHEET = `
| Date            | Lane | Name  | Age | Sex    | HDCP | Total | AVG   | X        | /         |
|-----------------|------|-------|-----|--------|------|-------|-------|----------|-----------|
| 2016/06/13 Sun  | 15   | Erika | 18  | female | 15   | 484   | 161.3 | 8(15.0%) | 11(20.7%) |

| Start | Game | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10        | SUB/T   | X | / | - |
|-------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-----------|---------|---|---|---|
| 09:30 | 1    | 8 | / | 9 | / | 5 | 2 | X     | 7 | / | X     | 9 | / | X     | 7 | 2 | 9 | - |   | 173/117 | 3 | 4 | 1 |
| 10:45 | 2    | 7 | - | 1 | 5 | 7 | - | 8 | / | 5 | 3 | 7 | / | X     | 6 | 3 | G | 9 | F | / | 1 | 126/117 | 1 | 3 | 6 |
| 12:00 | 3    | X     | 7 | 2 | 3 | / | X     | 8 | / | X     | 7 | / | 8 | / | X     | 7 | - |   | 185/216 | 4 | 4 | 1 |
`;

const isExcludedLine = (lines: string[]) => lines.filter((_, i, arr) => i !== 0 && i !== arr.length);
const toText = pipe(split('\n'), isExcludedLine, join('\n'));

describe(`${TEST_CASE_NAME} 6.プレイヤーごとのスコアシートを作成し、出力する`, () => {
  it('Akiraのスコアシートを返却', () => {
    expect(toText(EXPECTED_AKIRA_SCORE_SHEET)).toBe('');
  });
  it('Ioriのスコアシートを返却', () => {
    expect(toText(EXPECTED_IORI_SCORE_SHEET)).toBe('');
  });
  it('Usakoのスコアシートを返却', () => {
    expect(toText(EXPECTED_USAKO_SCORE_SHEET)).toBe('');
  });
  it('Erikaのスコアシートを返却', () => {
    expect(toText(EXPECTED_ERIKA_SCORE_SHEET)).toBe('');
  });
});
