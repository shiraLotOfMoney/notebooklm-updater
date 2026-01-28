# クイックスタートガイド

NotebookLM Source Auto-Updater拡張機能をChrome Web Storeに公開し、社内配布するための最短手順です。

---

## 📋 チェックリスト

### ✅ 完了済み
- [x] アイコン作成（16px, 48px, 128px）
- [x] manifest.jsonにアイコン追加
- [x] プライバシーポリシー作成
- [x] ユーザーガイド作成
- [x] README作成
- [x] ストア掲載情報準備
- [x] デプロイメントガイド作成

### 🔲 あなたが実施すること

#### 必須（Chrome Web Store公開前）
- [ ] **ステップ1**: ローカルテスト（30分）
- [ ] **ステップ2**: スクリーンショット作成（15分）
- [ ] **ステップ3**: プライバシーポリシーのホスティング（30分）
- [ ] **ステップ4**: Chrome Web Store Developer登録（15分、$5）
- [ ] **ステップ5**: zipファイル作成と公開申請（45分）

#### 審査後
- [ ] **ステップ6**: 審査待ち（1-3営業日）
- [ ] **ステップ7**: 社内配布（1時間）

---

## 🚀 5ステップで公開

### ステップ1: ローカルテスト（30分）

**目的**: 拡張機能が正常に動作することを確認

```bash
# 1. Chromeを開く
# 2. アドレスバーに入力
chrome://extensions/

# 3. 右上の「デベロッパーモード」をオンにする
# 4. 「パッケージ化されていない拡張機能を読み込む」をクリック
# 5. このディレクトリを選択
/Users/shirahama.junya/Desktop/chromeNotebookLM
```

**テスト項目**:
- [ ] アイコンが表示される
- [ ] NotebookLMでポップアップが開く
- [ ] 全ソース更新が動作する
- [ ] 指定ソース更新（フィルタ機能）が動作する
- [ ] エラーが出ない

**問題があれば**: `README.md` のトラブルシューティングを参照

---

### ステップ2: スクリーンショット作成（15分）

**目的**: Chrome Web Store掲載用の画像を作成

```bash
# 1. NotebookLMで拡張機能を起動
https://notebooklm.google.com/

# 2. 拡張機能アイコンをクリック
# 3. 画面キャプチャ（macOS: Cmd+Shift+4）
# 4. リサイズ
sips -z 800 1280 ~/Desktop/captured-screenshot.png \
  --out screenshots/screenshot-1.png

# 5. 確認
ls -lh screenshots/screenshot-1.png
```

**要件**:
- サイズ: 1280x800px または 640x400px
- 形式: PNG
- 内容: ポップアップが表示されている状態

**詳細**: `screenshots/README.md` を参照

---

### ステップ3: プライバシーポリシーのホスティング（30分）

**目的**: Chrome Web Storeの必須要件を満たす

#### オプションA: GitHub Pages（推奨）

```bash
# GitHubリポジトリを作成
cd /Users/shirahama.junya/Desktop/chromeNotebookLM
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[your-org]/notebooklm-updater.git
git push -u origin main

# GitHub.comでリポジトリの Settings → Pages に移動
# Source: Deploy from a branch
# Branch: main / root
# Save
```

**取得するURL**:
```
https://[your-org].github.io/notebooklm-updater/PRIVACY_POLICY
```

#### オプションB: 社内イントラネット

```bash
# PRIVACY_POLICY.mdを社内サーバーに配置
# 例: https://intranet.[yourcompany].com/tools/notebooklm-updater/privacy
```

⚠️ **注意**: イントラネットの場合、Chrome Web Storeの審査担当者がアクセスできない可能性があります。GitHub Pagesを推奨します。

**取得したURLをメモ**: `__________________________`

---

### ステップ4: Chrome Web Store Developer登録（15分）

**目的**: 拡張機能を公開する権限を取得

```bash
# 1. Developer Dashboardにアクセス
https://chrome.google.com/webstore/devconsole

# 2. Googleアカウントでログイン
# （社内Workspaceアカウント推奨）

# 3. 初回のみ$5の登録料を支払い
# （クレジットカードまたはPayPal）

# 4. アカウント有効化を確認
```

**費用**: $5（一度限り）
**所要時間**: 約15分

---

### ステップ5: zipファイル作成と公開申請（45分）

#### 5-1. zipファイル作成

```bash
cd /Users/shirahama.junya/Desktop/chromeNotebookLM

# 配布用zipを作成
zip -r notebooklm-updater-v1.0.0.zip . \
  -x "*.md" \
  -x "*.DS_Store" \
  -x "screenshots/*" \
  -x ".git/*" \
  -x "*.svg" \
  -x ".claude/*"

# 内容を確認
unzip -l notebooklm-updater-v1.0.0.zip

# サイズを確認（10MB以下であること）
ls -lh notebooklm-updater-v1.0.0.zip
```

#### 5-2. Chrome Web Storeに公開

```bash
# 1. Developer Dashboardにアクセス
https://chrome.google.com/webstore/devconsole

# 2. 「新しいアイテム」をクリック

# 3. zipファイルをアップロード
notebooklm-updater-v1.0.0.zip

# 4. ストア掲載情報を入力（以下のテンプレートを使用）
```

**拡張機能名**:
```
NotebookLM Source Auto-Updater
```

**概要（132文字以内）**:
```
NotebookLMのソースを効率的に一括更新する社内ツール。全ソース更新と指定ソース更新に対応。
```

