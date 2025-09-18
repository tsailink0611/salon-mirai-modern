// Complete Admin Integration - 全ページ対応版
// ================================================

// 管理画面のデータを読み込む関数
function loadAdminData() {
    try {
        const adminData = localStorage.getItem('salon_data_backup');
        if (adminData) {
            return JSON.parse(adminData);
        }
        return getDefaultSalonData();
    } catch (error) {
        console.error('Admin data load error:', error);
        return getDefaultSalonData();
    }
}

// デフォルトデータ
function getDefaultSalonData() {
    return {
        "campaigns": [
            {
                "id": 1,
                "title": "秋冬限定カラーキャンペーン",
                "period": "2024年9月1日〜11月30日",
                "description": "季節感あふれるトレンドカラーを特別価格でご提供。パーソナルカラー診断付きで、あなたに最適な色合いを見つけましょう。",
                "originalPrice": 8500,
                "salePrice": 6800,
                "badge": "🔥人気",
                "featured": true,
                "active": true,
                "tags": "カラー,パーソナル診断,期間限定",
                "image": "images_top/image_fx (5).jpg"
            }
        ],
        "news": [
            {
                "id": 1,
                "title": "年末年始の営業について",
                "content": "12月31日〜1月3日まで休業させていただきます。新年は1月4日より通常営業いたします。",
                "publishedAt": "2024-09-17T09:00:00.000Z",
                "featured": true
            }
        ],
        "staff": [
            {
                "id": 1,
                "name": "田中美穂",
                "role": "代表スタイリスト / サロンオーナー",
                "experience": "15",
                "bio": "15年の経験を持つベテランスタイリスト。お客様一人ひとりの魅力を最大限に引き出すスタイル提案を得意としています。",
                "specialties": "カット,カラー,パーマ",
                "rating": 4.9,
                "photo": "images_about/Image_daihyou.jpg",
                "reviews": ["いつも丁寧にカウンセリングしてくれます。", "技術力が高く、素敵です。"]
            }
        ],
        "services": [
            {
                "id": 1,
                "category": "カット・スタイリング",
                "name": "レディースカット",
                "price": 4500,
                "priceNote": "～",
                "description": "シャンプー・ブロー込み。丁寧なカウンセリングでお客様に最適なスタイルをご提案いたします。",
                "features": "骨格診断に基づくカット\nライフスタイルカウンセリング\nスタイリングアドバイス"
            }
        ],
        "settings": {
            "siteName": "サロン未来",
            "primaryColor": "#B8860B",
            "contact": {
                "phone": "03-5678-9012",
                "email": "info@salon-mirai.com",
                "address": "〒123-4567 東京都未来区美容町1-2-3",
                "hours": "10:00〜20:00（月曜定休）"
            }
        }
    };
}

// ホームページの更新
function updateHomePage() {
    const data = loadAdminData();
    console.log('🏠 Updating homepage with admin data');

    // メインキャンペーンの更新
    updateMainCampaign(data);

    // キャンペーン一覧の更新
    updateHomeCampaigns(data);

    // お知らせの更新
    updateHomeNews(data);

    // スタッフ紹介の更新
    updateHomeStaff(data);

    // サービス紹介の更新
    updateHomeServices(data);
}

// メインキャンペーンエリアの更新
function updateMainCampaign(data) {
    const campaigns = data.campaigns.filter(c => c.active);
    const featuredCampaign = campaigns.find(c => c.featured) || campaigns[0];

    if (!featuredCampaign) return;

    // キャンペーンセクション全体を探す
    const campaignSection = document.querySelector('.campaign-section, .main-campaign, .hero-campaign');
    if (campaignSection) {
        const titleEl = campaignSection.querySelector('h1, h2, .campaign-title');
        const descEl = campaignSection.querySelector('.campaign-description, .description');
        const priceEl = campaignSection.querySelector('.price-info, .campaign-price');

        if (titleEl) titleEl.textContent = featuredCampaign.title;
        if (descEl) descEl.textContent = featuredCampaign.description;

        if (priceEl && featuredCampaign.originalPrice) {
            priceEl.innerHTML = `
                <span class="original-price">通常 ¥${featuredCampaign.originalPrice.toLocaleString()}</span>
                <span class="sale-price">特別価格 ¥${featuredCampaign.salePrice.toLocaleString()}</span>
                <span class="discount">${Math.round((1 - featuredCampaign.salePrice / featuredCampaign.originalPrice) * 100)}%OFF</span>
            `;
        }
    }
}

