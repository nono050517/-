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
        
        let html = '';
        Object.keys(categories).forEach(cat => {
            html += `<div class="nav-category-title">${cat}</div><ul class="nav-list">`;
            categories[cat].forEach(item => {
                let link = 'index.html'; 
                if (item.page_id === 'production-page') link = 'production.html';
                if (item.page_id === 'faq-page') link = 'faq.html';
                
                html += `<li><a href="${link}">${item.display_name}</a></li>`;
            });
            html += `</ul>`;
        });
        navEl.innerHTML = html;
    } catch (e) { console.error(e); }
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
