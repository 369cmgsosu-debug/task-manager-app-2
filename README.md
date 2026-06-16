# Task Manager App

現場の是正管理・タスク管理ツールです。
個人ごとの「抱えている案件」「達成率」「遅延」を可視化できます。

## 機能
- **ダッシュボード**: ユーザーごとのタスク数、完了率、遅延数を一覧表示。
- **個人ページ**: 担当タスクの詳細表示（案件名、期限、状態）。
- **印刷機能**: 個人別レポートをテーブル形式で出力可能。

## 技術スタック
- **Framework**: Next.js (Pages Router)
- **Styling**: CSS Modules / Global CSS
- **Deployment**: Render に対応

## 使い方

### セットアップ
```bash
npm install
```

### 開発モード
```bash
npm run dev
```

### ビルドと実行
```bash
npm run build
npm start
```

## データ構造
データは `pages/api/data.js` 内の JSON で管理されています。将来的にデータベース化しやすい構造になっています。
