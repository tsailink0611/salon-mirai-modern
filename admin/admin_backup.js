// Salon Mirai Admin System
// =========================

// Global state
let currentData = null;
let isAuthenticated = false;
let currentUser = null;

// Authentication
const validCredentials = {
    'salon_admin': 'salon2024',
    'demo_user': 'demo123'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');

    // Force initialization
    initializeApp();
});

async function initializeApp() {
    try {
        console.log('Initializing app...');

        // Setup authentication and listeners first
        checkAuthentication();
        setupEventListeners();

        // Ensure data is always loaded
        if (!currentData) {
            console.log('No current data, loading...');
            await loadData();
        }

        // Force re-render after a short delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Force re-render...');
            if (currentData) {
                updateDashboardStats();
                renderAllContent();
            }
        }, 500);

        console.log('App initialization complete');
    } catch (error) {
        console.error('App initialization error:', error);
        // Emergency fallback
        currentData = getDefaultData();
        setTimeout(() => {
            updateDashboardStats();
            renderAllContent();
        }, 1000);
    }
}

// Authentication Functions
function checkAuthentication() {
    const authData = localStorage.getItem('salon_auth');
    if (authData) {
        const auth = JSON.parse(authData);
        if (auth.expiry > Date.now()) {
            isAuthenticated = true;
            currentUser = auth.username;
            showDashboard();
            return;
        }
    }
    showLogin();
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
        console.log('No data found, loading default data');
        currentData = getDefaultData();
    }

    updateDashboardStats();
    renderAllContent();
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

// Data Management
async function loadData() {
    console.log('loadData called');

    try {
        // First try to load from localStorage
        const localData = loadFromLocalStorage();
        if (localData) {
            currentData = localData;
            console.log('データをlocalStorageから読み込み:', currentData);
            updateDashboardStats();
            renderAllContent();
            return;
        }

        // Skip fetch for file:// protocol due to CORS issues
        if (window.location.protocol === 'file:') {
            throw new Error('File protocol detected, using default data');
        }

        // If no localStorage, try to fetch from data.json
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('データファイルが見つかりません');
        }
        currentData = await response.json();
        console.log('data.jsonから読み込み成功:', currentData);
        updateDashboardStats();
        renderAllContent();
    } catch (error) {
        console.log('Using default data due to:', error.message);
        // フォールバック: デフォルトデータを使用
        currentData = getDefaultData();
        console.log('デフォルトデータを使用:', currentData);
        updateDashboardStats();
        renderAllContent();
    }
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
            "lastUpdated": "2024-09-17T15:30:00.000Z"
        }
    };
}

