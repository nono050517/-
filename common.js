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
        const categories = {};
        data.forEach(item => { 
            if (!categories[item.category]) categories[item.category] = []; 
            categories[item.category].push(item); 
        });
        
        // 閉じておきたいカテゴリのキーワード設定
        const collapsibleCats = ["一次職", "二次職", "三次職"];
        let html = '';
        
        Object.keys(categories).forEach((cat, i) => {
            // カテゴリ名に「次職」が含まれるか、リストに完全一致するか判定
            const isCollapsible = collapsibleCats.includes(cat) || cat.includes("次職");
            
            const titleCls = isCollapsible ? "nav-category-title collapsible" : "nav-category-title";
            const ulCls = isCollapsible ? "" : "always-show";
            const click = isCollapsible ? `onclick="toggleNav('u-${i}','t-${i}')"` : "";

            html += `<div id="t-${i}" class="${titleCls}" ${click}>${cat}</div><ul id="u-${i}" class="${ulCls}">`;
            
            categories[cat].forEach(item => {
                let link = 'index.html'; 
                if (item.page_id === 'production-page') link = 'production.html';
                if (item.page_id === 'faq-page') link = 'faq.html';
                
                html += `<li><a href="${link}">${item.display_name}</a></li>`;
            });
            html += `</ul>`;
        });
        navEl.innerHTML = html;
    } catch (e) { 
        console.error("Sidebar error:", e); 
    }
}

function toggleNav(u, t) {
    const ul = document.getElementById(u);
    const title = document.getElementById(t);
    if (ul && title) {
        ul.classList.toggle('show');
        title.classList.toggle('active');
    }
}

// 共通パーツ（ヘッダー）の注入
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
