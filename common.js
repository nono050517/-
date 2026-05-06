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
        data.forEach(item => { if (!categories[item.category]) categories[item.category] = []; categories[item.category].push(item); });
        
        const jobCats = ["一次職", "二次職", "三次職"];
        let html = '';
        Object.keys(categories).forEach((cat, i) => {
            const isJob = jobCats.includes(cat);
            const titleCls = isJob ? "nav-category-title collapsible" : "nav-category-title";
            const ulCls = isJob ? "" : "always-show";
            const click = isJob ? `onclick="toggleNav('u-${i}','t-${i}')"` : "";

            html += `<div id="t-${i}" class="${titleCls}" ${click}>${cat}</div><ul id="u-${i}" class="${ulCls}">`;
            categories[cat].forEach(item => {
                // リンク先をファイル名に紐付け
                let link = 'index.html'; 
                if (item.page_id === 'production-page') link = 'production.html';
                if (item.page_id === 'faq-page') link = 'faq.html';
                if (item.page_id === 'status-page') link = 'status.html';
                if (item.page_id === 'job-change') link = 'job_change.html';
                if (item.page_id === 'exp-page') link = 'experience.html';
                if (item.page_id === 'swordman') link = '1job_swordman.html';
                if (item.page_id === 'archer') link = '1job_archer.html';                
                html += `<li><a href="${link}">${item.display_name}</a></li>`;
            });
            html += `</ul>`;
        });
        navEl.innerHTML = html;
    } catch (e) { console.error("Sidebar error:", e); }
}

function toggleNav(u, t) {
    document.getElementById(u).classList.toggle('show');
    document.getElementById(t).classList.toggle('active');
}

// ページ読み込み時にヘッダーを注入
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