function saveData() {
    try {
        // Save to localStorage for persistence
        localStorage.setItem('salon_data_backup', JSON.stringify(currentData));

        // Update last modified time
        if (currentData.settings) {
            currentData.settings.lastUpdated = new Date().toISOString();
        }

        console.log('Data saved to localStorage:', currentData);

        // Try to save to data.json (this will work in a local server environment)
        // For file:// protocol, this will fail silently, but localStorage works

        return true;
    } catch (error) {
        console.error('Save error:', error);
        showNotification('データの保存に失敗しました', 'error');
        return false;
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

    if (campaignCount) campaignCount.textContent = currentData.campaigns?.length || 0;
    if (newsCount) newsCount.textContent = currentData.news?.length || 0;
    if (staffCount) staffCount.textContent = currentData.staff?.length || 0;
    if (serviceCount) serviceCount.textContent = currentData.services?.length || 0;

    console.log('Dashboard stats updated:', {
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

    console.log('Rendering campaigns:', currentData.campaigns);

    container.innerHTML = currentData.campaigns.map(campaign => `
        <div class="data-card">
            <div class="card-header">
                <h4 class="card-title">${campaign.title}</h4>
                <div class="card-actions">
                    <button onclick="editCampaign(${campaign.id})" class="btn-sm btn-edit">編集</button>
                    <button onclick="toggleCampaignStatus(${campaign.id})"
                            class="btn-sm ${campaign.active ? 'btn-delete' : 'btn-edit'}">
                        ${campaign.active ? '無効化' : '有効化'}
                    </button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${campaign.period}</p>
            <p style="margin: 10px 0;">${campaign.description}</p>
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
                <h4 class="card-title">${news.title}</h4>
                <div class="card-actions">
                    <button onclick="editNews(${news.id})" class="btn-sm btn-edit">編集</button>
                    <button onclick="deleteNews(${news.id})" class="btn-sm btn-delete">削除</button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${formatDate(news.publishedAt)}</p>
            <p style="margin: 10px 0;">${news.content}</p>
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
                <h4 class="card-title">${staff.name}</h4>
                <div class="card-actions">
                    <button onclick="editStaff(${staff.id})" class="btn-sm btn-edit">編集</button>
                </div>
            </div>
            <p style="margin: 10px 0; color: #666;">${staff.role}</p>
            <p style="margin: 10px 0;">経験年数: ${staff.experience}年</p>
            <p style="margin: 10px 0;">専門: ${staff.specialties}</p>
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

    container.innerHTML = Object.entries(groupedServices).map(([category, services]) => `
        <div style="margin-bottom: 30px;">
            <h3 style="color: #2c3e50; border-bottom: 2px solid #B8860B; padding-bottom: 10px; margin-bottom: 20px;">${category}</h3>
            <div class="data-grid">
                ${services.map(service => `
                    <div class="data-card">
                        <div class="card-header">
                            <h4 class="card-title">${service.name}</h4>
                            <div class="card-actions">
                                <button onclick="editService(${service.id})" class="btn-sm btn-edit">編集</button>
                            </div>
                        </div>
                        <div class="price-display" style="margin: 15px 0;">
                            <span class="sale-price">¥${service.price.toLocaleString()}${service.priceNote || ''}</span>
                        </div>
                        <p style="margin: 10px 0;">${service.description}</p>
                        ${service.features ? `
                            <div style="margin-top: 15px;">
                                <strong style="color: #666;">特徴:</strong>
                                <ul style="margin: 5px 0 0 20px; color: #666;">
                                    ${service.features.split('\n').map(feature =>
                                        `<li>${feature}</li>`
                                    ).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// CRUD Operations
function toggleCampaignStatus(id) {
    const campaign = currentData.campaigns.find(c => c.id === id);
    if (campaign) {
        campaign.active = !campaign.active;
        renderCampaigns();
        updateDashboardStats();
        showNotification(`キャンペーンを${campaign.active ? '有効' : '無効'}にしました`, 'success');
    }
}

function editCampaign(id) {
    const campaign = currentData.campaigns.find(c => c.id === id);
    if (campaign) {
        showEditModal('campaign', campaign);
    }
}

function editNews(id) {
    const news = currentData.news.find(n => n.id === id);
    if (news) {
        showEditModal('news', news);
    }
}

function editStaff(id) {
    const staff = currentData.staff.find(s => s.id === id);
    if (staff) {
        showEditModal('staff', staff);
    }
}

function editService(id) {
    const service = currentData.services.find(s => s.id === id);
    if (service) {
        showEditModal('service', service);
    }
}

function deleteNews(id) {
    if (confirm('このお知らせを削除しますか？')) {
        currentData.news = currentData.news.filter(n => n.id !== id);
        renderNews();
        showNotification('お知らせを削除しました', 'success');
    }
}

// Modal Management
function showEditModal(type, item, isNew = false) {
    console.log('showEditModal called:', { type, item, isNew });

    const modal = document.getElementById('editForm');
    if (!modal) {
        console.error('Modal element not found');
        showNotification('モーダル要素が見つかりません', 'error');
        return;
    }

    const title = document.getElementById('formTitle');
    const form = document.getElementById('formContent');

    // Create modal content dynamically if elements don't exist
    if (!title || !form) {
        console.log('Creating modal content dynamically');
        modal.innerHTML = `
            <div class="form-container">
                <h3 id="formTitle">${getTypeLabel(type)}を${isNew ? '追加' : '編集'}</h3>
                <div id="formContent">${generateFormFields(type, item)}</div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="closeEditForm()">キャンセル</button>
                    <button class="btn-save" onclick="saveItem()">保存</button>
                </div>
            </div>
        `;
    } else {
        // Update existing elements
        title.textContent = `${getTypeLabel(type)}を${isNew ? '追加' : '編集'}`;
        form.innerHTML = generateFormFields(type, item);
    }

    modal.style.display = 'flex';
    console.log('Modal should be visible now');

    // Store current edit info
    modal.dataset.type = type;
    modal.dataset.id = item.id;
    modal.dataset.isNew = isNew;
}

function closeModal() {
    document.getElementById('editForm').style.display = 'none';
}

function closeEditForm() {
    closeModal();
}

function saveItem() {
    console.log('saveItem called');

    const modal = document.getElementById('editForm');
    if (!modal) {
        console.error('Modal not found');
        showNotification('エラー: モーダルが見つかりません', 'error');
        return;
    }

    const type = modal.dataset.type;
    const id = parseInt(modal.dataset.id);
    const isNew = modal.dataset.isNew === 'true';

    console.log('Save data:', { type, id, isNew });

    // Try to find form element - either by ID or within the modal
    let form = document.getElementById('editItemForm');
    if (!form) {
        // If form with ID not found, try to find any form within the modal
        form = modal.querySelector('form');
    }
    if (!form) {
        // If still no form, try to find the form content div and treat it as form
        const formContent = document.getElementById('formContent');
        if (formContent) {
            // Create a temporary form element to wrap the content
            form = document.createElement('form');
            form.innerHTML = formContent.innerHTML;
            formContent.appendChild(form);
        }
    }
    if (!form) {
        console.error('Form not found');
        showNotification('エラー: フォームが見つかりません', 'error');
        return;
    }

    // Get form data more safely
    const updatedData = {};

    // Try FormData first
    try {
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            updatedData[key] = value;
        }
    } catch (formDataError) {
        console.log('FormData failed, using direct element access');
        // Fallback: direct element access
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                updatedData[input.name] = input.checked;
            } else if (input.name) {
                updatedData[input.name] = input.value;
            }
        });
    }

    console.log('Raw form data:', updatedData);

    // Convert numeric fields
    if (updatedData.price) updatedData.price = parseInt(updatedData.price) || 0;
    if (updatedData.originalPrice) updatedData.originalPrice = parseInt(updatedData.originalPrice) || 0;
    if (updatedData.salePrice) updatedData.salePrice = parseInt(updatedData.salePrice) || 0;
    if (updatedData.rating) updatedData.rating = parseFloat(updatedData.rating) || 0;

    // Convert boolean fields (checkbox handling) - safer approach
    const activeCheckbox = form.querySelector('input[name="active"]') ||
                          document.querySelector('input[name="active"]');
    const featuredCheckbox = form.querySelector('input[name="featured"]') ||
                            document.querySelector('input[name="featured"]');

    updatedData.active = activeCheckbox ? activeCheckbox.checked : false;
    updatedData.featured = featuredCheckbox ? featuredCheckbox.checked : false;

    // Ensure required fields for new items
    if (isNew) {
        updatedData.id = id;
        if (type === 'news') {
            updatedData.publishedAt = new Date().toISOString();
        }
        if (type === 'staff') {
            updatedData.reviews = [];
        }
    }

    console.log('Processed form data:', updatedData);

    try {
        if (isNew) {
            // Add new item
            addNewItemData(type, updatedData);
            showNotification(`新しい${getTypeLabel(type)}を追加しました`, 'success');
        } else {
            // Update existing item
            updateItemData(type, id, updatedData);
            showNotification('更新しました', 'success');
        }

        // Save to localStorage for persistence
        saveData();

        closeModal();
        renderAllContent();
        updateDashboardStats();

        console.log('Save completed successfully');
    } catch (error) {
        console.error('Save error:', error);
        showNotification('保存中にエラーが発生しました', 'error');
    }
}

function updateItemData(type, id, updatedData) {
    let collection;
    switch (type) {
        case 'campaign':
            collection = currentData.campaigns;
            break;
        case 'news':
            collection = currentData.news;
            break;
        case 'staff':
            collection = currentData.staff;
            break;
        case 'service':
            collection = currentData.services;
            break;
    }

    const item = collection.find(item => item.id === id);
    if (item) {
        Object.assign(item, updatedData);
    }
}

// Form Generation
function generateFormFields(type, item) {
    const formHTML = (() => {
        switch (type) {
            case 'campaign':
                return `
                    <div class="form-group">
                        <label>タイトル</label>
                        <input type="text" name="title" value="${item.title}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>期間</label>
                        <input type="text" name="period" value="${item.period}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>説明</label>
                        <textarea name="description" class="form-control" rows="3" required>${item.description}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>通常価格</label>
                            <input type="number" name="originalPrice" value="${item.originalPrice || ''}" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>セール価格</label>
                            <input type="number" name="salePrice" value="${item.salePrice || ''}" class="form-control">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>バッジ</label>
                        <input type="text" name="badge" value="${item.badge || ''}" class="form-control" placeholder="例: 🔥人気">
                    </div>
                    <div class="form-group">
                        <label>タグ（カンマ区切り）</label>
                        <input type="text" name="tags" value="${item.tags || ''}" class="form-control" placeholder="例: カラー,期間限定">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="active" value="true" ${item.active ? 'checked' : ''}>
                                有効
                            </label>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="featured" value="true" ${item.featured ? 'checked' : ''}>
                                注目
                            </label>
                        </div>
                    </div>
                `;
            case 'news':
                return `
                    <div class="form-group">
                        <label>タイトル</label>
                        <input type="text" name="title" value="${item.title}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>内容</label>
                        <textarea name="content" class="form-control" rows="4" required>${item.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="featured" value="true" ${item.featured ? 'checked' : ''}>
                            注目記事
                        </label>
                    </div>
                `;
            case 'staff':
                return `
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" name="name" value="${item.name}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>役職</label>
                        <input type="text" name="role" value="${item.role}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>経験年数</label>
                        <input type="text" name="experience" value="${item.experience}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>プロフィール</label>
                        <textarea name="bio" class="form-control" rows="3" required>${item.bio}</textarea>
                    </div>
                    <div class="form-group">
                        <label>専門分野（カンマ区切り）</label>
                        <input type="text" name="specialties" value="${item.specialties}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>評価</label>
                        <input type="number" name="rating" value="${item.rating}" min="1" max="5" step="0.1" class="form-control" required>
                    </div>
                `;
            case 'service':
                return `
                    <div class="form-group">
                        <label>カテゴリー</label>
                        <input type="text" name="category" value="${item.category}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>サービス名</label>
                        <input type="text" name="name" value="${item.name}" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>説明</label>
                        <textarea name="description" class="form-control" rows="3" required>${item.description}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>価格</label>
                            <input type="number" name="price" value="${item.price}" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>価格表記</label>
                            <input type="text" name="priceNote" value="${item.priceNote || ''}" class="form-control" placeholder="例: ～">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>特徴（改行区切り）</label>
                        <textarea name="features" class="form-control" rows="3">${item.features || ''}</textarea>
                    </div>
                `;
            default:
                return '';
        }
    })();

    return `<form id="editItemForm">${formHTML}</form>`;
}

// Utility Functions
function getTypeLabel(type) {
    const labels = {
        campaign: 'キャンペーン',
        news: 'お知らせ',
        staff: 'スタッフ',
        service: 'サービス'
    };
    return labels[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;

    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
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
        pageTitle.textContent = titles[sectionId] || sectionId;
    }
}

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });

    // Modal close
    document.getElementById('editForm').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);

            // Update active state
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            // Update page title
            const titles = {
                dashboard: 'ダッシュボード',
                campaigns: 'キャンペーン管理',
                news: 'お知らせ管理',
                staff: 'スタッフ管理',
                services: 'メニュー管理',
                settings: 'サイト設定'
            };
            document.getElementById('pageTitle').textContent = titles[section] || section;
        });
    });
}

