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
        
        // 1. カテゴリごとにデータを分ける
        data.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        // 2. 画面を作っていく
        Object.keys(categories).forEach((cat, i) => {
            html += `<div class="nav-category-title">${cat}</div><ul class="nav-list">`;
            
            let isSubMenuOpen = false; // 現在、一次職などの「中身」を書き込み中かどうか

            categories[cat].forEach((item, j) => {
                const isJobGroup = item.display_name.includes("次職");
                const uniqueId = `sub-${i}-${j}`;

                // もし「一次職」などが来たら、新しい折りたたみを作る
                if (isJobGroup) {
                    if (isSubMenuOpen) html += `</ul></li>`; // 前のがあれば閉じる
                    
                    html += `<li class="sub-category">
                                <div class="sub-title" onclick="toggleSubMenu('${uniqueId}')">
                                    <span id="icon-${uniqueId}">▶</span> ${item.display_name}
                                </div>
                                <ul id="${uniqueId}" class="sub-menu" style="display:none;">`;
                    isSubMenuOpen = true;
                } else {
                    // 通常のメニュー（一次職などの下にいない場合も表示する）
                    let link = 'index.html'; 
                    if (item.page_id === 'production-page') link = 'production.html';
                    if (item.page_id === 'faq-page') link = 'faq.html';

                    const hasSymbol = item.display_name.includes('┣') || item.display_name.includes('┗');
                    const displayName = hasSymbol ? item.display_name : `┣ ${item.display_name}`;

                    html += `<li><a href="${link}">${displayName}</a></li>`;
                }
            });

            if (isSubMenuOpen) html += `</ul></li>`;
            html += `</ul>`;
        });
        
        navEl.innerHTML = html;
    } catch (e) { 
        console.error("Sidebar error:", e); 
    }
}

// 開閉スイッチ
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
