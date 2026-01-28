# Chrome Web Store掲載情報

このドキュメントは、Chrome Web Storeに拡張機能を公開する際に必要な情報をまとめたものです。

## 基本情報

### 拡張機能名
```
NotebookLM Source Auto-Updater
```

または社内向けの名前：
```
NotebookLM 社内ツール - ソース自動更新
```

### 概要（132文字以内）
```
NotebookLMのソースを効率的に一括更新する社内ツール。全ソース更新と指定ソース更新に対応。
```

英語版（オプション）:
```
Internal tool for efficiently batch-updating NotebookLM sources. Supports both full and filtered updates.
```

## 詳細説明

### 日本語版
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
社内専用ツールです。NotebookLMを使用している社員向けに提供されています。

【セキュリティ】
本拡張機能は一切のユーザーデータを収集・送信しません。
すべての処理はブラウザ内で完結します。

【サポート】
お問い合わせ: [社内連絡先]
```

### 英語版（オプション）
```markdown
A Chrome extension for efficiently updating NotebookLM sources.

【Key Features】
✓ Batch update all sources automatically
✓ Filter function to update specific sources only
✓ Search preview before updating
✓ Progress indicator

【How to Use】
1. Click the extension icon on NotebookLM page
2. Select "All Sources" or "Filtered Sources"
3. For filtered sources, enter keywords and search
4. Click the update button

【Target Users】
Internal company tool for employees using NotebookLM.

【Security】
This extension does not collect or transmit any user data.
All processing is done within the browser.

【Support】
Contact: [Internal contact information]
```

## ストア掲載設定

### カテゴリ
- **Primary Category**: 生産性向上 (Productivity)
- **Secondary Category**: ツール (Tools)

### 言語
- 日本語（主言語）
- 英語（オプション）

### 公開範囲
**重要**: 社内配布用のため、以下のいずれかを選択

#### オプション1: Unlisted（推奨）
- URLを知っている人のみインストール可能
- 社内でURLを共有して配布
- Google Workspaceアカウントは不要

#### オプション2: Private
- 特定のGoogle Workspaceドメインのみアクセス可能
- より高いセキュリティ
- Workspace管理者の設定が必要

### 地域
- すべての地域（制限なし）
- または日本のみ

## メディアアセット

### アイコン
- **128x128**: `icons/icon-128.png` ✓（作成済み）
- **48x48**: `icons/icon-48.png` ✓（作成済み）
- **16x16**: `icons/icon-16.png` ✓（作成済み）

### スクリーンショット
- **メインスクリーンショット**: `screenshots/screenshot-1.png`（1280x800px）
  - 作成方法は `screenshots/README.md` を参照
  - **要作成**: 実際の拡張機能を使用してキャプチャが必要

### プロモーションタイル（オプション）
- **Small Tile**: 440x280px（オプション）
- **Large Tile**: 920x680px（オプション）
- **Marquee**: 1400x560px（オプション）

## プライバシー設定

### プライバシーポリシーURL
プライバシーポリシーを公開URLでホスティングする必要があります。

**オプション1: GitHub Pages**
```
https://[yourcompany].github.io/notebooklm-updater/PRIVACY_POLICY.html
```

**オプション2: 社内サーバー**
```
https://intranet.[yourcompany].com/tools/notebooklm-updater/privacy
```

**手順**:
1. `PRIVACY_POLICY.md` をHTMLに変換、またはそのままホスティング
2. 公開URLを取得
3. Chrome Web Storeの設定で指定

### プライバシー慣行の申告

**データ収集に関する質問への回答**:

1. **個人情報を収集しますか？**
   - **回答**: いいえ

2. **ユーザーデータを外部サーバーに送信しますか？**
   - **回答**: いいえ

3. **分析ツールを使用していますか？**
   - **回答**: いいえ

4. **Cookieを使用していますか？**
   - **回答**: いいえ

5. **ユーザーのWebサイト閲覧情報を収集しますか？**
   - **回答**: いいえ

6. **個人を特定できる情報を収集しますか？**
   - **回答**: いいえ

7. **データ処理の目的は何ですか？**
   - **回答**: 該当なし（データ収集なし）

## 権限の説明

Chrome Web Storeでは、各権限の使用目的を説明する必要があります。

### activeTab
**説明**:
```
現在開いているNotebookLMページにアクセスし、ソース更新ボタンを検出するために使用します。
ユーザーが拡張機能を起動した時のみ動作します。
```

### scripting
**説明**:
```
NotebookLMページ内のソース更新ボタンを自動的にクリックするために使用します。
ユーザーの指示に基づいてのみ実行されます。
```

### host_permissions (notebooklm.google.com)
**説明**:
```
NotebookLM（notebooklm.google.com）でのみ動作するように制限されています。
他のWebサイトではアクセスしません。
```

## 審査のための補足情報

### テストアカウント
**注意**: Chrome Web Storeの審査で必要な場合があります

```
テストURL: https://notebooklm.google.com/
説明: 公開されているGoogle NotebookLMで動作します。
      特別なアカウントは不要です。
