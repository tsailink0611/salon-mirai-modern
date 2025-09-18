// Admin Integration - ホームページと管理画面の連携
// =================================================

// 管理画面のデータを読み込む関数
function loadAdminData() {
    try {
        // localStorageから管理画面のデータを取得
        const adminData = localStorage.getItem('salon_data_backup');
        if (adminData) {
            return JSON.parse(adminData);
        }

        // フォールバック：デフォルトデータ
        return getDefaultSalonData();
    } catch (error) {
        console.error('Admin data load error:', error);
        return getDefaultSalonData();
    }
}

// デフォルトデータ（管理画面と同じ構造）
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
            },
            {
                "id": 2,
                "title": "初回限定トライアルセット",
                "period": "新規のお客様限定",
                "description": "初回ご来店のお客様に特別価格でカット+シャンプー+ブローのセットをご提供。お気軽にサロン未来の技術をお試しください。",
                "originalPrice": 5500,
                "salePrice": 3980,
                "badge": "✨新規",
                "featured": false,
                "active": true,
                "tags": "カット,初回限定,お試し",
                "image": "images_about/image_coordinate.jpg"
            },
            {
                "id": 3,
                "title": "プレミアムヘッドスパ体験",
                "period": "2024年9月15日〜10月15日",
                "description": "疲れた頭皮と心を癒すプレミアムヘッドスパコース。アロマオイルを使用した極上のリラクゼーション体験をお楽しみください。",
                "originalPrice": 4500,
                "salePrice": 3200,
                "badge": "",
                "featured": false,
                "active": true,
                "tags": "ヘッドスパ,リラクゼーション,アロマ",
                "image": "images_about/Image_kodawarinoie.jpg"
            }
        ],
        "news": [
            {
                "id": 1,
                "title": "年末年始の営業について",
                "content": "12月31日〜1月3日まで休業させていただきます。新年は1月4日より通常営業いたします。",
                "publishedAt": "2024-09-17T09:00:00.000Z",
                "featured": true
            },
            {
                "id": 2,
                "title": "新スタイリスト鈴木健太が加入しました",
                "content": "10年の経験を持つスタイリスト鈴木健太がサロン未来に加入いたします。メンズカットとトレンドスタイルが得意です。",
                "publishedAt": "2024-09-15T10:30:00.000Z",
                "featured": false
            },
            {
                "id": 3,
                "title": "秋冬トレンドカラーのご提案",
                "content": "今年の秋冬トレンドカラーをご紹介します。深みのあるブラウン系やアッシュ系が人気です。",
                "publishedAt": "2024-09-10T14:00:00.000Z",
                "featured": false
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
                "reviews": [
                    "いつも丁寧にカウンセリングしてくれます。仕上がりも最高！",
                    "技術力が高く、トレンドを取り入れたスタイルが素敵です。"
                ]
            },
            {
                "id": 2,
                "name": "佐藤雅人",
                "role": "シニアスタイリスト",
                "experience": "12",
                "bio": "トレンドを取り入れたモダンなスタイルから、クラシックなデザインまで幅広く対応。メンズカットも得意分野です。",
                "specialties": "メンズカット,トレンドスタイル,ヘッドスパ",
                "rating": 4.8,
                "photo": "images_about/Image_sekkeishi.jpg",
                "reviews": [
                    "メンズカットが本当に上手！清潔感のある仕上がりです。",
                    "ヘッドスパが気持ちよくて、毎回リラックスできます。"
                ]
            },
            {
                "id": 3,
                "name": "山田愛",
                "role": "スタイリスト",
                "experience": "8",
                "bio": "ナチュラルで上品なスタイルを得意とし、特にボブスタイルとカラーリングに定評があります。丁寧なカウンセリングが人気です。",
                "specialties": "ボブスタイル,ナチュラルカラー,トリートメント",
                "rating": 4.7,
                "photo": "images_about/image_coordinate.jpg",
                "reviews": [
                    "ボブスタイルが本当に似合うようにカットしてくれます。",
                    "カラーの提案が上手で、いつも満足しています。"
                ]
            },
            {
                "id": 4,
                "name": "鈴木健太",
                "role": "スタイリスト",
                "experience": "10",
                "bio": "モダンで洗練されたスタイルが得意。特にレイヤーカットとメンズスタイルに定評があります。お客様との コミュニケーションを大切にしています。",
                "specialties": "レイヤーカット,メンズスタイル,ハイライト",
                "rating": 4.6,
                "photo": "images_about/Image_daihyou.jpg",
                "reviews": [
                    "新人とは思えない技術力！とても満足しています。",
                    "話しやすくて、要望をしっかり聞いてくれます。"
                ]
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
            },
            {
                "id": 2,
                "category": "カット・スタイリング",
                "name": "メンズカット",
                "price": 3800,
                "priceNote": "～",
                "description": "ビジネスからカジュアルまで、シーンに合わせたメンズスタイルをご提案。清潔感のある仕上がりが人気です。",
                "features": "ビジネススタイル対応\n眉毛カット込み\nスタイリング指導"
            },
            {
                "id": 3,
                "category": "カラー",
                "name": "フルカラー",
                "price": 8000,
                "priceNote": "～",
                "description": "全体カラー。豊富な色展開で、お客様だけの特別な色合いを実現します。",
                "features": "オーガニックカラー使用\n肌色診断\n色持ちアドバイス"
            },
            {
                "id": 4,
                "category": "パーマ・ストレート",
                "name": "デジタルパーマ",
                "price": 12500,
                "priceNote": "～",
                "description": "自然で美しいカールが長持ち。お手入れが簡単で、毎朝のスタイリングが楽になります。",
                "features": "長時間持続\n自然な仕上がり\nスタイリング簡単"
            },
            {
                "id": 5,
                "category": "ヘッドスパ・トリートメント",
                "name": "プレミアムヘッドスパ",
                "price": 5500,
                "priceNote": "～",
                "description": "頭皮のクレンジングからマッサージまで、至福のリラクゼーション体験をお楽しみください。",
                "features": "オーガニックオイル使用\n頭皮診断\nリラクゼーション効果\n血行促進"
            }
        ],
        "settings": {
            "siteName": "サロン未来",
            "primaryColor": "#B8860B",
            "secondaryColor": "#F7F4F0",
            "accentColor": "#E8B4B8",
            "contact": {
                "phone": "03-5678-9012",
                "email": "info@salon-mirai.com",
                "address": "〒123-4567 東京都未来区美容町1-2-3",
                "hours": "10:00〜20:00（月曜定休）"
            },
            "lastUpdated": "2024-09-17T15:30:00.000Z"
        }
    };
}

