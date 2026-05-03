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
        const { data, error } = await client.from('nav_menus').select('*').eq('is_active', true).order('display_order');
        if (error) throw error;

        const categories = {};
        data.forEach(item => { 
            if (!categories[item.category]) categories[item.category] = []; 
            categories[item.category].push(item); 
        });
        
        const jobCats = ["一次職", "二次職", "三次職"];
        let html = '';
        Object.keys(categories).forEach((cat, i) => {
            const isJob = jobCats.includes(cat);
            const titleCls = isJob ? "nav-category-title collapsible" : "nav-category-title";
            const ulCls = isJob ? "" : "always-show";
            const click = isJob ? `onclick="toggleNav('u-${i}','t-${i}')"` : "";

            html += `<div id="t-${i}" class="${titleCls}" ${click}>${cat}</div><ul id="u-${i}" class="${ulCls}">`;
            categories[cat].forEach(item => {
                let link = 'index.html'; 
                if (item.page_id === 'production-page') link = 'production.html';
                if (item.page_id === 'faq-page') link = 'faq.html';
                if (item.page_id === 'status-page') link = 'status.html';
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
    if (ul) ul.classList.toggle('show');
    if (title) title.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", () => {
    initCommon();
});
