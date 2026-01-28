# NotebookLM Source Auto-Updater

Google NotebookLMのソースを効率的に一括更新するChrome拡張機能です。

## 機能概要

### 主な機能
- **全ソース自動更新**: NotebookLM内のすべてのソースを一括で自動更新
- **指定ソース更新**: フィルタ機能で特定のソースのみを選択的に更新
- **検索プレビュー**: 更新前に該当するソースを確認
- **進捗表示**: 更新状況をリアルタイムで表示
- **シンプルなUI**: 直感的なトグルとボタンで簡単操作

### 技術仕様
- **Manifest Version**: 3
- **対応ブラウザ**: Chrome, Microsoft Edge (Chromiumベース)
- **権限**: activeTab, scripting
- **対象サイト**: https://notebooklm.google.com/*

## プロジェクト構成

```
chromeNotebookLM/
├── manifest.json           # 拡張機能のメタデータと設定
├── popup.html              # ポップアップUIのHTML
├── popup.js                # ポップアップのロジック
├── content.js              # NotebookLMページに注入されるスクリプト
├── styles.css              # ポップアップのスタイル
├── icons/                  # 拡張機能のアイコン
│   ├── icon-16.png         # ツールバー用（16x16）
│   ├── icon-48.png         # 拡張機能管理ページ用（48x48）
│   ├── icon-128.png        # Chrome Web Store用（128x128）
│   └── icon.svg            # ソースSVG
├── PRIVACY_POLICY.md       # プライバシーポリシー
├── USER_GUIDE.md           # ユーザーガイド
└── README.md               # このファイル
```

## 開発環境のセットアップ

### 必要な環境
- Google Chrome（最新版推奨）
- テキストエディタ（VS Code推奨）
- Git（バージョン管理用）

### ローカル開発手順

1. **リポジトリのクローン**
   ```bash
   git clone [リポジトリURL]
   cd chromeNotebookLM
   ```

2. **Chromeに拡張機能を読み込む**
   - Chromeで `chrome://extensions/` にアクセス
   - 右上の「デベロッパーモード」をオンにする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `chromeNotebookLM` ディレクトリを選択

3. **動作確認**
   - https://notebooklm.google.com/ にアクセス
   - ツールバーの拡張機能アイコンをクリック
   - ポップアップが表示されることを確認

### 開発時の注意点

- **コード変更時**: 拡張機能の再読み込みが必要
  - `chrome://extensions/` で「更新」ボタンをクリック
  - またはCmd+R（Mac）/ Ctrl+R（Windows）

- **デバッグ方法**:
  - ポップアップ: ポップアップ上で右クリック → 「検証」
  - Content Script: NotebookLMページで右クリック → 「検証」→ Console
  - Background: `chrome://extensions/` → 「サービスワーカー」をクリック

## ビルド手順

### 配布用zipの作成

Chrome Web Storeにアップロードするためのzipファイルを作成します。

```bash
# プロジェクトディレクトリに移動
cd /path/to/chromeNotebookLM

# 不要なファイルを除外してzip作成
zip -r notebooklm-updater-v1.0.0.zip . \
  -x "*.md" \
  -x "*.DS_Store" \
  -x "screenshots/*" \
  -x ".git/*" \
  -x "*.svg"
```

