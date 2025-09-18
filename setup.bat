@echo off
chcp 65001 > nul
echo ==========================================
echo    サロン未来 - 簡単セットアップ
echo ==========================================
echo.

echo 📁 プロジェクトディレクトリを作成中...
if not exist "salon-projects" mkdir salon-projects
cd salon-projects

echo.
echo 🏪 新しいサロンサイトの名前を入力してください:
set /p SALON_NAME="サロン名: "

echo.
echo 📋 基本情報を入力してください:
set /p PHONE="電話番号 (例: 03-1234-5678): "
set /p EMAIL="メールアドレス (例: info@salon.com): "
set /p ADDRESS="住所: "

echo.
echo 📂 "%SALON_NAME%" フォルダを作成中...
if not exist "%SALON_NAME%" mkdir "%SALON_NAME%"
cd "%SALON_NAME%"

echo.
echo 📄 ファイルをコピー中...
xcopy /S /E /Y "..\..\*" "." /EXCLUDE:..\..\exclude.txt

echo.
echo ⚙️ サロン情報を設定中...
powershell -Command "(Get-Content 'admin\data.json') -replace 'サロン未来', '%SALON_NAME%' -replace '03-5678-9012', '%PHONE%' -replace 'info@salon-mirai.com', '%EMAIL%' -replace '〒123-4567 東京都未来区美容町1-2-3', '%ADDRESS%' | Set-Content 'admin\data.json'"

echo.
echo 🎨 サイトタイトルを更新中...
powershell -Command "(Get-Content 'index.html') -replace 'サロン未来', '%SALON_NAME%' | Set-Content 'index.html'"
powershell -Command "(Get-Content 'campaign.html') -replace 'サロン未来', '%SALON_NAME%' | Set-Content 'campaign.html'"
powershell -Command "(Get-Content 'company.html') -replace 'サロン未来', '%SALON_NAME%' | Set-Content 'company.html'"

echo.
echo ✅ セットアップ完了！
echo.
echo 📖 使用方法:
echo 1. index.html をブラウザで開いてサイトを確認
echo 2. admin\index.html で管理画面にアクセス
echo    - ユーザー名: salon_admin
echo    - パスワード: salon2024
echo 3. キャンペーンやスタッフ情報を自由に編集
echo.
echo 🌐 サイトを開きますか？ (Y/N)
set /p OPEN_SITE="選択: "
if /I "%OPEN_SITE%"=="Y" (
    start index.html
    start admin\index.html
)

echo.
echo 🎉 "%SALON_NAME%" のサイトが完成しました！
pause