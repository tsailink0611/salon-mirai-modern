document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const header = document.getElementById('header');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const globalNav = document.querySelector('.global-nav');

    // --- ローディング画面 ---
    if (loader) {
        document.body.classList.add('loading'); // 初期はスクロール禁止
        window.addEventListener('load', () => {
            setTimeout(() => { // 少し遅延させてロゴを見せる
                loader.classList.add('loaded');
                document.body.classList.remove('loading'); // スクロール許可
                // ヒーローセクションのロード時アニメーション発火
                const heroAnimations = document.querySelectorAll('.animate-on-load');
                heroAnimations.forEach(el => {
                    el.classList.add('is-visible');
                });
            }, 500); // 0.5秒後にローダーを消す（アニメーション時間はCSSで調整）
        });
    } else {
        // ローダーがない場合はヒーローアニメーションを即時発火
        const heroAnimations = document.querySelectorAll('.animate-on-load');
        heroAnimations.forEach(el => {
            el.classList.add('is-visible');
        });
        // ローダーがない場合はスクロールを許可しておく
        document.body.classList.remove('loading');
    }


    // --- ヘッダーのスクロール時スタイル変更 ---
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- スクロールアニメーション (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => { // observer を obs に変更
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // 一度表示されたら監視を止める場合 (パフォーマンス向上)
                    obs.unobserve(entry.target);
                }
                // 画面外に出たらアニメーションをリセットする場合は unobserve しない
                // else { entry.target.classList.remove('is-visible'); }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- FAQ アコーディオン (services.html) ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    }

});
// ▼▼▼ ここからヒーローセクションのパララックス処理を追加 ▼▼▼
const heroSection = document.getElementById('hero');
if (heroSection) { // hero要素が存在する場合のみ実行
    const layerDeep = heroSection.querySelector('.hero-bg-layer.layer-deep');
    const layerMiddle = heroSection.querySelector('.hero-bg-layer.layer-middle');
    const layerNear = heroSection.querySelector('.hero-bg-layer.layer-near');

    if (layerDeep && layerMiddle && layerNear) {
        window.addEventListener('scroll', () => {
            // requestAnimationFrameを使ってスクロールイベント処理を最適化
            window.requestAnimationFrame(() => {
                let scrollPosition = window.pageYOffset;

                // 各レイヤーの移動速度係数（この値を調整して動きの大きさを変える）
                // 奥のレイヤーほど小さく、手前のレイヤーほど大きく（またはマイナスで逆方向）
                const deepSpeed = 0.2;
                const middleSpeed = 0.4;
                const nearSpeed = 0.6;

                // 画面上部からヒーローセクションが見え始めるまでは動かさないように調整も可能
                // const heroTop = heroSection.offsetTop;
                // if (scrollPosition >= heroTop - window.innerHeight && scrollPosition <= heroTop + heroSection.offsetHeight) {
                //    let relativeScroll = scrollPosition - (heroTop - window.innerHeight / 2); // 調整したスクロール量
                // }

                // transform: translateY で垂直方向に動かす
                // スクロール量に係数を掛けて、移動量を計算
                if (layerDeep) {
                    layerDeep.style.transform = `translateY(${scrollPosition * deepSpeed}px)`;
                }
                if (layerMiddle) {
                    layerMiddle.style.transform = `translateY(${scrollPosition * middleSpeed}px)`;
                }
                if (layerNear) {
                    layerNear.style.transform = `translateY(${scrollPosition * nearSpeed}px)`;
                }
            });
        });
    }
}
// ▲▲▲ ここまでヒーローセクションのパララックス処理 ▲▲▲
document.addEventListener('DOMContentLoaded', () => {
    const superRichOpening = document.getElementById('super-rich-opening');
    // const richLoader = document.getElementById('rich-loader'); // トップページ以外用
    const headerEl = document.getElementById('header'); // 変数名を変更
    const mainEl = document.querySelector('main');     // 変数名を変更
    const footerEl = document.getElementById('footer'); // 変数名を変更
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const globalNav = document.querySelector('.global-nav');
    const isTopPage = document.body.classList.contains('home');

    // --- パーティクル生成関数 (簡易版) ---
    function createParticles(container, count = 50) {
        if (!container) return;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('sro-particle');
            const size = Math.random() * 3 + 1; // 1px to 4px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            // particle.style.top = `${Math.random() * 100}%`; // 初期位置はアニメーションで制御
            particle.style.setProperty('--x-start', `${Math.random() * 100 - 50}vw`); // X方向の開始オフセット
            particle.style.setProperty('--x-end', `${Math.random() * 100 - 50}vw`);   // X方向の終了オフセット
            particle.style.setProperty('--scale', Math.random() * 0.5 + 0.5); // スケールばらつき
            particle.style.setProperty('--opacity-max', Math.random() * 0.4 + 0.2); // 最大不透明度ばらつき
            const duration = Math.random() * 5 + 5; // 5s to 10s
            particle.style.animationDuration = `${duration}s, ${duration}s`;
            particle.style.animationDelay = `${Math.random() * duration}s, ${Math.random() * duration}s`; // 開始タイミングもばらつかせる
            container.appendChild(particle);
        }
    }

    // --- ローディング/オープニング制御 ---
    if (isTopPage && superRichOpening) {
        document.body.classList.add('loading'); // スクロール禁止

        // 他のローダーがあれば非表示に
        const richLoader = document.getElementById('rich-loader');
        if (richLoader) richLoader.style.display = 'none';
        const prevOpening = document.getElementById('opening-animation-container');
        if (prevOpening) prevOpening.style.display = 'none';
        const saunaOpening = document.getElementById('sauna-style-opening');
        if (saunaOpening) saunaOpening.style.display = 'none';


        const particleContainer = superRichOpening.querySelector('.sro-particles-container');
        createParticles(particleContainer, 70); // パーティクルを70個生成

        // アニメーションの総時間をCSSの定義と合わせる (最も遅いアニメーションの完了時間)
        // ロゴ出現: 2.1s (delay) + 1.2s (duration) = 3.3s
        // キャッチ出現: 3.8s (delay) + 1.5s (duration) = 5.3s
        // 背景シフト: 1s (delay) + 6s (duration) = 7s
        // 余裕を持った全体の表示時間
        const openingTotalDuration = 7000; // ms (背景アニメーションが一番長いのでそれに合わせる)
        const fadeOutTransitionDuration = 1200; // CSSの#super-rich-openingのtransition-duration
        const fadeOutDelay = 500; // CSSの#super-rich-openingのtransition-delay

        // 1. CSSアニメーションに任せる

        // 2. オープニング終了処理
        setTimeout(() => {
            superRichOpening.classList.add('ending'); // フェードアウト開始
        }, openingTotalDuration - (fadeOutTransitionDuration + fadeOutDelay) + 500 ); // 終了少し前にフェードアウト開始(重なるように)

        // 3. コンテンツ表示とスクロール許可
        setTimeout(() => {
            document.body.classList.remove('loading');
            if(superRichOpening) superRichOpening.style.display = 'none'; // 完全に非表示

            // ヘッダー、メイン、フッターを表示
            if (headerEl) headerEl.classList.add('visible');
            if (mainEl) mainEl.classList.add('visible');
            if (footerEl) footerEl.classList.add('visible');

            // ヒーローセクション内の animate-on-load を発火
            const heroAnimations = document.querySelectorAll('#hero .animate-on-load');
            heroAnimations.forEach(el => {
                el.classList.add('is-visible');
            });

        }, openingTotalDuration + 500); // 全体のアニメーションが終わってから少し遅れて

    } else { // トップページ以外 (既存のリッチローダーを使う場合)
        const richLoader = document.getElementById('rich-loader'); // このローダーは別の実装と仮定
        if (richLoader) {
            document.body.classList.add('loading');
            window.addEventListener('load', () => {
                const totalAnimationTime = 3500;
                setTimeout(() => {
                    richLoader.classList.add('loaded');
                }, totalAnimationTime - 500);
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    // トップページ以外の animate-on-load を発火 (必要なら)
                    // const otherPageAnimations = document.querySelectorAll('.animate-on-load');
                    // otherPageAnimations.forEach(el => el.classList.add('is-visible'));
                }, totalAnimationTime + 800);
            });
        } else { // ローダーが何もない場合
            document.body.classList.remove('loading');
            // トップページ以外の animate-on-load を発火 (必要なら)
            // const otherPageAnimations = document.querySelectorAll('.animate-on-load');
            // otherPageAnimations.forEach(el => el.classList.add('is-visible'));
            // 最初からコンテンツ表示
            if (headerEl) headerEl.classList.add('visible');
            if (mainEl) mainEl.classList.add('visible');
            if (footerEl) footerEl.classList.add('visible');
        }
    }

    // --- ヘッダーのスクロール時スタイル変更 ---
    if (headerEl) { // header -> headerEl
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerEl.classList.add('scrolled');
            } else {
                headerEl.classList.remove('scrolled');
            }
        });
    }

    // --- スクロールアニメーション (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- ハンバーガーメニュー ---
    if (hamburgerMenu && globalNav) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            globalNav.classList.toggle('active');
            const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true' || false;
            hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
            if (globalNav.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
        globalNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (globalNav.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    globalNav.classList.remove('active');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }

});