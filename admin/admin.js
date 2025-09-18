// Salon Mirai Admin System - Fixed Version
// ==========================================

// Global state
let currentData = null;
let isAuthenticated = false;
let currentUser = null;
let currentModal = null;
let currentEditType = null;
let currentEditId = null;

// Authentication
const validCredentials = {
    'salon_admin': 'salon2024',
    'demo_user': 'demo123'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Starting init');
    initializeApp();
});

async function initializeApp() {
    try {
        console.log('🔧 Initializing app...');

        // Setup authentication and listeners first
        checkAuthentication();
        setupEventListeners();

        // Load data using new robust pattern
        await loadData();

        console.log('✅ App initialization complete');
    } catch (error) {
        console.error('❌ App initialization error:', error);
        // Emergency fallback
        currentData = getDefaultData();
        updateDashboardStats();
        renderAllContent();
    }
}

function checkAuthentication() {
    try {
        const authData = localStorage.getItem('salon_auth');
        if (authData) {
            const auth = JSON.parse(authData);
            if (auth.expiry > Date.now()) {
                isAuthenticated = true;
                currentUser = auth.username;
                showDashboard();
                return;
            } else {
                localStorage.removeItem('salon_auth');
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
    showLogin();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }

    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });
}

function showLogin() {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('admin-container').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'flex';

    // Ensure data is loaded when dashboard is shown
    if (!currentData) {
        console.log('No data found, loading...');
        loadData();
    } else {
        updateDashboardStats();
        renderAllContent();
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (validCredentials[username] && validCredentials[username] === password) {
        isAuthenticated = true;
        currentUser = username;

        // Store auth with 2 hour expiry
        const authData = {
            username: username,
            expiry: Date.now() + (2 * 60 * 60 * 1000)
        };
        localStorage.setItem('salon_auth', JSON.stringify(authData));

        showDashboard();
        showNotification('ログインしました', 'success');
    } else {
        showNotification('ユーザー名またはパスワードが正しくありません', 'error');
    }
}

function logout() {
    localStorage.removeItem('salon_auth');
    isAuthenticated = false;
    currentUser = null;
    showLogin();
    showNotification('ログアウトしました', 'info');
}

// Data Management - New robust loading pattern
async function loadData() {
    console.log('📁 loadData called - starting new loading pattern');

    try {
        // 1. First try to load from localStorage
        const localData = loadFromLocalStorage();
        if (localData) {
            currentData = localData;
            console.log('✅ データをlocalStorageから読み込み:', currentData);
            updateDashboardStats();
            renderAllContent();
            return;
        }

        // 2. Try to load from embedded seed data
        const seedData = loadFromSeedData();
        if (seedData) {
            currentData = seedData;
            console.log('✅ データを埋め込みseed-dataから読み込み:', currentData);
            updateDashboardStats();
            renderAllContent();
            return;
        }

        // 3. Fallback to default data
        throw new Error('No localStorage or seed data found, using defaults');

    } catch (error) {
        console.log('⚠️ Using default data due to:', error.message);
        currentData = getDefaultData();
        console.log('✅ デフォルトデータを使用:', currentData);
        updateDashboardStats();
        renderAllContent();
    }
}

// Load data from embedded script tag
function loadFromSeedData() {
    try {
        const seedScript = document.getElementById('seed-data');
        if (seedScript && seedScript.textContent) {
            const seedData = JSON.parse(seedScript.textContent);
            console.log('🌱 Seed data found and parsed:', seedData);
            return seedData;
        }
    } catch (error) {
        console.error('❌ Seed data parse error:', error);
    }
    return null;
}

// Default data for fallback
function getDefaultData() {
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
                "reviews": [
                    "いつも丁寧にカウンセリングしてくれます。仕上がりも最高！",
                    "技術力が高く、トレンドを取り入れたスタイルが素敵です。"
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
                "features": "骨格診断に基づくカット\\nライフスタイルカウンセリング\\nスタイリングアドバイス"
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
            "lastUpdated": "2024-09-17T15:30:00.000Z",
            "schemaVersion": 1
        }
    };
}

