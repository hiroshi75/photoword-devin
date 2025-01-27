# 開発計画 (PhotoWord)

## 1. 全体概要
スペイン語学習支援アプリケーション「PhotoWord」の開発計画書です。
ユーザーが写真をアップロードすると、マルチモーダルLLM（Claude 3 Haiku）を用いて画像を解析し、
写っているものに関連するスペイン語の単語帳を自動生成します。

### 1.1 主な機能
- 写真アップロード・解析
- スペイン語単語帳の自動生成
- クイズ機能
- 学習進捗管理
- 単語帳編集機能

### 1.2 技術スタック
- フロントエンド: Next.js 15 (App Router)
- UI: shadcn/ui + TailwindCSS
- バックエンド: Next.js API Routes
- データベース: SQLite
- 画像解析: Claude 3 Haiku (AWS Bedrock経由)
- ORM: Prisma
- テスト: Jest (フロントエンド), pytest (バックエンド)

## 2. 開発ステップ

### Phase 1: プロジェクトセットアップ ✅
1. 基本パッケージのインストール ✅
   - shadcn/uiセットアップ ✅
   - Prismaセットアップ ✅
   - AWS SDK & langchain-js ✅
   - テスト関連パッケージ ✅

2. 開発環境の整備 ✅
   - ESLint設定 ✅
   - prettier設定 ✅
   - husky (git hooks)
   - GitHub Actions (CI/CD)

3. データベース設計 ✅
   ```sql
   -- Photos テーブル
   CREATE TABLE photos (
     id INTEGER PRIMARY KEY,
     file_path TEXT NOT NULL,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP NOT NULL
   );

   -- Words テーブル
   CREATE TABLE words (
     id INTEGER PRIMARY KEY,
     photo_id INTEGER NOT NULL,
     spanish TEXT NOT NULL,
     japanese TEXT NOT NULL,
     example TEXT,
     part_of_speech TEXT,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP NOT NULL,
     FOREIGN KEY (photo_id) REFERENCES photos(id)
   );

   -- Learning Progress テーブル
   CREATE TABLE learning_progress (
     id INTEGER PRIMARY KEY,
     word_id INTEGER NOT NULL,
     status TEXT NOT NULL, -- 未学習/学習中/習得済み
     last_quiz_date TIMESTAMP,
     correct_count INTEGER DEFAULT 0,
     incorrect_count INTEGER DEFAULT 0,
     created_at TIMESTAMP NOT NULL,
     updated_at TIMESTAMP NOT NULL,
     FOREIGN KEY (word_id) REFERENCES words(id)
   );
   ```

### Phase 2: 写真アップロード機能 ✅
1. UI実装 ✅
   - アップロードコンポーネント作成 ✅
   - プレビュー表示 ✅
   - ドラッグ&ドロップ対応 ✅

2. バックエンド実装 ✅
   - アップロードAPI作成 ✅
   - 画像の一時保存処理 ✅
   - 画像の永続化処理 ✅

3. AWS Bedrock連携 ✅
   - 認証情報設定 ✅
   - Claude 3 Haiku呼び出し ✅
   - エラーハンドリング ✅

### Phase 3: 単語帳生成機能 ✅
1. LLMプロンプト設計 ✅
   - 画像解析プロンプト ✅
   - スペイン語単語抽出プロンプト ✅
   - 例文生成プロンプト ✅

2. 単語帳生成処理 ✅
   - LLMレスポンスのパース ✅
   - データベースへの保存 ✅
   - エラー時のリトライ処理 ✅

3. 単語帳表示UI ✅
   - カード形式での表示 ✅
   - ページネーション
   - アニメーション効果

### Phase 4: クイズ機能
1. クイズ生成機能
   - 問題形式の実装（日本語→スペイン語、スペイン語→日本語）
   - 難易度設定
   - 出題アルゴリズム

2. クイズUI
   - 問題表示画面
   - 回答入力フォーム
   - 結果表示画面

3. 学習データ記録
   - 正答率の計算
   - 学習進捗の更新
   - 苦手単語の特定

### Phase 5: 学習進捗管理
1. 進捗データの集計
   - 単語ごとの学習状況
   - 時系列での正答率
   - カテゴリー別の習得状況

2. 進捗表示UI
   - グラフ表示（Chart.js）
   - フィルタリング機能
   - CSV出力機能

### Phase 6: 単語帳編集機能
1. 編集UI
   - インライン編集フォーム
   - バリデーション
   - 変更履歴管理

2. バックエンド処理
   - 更新API
   - 整合性チェック
   - ロールバック機能

## 3. テスト計画
1. ユニットテスト
   - コンポーネントテスト（Jest + React Testing Library）
   - APIテスト（supertest）
   - LLM連携テスト（モック利用）

2. E2Eテスト
   - Cypress導入
   - 主要フロー確認
   - クロスブラウザテスト

## 4. 今後の拡張性
1. 多言語対応
   - 言語選択機能
   - 翻訳API連携

2. ユーザー管理
   - 認証機能
   - プロフィール管理

3. SNS連携
   - 学習記録のシェア
   - フレンド機能

## 5. 開発スケジュール
各フェーズの目安となる期間：
- Phase 1: 1週間
- Phase 2: 2週間
- Phase 3: 2週間
- Phase 4: 2週間
- Phase 5: 1週間
- Phase 6: 1週間

合計：約2ヶ月

## 6. 注意点
- セキュリティ
  - AWS認証情報の適切な管理
  - アップロード画像の検証
  - SQLインジェクション対策

- パフォーマンス
  - 画像の最適化
  - LLMレスポンスのキャッシュ
  - クエリの最適化

- UX
  - ローディング表示
  - エラーメッセージの適切な表示
  - レスポンシブデザイン
