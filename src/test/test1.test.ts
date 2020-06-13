// import { readTextFileLines } from '../lib/utils';
// const lines = readTextFileLines('src/.test-data/test1.txt', 'utf8');

const TEST_CASE_NAME = 'テストケース1';
describe(`${TEST_CASE_NAME} 1.レーン合計を計算し出力する`, () => {
  it('合計を出力', () => {
    expect(1586).toBe(0);
  });
});
describe(`${TEST_CASE_NAME} 2.プレイヤーをゲームの合計スコアの昇順で出力する`, () => {
  it('akira, iori, usako, erikaの順で出力', () => {
    // // akira 480 + 0 = 480
    // // iori 287 + 60 * 3 = 467
    // // usako 380 + 30 * 3 = 470
    // // erika 439 + 15 * 3 = 484
    const expected = ['erika', 'akira', 'usako', 'iori'].join('\n');
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
describe(`${TEST_CASE_NAME} 6.プレイヤーごとのスコアシートを作成し、出力する`, () => {
  it.todo('プレイヤー1');
  it.todo('プレイヤー2');
});