**詳細説明**:
```
NotebookLMのソースを効率的に更新するChrome拡張機能です。

【主な機能】
✓ 全ソースを一括で自動更新
✓ フィルタ機能で特定のソースのみ更新
✓ 検索プレビューで更新前に確認
✓ 進捗状況の表示

【使い方】
1. NotebookLMページで拡張機能アイコンをクリック
2. 「全ソース」または「指定ソース」を選択
3. 指定ソースの場合はフィルタキーワードを入力して検索
4. 更新ボタンをクリック

社内専用ツールです。
```

**カテゴリ**: 生産性向上 (Productivity)

**プライバシーポリシーURL**:
```
[ステップ3で取得したURL]
```

**プライバシー慣行**:
- 個人情報を収集: いいえ
- ユーザーデータを外部送信: いいえ
- 分析ツール: いいえ

**公開範囲**: ☑ Unlisted（非公開）

**スクリーンショット**: `screenshots/screenshot-1.png` をアップロード

#### 5-3. 審査のために送信

```bash
# 「審査のために送信」ボタンをクリック
```

**詳細**: `STORE_LISTING.md` を参照

---

### ステップ6: 審査待ち（1-3営業日）

**目的**: Googleの審査を通過

- メールで審査状況が通知されます
- 通常1-3営業日で完了
- 問題があれば修正して再提出

**審査中のステータス**: Developer Dashboardで「Pending Review」と表示

**承認されたら**:
- メールで通知
- 公開URLが発行される
  ```
  https://chrome.google.com/webstore/detail/[拡張機能ID]
  ```
- このURLを次のステップで使用

---

### ステップ7: 社内配布（1時間）

**目的**: 社内ユーザーにインストールしてもらう

#### 7-1. 公開URLを取得

```
https://chrome.google.com/webstore/detail/[拡張機能ID]
```

#### 7-2. 社内告知

**Slackでの告知例**:
```markdown
:tada: NotebookLM Source Auto-Updater がリリースされました！

NotebookLMのソースを一括更新できるChrome拡張機能です。

【インストール】
https://chrome.google.com/webstore/detail/[ID]

【主な機能】
・全ソースを一括更新
・指定ソースのみ更新（フィルタ機能）
・検索プレビュー
・進捗表示

【ユーザーガイド】
[USER_GUIDE.mdへのリンク]

ご質問は #notebooklm-support までお願いします！
```

**メールでの告知**: `DEPLOYMENT_GUIDE.md` の「社内配布」セクション参照

#### 7-3. サポート体制

- Slackチャンネル: `#notebooklm-support` を作成
- メール: `shirahama.junya@moneyforward.co.jp` を設定
- FAQ: `USER_GUIDE.md` を社内Wikiに掲載

---

## 📚 詳細ドキュメント

各ステップの詳細情報は以下のドキュメントを参照してください：

| ドキュメント | 内容 | 対象者 |
|------------|------|--------|
| `DEPLOYMENT_GUIDE.md` | 公開手順の詳細 | 管理者 |
| `STORE_LISTING.md` | ストア掲載情報 | 管理者 |
| `USER_GUIDE.md` | 使い方とFAQ | エンドユーザー |
| `README.md` | 開発情報 | 開発者 |
| `PRIVACY_POLICY.md` | プライバシーポリシー | 全員 |
| `IMPLEMENTATION_STATUS.md` | 実装状況 | 管理者 |

---

## ⚠️ よくある問題

### 問題1: ローカルテストでアイコンが表示されない
**解決策**: Chromeを再起動して拡張機能を再読み込み

### 問題2: スクリーンショットのサイズが合わない
**解決策**:
```bash
sips -z 800 1280 input.png --out output.png
```

### 問題3: プライバシーポリシーにアクセスできないエラー
**解決策**: URLが正しく公開されているか確認。GitHub Pagesの場合、反映に数分かかる場合があります。

### 問題4: 審査で却下された
**解決策**: メールで通知された理由を確認し、修正して再提出。`DEPLOYMENT_GUIDE.md` のトラブルシューティング参照。

---

## 🎯 成功のポイント

1. **ローカルテストを徹底する**
   - 公開前にすべての機能をテスト
   - エラーがないことを確認

2. **スクリーンショットは見栄え良く**
   - 機能が分かりやすい画面を選ぶ
   - 高解像度で撮影

3. **プライバシーポリシーは必ずアクセス可能に**
   - GitHub Pagesを推奨
   - 審査担当者がアクセスできることを確認

4. **Unlistedで公開する**
   - 社内配布にはUnlistedが最適
   - URLを知っている人のみインストール可能

5. **ユーザーガイドを社内共有**
   - インストール方法を明確に
   - サポート窓口を設置

---

## 📞 サポート

### 技術的な質問
- 開発者: shirahama.junya@moneyforward.co.jp

### ユーザーサポート
- Slack: `#notebooklm-support`
- メール: shirahama.junya@moneyforward.co.jp

---

## ✅ 完了確認

すべてのステップが完了したら、以下を確認してください：

- [ ] 拡張機能がChrome Web Storeで公開されている
- [ ] 公開URLを取得した
- [ ] 社内で告知した（Slack/メール/イントラ）
- [ ] サポート体制を整えた
- [ ] ユーザーガイドを共有した
- [ ] 初期ユーザーからのフィードバックを収集する準備ができている

**おめでとうございます！🎉**

拡張機能が社内で利用可能になりました。

---

**推定作業時間**: 2時間15分（審査待ち除く）
**全体期間**: 2-4日（審査期間含む）

**次のアクション**: ステップ1のローカルテストから開始してください。

**最終更新**: 2026-01-28
