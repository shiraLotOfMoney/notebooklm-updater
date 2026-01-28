# Chrome Web Store 公開ガイド

このガイドでは、NotebookLM Source Auto-Updater拡張機能をChrome Web Storeに公開し、社内で配布する手順を説明します。

## 目次

1. [事前準備](#事前準備)
2. [Chrome Web Store Developer登録](#chrome-web-store-developer登録)
3. [配布用パッケージの作成](#配布用パッケージの作成)
4. [Chrome Web Storeへの公開](#chrome-web-storeへの公開)
5. [審査と公開](#審査と公開)
6. [社内配布](#社内配布)
7. [更新とメンテナンス](#更新とメンテナンス)

---

## 事前準備

### 1. 必要なファイルの確認

以下のファイルが揃っていることを確認してください：

- [x] `manifest.json` - アイコン情報を含む
- [x] `popup.html`, `popup.js`, `content.js`, `styles.css`
- [x] `icons/icon-16.png`, `icons/icon-48.png`, `icons/icon-128.png`
- [x] `PRIVACY_POLICY.md`
- [x] `USER_GUIDE.md`
- [x] `README.md`
- [ ] `screenshots/screenshot-1.png` - **要作成**

### 2. スクリーンショットの作成

Chrome Web Storeには最低1枚のスクリーンショットが必要です。

**手順:**

1. **拡張機能をローカルで読み込む**
   ```
   chrome://extensions/ → デベロッパーモード → パッケージ化されていない拡張機能を読み込む
   ```

2. **NotebookLMにアクセス**
   ```
   https://notebooklm.google.com/
   ```

3. **拡張機能を起動して画面をキャプチャ**
   - 拡張機能アイコンをクリック
   - ポップアップが表示された状態でスクリーンショットを撮る
   - macOS: `Cmd + Shift + 4` で範囲選択
   - Windows: `Win + Shift + S` または Snipping Tool

4. **リサイズと保存**
   ```bash
   # macOSの場合（sipsコマンド）
   sips -z 800 1280 captured-screenshot.png --out screenshots/screenshot-1.png
   ```

   または、オンラインツールを使用：
   - https://imageresizer.com/
   - サイズ: 1280x800px または 640x400px

### 3. プライバシーポリシーの公開

Chrome Web Storeでは、プライバシーポリシーを公開URLでホスティングする必要があります。

#### オプションA: GitHub Pages（推奨）

1. **GitHubリポジトリを作成**
   ```bash
   # GitHubでリポジトリを作成（例: notebooklm-updater）
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-org]/notebooklm-updater.git
   git push -u origin main
   ```

2. **GitHub Pagesを有効化**
   - リポジトリの Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root
   - Save

3. **URLを確認**
   ```
   https://[your-org].github.io/notebooklm-updater/PRIVACY_POLICY
   ```

#### オプションB: 社内イントラネット

1. **PRIVACY_POLICY.mdを社内サーバーに配置**
   ```
   https://intranet.[yourcompany].com/tools/notebooklm-updater/privacy
   ```

2. **アクセス確認**
   - 社内ネットワークからアクセス可能であることを確認
   - Chrome Web Storeの審査担当者がアクセスできるようにする必要があります
   - **注意**: イントラネットの場合、審査時にアクセスできない可能性があります
   - GitHub Pagesの方が推奨されます

---

## Chrome Web Store Developer登録

### 1. Developer Dashboardにアクセス

```
https://chrome.google.com/webstore/devconsole
```

### 2. Googleアカウントでログイン

- 社内のGoogle Workspaceアカウントを推奨
- 個人アカウントでも可

### 3. 登録料の支払い

- 初回のみ$5の登録料が必要（一度限り）
- クレジットカードまたはPayPalで支払い

### 4. 開発者アカウントの有効化

- 支払い後、すぐにアカウントが有効化されます
- Developer Dashboardが使用可能になります

---

## 配布用パッケージの作成

### 1. プロジェクトディレクトリに移動

```bash
cd /Users/shirahama.junya/Desktop/chromeNotebookLM
```

### 2. 不要なファイルを除外してzipを作成

```bash
zip -r notebooklm-updater-v1.0.0.zip . \
  -x "*.md" \
  -x "*.DS_Store" \
  -x "screenshots/*" \
  -x ".git/*" \
  -x "*.svg" \
  -x "OPTIMIZATION_SUMMARY.md"
```

**含めるファイル:**
- manifest.json
- popup.html
- popup.js
- content.js
- styles.css
- icons/icon-16.png
- icons/icon-48.png
- icons/icon-128.png

**除外するファイル:**
- ドキュメント（*.md）
- スクリーンショット（screenshots/）
- Gitファイル（.git/）
- ソースSVG（*.svg）
- macOSの一時ファイル（.DS_Store）

### 3. zipファイルの確認

```bash
# zip内容を確認
unzip -l notebooklm-updater-v1.0.0.zip

# ファイルサイズを確認（10MB以下であることを確認）
ls -lh notebooklm-updater-v1.0.0.zip
```

---

## Chrome Web Storeへの公開

### 1. Developer Dashboardで新しいアイテムを作成

1. **「新しいアイテム」をクリック**
2. **zipファイルをアップロード**
   - `notebooklm-updater-v1.0.0.zip` を選択
   - アップロード完了を待つ

### 2. ストア掲載情報を入力

#### 基本情報

**拡張機能名:**
```
NotebookLM Source Auto-Updater
```

**概要（132文字以内）:**
```
NotebookLMのソースを効率的に一括更新する社内ツール。全ソース更新と指定ソース更新に対応。
```

**詳細説明:**
```markdown
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

【対象ユーザー】
社内専用ツールです。

【サポート】
お問い合わせ: [社内連絡先]
```

**カテゴリ:**
- Primary: 生産性向上 (Productivity)

**言語:**
- 日本語

#### メディア

**アイコン:**
- 128x128px: アップロード済み（manifest.jsonから自動読み込み）

**スクリーンショット:**
- `screenshots/screenshot-1.png` をアップロード（1280x800px）
- 追加のスクリーンショットもアップロード可能（最大5枚）

### 3. プライバシー設定

#### プライバシーポリシーURL
```
https://[your-org].github.io/notebooklm-updater/PRIVACY_POLICY
```

#### プライバシー慣行の申告

以下の質問に答えます：

1. **個人情報を収集しますか？**
   - ☐ はい
   - ☑ いいえ

2. **ユーザーデータを外部サーバーに送信しますか？**
   - ☐ はい
   - ☑ いいえ

3. **分析ツールを使用していますか？**
   - ☐ はい
   - ☑ いいえ

4. **広告を表示しますか？**
   - ☐ はい
   - ☑ いいえ

#### 権限の説明

**activeTab:**
```
現在開いているNotebookLMページにアクセスし、ソース更新ボタンを検出するために使用します。
```

**scripting:**
```
NotebookLMページ内のソース更新ボタンを自動的にクリックするために使用します。
```

**host_permissions:**
```
NotebookLM（notebooklm.google.com）でのみ動作します。
```

### 4. 公開範囲の設定

**重要**: 社内配布用のため、「Unlisted（非公開）」を選択

- ☑ **Unlisted（推奨）**
  - URLを知っている人のみインストール可能
  - 社内でURLを共有して配布
  - Google Workspaceアカウントは不要

- ☐ **Private**
  - 特定のGoogle Workspaceドメインのみ
  - Workspace管理者の設定が必要

- ☐ **Public**
  - 全世界に公開（社内専用のため選択しない）

### 5. 審査のために送信

1. すべての項目を確認
2. 「審査のために送信」ボタンをクリック
3. 送信完了の確認

---

## 審査と公開

### 1. 審査期間

- 通常1-3営業日で審査完了
- 複雑な拡張機能の場合は最大7営業日

### 2. 審査中のステータス確認

- Developer Dashboardで「Pending Review」と表示される
- メールで審査状況が通知される

### 3. 審査結果

#### 承認された場合

- メールで通知が届く
- ステータスが「Published」に変更
- 公開URLが発行される
  ```
  https://chrome.google.com/webstore/detail/[拡張機能ID]
  ```

#### 却下された場合

- メールで理由が通知される
- 修正して再提出が可能
- よくある却下理由:
  - プライバシーポリシーにアクセスできない
  - 権限の説明が不十分
  - スクリーンショットが不適切

### 4. 公開URLの取得

承認後、以下のURLが発行されます：

```
https://chrome.google.com/webstore/detail/notebooklm-source-auto-up/[ID]
```

このURLを社内で共有します。

---

## 社内配布

### 1. インストールURLの共有

#### Slackでの告知例

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
https://[link-to-user-guide]

ご質問は #notebooklm-support までお願いします！
```

#### メールでの告知例

```
件名: 【新ツール】NotebookLM Source Auto-Updater リリースのお知らせ

お疲れ様です。

NotebookLMのソースを効率的に更新できるChrome拡張機能をリリースしました。

■ インストール方法
1. 以下のURLにアクセス
   https://chrome.google.com/webstore/detail/[ID]
2. 「Chromeに追加」をクリック
3. 権限確認で「拡張機能を追加」をクリック

■ 主な機能
・全ソースを一括で自動更新
・フィルタ機能で特定のソースのみ更新
・検索プレビューで更新前に確認
・進捗状況の表示

■ 詳細・使い方
ユーザーガイド: https://[link-to-user-guide]

■ お問い合わせ
[連絡先]

よろしくお願いいたします。
```

### 2. イントラネットへの掲載

社内ポータルサイトやイントラネットに以下の情報を掲載：

- インストールURL
- 主な機能の説明
- ユーザーガイドへのリンク
- お問い合わせ先

### 3. サポート体制の整備

#### FAQページの作成

- `USER_GUIDE.md` の「よくある質問」セクションを参照
- 社内Wikiやイントラネットに掲載

#### 問い合わせ窓口

- Slackチャンネル: `#notebooklm-support`
- メール: `[support-email]`
- 社内チケットシステム

#### サポート対応者

- 開発担当者の連絡先を明記
- 営業時間内のサポート体制

---

## 更新とメンテナンス

### 1. バージョンアップの手順

#### ステップ1: コードの修正

```bash
# 機能追加やバグ修正
git checkout -b feature/new-feature
# コードを修正
git commit -m "Add new feature"
git push origin feature/new-feature
```

#### ステップ2: manifest.jsonのバージョン更新

```json
{
  "version": "1.1.0"
}
```

セマンティックバージョニング:
- メジャー (1.x.x): 破壊的変更
- マイナー (x.1.x): 新機能追加
- パッチ (x.x.1): バグ修正

#### ステップ3: リリースノートの作成

```markdown
## v1.1.0 (2026-02-15)

### 新機能
- 更新間隔のカスタマイズ機能を追加
- キャンセルボタンを追加

### バグ修正
- 大量のソースがある場合のタイムアウトを修正

### 改善
- UIの応答性を向上
```

#### ステップ4: 新しいzipを作成

```bash
zip -r notebooklm-updater-v1.1.0.zip . \
  -x "*.md" \
  -x "*.DS_Store" \
  -x "screenshots/*" \
  -x ".git/*" \
  -x "*.svg"
```

#### ステップ5: Chrome Web Storeで更新

1. Developer Dashboardにアクセス
2. 既存のアイテムを選択
3. 「パッケージ」タブをクリック
4. 「パッケージをアップロード」をクリック
5. 新しいzipファイルをアップロード
6. 変更内容を記載
   ```
   バージョン 1.1.0
   - 更新間隔のカスタマイズ機能を追加
   - キャンセルボタンを追加
   - バグ修正とパフォーマンス改善
   ```
7. 「変更を保存して送信」をクリック

#### ステップ6: 審査と自動配信

- 審査完了後（1-3営業日）、自動的にユーザーに配信される
- ユーザーは手動で更新する必要なし

### 2. 緊急バグ修正

重大なバグが見つかった場合の対応：

1. **即座に修正**
   ```bash
   git checkout -b hotfix/critical-bug
   # バグを修正
   git commit -m "Fix critical bug"
   ```

2. **パッチバージョンを上げる**
   ```json
   {
     "version": "1.0.1"
   }
   ```

3. **迅速にリリース**
   - zipを作成してアップロード
   - Chrome Web Storeで緊急審査をリクエスト

### 3. NotebookLMのUI変更への対応

NotebookLMのUI変更により拡張機能が動作しなくなった場合：

1. **問題の特定**
   - ユーザーからの報告を確認
   - NotebookLMのUI変更を調査

2. **セレクターの更新**
   - `content.js` でDOMセレクターを更新
   - テストして動作確認

3. **パッチリリース**
   - バージョンを上げてリリース
   - ユーザーに変更を告知

### 4. 自動更新の確認

ユーザーが最新バージョンを使用しているか確認：

```javascript
// manifest.json のバージョンをコンソールで確認
chrome.runtime.getManifest().version
```

---

## トラブルシューティング

### 審査で却下された場合

**理由1: プライバシーポリシーにアクセスできない**
- 解決策: URLが正しいか確認し、アクセス可能な状態にする

**理由2: 権限の説明が不十分**
- 解決策: より詳細な説明を追加

**理由3: スクリーンショットが不適切**
- 解決策: より明確なスクリーンショットを作成

### ユーザーがインストールできない

**原因1: URLが間違っている**
- 解決策: 正しいURLを共有

**原因2: 会社のポリシーでブロックされている**
- 解決策: IT部門に連絡してホワイトリストに追加

**原因3: Chromeのバージョンが古い**
- 解決策: Chromeを最新版に更新

---

## チェックリスト

### 公開前

- [x] アイコン作成済み
- [x] manifest.jsonにアイコン追加済み
- [ ] スクリーンショット作成
- [x] PRIVACY_POLICY.md作成済み
- [ ] プライバシーポリシーをホスティング
- [x] USER_GUIDE.md作成済み
- [x] README.md作成済み
- [ ] 配布用zip作成
- [ ] ローカルでテスト完了
- [ ] Chrome Web Store Developer登録完了

### 公開時

- [ ] ストア掲載情報入力完了
- [ ] プライバシー設定完了
- [ ] 公開範囲を「Unlisted」に設定
- [ ] 審査のために送信完了

### 公開後

- [ ] 審査承認確認
- [ ] 公開URL取得
- [ ] 社内告知（Slack/メール/イントラ）
- [ ] サポート体制整備
- [ ] フィードバック収集

---

**最終更新**: 2026-01-28
