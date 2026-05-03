const S_URL = 'https://djfklvgrpdehqzhhodyg.supabase.co'; 
const S_KEY = 'sb_publishable_ywFWyEJawcabWW8nHoETtQ_l-JyNOfC';
const client = supabase.createClient(S_URL, S_KEY);

async function initCommon() {
    console.log("Common JS 起動"); // 動作確認ログ
    await loadSidebar();
}

async function loadSidebar() {
    const navEl = document.getElementById('sidebar-nav');
    if (!navEl) {
        console.error("サイドバーの場所が見つかりません");
        return;
    }

    try {
        const { data, error } = await client.from('nav_menus').select('*').eq('is_active', true).order('display_order');
        
        if (error) {
            console.error("DB読み込みエラー:", error);
            return;
        }

        console.log("取得データ:", data); // どんなデータが来ているかログに出す

        let html = '';
        const categories = {};
        
        // カテゴリごとに整理
        data.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        Object.keys(categories).forEach((cat, i) => {
            // カテゴリ見出し
            html += `<div class="nav-category-title">${cat}</div>`;
            html += `<ul class="nav-list" style="display: block !important;">`; // 強制的に表示
            
            categories[cat].forEach((item, j) => {
                const uniqueId = `sub-${i}-${j}`;
                
                // 「次職」という文字が含まれる場合は、開閉用のボタンにする
                if (item.display_name.includes("次職")) {
                    html += `<li class="sub-category">
                                <div class="sub-title" onclick="toggleSubMenu('${uniqueId}')" style="cursor: pointer; font-weight: bold; color: #a04040;">
                                    <span id="icon-${uniqueId}">▶</span> ${item.display_name}
                                </div>
                                <ul id="${uniqueId}" class="sub-menu" style="display:none; list-style: none; padding-left: 15px;">`;
                } else {
                    // 通常のリンク
                    let link = 'index.html'; 
                    if (item.page_id === 'production-page') link = 'production.html';
                    if (item.page_id === 'faq-page') link = 'faq.html';

                    const hasSymbol = item.display_name.includes('┣') || item.display_name.includes('┗');
                    const displayName = hasSymbol ? item.display_name : `┣ ${item.display_name}`;

                    html += `<li><a href="${link}" style="text-decoration: none; color: #5d4037; display: block; padding: 2px 0;">${displayName}</a></li>`;
                }
            });
            
            html += `</ul>`;
        });
        
        navEl.innerHTML = html;
        console.log("サイドバーの書き換え完了");
    } catch (e) { 
        console.error("致命的なエラー:", e); 
    }
}

function toggleSubMenu(id) {
    const target = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    if (target.style.display === 'none') {
        target.style.display = 'block';
        icon.innerText = '▼';
    } else {
        target.style.display = 'none';
        icon.innerText = '▶';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const headerHtml = `
        <header>
            <h1 class="header-title">エリシアオンライン　アーカイブス</h1>
            <h2 class="header-subtitle">Ellicia-Online Archives</h2>
        </header>
        <div class="nav-bar"></div>
    `;
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) wrapper.insertAdjacentHTML('afterbegin', headerHtml);
    initCommon();
});
