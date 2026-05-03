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
        data.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        Object.keys(categories).forEach((cat, i) => {
            html += `<div class="nav-category-title">${cat}</div><ul class="nav-list">`;
            
            let subMenuHtml = ''; // 一次職などの中身を一時的に貯める場所
            let currentSubTitle = ''; // 「一次職」などのタイトルを保持
            let currentSubId = '';

            categories[cat].forEach((item, j) => {
                const isJobGroup = item.display_name.includes("次職");
                
                // リンク先の設定
                let link = 'index.html'; 
                if (item.page_id === 'production-page') link = 'production.html';
                if (item.page_id === 'faq-page') link = 'faq.html';

                // 表示名の整形
                let name = item.display_name.trim();

                if (isJobGroup) {
                    // もし前のサブメニューが開いていたら、一旦書き出す
                    if (currentSubTitle) {
                        html += renderSubMenu(currentSubId, currentSubTitle, subMenuHtml);
                        subMenuHtml = '';
                    }
                    currentSubTitle = name.replace(/[┣┗]/g, '').trim();
                    currentSubId = `sub-${i}-${j}`;
                } else {
                    // 普通の項目
                    const line = (name.startsWith('┣') || name.startsWith('┗')) ? '' : '┣ ';
                    const row = `<li><a href="${link}">${line}${name}</a></li>`;
                    
                    if (currentSubTitle) {
                        subMenuHtml += row; // サブメニューの中身として貯める
                    } else {
                        html += row; // 直接リストに出す
                    }
                }
            });

            // 最後に残ったサブメニューを書き出す
            if (currentSubTitle) {
                html += renderSubMenu(currentSubId, currentSubTitle, subMenuHtml);
            }

            html += `</ul>`;
        });
        
        navEl.innerHTML = html;
    } catch (e) { 
        console.error("Sidebar error:", e); 
    }
}

// サブメニュー（折りたたみ）を組み立てる補助関数
function renderSubMenu(id, title, content) {
    return `
        <li class="sub-category">
            <div class="sub-title" onclick="toggleSubMenu('${id}')" style="cursor:pointer; font-weight:bold;">
                <span id="icon-${id}">▶</span> ${title}
            </div>
            <ul id="${id}" class="sub-menu" style="display:none; padding-left:15px; list-style:none;">
                ${content}
            </ul>
        </li>`;
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
