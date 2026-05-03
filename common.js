const S_URL = 'https://djfklvgrpdehqzhhodyg.supabase.co'; 
const S_KEY = 'sb_publishable_ywfWyEJawcabWW8nHoETtQ_l-JyNOfC';
const client = supabase.createClient(S_URL, S_KEY);

async function loadSidebar() {
    const navEl = document.getElementById('sidebar-nav');
    if (!navEl) return;

    try {
        const { data, error } = await client.from('nav_menus').select('*').eq('is_active', true).order('display_order');
        
        if (error) {
            console.error("DB読み込みエラー:", error);
            return;
        }

        let html = '';
        let currentCat = '';

        data.forEach(item => {
            if (currentCat !== item.category) {
                if (currentCat !== '') html += `</ul>`; 
                currentCat = item.category;
                html += `<div class="nav-category-title">${currentCat}</div><ul class="nav-list">`;
            }

            let link = 'index.html'; 
            if (item.page_id === 'production-page') link = 'production.html';
            if (item.page_id === 'faq-page') link = 'faq.html';
            
            html += `<li><a href="${link}">${item.display_name}</a></li>`;
        });

        html += `</ul>`;
        navEl.innerHTML = html;
    } catch (e) {
        console.error("致命的なエラー:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector('.wrapper');
    if (wrapper) {
        const headerHtml = `
            <header>
                <h1 class="header-title">エリシアオンライン　アーカイブス</h1>
                <h2 class="header-subtitle">Ellicia-Online Archives</h2>
            </header>
            <div class="nav-bar"></div>
        `;
        wrapper.insertAdjacentHTML('afterbegin', headerHtml);
    }
    loadSidebar();
});