// ホームページのキャンペーンセクションを動的に更新
function updateCampaignsOnHomepage() {
    const data = loadAdminData();
    const campaigns = data.campaigns.filter(c => c.active);

    // ホームページのキャンペーンエリアを探して更新
    const campaignContainer = document.querySelector('.campaign-section .container');
    if (campaignContainer && campaigns.length > 0) {
        const featuredCampaign = campaigns.find(c => c.featured) || campaigns[0];

        // キャンペーン情報を更新
        const campaignTitle = campaignContainer.querySelector('h2');
        const campaignDescription = campaignContainer.querySelector('.campaign-description');
        const campaignPrice = campaignContainer.querySelector('.price-info');

        if (campaignTitle) {
            campaignTitle.textContent = featuredCampaign.title;
        }

        if (campaignDescription) {
            campaignDescription.textContent = featuredCampaign.description;
        }

        if (campaignPrice && featuredCampaign.originalPrice) {
            campaignPrice.innerHTML = `
                <span class="original-price">通常 ¥${featuredCampaign.originalPrice.toLocaleString()}</span>
                <span class="sale-price">特別価格 ¥${featuredCampaign.salePrice.toLocaleString()}</span>
                <span class="discount">${Math.round((1 - featuredCampaign.salePrice / featuredCampaign.originalPrice) * 100)}%OFF</span>
            `;
        }
    }
}

// キャンペーンページの更新
function updateCampaignPage() {
    const data = loadAdminData();
    const campaigns = data.campaigns.filter(c => c.active);

    // 動的キャンペーンエリアを更新
    const dynamicCampaignsContainer = document.getElementById('dynamic-campaigns');
    const staticCampaignsContainer = document.getElementById('static-campaigns');

    if (dynamicCampaignsContainer && campaigns.length > 0) {
        // 静的コンテンツを非表示にし、動的コンテンツを表示
        if (staticCampaignsContainer) {
            staticCampaignsContainer.style.display = 'none';
        }
        dynamicCampaignsContainer.style.display = 'grid';

        dynamicCampaignsContainer.innerHTML = campaigns.map(campaign => `
            <div class="campaign-card ${campaign.featured ? 'featured' : ''}">
                ${campaign.badge ? `<div class="campaign-badge">${campaign.badge}</div>` : ''}
                <img src="${campaign.image || 'images_top/default.jpg'}" alt="${campaign.title}">
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
                        ${campaign.tags.split(',').map(tag => `<span>${tag.trim()}</span>`).join('')}
                    </div>
                    <a href="company.html#booking" class="btn btn-primary">今すぐ予約</a>
                </div>
            </div>
        `).join('');
    } else if (staticCampaignsContainer) {
        // データがない場合は静的コンテンツを表示
        staticCampaignsContainer.style.display = 'grid';
        if (dynamicCampaignsContainer) {
            dynamicCampaignsContainer.style.display = 'none';
        }
    }
}

// スタッフページの更新
function updateStaffPage() {
    const data = loadAdminData();
    const staff = data.staff;

    const staffGrid = document.querySelector('.staff-grid');
    if (staffGrid) {
        staffGrid.innerHTML = staff.map(member => `
            <div class="staff-card">
                <div class="staff-image">
                    <img src="${member.photo || 'images_about/default-staff.jpg'}" alt="${member.name}">
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

// お知らせの更新
function updateNewsSection() {
    const data = loadAdminData();
    const news = data.news.slice(0, 3); // 最新3件

    const newsContainer = document.querySelector('.news-section .news-list');
    if (newsContainer) {
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
    console.log('🔄 Admin integration loading...');

    // 現在のページに応じて適切な更新関数を実行
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
        case '':
            updateCampaignsOnHomepage();
            updateNewsSection();
            break;
        case 'campaign.html':
            updateCampaignPage();
            break;
        case 'staff.html':
            updateStaffPage();
            break;
        default:
            // すべてのページでお知らせセクションがあれば更新
            updateNewsSection();
            break;
    }

    console.log('✅ Admin integration complete');
});

// グローバル関数として公開
window.SalonIntegration = {
    loadAdminData,
    updateCampaignsOnHomepage,
    updateCampaignPage,
    updateStaffPage,
    updateNewsSection
};