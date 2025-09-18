// Firebase Integration for Real-time Admin-Website Sync
// リアルタイム管理画面・ウェブサイト同期システム

// Firebase configuration (本番環境では環境変数を使用)
const firebaseConfig = {
    // Firebase プロジェクト設定をここに追加
    // 実際のデプロイ時に設定
    apiKey: "YOUR_API_KEY",
    authDomain: "salon-mirai.firebaseapp.com",
    databaseURL: "https://salon-mirai-default-rtdb.firebaseio.com/",
    projectId: "salon-mirai",
    storageBucket: "salon-mirai.appspot.com",
    messagingSenderId: "123456789",
    appId: "YOUR_APP_ID"
};

class SalonFirebaseManager {
    constructor() {
        this.isFirebaseAvailable = false;
        this.db = null;
        this.isOnline = navigator.onLine;
        this.initializeFirebase();
        this.setupOfflineHandling();
    }

    async initializeFirebase() {
        try {
            // Firebase SDKが利用可能かチェック
            if (typeof firebase !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.database();
                this.isFirebaseAvailable = true;
                console.log('✅ Firebase initialized successfully');

                // リアルタイムリスナーを設定
                this.setupRealtimeListeners();
            } else {
                console.log('⚠️ Firebase SDK not available, using localStorage fallback');
                this.isFirebaseAvailable = false;
            }
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.isFirebaseAvailable = false;
        }
    }

    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Online - syncing with Firebase');
            this.syncLocalToFirebase();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📴 Offline - using localStorage');
        });
    }

    setupRealtimeListeners() {
        if (!this.isFirebaseAvailable) return;

        // サロンデータの変更を監視
        this.db.ref('salonData').on('value', (snapshot) => {
            const firebaseData = snapshot.val();
            if (firebaseData) {
                console.log('🔄 Firebase data updated, refreshing website');

                // localStorageも更新
                localStorage.setItem('salon_data_backup', JSON.stringify(firebaseData));

                // ページを自動更新（管理画面以外）
                if (!window.location.pathname.includes('admin')) {
                    this.refreshWebsiteContent(firebaseData);
                }
            }
        });
    }

    async saveData(data) {
        // まずlocalStorageに保存（即座の応答のため）
        localStorage.setItem('salon_data_backup', JSON.stringify(data));

        // オンラインの場合はFirebaseにも保存
        if (this.isFirebaseAvailable && this.isOnline) {
            try {
                await this.db.ref('salonData').set(data);
                console.log('✅ Data saved to Firebase');
                return { success: true, source: 'firebase' };
            } catch (error) {
                console.error('❌ Firebase save failed:', error);
                return { success: true, source: 'localStorage', error: error.message };
            }
        }

        return { success: true, source: 'localStorage' };
    }

    async loadData() {
        // オンライン且つFirebase利用可能な場合はFirebaseから読み込み
        if (this.isFirebaseAvailable && this.isOnline) {
            try {
                const snapshot = await this.db.ref('salonData').once('value');
                const firebaseData = snapshot.val();

                if (firebaseData) {
                    // localStorageも更新して同期を保つ
                    localStorage.setItem('salon_data_backup', JSON.stringify(firebaseData));
                    console.log('✅ Data loaded from Firebase');
                    return firebaseData;
                }
            } catch (error) {
                console.error('❌ Firebase load failed:', error);
            }
        }

        // Firebase失敗またはオフラインの場合はlocalStorageから
        const localData = localStorage.getItem('salon_data_backup');
        if (localData) {
            console.log('✅ Data loaded from localStorage');
            return JSON.parse(localData);
        }

        // 両方失敗の場合はデフォルトデータ
        console.log('⚠️ Using default data');
        return this.getDefaultData();
    }

    async syncLocalToFirebase() {
        if (!this.isFirebaseAvailable || !this.isOnline) return;

        const localData = localStorage.getItem('salon_data_backup');
        if (localData) {
            try {
                const data = JSON.parse(localData);
                await this.db.ref('salonData').set(data);
                console.log('🔄 Local data synced to Firebase');
            } catch (error) {
                console.error('❌ Sync to Firebase failed:', error);
            }
        }
    }

    refreshWebsiteContent(data) {
        // SalonIntegrationが利用可能な場合は更新関数を呼び出し
        if (window.SalonIntegration && typeof window.SalonIntegration.refreshAll === 'function') {
            window.SalonIntegration.refreshAll();
        }

        // 管理画面連携スクリプトが利用可能な場合
        if (window.SalonIntegration) {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            switch (currentPage) {
                case 'index.html':
                case '':
                    if (window.SalonIntegration.updateHomePage) {
                        window.SalonIntegration.updateHomePage();
                    }
                    break;
                case 'campaign.html':
                    if (window.SalonIntegration.updateCampaignPage) {
                        window.SalonIntegration.updateCampaignPage();
                    }
                    break;
                case 'staff.html':
                    if (window.SalonIntegration.updateStaffPage) {
                        window.SalonIntegration.updateStaffPage();
                    }
                    break;
                case 'services.html':
                    if (window.SalonIntegration.updateServicesPage) {
                        window.SalonIntegration.updateServicesPage();
                    }
                    break;
                case 'about.html':
                case 'company.html':
                    if (window.SalonIntegration.updateAboutPage) {
                        window.SalonIntegration.updateAboutPage();
                    }
                    break;
            }

            // 共通要素とお知らせの更新
            if (window.SalonIntegration.updateCommonElements) {
                window.SalonIntegration.updateCommonElements();
            }
            if (window.SalonIntegration.updateNewsSection) {
                window.SalonIntegration.updateNewsSection();
            }
        }
    }

    getDefaultData() {
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
                },
                "lastUpdated": new Date().toISOString()
            }
        };
    }

    // 管理画面専用：認証付きデータ保存
    async saveAdminData(data, user) {
        // 更新情報を追加
        if (data.settings) {
            data.settings.lastUpdated = new Date().toISOString();
            data.settings.lastUpdatedBy = user || 'admin';
        }

        const result = await this.saveData(data);

        // 管理ログを記録（オプション）
        if (this.isFirebaseAvailable && this.isOnline) {
            try {
                await this.db.ref('adminLogs').push({
                    action: 'data_update',
                    user: user || 'admin',
                    timestamp: new Date().toISOString(),
                    success: result.success
                });
            } catch (error) {
                console.error('❌ Admin log failed:', error);
            }
        }

        return result;
    }

    // 接続状態チェック
    getConnectionStatus() {
        return {
            isOnline: this.isOnline,
            isFirebaseAvailable: this.isFirebaseAvailable,
            currentSource: this.isFirebaseAvailable && this.isOnline ? 'firebase' : 'localStorage'
        };
    }
}

// グローバルインスタンス作成
const salonFirebase = new SalonFirebaseManager();

// 既存のSalonIntegrationにFirebase機能を統合
if (window.SalonIntegration) {
    // 既存の loadAdminData を Firebase版に拡張
    const originalLoadAdminData = window.SalonIntegration.loadAdminData;
    window.SalonIntegration.loadAdminData = async function() {
        return await salonFirebase.loadData();
    };

    // Firebase保存機能を追加
    window.SalonIntegration.saveAdminData = async function(data, user) {
        return await salonFirebase.saveAdminData(data, user);
    };

    // 接続状態確認機能を追加
    window.SalonIntegration.getConnectionStatus = function() {
        return salonFirebase.getConnectionStatus();
    };
}

// グローバルアクセス用
window.SalonFirebase = salonFirebase;

console.log('✅ Firebase integration script loaded');