async function saveData() {
    try {
        // Update schema version and timestamp
        if (currentData.settings) {
            currentData.settings.lastUpdated = new Date().toISOString();
            currentData.settings.schemaVersion = 1; // Add schema versioning
        }

        // Firebase統合チェック
        if (window.SalonFirebase) {
            const result = await window.SalonFirebase.saveAdminData(currentData, currentUser);
            if (result.success) {
                console.log('✅ Data saved:', result);
                showNotification(`データを保存しました (${result.source})`, 'success');
                return true;
            } else {
                throw new Error('Firebase save failed');
            }
        } else {
            // フォールバック: localStorage保存
            localStorage.setItem('salon_data_backup', JSON.stringify(currentData));
            console.log('✅ Data saved to localStorage:', currentData);
            showNotification('データを保存しました (localStorage)', 'success');
            return true;
        }
    } catch (error) {
        console.error('❌ Save error:', error);

        // エラー時のフォールバック保存
        try {
            localStorage.setItem('salon_data_backup', JSON.stringify(currentData));
            showNotification('データを保存しました (ローカル保存)', 'warning');
            return true;
        } catch (fallbackError) {
            showNotification('データの保存に失敗しました', 'error');
            return false;
        }
    }
}

// Load data from localStorage if available
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('salon_data_backup');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('LocalStorage load error:', error);
    }
    return null;
}

// Dashboard Stats
function updateDashboardStats() {
    if (!currentData) return;

    const campaignCount = document.getElementById('campaignCount');
    const newsCount = document.getElementById('newsCount');
    const staffCount = document.getElementById('staffCount');
    const serviceCount = document.getElementById('serviceCount');
    const lastUpdated = document.getElementById('lastUpdated');

    if (campaignCount) campaignCount.textContent = currentData.campaigns?.length || 0;
    if (newsCount) newsCount.textContent = currentData.news?.length || 0;
    if (staffCount) staffCount.textContent = currentData.staff?.length || 0;
    if (serviceCount) serviceCount.textContent = currentData.services?.length || 0;

    if (lastUpdated && currentData.settings?.lastUpdated) {
        lastUpdated.textContent = formatDate(currentData.settings.lastUpdated);
    }

    console.log('📊 Dashboard stats updated:', {
        campaigns: currentData.campaigns?.length || 0,
        news: currentData.news?.length || 0,
        staff: currentData.staff?.length || 0,
        services: currentData.services?.length || 0
    });
}

// Content Rendering
function renderAllContent() {
    renderCampaigns();
    renderNews();
    renderStaff();
    renderServices();
}

function renderCampaigns() {
    const container = document.getElementById('campaignList');
    if (!container) {
        console.warn('Campaign list container not found');
        return;
    }

    if (!currentData || !currentData.campaigns) {
        console.warn('No campaign data available');
        container.innerHTML = '<p>キャンペーンデータがありません</p>';
        return;
    }

    console.log('🎯 Rendering campaigns:', currentData.campaigns);

    container.innerHTML = currentData.campaigns.map(campaign => `
        <div class="data-card">
            <div class="card-header">
                <h4 class="card-title">${escapeHtml(campaign.title)}</h4>
                <div class="card-actions">
                    <button onclick="editCampaign(${campaign.id})" class="btn-sm btn-edit">編集</button>
                    <button onclick="toggleCampaignStatus(${campaign.id})"
                            class="btn-sm ${campaign.active ? 'btn-delete' : 'btn-edit'}">
                        ${campaign.active ? '無効化' : '有効化'}
                    </button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${escapeHtml(campaign.period)}</p>
            <p style="margin: 10px 0;">${escapeHtml(campaign.description)}</p>
            ${campaign.originalPrice ? `
                <div class="price-display">
                    <span class="original-price">¥${campaign.originalPrice.toLocaleString()}</span>
                    <span class="sale-price">¥${campaign.salePrice.toLocaleString()}</span>
                    <span class="discount">${Math.round((1 - campaign.salePrice / campaign.originalPrice) * 100)}%OFF</span>
                </div>
            ` : ''}
            <div style="margin-top: 15px;">
                <span class="status-badge ${campaign.active ? 'status-active' : 'status-inactive'}">
                    ${campaign.active ? 'アクティブ' : '停止中'}
                </span>
                ${campaign.featured ? '<span class="status-badge" style="background: #ffeaa7; color: #d63031; margin-left: 10px;">注目</span>' : ''}
            </div>
        </div>
    `).join('');
}

function renderNews() {
    const container = document.getElementById('newsList');
    if (!container) {
        console.warn('News list container not found');
        return;
    }

    if (!currentData || !currentData.news) {
        console.warn('No news data available');
        container.innerHTML = '<p>お知らせデータがありません</p>';
        return;
    }

    container.innerHTML = currentData.news.map(news => `
        <div class="data-card">
            <div class="card-header">
                <h4 class="card-title">${escapeHtml(news.title)}</h4>
                <div class="card-actions">
                    <button onclick="editNews(${news.id})" class="btn-sm btn-edit">編集</button>
                    <button onclick="deleteNews(${news.id})" class="btn-sm btn-delete">削除</button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${formatDate(news.publishedAt)}</p>
            <p style="margin: 10px 0;">${escapeHtml(news.content)}</p>
            ${news.featured ? '<span class="status-badge" style="background: #ffeaa7; color: #d63031;">注目</span>' : ''}
        </div>
    `).join('');
}

