const collections = [
    { id: 1, name: "Pantalons Denim", items: [22, 23, 24] },
    { id: 2, name: "Ensemble Mixte", items: [25, 26, 27, 28] }, 
    { id: 3, name: "Style Urbain", items: [29, 34, 35, 36, 37, 38, 39, 40, 41, 57, 58, 59] }, 
    { id: 4, name: "Premium Selection", items: [42, 43, 44, 45, 46, 48, 56] }, 
    { id: 5, name: "Essentials", items: [49, 50, 51, 52, 53, 54, 55] } 
];

const allItems = [{ id: 27, ext: 'gif' }, { id: 28, ext: 'gif' }];
const usedIds = new Set([27, 28]);
collections.forEach(c => {
    c.items.forEach(id => {
        if(!usedIds.has(id)) { allItems.push({ id: id, ext: 'jpg' }); usedIds.add(id); }
    });
});

// --- INITIALISATION AU CHARGEMENT ---
window.onload = () => {
    renderAll();
    initScrollEffects();
};

function renderAll() {
    const hGrid = document.getElementById('homeGrid');
    const cGrid = document.getElementById('collectionGrid');
    
    if(hGrid) hGrid.innerHTML = allItems.slice(0, 10).map(img => `
        <div class="product-card reveal" onclick="openProduct(${img.id}, '${img.ext}')">
            <img src="Img_magasin/${img.id}.${img.ext}" loading="lazy" onerror="this.src='Img_magasin/22.jpg'">
        </div>`).join('');

    if(cGrid) cGrid.innerHTML = collections.map(col => `
        <div class="collection-card reveal" onclick="openCollection(${col.id})">
            <div class="col-count-badge" data-target="${col.items.length}">0</div>
            <img src="Img_magasin/${col.items[0]}.jpg" onerror="this.src='Img_magasin/22.jpg'">
            <div class="col-name">${col.name}</div>
        </div>`).join('');
    
    setTimeout(animateBadges, 500); 
}

// --- FONCTIONS DE NAVIGATION (RÉPARÉES) ---
function toggleNav() {
    const sideBar = document.getElementById('sideBar');
    sideBar.classList.toggle('active');
}

function showFullCatalogue() {
    document.getElementById('homeSection').style.display = 'none';
    const full = document.getElementById('fullCatalogue');
    full.style.display = 'block';
    const grid = document.getElementById('randomGrid');
    grid.innerHTML = allItems.map(img => `
        <div class="product-card reveal active" onclick="openProduct(${img.id}, '${img.ext}')">
            <img src="Img_magasin/${img.id}.${img.ext}" onerror="this.src='Img_magasin/22.jpg'">
        </div>`).join('');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// --- GESTION DES MODALES ---
function openProduct(id, ext) {
    const view = document.getElementById('productView');
    document.getElementById('mediaContainer').innerHTML = `<img src="Img_magasin/${id}.${ext}" class="zoom-in" style="width:100%; border-radius:15px; max-width:500px;" onerror="this.src='Img_magasin/22.jpg'">`;
    document.getElementById('waOrderBtn').href = `https://wa.me/2250717958688?text=Je commande le modèle n°${id}`;
    document.getElementById('waOrderBtn').style.display = 'block';
    showSuggestions(id);
    view.classList.add('active');
    document.body.style.overflow = "hidden";
}

function closeProduct() {
    document.getElementById('productView').classList.remove('active');
    document.body.style.overflow = "auto";
}

function openCollection(colId) {
    const col = collections.find(c => c.id === colId);
    const view = document.getElementById('productView');
    document.getElementById('waOrderBtn').style.display = 'none';
    document.getElementById('suggestionArea').innerHTML = ''; 
    document.getElementById('mediaContainer').innerHTML = `
        <h2 style="color:#ff3b30; text-align:center; margin-bottom:15px; text-transform:uppercase; font-size:1rem;">${col.name}</h2>
        <div class="product-grid">${col.items.map(id => {
            let ext = (id === 27 || id === 28) ? 'gif' : 'jpg';
            return `<div class="product-card active" onclick="openProduct(${id}, '${ext}')"><img src="Img_magasin/${id}.${ext}" onerror="this.src='Img_magasin/22.jpg'"></div>`
        }).join('')}</div>`;
    view.classList.add('active');
    view.scrollTo(0,0);
}

function showSuggestions(currentId) {
    const suggestArea = document.getElementById('suggestionArea');
    const filtered = allItems.filter(item => item.id !== currentId);
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
    suggestArea.innerHTML = `<p class="prop-title">VOUS POURRIEZ AUSSI AIMER</p><div class="similar-grid">${shuffled.map(img => `<img src="Img_magasin/${img.id}.${img.ext}" onclick="openProduct(${img.id}, '${img.ext}')" onerror="this.src='Img_magasin/22.jpg'">`).join('')}</div>`;
}

// --- REELS ET VIDÉO ---
function openReel(src) {
    const modal = document.getElementById('reelModal');
    const video = document.getElementById('modalVideo');
    video.src = src; modal.classList.add('active'); video.play();
    document.body.style.overflow = "hidden";
}

function closeReel() {
    document.getElementById('reelModal').classList.remove('active');
    document.getElementById('modalVideo').pause();
    document.body.style.overflow = "auto";
}

function handleVideoInteraction() {
    const v = document.getElementById('mainVideo');
    const btn = document.getElementById('volBtn');
    v.muted = !v.muted;
    btn.innerHTML = v.muted ? "🔇" : "🔊";
}

function forcePlayVideo() { document.getElementById('mainVideo').play().catch(()=>{}); }

// --- EFFETS VISUELS ---
function animateBadges() {
    const badges = document.querySelectorAll('.col-count-badge');
    badges.forEach(badge => {
        const target = +badge.getAttribute('data-target');
        let current = 0;
        const update = () => {
            if (current < target) {
                current += Math.ceil(target / 20);
                if(current > target) current = target;
                badge.innerText = current;
                setTimeout(update, 40);
            }
        };
        update();
    });
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        const video = document.getElementById('mainVideo');
        if (video) { video.style.transform = `translateY(${window.pageYOffset * 0.3}px)`; }
    });
}
