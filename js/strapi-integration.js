// Strapi CMS Integration for Salon Mirai
// =====================================

// Strapi API Configuration
const STRAPI_URL = 'http://localhost:1337'; // 本番環境では変更
const API_BASE = `${STRAPI_URL}/api`;

// =====================================
// お知らせ（ニュース）の自動取得・表示
// =====================================
async function loadNews() {
    try {
        const response = await fetch(`${API_BASE}/news-items?sort=publishedAt:desc&pagination[limit]=5`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayNews(data.data);
        }
    } catch (error) {
        console.error('ニュースの取得に失敗しました:', error);
        // フォールバック: 静的コンテンツを表示
        displayStaticNews();
    }
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('dynamic-news');
    if (!newsContainer) return;

    newsContainer.innerHTML = newsItems.map(item => {
        const attrs = item.attributes;
        return `
            <article class="news-item animate-on-scroll fade-in-up">
                <div class="news-date">${formatDate(attrs.publishedAt)}</div>
                <h4 class="news-title">${attrs.title}</h4>
                <p class="news-content">${attrs.content}</p>
                ${attrs.link ? `<a href="${attrs.link}" class="news-link">詳細を見る →</a>` : ''}
            </article>
        `;
    }).join('');
}

// =====================================
// キャンペーン情報の自動取得・表示
// =====================================
async function loadCampaigns() {
    try {
        const response = await fetch(`${API_BASE}/campaigns?filters[active][$eq]=true&populate=*`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayCampaigns(data.data);
        }
    } catch (error) {
        console.error('キャンペーンの取得に失敗しました:', error);
    }
}

function displayCampaigns(campaigns) {
    const campaignGrid = document.getElementById('dynamic-campaigns');
    if (!campaignGrid) return;

    campaignGrid.innerHTML = campaigns.map(campaign => {
        const attrs = campaign.attributes;
        const imageUrl = attrs.image?.data?.attributes?.url
            ? `${STRAPI_URL}${attrs.image.data.attributes.url}`
            : 'images_top/image_fx (5).jpg'; // デフォルト画像

        return `
            <div class="campaign-card ${attrs.featured ? 'featured' : ''}" data-campaign-id="${campaign.id}">
                ${attrs.badge ? `<div class="campaign-badge">${attrs.badge}</div>` : ''}
                <img src="${imageUrl}" alt="${attrs.title}">
                <div class="campaign-content">
                    <h3>${attrs.title}</h3>
                    <p class="campaign-period">${attrs.period}</p>
                    <p>${attrs.description}</p>
                    ${attrs.originalPrice ? `
                        <div class="campaign-price">
                            <span class="original-price">通常 ¥${attrs.originalPrice.toLocaleString()}</span>
                            <span class="sale-price">¥${attrs.salePrice.toLocaleString()}</span>
                            <span class="discount">${calculateDiscount(attrs.originalPrice, attrs.salePrice)}%OFF</span>
                        </div>
                    ` : ''}
                    <div class="campaign-tags">
                        ${attrs.tags ? attrs.tags.split(',').map(tag =>
                            `<span>${tag.trim()}</span>`
                        ).join('') : ''}
                    </div>
                    <a href="company.html#booking" class="btn btn-primary">今すぐ予約</a>
                </div>
            </div>
        `;
    }).join('');
}

// =====================================
// スタッフ情報の自動取得・表示
// =====================================
async function loadStaff() {
    try {
        const response = await fetch(`${API_BASE}/staff-members?populate=*`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayStaff(data.data);
        }
    } catch (error) {
        console.error('スタッフ情報の取得に失敗しました:', error);
    }
}

function displayStaff(staffMembers) {
    const staffGrid = document.getElementById('dynamic-staff');
    if (!staffGrid) return;

    staffGrid.innerHTML = staffMembers.map(staff => {
        const attrs = staff.attributes;
        const photoUrl = attrs.photo?.data?.attributes?.url
            ? `${STRAPI_URL}${attrs.photo.data.attributes.url}`
            : 'images_about/Image_daihyou.jpg';

        return `
            <div class="staff-card" data-staff="${staff.id}">
                <div class="staff-image">
                    <img src="${photoUrl}" alt="${attrs.name} - ${attrs.role}">
                    <div class="staff-overlay">
                        <div class="staff-info">
                            <h4>${attrs.name}</h4>
                            <p class="staff-role">${attrs.role}</p>
                            <div class="staff-rating">
                                ${generateStars(attrs.rating || 5)}
                            </div>
                        </div>
                        <button class="btn btn-outline staff-detail-btn" data-target="${staff.id}-detail">詳細を見る</button>
                    </div>
                </div>
                <div class="staff-card-content">
                    <h4>${attrs.name}</h4>
                    <p class="staff-title">${attrs.role}</p>
                    <p class="staff-experience">${attrs.experience || '10'}年の経験</p>
                    <div class="staff-specialties">
                        ${attrs.specialties ? attrs.specialties.split(',').map(spec =>
                            `<span>${spec.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// =====================================
// メニュー料金の自動取得・表示
// =====================================
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE}/services?populate=*`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            displayServices(data.data);
        }
    } catch (error) {
        console.error('サービス情報の取得に失敗しました:', error);
    }
}

function displayServices(services) {
    const serviceContainer = document.getElementById('dynamic-services');
    if (!serviceContainer) return;

    // カテゴリー別にグループ化
    const groupedServices = services.reduce((acc, service) => {
        const category = service.attributes.category || 'その他';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, {});

    serviceContainer.innerHTML = Object.entries(groupedServices).map(([category, items]) => `
        <div class="service-category">
            <h3>${category}</h3>
            <div class="service-menu">
                ${items.map(service => {
                    const attrs = service.attributes;
                    return `
                        <div class="service-item">
                            <div class="service-header">
                                <h4>${attrs.name}</h4>
                                <span class="price">¥${attrs.price.toLocaleString()}${attrs.priceNote || '～'}</span>
                            </div>
                            <p>${attrs.description}</p>
                            ${attrs.features ? `
                                <ul class="service-features">
                                    ${attrs.features.split('\n').map(feature =>
                                        `<li>${feature}</li>`
                                    ).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// =====================================
// ユーティリティ関数
// =====================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function calculateDiscount(original, sale) {
    return Math.round((1 - sale / original) * 100);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return `
        ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
        ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
        ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        <span class="rating-number">(${rating})</span>
    `;
}

// =====================================
// 静的コンテンツフォールバック
// =====================================
function displayStaticNews() {
    // Strapi接続失敗時は現在の静的コンテンツを表示
    console.log('静的コンテンツを表示します');
}

// =====================================
// 初期化
// =====================================
document.addEventListener('DOMContentLoaded', function() {
    // 各ページで必要なコンテンツのみ読み込み
    if (document.getElementById('dynamic-news')) {
        loadNews();
    }
    if (document.getElementById('dynamic-campaigns')) {
        loadCampaigns();
    }
    if (document.getElementById('dynamic-staff')) {
        loadStaff();
    }
    if (document.getElementById('dynamic-services')) {
        loadServices();
    }

    // 30秒ごとに最新データを取得（オプション）
    if (window.location.pathname.includes('campaign')) {
        setInterval(loadCampaigns, 30000);
    }
});

// =====================================
// エクスポート（必要に応じて）
// =====================================
window.StrapiCMS = {
    loadNews,
    loadCampaigns,
    loadStaff,
    loadServices,
    refresh: function() {
        loadNews();
        loadCampaigns();
        loadStaff();
        loadServices();
    }
};