// Add New Items
function addCampaign() {
    console.log('=== addCampaign called ===');
    console.log('currentData:', currentData);

    if (!currentData) {
        console.error('currentData is null, initializing...');
        currentData = getDefaultData();
    }

    const maxId = currentData.campaigns && currentData.campaigns.length > 0
        ? Math.max(...currentData.campaigns.map(c => c.id))
        : 0;

    const newCampaign = {
        id: maxId + 1,
        title: '新しいキャンペーン',
        period: '期間未設定',
        description: 'キャンペーンの説明を入力してください',
        originalPrice: 0,
        salePrice: 0,
        badge: '',
        featured: false,
        active: true,
        tags: '',
        image: 'images_top/image_fx (5).jpg'
    };

    console.log('newCampaign:', newCampaign);
    console.log('About to call showEditModal...');

    try {
        showEditModal('campaign', newCampaign, true);
        console.log('showEditModal completed successfully');
    } catch (error) {
        console.error('Error in showEditModal:', error);
        showNotification('モーダルの表示に失敗しました', 'error');
    }
}

function addNews() {
    console.log('addNews called');
    if (!currentData) {
        showNotification('データが読み込まれていません', 'error');
        return;
    }

    const maxId = currentData.news && currentData.news.length > 0
        ? Math.max(...currentData.news.map(n => n.id))
        : 0;

    const newNews = {
        id: maxId + 1,
        title: '新しいお知らせ',
        content: 'お知らせの内容を入力してください',
        publishedAt: new Date().toISOString(),
        featured: false
    };
    showEditModal('news', newNews, true);
}

