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
        if (!data) return;

        let html = '';
        let currentCat = '';

        data.forEach((item) => {
            // カテゴリが変わったら見出しを作る
            if (currentCat !== item.category) {
                if (currentCat !== '') html += `</ul>`; // 前のリストを閉じる
                currentCat = item.category;
                html += `<div class="nav-category-title">${currentCat}</div><ul class="nav-list">`;
            }

            // リンク先判定
            let link = 'index.html';
            if (item.page_id === 'production-page') link = 'production.html';
            if (item.page_id === 'faq-page') link = 'faq.html';

            const name = item.display_name.trim();

            // 「次職」が含まれる場合は、少し目立つ特別な行にする
            if (name.includes("次職")) {
                html += `<li style="list-style:none; margin-top:5px; font-weight:bold; color:#a04040;">▼ ${name.replace(/[┣┗]/g, '')}</li>`;
            } else {
                // それ以外は普通の枝付きリンク
                const symbol = (name.startsWith('┣') || name.startsWith('┗')) ? '' : '┣ ';
                html += `<li><a href="${link}">${symbol}${name}</a></li>`;
            }
        });

        html += `</ul>`;
        navEl.innerHTML = html;

    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const headerHtml = `<header><h1 class="header-title">エリシアオンライン　アーカイブス</h1><h2 class="header-subtitle">Ellicia-Online Archives</h2></header><div class="nav-bar"></div>`;
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) wrapper.insertAdjacentHTML('afterbegin', headerHtml);
    initCommon();
});