### 含めるファイル
- manifest.json
- popup.html
- popup.js
- content.js
- styles.css
- icons/*.png（16, 48, 128のみ）

### 除外するファイル
- *.md（ドキュメント）
- screenshots/（Chrome Web Store用資料）
- .git/（Gitディレクトリ）
- *.svg（ソースファイル）
- .DS_Store（macOS用一時ファイル）

## バージョン管理

### セマンティックバージョニング

本プロジェクトは[セマンティックバージョニング](https://semver.org/)に従います。

- **メジャーバージョン**: 破壊的変更（例: 1.0.0 → 2.0.0）
- **マイナーバージョン**: 新機能追加（例: 1.0.0 → 1.1.0）
- **パッチバージョン**: バグ修正（例: 1.0.0 → 1.0.1）

### バージョンの更新手順

1. **manifest.jsonのバージョンを更新**
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **変更内容を記録**
   - リリースノートを作成（後述）

3. **Gitにコミット**
   ```bash
   git add manifest.json
   git commit -m "Bump version to 1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

## リリースプロセス

### リリース前チェックリスト

- [ ] すべての機能が正常に動作することを確認
- [ ] manifest.jsonのバージョンを更新
- [ ] CHANGELOG.md（またはリリースノート）を更新
- [ ] ローカルでテスト（デベロッパーモードで読み込み）
- [ ] 配布用zipを作成
- [ ] zipファイルの内容を確認（不要なファイルが含まれていないか）

### Chrome Web Storeへの公開

1. **Chrome Web Store Developer Dashboardにアクセス**
   - https://chrome.google.com/webstore/devconsole

2. **新規アップロード（初回）**
   - 「新しいアイテム」をクリック
   - zipファイルをアップロード
   - ストア掲載情報を入力
   - 公開範囲を「Unlisted（非公開）」に設定
   - 審査のために送信

3. **更新アップロード（2回目以降）**
   - 既存のアイテムを選択
   - 「パッケージ」タブで「パッケージをアップロード」
   - 新しいzipファイルをアップロード
   - 変更内容を記載
   - 「変更を保存して送信」

4. **審査待ち**
   - 通常1-3営業日で審査完了
   - 問題があれば修正して再提出

5. **公開完了**
   - 審査通過後、数時間以内にユーザーに自動配信

### リリースノート

各バージョンの変更内容を記録します。

**フォーマット例:**
```markdown
## v1.1.0 (2026-02-15)

### 新機能
- 検索プレビュー機能を追加
- 進捗表示のUI改善

### バグ修正
- 大量のソースがある場合のタイムアウトを修正
- フィルタの大文字小文字判定を修正

### その他
- パフォーマンスの最適化
```

## コーディング規約

### JavaScript
- ES2020以降の構文を使用
- `const` / `let` を使用（`var` は使用しない）
- アロー関数を優先
- async/await を使用（Promise.thenチェーンは避ける）

### HTML/CSS
- セマンティックなHTML5タグを使用
- BEM記法でクラス名を命名
- インラインスタイルは避ける

### コメント
- 複雑なロジックには日本語でコメントを追加
- TODOコメントには日付と担当者を記載

## トラブルシューティング（開発者向け）

### 拡張機能が読み込めない
- manifest.jsonの構文エラーを確認
- 必須フィールドが正しく設定されているか確認

### Content Scriptが動作しない
- NotebookLMのページ構造が変更されていないか確認
- Console でエラーを確認
- `matches` パターンが正しいか確認

### ポップアップが表示されない
- popup.htmlのパスが正しいか確認
- HTMLの構文エラーがないか確認

## セキュリティ

### セキュリティ原則
- 最小権限の原則: 必要最小限の権限のみを要求
- XSS対策: ユーザー入力を適切にエスケープ
- データ保護: 個人情報を収集・送信しない

### セキュリティレビュー
- リリース前にコードレビューを実施
- 外部ライブラリは信頼できるソースから取得
- 定期的にセキュリティアップデートを確認

## ライセンス

[ライセンス情報を記載]

## 貢献

### バグ報告
shirahama.junya@moneyforward.co.jp

### 機能要望
shirahama.junya@moneyforward.co.jp

### Pull Request
1. フォークしてブランチを作成
2. 変更を実装
3. テストを実行
4. Pull Requestを作成

## サポート

### 開発者向けサポート
- 技術的な質問: shirahama.junya@moneyforward.co.jp
- コードレビュー依頼: shirahama.junya@moneyforward.co.jp

### ユーザー向けサポート
- ユーザーガイドを参照: [USER_GUIDE.md](./USER_GUIDE.md)
- 問い合わせ先: shirahama.junya@moneyforward.co.jp

## リンク

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

---

**Current Version:** 1.0.0
**Last Updated:** 2026-01-28