function renderStaff() {
    const container = document.getElementById('staffList');
    if (!container) {
        console.warn('Staff list container not found');
        return;
    }

    if (!currentData || !currentData.staff) {
        console.warn('No staff data available');
        container.innerHTML = '<p>スタッフデータがありません</p>';
        return;
    }

    container.innerHTML = currentData.staff.map(staff => `
        <div class="data-card">
            <div class="card-header">
                <h4 class="card-title">${escapeHtml(staff.name)}</h4>
                <div class="card-actions">
                    <button onclick="editStaff(${staff.id})" class="btn-sm btn-edit">編集</button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${escapeHtml(staff.role)}</p>
            <p style="margin: 10px 0;">経験年数: ${escapeHtml(staff.experience)}年</p>
            <p style="margin: 10px 0;">専門: ${escapeHtml(staff.specialties)}</p>
            <div style="margin: 10px 0; color: #B8860B; font-weight: bold;">評価: ${staff.rating}/5.0 ⭐</div>
        </div>
    `).join('');
}

function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) {
        console.warn('Services list container not found');
        return;
    }

    if (!currentData || !currentData.services) {
        console.warn('No services data available');
        container.innerHTML = '<p>サービスデータがありません</p>';
        return;
    }

    const groupedServices = currentData.services.reduce((acc, service) => {
        const category = service.category || 'その他';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, {});

    let servicesHtml = '';
    Object.keys(groupedServices).forEach(category => {
        servicesHtml += `<h4 style="margin: 20px 0 10px 0; color: #B8860B;">${escapeHtml(category)}</h4>`;
        servicesHtml += groupedServices[category].map(service => `
            <div class="data-card">
                <div class="card-header">
                    <h4 class="card-title">${escapeHtml(service.name)}</h4>
                    <div class="card-actions">
                        <button onclick="editService(${service.id})" class="btn-sm btn-edit">編集</button>
                    </div>
                </div>
                <p style="margin: 10px 0; color: #B8860B; font-weight: bold;">¥${service.price.toLocaleString()}${service.priceNote || ''}</p>
                <p style="margin: 10px 0;">${escapeHtml(service.description)}</p>
            </div>
        `).join('');
    });

    container.innerHTML = servicesHtml;
}

// Navigation
function showSection(sectionName) {
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Show/hide sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update page title
    const titles = {
        dashboard: 'ダッシュボード',
        campaigns: 'キャンペーン管理',
        news: 'お知らせ管理',
        staff: 'スタッフ管理',
        services: 'メニュー管理',
        settings: 'サイト設定'
    };

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'ダッシュボード';
    }
}

// Modal and Form Functions - Fixed implementation
function showEditModal(type, id = null) {
    console.log(`🖼️ showEditModal called with type: ${type}, id: ${id}`);

    currentEditType = type;
    currentEditId = id;

    const modal = document.getElementById('editForm');
    const formTitle = document.getElementById('formTitle');
    const formContent = document.getElementById('formContent');

    if (!modal || !formTitle || !formContent) {
        console.error('❌ Modal elements not found');
        return;
    }

    // Set title
    const titles = {
        campaign: id ? 'キャンペーン編集' : '新規キャンペーン',
        news: id ? 'お知らせ編集' : '新規お知らせ',
        staff: id ? 'スタッフ編集' : '新規スタッフ',
        service: id ? 'メニュー編集' : '新規メニュー'
    };
    formTitle.textContent = titles[type] || '編集';

    // Generate form content based on type
    let formHtml = '';
    let item = null;

    if (id) {
        const items = currentData[type === 'service' ? 'services' : type + 's'];
        item = items?.find(i => i.id === id);
        if (!item) {
            console.error(`❌ Item not found: ${type} with id ${id}`);
            return;
        }
    }

    switch (type) {
        case 'campaign':
            formHtml = generateCampaignForm(item);
            break;
        case 'news':
            formHtml = generateNewsForm(item);
            break;
        case 'staff':
            formHtml = generateStaffForm(item);
            break;
        case 'service':
            formHtml = generateServiceForm(item);
            break;
        default:
            console.error('❌ Unknown form type:', type);
            return;
    }

    formContent.innerHTML = `<form id="editItemForm">${formHtml}</form>`;
    modal.classList.add('show');

    console.log(`✅ Modal shown for ${type} editing`);
}