```

### 使用方法の説明（審査者向け）
```markdown
【テスト手順】
1. https://notebooklm.google.com/ にアクセス
2. Googleアカウントでログイン（任意のアカウントで可）
3. 新しいノートを作成し、いくつかのソースを追加
4. 拡張機能アイコンをクリック
5. 「全ソースを自動更新」ボタンをクリック
6. 各ソースの更新ボタンが自動的にクリックされることを確認

【注意事項】
- NotebookLMは無料で使用できるGoogleのサービスです
- ソースが存在しない場合は、事前に追加してください
- 拡張機能はNotebookLMページでのみ動作します
```

## リリースノート

### バージョン 1.0.0（初回リリース）
```markdown
【初回リリース】
- 全ソース自動更新機能
- 指定ソース更新機能（フィルタ付き）
- 検索プレビュー機能
- 進捗状況表示
```

### 今後のバージョン（例）
```markdown
バージョン 1.1.0:
- 更新間隔のカスタマイズ機能
- キャンセルボタンの追加
- UI/UXの改善

バージョン 1.2.0:
- スケジュール更新機能
- 複数NotebookLM対応
- エクスポート機能
```

## チェックリスト

公開前に以下を確認してください：

### 必須項目
- [ ] アイコン（16, 48, 128px）を作成済み ✓
- [ ] manifest.jsonにアイコンを追加済み ✓
- [ ] スクリーンショット（1280x800px）を作成（要手動作成）
- [ ] PRIVACY_POLICY.mdを作成済み ✓
- [ ] プライバシーポリシーを公開URLでホスティング（要実施）
- [ ] ストア掲載情報を準備済み ✓
- [ ] 配布用zipファイルを作成（要実施）
- [ ] ローカルでテスト済み（要実施）

### オプション項目
- [ ] プロモーションタイル作成
- [ ] 複数言語対応
- [ ] 動画デモ作成

### 公開設定
- [ ] Chrome Web Store Developer登録完了（$5支払い済み）
- [ ] 公開範囲を「Unlisted」に設定
- [ ] プライバシー慣行を正しく申告
- [ ] 権限の説明を記載

## 次のステップ

1. **スクリーンショット作成**
   - NotebookLMで拡張機能を使用して画面キャプチャ
   - 1280x800pxにリサイズ
   - `screenshots/screenshot-1.png` として保存

2. **プライバシーポリシーのホスティング**
   - GitHub PagesまたはイントラネットでPRIVACY_POLICY.mdを公開
   - URLを記録

3. **zipファイル作成**
   ```bash
   cd /Users/shirahama.junya/Desktop/chromeNotebookLM
   zip -r notebooklm-updater-v1.0.0.zip . \
     -x "*.md" \
     -x "*.DS_Store" \
     -x "screenshots/*" \
     -x ".git/*" \
     -x "*.svg"
   ```

4. **Chrome Web Store Developer Dashboard**
   - https://chrome.google.com/webstore/devconsole
   - 新しいアイテムをアップロード
   - このドキュメントの情報を入力
   - 審査のために送信

5. **審査待ち**
   - 1-3営業日で結果通知
   - 承認後、公開URLを社内共有

---

**最終更新**: 2026-01-28
