// ナビゲーション統一スクリプト
// 全ページで一貫したナビゲーションを提供

// 標準ナビゲーション構造
const standardNavigation = [
    { href: "index.html", text: "ホーム", id: "home" },
    { href: "about.html", text: "サロンについて", id: "about" },
    { href: "services.html", text: "メニュー・料金", id: "services" },
    { href: "staff.html", text: "スタッフ紹介", id: "staff" },
    { href: "works.html", text: "スタイルギャラリー", id: "works" },
    { href: "campaign.html", text: "キャンペーン", id: "campaign" },
    { href: "company.html", text: "アクセス・予約", id: "company" }
];

// 現在のページを判定
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    // ファイル名から拡張子を除去してIDを取得
    const pageId = filename.replace('.html', '') || 'index';
    return pageId === 'index' ? 'home' : pageId;
}

// ナビゲーションを統一
function standardizeNavigation() {
    const navContainer = document.querySelector('.global-nav ul');
    if (!navContainer) return;

    const currentPage = getCurrentPage();

    // ナビゲーションを再構築
    navContainer.innerHTML = standardNavigation.map(item => `
        <li>
            <a href="${item.href}" ${item.id === currentPage ? 'class="active"' : ''}>
                ${item.text}
            </a>
        </li>
    `).join('');
}

// フッターナビゲーションも統一
function standardizeFooterNavigation() {
    const footerNav = document.querySelector('.footer-nav ul');
    if (!footerNav) return;

    footerNav.innerHTML = standardNavigation.map(item => `
        <li><a href="${item.href}">${item.text}</a></li>
    `).join('');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    standardizeNavigation();
    standardizeFooterNavigation();
    console.log('✅ Navigation standardized');
});

// グローバルアクセス用
window.NavigationFix = {
    standardizeNavigation,
    standardizeFooterNavigation,
    getCurrentPage
};