// ホームページのキャンペーン一覧更新
function updateHomeCampaigns(data) {
    const campaigns = data.campaigns.filter(c => c.active).slice(0, 3);
    const container = document.querySelector('.home-campaigns, .campaigns-preview, .top-campaigns');

    if (container && campaigns.length > 0) {
        container.innerHTML = `
            <h3>🔥 注目のキャンペーン</h3>
            <div class="campaign-grid">
                ${campaigns.map(campaign => `
                    <div class="campaign-item">
                        ${campaign.badge ? `<span class="badge">${campaign.badge}</span>` : ''}
                        <h4>${campaign.title}</h4>
                        <p class="period">${campaign.period}</p>
                        <p class="description">${campaign.description.substring(0, 80)}...</p>
                        ${campaign.originalPrice ? `
                            <div class="price">
                                <span class="original">¥${campaign.originalPrice.toLocaleString()}</span>
                                <span class="sale">¥${campaign.salePrice.toLocaleString()}</span>
                            </div>
                        ` : ''}
                        <a href="campaign.html" class="btn btn-small">詳細を見る</a>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ホームページのお知らせ更新
function updateHomeNews(data) {
    const news = data.news.slice(0, 3);
    const container = document.querySelector('.home-news, .news-preview, .latest-news');

    if (container && news.length > 0) {
        container.innerHTML = `
            <h3>📢 お知らせ</h3>
            <div class="news-list">
                ${news.map(item => `
                    <div class="news-item ${item.featured ? 'featured' : ''}">
                        <div class="news-date">${formatDate(item.publishedAt)}</div>
                        <div class="news-content">
                            <h4>${item.title}</h4>
                            <p>${item.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ホームページのスタッフ紹介更新
function updateHomeStaff(data) {
    const staff = data.staff.slice(0, 3);
    const container = document.querySelector('.home-staff, .staff-preview');

    if (container && staff.length > 0) {
        container.innerHTML = `
            <h3>👥 スタッフ紹介</h3>
            <div class="staff-grid">
                ${staff.map(member => `
                    <div class="staff-preview-item">
                        <div class="staff-image">
                            <img src="${member.photo || 'images_about/default-staff.jpg'}" alt="${member.name}" loading="lazy">
                        </div>
                        <h4>${member.name}</h4>
                        <p class="role">${member.role}</p>
                        <p class="experience">経験${member.experience}年</p>
                        <div class="rating">⭐ ${member.rating}</div>
                    </div>
                `).join('')}
            </div>
            <a href="staff.html" class="btn btn-outline">スタッフ一覧を見る</a>
        `;
    }
}

// ホームページのサービス紹介更新
function updateHomeServices(data) {
    const services = data.services.slice(0, 4);
    const container = document.querySelector('.home-services, .services-preview');

    if (container && services.length > 0) {
        container.innerHTML = `
            <h3>💅 人気メニュー</h3>
            <div class="services-grid">
                ${services.map(service => `
                    <div class="service-preview-item">
                        <h4>${service.name}</h4>
                        <p class="category">${service.category}</p>
                        <div class="price">¥${service.price.toLocaleString()}${service.priceNote || ''}</div>
                        <p class="description">${service.description.substring(0, 60)}...</p>
                    </div>
                `).join('')}
            </div>
            <a href="services.html" class="btn btn-outline">全メニューを見る</a>
        `;
    }
}

// キャンペーンページの更新
function updateCampaignPage() {
    const data = loadAdminData();
    const campaigns = data.campaigns.filter(c => c.active);
    console.log('🎯 Updating campaign page with admin data');

    const dynamicContainer = document.getElementById('dynamic-campaigns');
    const staticContainer = document.getElementById('static-campaigns');

    if (dynamicContainer && campaigns.length > 0) {
        if (staticContainer) staticContainer.style.display = 'none';
        dynamicContainer.style.display = 'grid';

        dynamicContainer.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card ${campaign.featured ? 'featured' : ''}">
                ${campaign.badge ? `<div class="campaign-badge">${campaign.badge}</div>` : ''}
                <img src="${campaign.image || 'images_top/default.jpg'}" alt="${campaign.title}" loading="lazy">
                <div class="campaign-content">
                    <h3>${campaign.title}</h3>
                    <p class="campaign-period">${campaign.period}</p>
                    <p>${campaign.description}</p>
                    ${campaign.originalPrice ? `
                        <div class="campaign-price">
                            <span class="original-price">通常 ¥${campaign.originalPrice.toLocaleString()}</span>
                            <span class="sale-price">¥${campaign.salePrice.toLocaleString()}</span>
                            <span class="discount">${Math.round((1 - campaign.salePrice / campaign.originalPrice) * 100)}%OFF</span>
                        </div>
                    ` : ''}
                    <div class="campaign-tags">
                        ${campaign.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                    </div>
                    <a href="company.html#booking" class="btn btn-primary">今すぐ予約</a>
                </div>
            </div>
        `).join('');
    } else if (staticContainer) {
        staticContainer.style.display = 'grid';
        if (dynamicContainer) dynamicContainer.style.display = 'none';
    }
}

// スタッフページの更新
function updateStaffPage() {
    const data = loadAdminData();
    const staff = data.staff;
    console.log('👥 Updating staff page with admin data');

    const staffGrid = document.querySelector('.staff-grid, .staff-list');
    if (staffGrid && staff.length > 0) {
        staffGrid.innerHTML = staff.map(member => `
            <div class="staff-card">
                <div class="staff-image">
                    <img src="${member.photo || 'images_about/default-staff.jpg'}" alt="${member.name}" loading="lazy">
                </div>
                <div class="staff-info">
                    <h3>${member.name}</h3>
                    <p class="staff-role">${member.role}</p>
                    <p class="staff-experience">経験年数: ${member.experience}年</p>
                    <p class="staff-specialties">専門: ${member.specialties}</p>
                    <div class="staff-rating">評価: ${member.rating}/5.0 ⭐</div>
                    <p class="staff-bio">${member.bio}</p>
                    ${member.reviews && member.reviews.length > 0 ? `
                        <div class="staff-reviews">
                            <h4>お客様の声</h4>
                            ${member.reviews.map(review => `<blockquote>"${review}"</blockquote>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

// サービスページの更新
function updateServicesPage() {
    const data = loadAdminData();
    const services = data.services;
    console.log('💅 Updating services page with admin data');

    const servicesContainer = document.querySelector('.services-grid, .services-list, .menu-list');
    if (servicesContainer && services.length > 0) {
        const groupedServices = services.reduce((acc, service) => {
            const category = service.category || 'その他';
            if (!acc[category]) acc[category] = [];
            acc[category].push(service);
            return acc;
        }, {});

        let servicesHtml = '';
        Object.keys(groupedServices).forEach(category => {
            servicesHtml += `
                <div class="service-category">
                    <h3 class="category-title">${category}</h3>
                    <div class="service-items">
                        ${groupedServices[category].map(service => `
                            <div class="service-item">
                                <div class="service-header">
                                    <h4>${service.name}</h4>
                                    <div class="price">¥${service.price.toLocaleString()}${service.priceNote || ''}</div>
                                </div>
                                <p class="service-description">${service.description}</p>
                                ${service.features ? `
                                    <div class="service-features">
                                        ${service.features.split('\n').map(feature => `
                                            <span class="feature">✓ ${feature.trim()}</span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        servicesContainer.innerHTML = servicesHtml;
    }
}

// About/会社概要ページの更新
function updateAboutPage() {
    const data = loadAdminData();
    console.log('ℹ️ Updating about page with admin data');

    if (data.settings && data.settings.contact) {
        const contact = data.settings.contact;

        // 連絡先情報の更新
        const phoneElements = document.querySelectorAll('.phone, .contact-phone, .tel');
        phoneElements.forEach(el => {
            if (contact.phone) el.textContent = contact.phone;
        });

        const emailElements = document.querySelectorAll('.email, .contact-email');
        emailElements.forEach(el => {
            if (contact.email) el.textContent = contact.email;
        });

        const addressElements = document.querySelectorAll('.address, .contact-address');
        addressElements.forEach(el => {
            if (contact.address) el.textContent = contact.address;
        });

        const hoursElements = document.querySelectorAll('.hours, .business-hours, .opening-hours');
        hoursElements.forEach(el => {
            if (contact.hours) el.textContent = contact.hours;
        });
    }

    // サロン名の更新
    if (data.settings && data.settings.siteName) {
        const siteNameElements = document.querySelectorAll('.site-name, .salon-name, .company-name');
        siteNameElements.forEach(el => {
            el.textContent = data.settings.siteName;
        });
    }
}

// お知らせセクションの更新（全ページ共通）
function updateNewsSection() {
    const data = loadAdminData();
    const news = data.news.slice(0, 3);

    const newsContainer = document.querySelector('.news-section .news-list, .news-container, .latest-news');
    if (newsContainer && news.length > 0) {
        newsContainer.innerHTML = news.map(item => `
            <div class="news-item ${item.featured ? 'featured' : ''}">
                <div class="news-date">${formatDate(item.publishedAt)}</div>
                <div class="news-content">
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                </div>
            </div>
        `).join('');
    }
}

// 全ページ共通要素の更新
function updateCommonElements() {
    const data = loadAdminData();
    console.log('🔗 Updating common elements');

    if (data.settings) {
        // サイト名の更新（ヘッダー・フッター）
        if (data.settings.siteName) {
            const siteNameElements = document.querySelectorAll('header .logo, .header-title, .footer-title, title');
            siteNameElements.forEach(el => {
                if (el.tagName === 'TITLE') {
                    el.textContent = `${data.settings.siteName} - 美容室`;
                } else {
                    el.textContent = data.settings.siteName;
                }
            });
        }

        // 連絡先情報の更新（フッター・ヘッダー）
        if (data.settings.contact) {
            const contact = data.settings.contact;

            const footerPhone = document.querySelector('.footer-phone, footer .phone');
            if (footerPhone && contact.phone) footerPhone.textContent = contact.phone;

            const footerEmail = document.querySelector('.footer-email, footer .email');
            if (footerEmail && contact.email) footerEmail.textContent = contact.email;

            const footerAddress = document.querySelector('.footer-address, footer .address');
            if (footerAddress && contact.address) footerAddress.textContent = contact.address;
        }
    }
}

// 日付フォーマット関数
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateStr;
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Complete Admin integration loading...');

    // 全ページ共通要素を最初に更新
    updateCommonElements();

    // 現在のページに応じて適切な更新関数を実行
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log(`📄 Current page: ${currentPage}`);

    switch (currentPage) {
        case 'index.html':
        case '':
            updateHomePage();
            break;
        case 'campaign.html':
            updateCampaignPage();
            updateNewsSection();
            break;
        case 'staff.html':
            updateStaffPage();
            updateNewsSection();
            break;
        case 'services.html':
            updateServicesPage();
            updateNewsSection();
            break;
        case 'about.html':
        case 'company.html':
            updateAboutPage();
            updateNewsSection();
            break;
        default:
            // すべてのページでお知らせセクションがあれば更新
            updateNewsSection();
            break;
    }

    console.log('✅ Complete Admin integration finished');
});

// グローバル関数として公開
window.SalonIntegration = {
    loadAdminData,
    updateHomePage,
    updateCampaignPage,
    updateStaffPage,
    updateServicesPage,
    updateAboutPage,
    updateNewsSection,
    updateCommonElements,
    // 手動更新用
    refreshAll: function() {
        updateCommonElements();
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        switch (currentPage) {
            case 'index.html':
            case '':
                updateHomePage();
                break;
            case 'campaign.html':
                updateCampaignPage();
                break;
            case 'staff.html':
                updateStaffPage();
                break;
            case 'services.html':
                updateServicesPage();
                break;
            case 'about.html':
            case 'company.html':
                updateAboutPage();
                break;
        }
        updateNewsSection();
    }
};

console.log('✅ Complete Admin integration script loaded successfully');