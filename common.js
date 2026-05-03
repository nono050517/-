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
        
        // データを整理
        let html = '';
        const categories = [...new Set(data.map(item => item.category))];

        categories.forEach((cat, i) => {
            html += `<div class="nav-category-title">■${cat}</div><ul class="nav-list">`;
            
            const items = data.filter(item => item.category === cat);
            
            items.forEach((item, j) => {
                const uniqueId = `menu-${i}-${j}`;
                
                // 「一次職」「二次職」「三次職」という名前のメニューを見つけたら開閉ボタンにする
                if (item.display_name.includes("次職")) {
                    html += `<li class="sub-category">
                                <div class="sub-title" onclick="toggleSubMenu('${uniqueId}')">
                                    <span id="icon-${uniqueId}">▶</span> ${item.display_name}
                                </div>
                                <ul id="${uniqueId}" class="sub-menu" style="display:none;">`;
                } else {
                    // 通常のリンク
                    let link = 'index.html'; 
                    if (item.page_id === 'production-page') link = 'production.html';
                    if (item.page_id === 'faq-page') link = 'faq.html';
                    
                    // 前に付いている枝記号を整える
                    const symbol = item.display_name.startsWith('┣') || item.display_name.startsWith('┗') ? '' : '┣ ';
                    html += `<li><a href="${link}">${symbol}${item.display_name}</a></li>`;
                }

                // 次のアイテムが「次職」系、またはカテゴリの最後なら、閉じタグを入れる
                const nextItem = items[j + 1];
                if (nextItem && nextItem.display_name.includes("次職") && !item.display_name.includes("次職")) {
                    // ここは何もしない（次のループで新しいsub-categoryが始まる）
                }
            });
            html += `</ul>`;
        });
        navEl.innerHTML = html;
    } catch (e) { 
        console.error("Sidebar error:", e); 
    }
}

// サブメニューの開閉用
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