function generateCampaignForm(item) {
    return `
        <div class="form-row">
            <div>
                <label>タイトル</label>
                <input type="text" name="title" class="form-control" value="${item?.title || ''}" required>
            </div>
            <div>
                <label>期間</label>
                <input type="text" name="period" class="form-control" value="${item?.period || ''}" required>
            </div>
        </div>
        <div class="form-row full">
            <div>
                <label>説明</label>
                <textarea name="description" class="form-control" rows="3" required>${item?.description || ''}</textarea>
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>通常価格</label>
                <input type="number" name="originalPrice" class="form-control" value="${item?.originalPrice || ''}">
            </div>
            <div>
                <label>特別価格</label>
                <input type="number" name="salePrice" class="form-control" value="${item?.salePrice || ''}">
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>バッジ</label>
                <input type="text" name="badge" class="form-control" value="${item?.badge || ''}">
            </div>
            <div>
                <label>画像パス</label>
                <input type="text" name="image" class="form-control" value="${item?.image || ''}">
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>タグ（カンマ区切り）</label>
                <input type="text" name="tags" class="form-control" value="${item?.tags || ''}">
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" name="featured" ${item?.featured ? 'checked' : ''}> 注目
                </label>
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" name="active" ${item?.active !== false ? 'checked' : ''}> アクティブ
                </label>
            </div>
        </div>
    `;
}

function generateNewsForm(item) {
    return `
        <div class="form-row">
            <div>
                <label>タイトル</label>
                <input type="text" name="title" class="form-control" value="${item?.title || ''}" required>
            </div>
            <div>
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="checkbox" name="featured" ${item?.featured ? 'checked' : ''}> 注目
                </label>
            </div>
        </div>
        <div class="form-row full">
            <div>
                <label>内容</label>
                <textarea name="content" class="form-control" rows="5" required>${item?.content || ''}</textarea>
            </div>
        </div>
    `;
}

function generateStaffForm(item) {
    return `
        <div class="form-row">
            <div>
                <label>名前</label>
                <input type="text" name="name" class="form-control" value="${item?.name || ''}" required>
            </div>
            <div>
                <label>役職</label>
                <input type="text" name="role" class="form-control" value="${item?.role || ''}" required>
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>経験年数</label>
                <input type="number" name="experience" class="form-control" value="${item?.experience || ''}" required>
            </div>
            <div>
                <label>評価</label>
                <input type="number" name="rating" class="form-control" step="0.1" min="1" max="5" value="${item?.rating || '4.5'}" required>
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>専門分野（カンマ区切り）</label>
                <input type="text" name="specialties" class="form-control" value="${item?.specialties || ''}" required>
            </div>
            <div>
                <label>写真パス</label>
                <input type="text" name="photo" class="form-control" value="${item?.photo || ''}">
            </div>
        </div>
        <div class="form-row full">
            <div>
                <label>プロフィール</label>
                <textarea name="bio" class="form-control" rows="3" required>${item?.bio || ''}</textarea>
            </div>
        </div>
    `;
}

function generateServiceForm(item) {
    return `
        <div class="form-row">
            <div>
                <label>メニュー名</label>
                <input type="text" name="name" class="form-control" value="${item?.name || ''}" required>
            </div>
            <div>
                <label>カテゴリー</label>
                <input type="text" name="category" class="form-control" value="${item?.category || ''}" required>
            </div>
        </div>
        <div class="form-row">
            <div>
                <label>価格</label>
                <input type="number" name="price" class="form-control" value="${item?.price || ''}" required>
            </div>
            <div>
                <label>価格備考</label>
                <input type="text" name="priceNote" class="form-control" value="${item?.priceNote || ''}">
            </div>
        </div>
        <div class="form-row full">
            <div>
                <label>説明</label>
                <textarea name="description" class="form-control" rows="3" required>${item?.description || ''}</textarea>
            </div>
        </div>
        <div class="form-row full">
            <div>
                <label>特徴（改行区切り）</label>
                <textarea name="features" class="form-control" rows="3">${item?.features || ''}</textarea>
            </div>
        </div>
    `;
}

function closeEditForm() {
    const modal = document.getElementById('editForm');
    if (modal) {
        modal.classList.remove('show');
    }
    currentEditType = null;
    currentEditId = null;
}