function addStaff() {
    console.log('addStaff called');
    if (!currentData) {
        showNotification('データが読み込まれていません', 'error');
        return;
    }

    const maxId = currentData.staff && currentData.staff.length > 0
        ? Math.max(...currentData.staff.map(s => s.id))
        : 0;

    const newStaff = {
        id: maxId + 1,
        name: '新しいスタッフ',
        role: '役職',
        experience: '1',
        bio: 'プロフィールを入力してください',
        specialties: '専門分野',
        rating: 4.5,
        photo: 'images_about/Image_daihyou.jpg',
        reviews: []
    };
    showEditModal('staff', newStaff, true);
}

function addService() {
    console.log('addService called');
    if (!currentData) {
        showNotification('データが読み込まれていません', 'error');
        return;
    }

    const maxId = currentData.services && currentData.services.length > 0
        ? Math.max(...currentData.services.map(s => s.id))
        : 0;

    const newService = {
        id: maxId + 1,
        category: 'カテゴリー',
        name: '新しいサービス',
        price: 0,
        priceNote: '～',
        description: 'サービスの説明を入力してください',
        features: '特徴1\n特徴2\n特徴3'
    };
    showEditModal('service', newService, true);
}

// Live Preview Function
function previewSite() {
    // Export current data as JSON file for preview
    const blob = new Blob([JSON.stringify(currentData, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    // Update data.json temporarily for preview
    localStorage.setItem('preview_data', JSON.stringify(currentData));

    // Open preview in new tab
    window.open('../campaign.html', '_blank');

    showNotification('プレビューを開きました。新しいタブでサイトの変更を確認できます。', 'info');
}

// Backup and Restore
function exportData() {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `salon-mirai-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('データをエクスポートしました', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    currentData = importedData;
                    renderAllContent();
                    updateDashboardStats();
                    showNotification('データをインポートしました', 'success');
                } catch (error) {
                    showNotification('ファイルの読み込みに失敗しました', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Bulk Operations
function toggleAllCampaigns(active) {
    currentData.campaigns.forEach(campaign => {
        campaign.active = active;
    });
    renderCampaigns();
    updateDashboardStats();
    showNotification(`全キャンペーンを${active ? '有効' : '無効'}にしました`, 'success');
}

// Updated Modal Management with isNew parameter
function showEditModal(type, item, isNew = false) {
    const modal = document.getElementById('edit-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('edit-form');

    title.textContent = `${getTypeLabel(type)}を${isNew ? '追加' : '編集'}`;
    form.innerHTML = generateFormFields(type, item);

    modal.style.display = 'flex';

    // Store current edit info
    modal.dataset.type = type;
    modal.dataset.id = item.id;
    modal.dataset.isNew = isNew;
}


function addNewItemData(type, newData) {
    switch (type) {
        case 'campaign':
            currentData.campaigns.push(newData);
            break;
        case 'news':
            currentData.news.push(newData);
            break;
        case 'staff':
            currentData.staff.push(newData);
            break;
        case 'service':
            currentData.services.push(newData);
            break;
    }
}

// Settings management
function saveSettings() {
    const siteName = document.getElementById('siteName')?.value;
    const primaryColor = document.getElementById('primaryColor')?.value;
    const phone = document.getElementById('phone')?.value;
    const email = document.getElementById('email')?.value;
    const address = document.getElementById('address')?.value;
    const hours = document.getElementById('hours')?.value;

    if (currentData && currentData.settings) {
        currentData.settings.siteName = siteName || currentData.settings.siteName;
        currentData.settings.primaryColor = primaryColor || currentData.settings.primaryColor;
        currentData.settings.contact.phone = phone || currentData.settings.contact.phone;
        currentData.settings.contact.email = email || currentData.settings.contact.email;
        currentData.settings.contact.address = address || currentData.settings.contact.address;
        currentData.settings.contact.hours = hours || currentData.settings.contact.hours;
        currentData.settings.lastUpdated = new Date().toISOString();

        saveData();
        showNotification('設定を保存しました', 'success');
    }
}

// Reset data to default
function resetData() {
    if (confirm('すべてのデータをリセットしてデフォルトに戻しますか？この操作は取り消せません。')) {
        localStorage.removeItem('salon_data_backup');
        currentData = getDefaultData();
        renderAllContent();
        updateDashboardStats();
        showNotification('データをリセットしました', 'info');
    }
}

// Export data as JSON file
function exportDataAsFile() {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `salon-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('データをダウンロードしました', 'success');
}

// Global function exports for HTML onclick handlers
window.login = login;
window.logout = logout;
window.showSection = showSection;
window.editCampaign = editCampaign;
window.editNews = editNews;
window.editStaff = editStaff;
window.editService = editService;
window.addCampaign = addCampaign;
window.addNews = addNews;
window.addStaff = addStaff;
window.addService = addService;
window.toggleCampaignStatus = toggleCampaignStatus;
window.deleteNews = deleteNews;
window.saveItem = saveItem;
window.closeEditForm = closeEditForm;
window.closeModal = closeModal;
window.saveSettings = saveSettings;
window.resetData = resetData;
window.exportDataAsFile = exportDataAsFile;

// Export for programmatic use
window.SalonAdmin = {
    login,
    logout,
    showSection,
    editCampaign,
    editNews,
    editStaff,
    editService,
    addCampaign,
    addNews,
    addStaff,
    addService,
    toggleCampaignStatus,
    deleteNews,
    saveItem,
    closeModal,
    closeEditForm,
    previewSite,
    exportData,
    importData,
    toggleAllCampaigns,
    loadData,
    renderAllContent,
    updateDashboardStats
};