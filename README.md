bowling-score-printer
====

# Overview

ボーリングのスコア表を作成するプログラミング問題とその回答例

# Question

## 期待する出力項目

1. レーン合計を計算し出力する
  - ただし、レーンの合計にはHDCPを加味しないこと

2. プレイヤーの名前をゲームの合計スコアの昇順で出力する
  - プレイヤー名の間は改行で出力すること

3. プレイヤーのゲームの合計スコアと平均スコアを出力する

4. プレイヤーのゲームのストライク数、スペア数、ガター数を出力する

5. プレイヤー名、ゲーム数、フレーム数、N投目かを指定して、倒したピンの数を出力する
  - フレームのN投目を投げていない場合、"No Throw"を出力すること

6. プレイヤーごとのスコアシートを作成し、出力する
  - 出力フォーマットは後述する

## 入力データ仕様

### 入力データサンプル
```
10 2016-06-26 2 2
kira 0 31 M
L 30 31 M
09:30
10:00
G 3 6 G 9 G 7 G 8 G 3 6 8 2 10 10 9 G
G 3 6 G 9 G 7 G 8 G 3 6 8 2 10 10 9 G
G 3 6 G 9 G 7 G 8 G 3 6 8 2 10 10 9 G
G 3 6 G 9 G 7 G 8 G 3 6 8 2 10 10 9 G
```

### 入力データ
```
LaneNo Date Player_N Game_N
Player_1_Name Player_1_HDCP Player_1_Age Player_1_Sex
Player_2_Name Player_2_HDCP Player_2_Age Player_2_Sex
・・・
Player_N_Name Player_N_HDCP Player_N_Age Player_N_Sex
Game_1_StartTime
Game_2_StartTime
・・・
Game_N_StartTime
Player_1_Game_1_Throw_1 Player_1_Game_1_Throw_2 Player_1_Game_1_Throw_3 ・・・ Player_1_Game_1_Throw_N
・・・
Player_1_Game_N_Throw_1 Player_1_Game_N_Throw_2 Player_1_Game_N_Throw_3 ・・・ Player_1_Game_N_Throw_N
・・・
Player_2_Game_1_Throw_1 Player_2_Game_1_Throw_2 Player_2_Game_1_Throw_3 ・・・ Player_1_Game_1_Throw_N
・・・
Player_2_Game_N_Throw_1 Player_2_Game_N_Throw_2 Player_2_Game_N_Throw_3 ・・・ Player_2_Game_N_Throw_N
・・・
Player_N_Game_1_Throw_1 Player_N_Game_1_Throw_2 Player_N_Game_1_Throw_3 ・・・ Player_N_Game_1_Throw_N
・・・
Player_N_Game_N_Throw_1 Player_N_Game_N_Throw_2 Player_N_Game_N_Throw_3 ・・・ Player_N_Game_N_Throw_N
```

### 入力データ仕様詳細
- 1行目に遊んだレーン数（LaneNo）、日付（Date）、プレイヤー数（Player_N）、ゲーム数（Game_N）の順で半角スペース区切りで与えられる
- 2〜Player_N行目まで、プレイヤー名（Player_N_Name）、HDCP（Player_N_HDCP）、年齢（Player_N_Age）、性別（Player_N_Sex）の順で半角スペース区切りで与えられる
- Player_N〜Game_N行目まで、開始時間（Game_N_StartTime）の順で半角スペース区切りで与えられる
- Game_N行目以降はプレイヤーのゲームの投球結果がゲーム数の昇順で行区切りで与えられる
- プレイヤーの投球結果の行は1投目から順にN投目まで順に半角スペース区切りで与えられる
- フォーマットは次の通り
  - 日付（Date）は"yyyy-MM-dd"で与えられる
  - 開始時間（Game_N_StartTime）は"HH:mm"で与えられる
  - 性別（Player_N_Sex）は男性なら"M"、女性なら"W"で与えられる
  - プレイヤーの投球結果はガターは"G"、ファールは"F"、倒したピンの数のいずれかで与えられる


