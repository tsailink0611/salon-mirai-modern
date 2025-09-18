// 画像アップロード機能
// ====================

// 画像アップロード処理
function handleImageUpload(input, previewId) {
    const file = input.files[0];
    const previewDiv = document.getElementById(previewId);
    const hiddenInput = input.parentElement.querySelector('input[type="hidden"]');

    if (!file) {
        previewDiv.innerHTML = '';
        if (hiddenInput) hiddenInput.value = '';
        return;
    }

    // ファイルサイズチェック (2MB制限)
    if (file.size > 2 * 1024 * 1024) {
        alert('⚠️ ファイルサイズが大きすぎます。2MB以下の画像を選択してください。');
        input.value = '';
        return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
        alert('⚠️ 画像ファイルを選択してください。');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // プレビュー表示
        previewDiv.innerHTML = `
            <div class="image-preview-container">
                <img src="${e.target.result}" alt="プレビュー" style="max-width: 200px; max-height: 150px; border-radius: 8px; border: 2px solid #ddd;">
                <p style="margin-top: 5px; font-size: 12px; color: #666;">
                    📁 ${file.name} (${(file.size / 1024).toFixed(1)}KB)
                </p>
                <button type="button" onclick="removeImagePreview('${previewId}', '${input.id}')"
                        style="margin-top: 5px; padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                    🗑️ 削除
                </button>
            </div>
        `;

        // Base64データを隠しフィールドに保存
        if (hiddenInput) {
            hiddenInput.value = e.target.result;
        }
    };

    reader.readAsDataURL(file);
}

// 画像プレビュー削除
function removeImagePreview(previewId, inputId) {
    document.getElementById(previewId).innerHTML = '';
    document.getElementById(inputId).value = '';
    const hiddenInput = document.getElementById(inputId).parentElement.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = '';
}

// 画像URL生成 (Base64またはパス)
function getImageUrl(imageData) {
    if (!imageData) return 'images/default-placeholder.jpg';

    // Base64データの場合
    if (imageData.startsWith('data:image/')) {
        return imageData;
    }

    // パスの場合
    return imageData;
}

// 画像表示用ヘルパー
function createImageElement(imageData, altText = '', className = '') {
    const img = document.createElement('img');
    img.src = getImageUrl(imageData);
    img.alt = altText;
    if (className) img.className = className;

    // 画像読み込みエラー時のフォールバック
    img.onerror = function() {
        this.src = 'images/default-placeholder.jpg';
    };

    return img;
}

// フォームの改善: ヘルプテキストとプレースホルダー
const formHelpers = {
    campaigns: {
        title: "キャンペーン名を入力（例：秋冬限定カラーキャンペーン）",
        period: "期間を入力（例：2024年10月1日〜12月31日）",
        description: "キャンペーンの詳細説明を入力",
        originalPrice: "通常料金を入力（数字のみ）",
        salePrice: "キャンペーン料金を入力（数字のみ）",
        badge: "バッジテキスト（例：🔥人気、✨新規、💎限定）",
        tags: "タグをカンマ区切りで入力（例：カラー,パーマ,初回限定）",
        image: "キャンペーン画像を選択してください"
    },
    staff: {
        name: "スタッフ名を入力（例：田中美穂）",
        role: "役職を入力（例：代表スタイリスト）",
        experience: "経験年数を入力（数字のみ、例：10）",
        rating: "評価を入力（1.0〜5.0、例：4.8）",
        specialties: "専門分野をカンマ区切りで入力（例：カット,カラー,パーマ）",
        bio: "プロフィール・経歴を入力",
        photo: "スタッフ写真を選択してください"
    },
    news: {
        title: "お知らせタイトルを入力",
        content: "お知らせ内容を入力"
    }
};

// フォーム要素にヘルプテキストを追加
function addFormHelpers() {
    // プレースホルダーとヘルプテキストを追加
    Object.keys(formHelpers).forEach(formType => {
        Object.keys(formHelpers[formType]).forEach(fieldName => {
            const input = document.getElementById(`${formType.slice(0, -1)}-${fieldName}`);
            if (input && input.tagName !== 'INPUT' || input.type !== 'file') {
                input.placeholder = formHelpers[formType][fieldName];
            }
        });
    });
}

// 初期化時にヘルパーを適用
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addFormHelpers, 1000); // 管理システムが読み込まれた後に実行
});