function saveItem() {
    console.log(`💾 saveItem called for type: ${currentEditType}, id: ${currentEditId}`);

    const form = document.getElementById('editItemForm');
    if (!form) {
        console.error('❌ Form not found!');
        showNotification('フォームが見つかりません', 'error');
        return;
    }

    const formData = new FormData(form);
    const data = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        if (key === 'featured' || key === 'active') {
            data[key] = true; // Checkboxes that are checked
        } else if (key === 'originalPrice' || key === 'salePrice' || key === 'price' || key === 'experience' || key === 'rating') {
            data[key] = value ? Number(value) : 0;
        } else {
            data[key] = value;
        }
    }

    // Handle unchecked checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            data[checkbox.name] = false;
        }
    });

    console.log('📝 Form data:', data);

    try {
        if (currentEditId) {
            // Update existing item
            updateItem(currentEditType, currentEditId, data);
        } else {
            // Create new item
            createItem(currentEditType, data);
        }

        saveData();
        renderAllContent();
        updateDashboardStats();
        closeEditForm();
        showNotification('保存が完了しました', 'success');

        console.log('✅ Item saved successfully');
    } catch (error) {
        console.error('❌ Save error:', error);
        showNotification('保存中にエラーが発生しました', 'error');
    }
}

function updateItem(type, id, data) {
    const collection = type === 'service' ? 'services' : type + 's';
    const items = currentData[collection];
    const index = items.findIndex(item => item.id === id);

    if (index !== -1) {
        items[index] = { ...items[index], ...data };
    }
}

function createItem(type, data) {
    const collection = type === 'service' ? 'services' : type + 's';
    const items = currentData[collection];

    // Generate new ID
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    const newItem = { ...data, id: maxId + 1 };

    // Add publishedAt for news
    if (type === 'news') {
        newItem.publishedAt = new Date().toISOString();
    }

    items.push(newItem);
}

// Add functions for creating new items
function addCampaign() {
    showEditModal('campaign');
}

function addNews() {
    showEditModal('news');
}

function addStaff() {
    showEditModal('staff');
}

function addService() {
    showEditModal('service');
}

// Edit functions
function editCampaign(id) {
    showEditModal('campaign', id);
}

function editNews(id) {
    showEditModal('news', id);
}

function editStaff(id) {
    showEditModal('staff', id);
}

function editService(id) {
    showEditModal('service', id);
}

// Delete and toggle functions
function deleteNews(id) {
    if (confirm('このお知らせを削除しますか？')) {
        currentData.news = currentData.news.filter(news => news.id !== id);
        saveData();
        renderNews();
        updateDashboardStats();
        showNotification('お知らせを削除しました', 'success');
    }
}

function toggleCampaignStatus(id) {
    const campaign = currentData.campaigns.find(c => c.id === id);
    if (campaign) {
        campaign.active = !campaign.active;
        saveData();
        renderCampaigns();
        showNotification(`キャンペーンを${campaign.active ? '有効' : '無効'}にしました`, 'success');
    }
}

// Settings functions
function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        primaryColor: document.getElementById('primaryColor').value,
        contact: {
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            hours: document.getElementById('hours').value
        }
    };

    currentData.settings = { ...currentData.settings, ...settings };
    saveData();
    showNotification('設定を保存しました', 'success');
}

// Export/Import functions
function exportDataAsFile() {
    try {
        const dataStr = JSON.stringify(currentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `salon-data-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        showNotification('データをエクスポートしました', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('エクスポートに失敗しました', 'error');
    }
}

function importDataFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Basic validation
            if (importedData.campaigns && importedData.news && importedData.staff && importedData.services && importedData.settings) {
                currentData = importedData;
                saveData();
                updateDashboardStats();
                renderAllContent();
                showNotification('データを復元しました', 'success');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Import error:', error);
            showNotification('データの復元に失敗しました', 'error');
        }
    };
    reader.readAsText(file);
}

// Utility functions
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateStr;
    }
}

function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const successMsg = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    if (successMsg && successText) {
        successText.textContent = message;
        successMsg.classList.add('show');

        // Auto hide after 3 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    } else {
        // Fallback to alert
        alert(message);
    }
}

// Global object for external access
window.SalonAdmin = {
    loadData,
    saveData,
    currentData: () => currentData
};

// Make edit functions globally accessible
window.editCampaign = editCampaign;
window.editNews = editNews;
window.editStaff = editStaff;
window.editService = editService;
window.deleteNews = deleteNews;
window.toggleCampaignStatus = toggleCampaignStatus;

console.log('✅ Admin script loaded successfully');