## スコアシートの仕様

### スコアシートサンプル
```
| Date            | Lane | Name   | Age | Sex             | HDCP | Total | AVG | X       | /        |
|-----------------|------|--------|-----|-----------------|------|-------|-----|---------|----------|
| 2020/06/13 Sat  | 15   | watabe | 40  | male(or female) | 0    | 216   | 108 | 1(2.5%) | 7(17.5%) |

| Start | Game | 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | 10        | SUB/T   | X | / | - |
|-------|------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-----------|---------|---|---|---|
| 09:38 | 1    | 7 | - | 1 | 5 | 7 | - | 8 | / | 5 | 3 | 7 | / | X     | 6 | 3 | G | 9 | F | / | 1 | 117/117 | 1 | 3 | 6 |
| 09:49 | 2    | G | 7 | 7 | / | 3 | - | 8 | 1 | 9 | / | 8 | / | 7 | - | 9 | - | 6 | / | 4 | 4 |   | 105/216 | 0 | 4 | 6 |

```

### スコアシート詳細

- 全体
  - スコアシートは"サマリーを表示する表"と"ゲームの詳細を表示する表"の2種類からなる
  - 列ごとの区切りは"|"をつける
  - 列ごとの区切りと見出し行、データの間は必ず1つ以上の半角スペースをつける
  - 各列の幅はその列の中で最も長さの大きい見出し・データが上記の形で収まる最小の幅とする
  - 文字列、数値に関わらず、データは左寄せとする
  - 区切り行は"|"を除き、ハイフンで埋める

- "サマリーを表示する表"
  - "Date"は"yyyy/MM/dd eee"のフォーマットで出力する
  - "Lane"は遊んだレーン数を出力する
  - "Name"は出力対象となったプレイヤー名を出力する
  - "Age"はプレイヤーの年齢を出力する
  - "Sex"は男性ならmale、女性ならfemaleのフォーマットで出力する
  - "HDCP"はプレイヤーのハンディキャップを出力する
  - "Total"は全ゲームの合計スコアを出力する
  - "AVG"は1ゲームの平均スコアを出力する
  - "X"、"/"は全ゲームのストライク及びスペアの合計と全ゲームの投球数で割った平均を出力する
  - "X"、"/"は次のフォーマットで出力する（合計数/投球数で割った平均 + %）
  - "AVG", "X", "/"で小数点以下が発生する場合、小数点以下第2位を切り捨て出力する

- "ゲームの詳細を表示する表"
  - 1行に１ゲームごとのスコアを出力する
  - "Start"は"HH:mm"のフォーマットで開始時間を出力する
  - それぞれのフレームはストライクは”X”、スペアは"/"、1投目のガターは"G"、2投目以降のガターは"-"、ファールは"F"、上記以外は倒したピンの数を出力する
  - ただし、第10フレームの3投目がない場合は" "（半角スペース）を出力する
  - ストライクの場合、1投目と2投目を区切る"|"を付けない（ただし、第10フレームを除く）
  - "SUB/T"にはゲームの合計スコアとそれまでのゲームをした値を/区切りで出力する
  - "X"、"/"、”-”にはそれぞれゲームのストライク、スペア、ガター(G or -)の合計数を出力する


## Install

1. node.jsのVer.12.18.0が動くPCを用意してください.

2. このレポジトリを`git clone`して、`npm install`を行ってください.

3. コマンドコンソールにて`npm start`を実行し、`hallo world`と表示されれば、準備は完了です.

## Run Test

コマンドコンソールにて、`npm run test`を実行するとテストが実行されます.

[テスト用のテキストファイルとソースコード](./src/test)

## API Documentation

API Documentation created By typedoc [Check github pages](https://shigarashi1.github.io/bowling-score-printer/index.html)