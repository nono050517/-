const S_URL = 'https://djfklvgrpdehqzhhodyg.supabase.co'; 
const S_KEY = 'sb_publishable_ywFWyEJawcabWW8nHoETtQ_l-JyNOfC';
const client = supabase.createClient(S_URL, S_KEY);

async function initCommon() {
    await loadSidebar();
}

async function loadSidebar() {
    const navEl = document.getElementById('sidebar-nav');
    if (!navEl) return;

    try {
        const { data } = await client.from('nav_menus').select('*').eq('is_active', true).order('display_order');
        
        let html = '';
        const categories = {};
        
        // カテゴリごとにデータを分ける
        data.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        Object.keys(categories).forEach((cat, i) => {
            // カテゴリ見出し（「■」はDB側にあるのでそのまま表示）
            html += `<div class="nav-category-title">${cat}</div><ul class="nav-list">`;
            
            let currentSubMenuId = null;

            categories[cat].forEach((item, j) => {
                const isJobGroup = item.display_name.includes("次職");
                const uniqueId = `sub-${i}-${j}`;

                if (isJobGroup) {
                    // 前に開いていたサブメニューがあれば閉じる
                    if (currentSubMenuId) html += `</ul></li>`;
                    
                    // 「一次職」などの開閉タイトル
                    html += `<li class="sub-category">
                                <div class="sub-title" onclick="toggleSubMenu('${uniqueId}')">
                                    <span id="icon-${uniqueId}">▶</span> ${item.display_name}
                                </div>
                                <ul id="${uniqueId}" class="sub-menu" style="display:none;">`;
                    currentSubMenuId = uniqueId;
                } else {
                    // 通常のリンク設定
                    let link = 'index.html'; 
                    if (item.page_id === 'production-page') link = 'production.html';
                    if (item.page_id === 'faq-page') link = 'faq.html';

                    // 枝記号の調整（DBに記号がない場合のみ付ける）
                    const hasSymbol = item.display_name.includes('┣') || item.display_name.includes('┗');
                    const displayName = hasSymbol ? item.display_name : `┣ ${item.display_name}`;

                    html += `<li><a href="${link}">${displayName}</a></li>`;
                }
            });

            // 最後にサブメニューが開いたままなら閉じるタグを追加
            if (currentSubMenuId) html += `</ul></li>`;
            html += `</ul>`;
        });
        
        navEl.innerHTML = html;
    } catch (e) { 
        console.error("Sidebar error:", e); 
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
    const headerHtml = `<header><h1 class="header-title">エリシアオンライン　アーカイブス</h1><h2 class="header-subtitle">Ellicia-Online Archives</h2></header><div class="nav-bar"></div>`;
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) wrapper.insertAdjacentHTML('afterbegin', headerHtml);
    initCommon();
});
