# サロン未来 - デプロイガイド

このガイドでは、サロン未来のウェブサイトと管理システムをクラウドにデプロイする手順を説明します。

## 🚀 システム概要

- **ウェブサイト**: 美容サロンの公式サイト（静的サイト）
- **管理システム**: リアルタイム更新可能な管理画面
- **データベース**: Firebase Realtime Database
- **デプロイ先**: Netlify（またはVercel）

## 📋 デプロイ前の準備

### 1. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `salon-mirai`
4. Google Analytics: 無効でOK
5. プロジェクト作成完了

### 2. Firebase設定

1. Firebase Console > プロジェクト設定 > 全般タブ
2. 「ウェブアプリを追加」をクリック
3. アプリ名: `salon-mirai-web`
4. 設定情報をコピー

### 3. Realtime Database設定

1. Firebase Console > 構築 > Realtime Database
2. 「データベースを作成」
3. 場所: asia-southeast1（シンガポール）
4. セキュリティルール: テストモードで開始

### 4. セキュリティルール設定

Realtime Databaseのルールタブで以下を設定：

```json
{
  "rules": {
    "salonData": {
      ".read": true,
      ".write": true
    },
    "adminLogs": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 🔧 設定ファイル更新

### firebase-integration.js の設定

`js/firebase-integration.js` ファイルの設定を更新：

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "salon-mirai.firebaseapp.com",
    databaseURL: "https://salon-mirai-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "salon-mirai",
    storageBucket: "salon-mirai.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## 🌐 Netlifyデプロイ

### 方法1: GitHub経由（推奨）

1. GitHubリポジトリを作成
2. プロジェクトファイルをpush
3. [Netlify](https://netlify.com) にログイン
4. 「New site from Git」
5. GitHubリポジトリを選択
6. 設定:
   - Build command: `echo "No build needed"`
   - Publish directory: `/`
7. 「Deploy site」

### 方法2: ドラッグ&ドロップ

1. プロジェクトフォルダをZIP化
2. Netlify の Deploy manually
3. ZIPファイルをドラッグ&ドロップ

## 🔒 セキュリティ設定

### 環境変数設定

Netlify Dashboard > Site Settings > Environment variables:

```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=salon-mirai.firebaseapp.com
FIREBASE_DATABASE_URL=https://salon-mirai-default-rtdb.asia-southeast1.firebasedatabase.app/
FIREBASE_PROJECT_ID=salon-mirai
FIREBASE_STORAGE_BUCKET=salon-mirai.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Firebase セキュリティルール（本番用）

```json
{
  "rules": {
    "salonData": {
      ".read": true,
      ".write": "auth != null"
    },
    "adminLogs": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 🧪 動作テスト

### 1. ウェブサイト確認

1. デプロイされたURLにアクセス
2. 全ページが正常に表示されることを確認
3. ナビゲーションが動作することを確認

### 2. 管理システム確認

1. `your-site.netlify.app/admin/index.html` にアクセス
2. ログイン（salon_admin / salon2024）
3. キャンペーンを追加・編集
4. データが保存されることを確認

### 3. リアルタイム同期確認

1. 管理画面でキャンペーンを編集
2. 別タブでウェブサイトを開く
3. ウェブサイトに変更が即座に反映されることを確認

## 📱 カスタムドメイン設定

### Netlify でカスタムドメイン

1. Netlify Dashboard > Domain settings
2. 「Add custom domain」
3. ドメイン名を入力
4. DNS設定でCNAMEレコードを追加:
   ```
   www CNAME your-site.netlify.app
   @ CNAME your-site.netlify.app
   ```

## 🔍 トラブルシューティング

### よくある問題

1. **Firebase接続エラー**
   - 設定値を再確認
   - ブラウザのコンソールでエラーを確認

2. **管理画面にアクセスできない**
   - URL末尾に `/admin/index.html` を追加
   - Netlify のリダイレクト設定を確認

3. **リアルタイム更新されない**
   - Firebase Database ルールを確認
   - ネットワーク接続を確認

### デバッグ用ツール

- ブラウザ開発者ツール > Console
- Firebase Console > 使用状況
- Netlify Functions ログ

## 📞 サポート

問題が発生した場合：

1. ブラウザのコンソールエラーを確認
2. Firebase Console で接続状況を確認
3. Netlify Deploy ログを確認

## 🎉 完了

デプロイが完了すると：

- **ウェブサイト**: お客様が閲覧可能
- **管理システム**: リアルタイム更新可能
- **データ同期**: 管理画面の変更が即座にウェブサイトに反映

---

**注意**: 本番環境では適切なパスワード設定と認証システムの実装を推奨します。