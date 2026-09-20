// Baza de date locală inițială (Mock Data)
let dataset = [
    { id: 1, title: "Sabie Netherite Max Stats - Sharpness V", price: "16 Diamante", category: "Armuri/Unelte", seller: "Xenesthis", online: true, badge: "top", emoji: "⚔️", date: "Azi" },
    { id: 2, title: "Stoc 5 Shulker Box-uri cu Quartz", price: "32 Emeralds", category: "Resurse", seller: "CraftyV", online: false, badge: "nego", emoji: "📦", date: "Ieri" },
    { id: 3, title: "Teren protejat lângă Spawn (20x20)", price: "Schimb pe Beacon", category: "Terenuri", seller: "BuilderPro", online: true, badge: "rar", emoji: "🏡", date: "Acum 2 ore" },
    { id: 4, title: "Serviciu Mending la comandă", price: "5 Coins / carte", category: "Servicii", seller: "WizardMC", online: true, badge: "", emoji: "✨", date: "Azi" }
];

// Inițializare aplicație
document.addEventListener("DOMContentLoaded", () => {
    loadAuth();
    renderListings(dataset);
    renderAdminPanel();
    
    // Filtrare dinamică la tastarea în bara de căutare
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchVal = e.target.value.toLowerCase();
        const filtered = dataset.filter(item => item.title.toLowerCase().includes(searchVal));
        renderListings(filtered);
    });
});

// Randare grid anunțuri pe pagina principală
function renderListings(items) {
    const grid = document.getElementById('listingsGrid');
    grid.innerHTML = "";

    if (items.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); margin-top: 40px;">Nu s-a găsit niciun anunț conform criteriilor.</p>`;
        return;
    }

    items.forEach(item => {
        const badgeHTML = item.badge ? `<span class="badge badge-${item.badge}">${item.badge}</span>` : '';
        const statusClass = item.online ? 'status-online' : 'status-offline';
        const ingameCommand = `/msg ${item.seller} Vreau sa cumpar "${item.title}" cu ${item.price}`;

        const card = document.createElement('div');
        card.className = 'ad-card';
        card.innerHTML = `
            <div class="ad-thumbnail-wrapper">
                ${item.emoji}
                <div class="ad-badges">${badgeHTML}</div>
                <div class="status-indicator ${statusClass}" title="${item.online ? 'Online pe server' : 'Offline'}"></div>
            </div>
            <div class="ad-details">
                <div class="ad-title">${item.title}</div>
                <div class="ad-price">${item.price}</div>
                <div class="ad-meta">Vânzător: <b>${item.seller}</b> • ${item.date}</div>
                <div class="ad-actions">
                    <button class="btn btn-secondary" style="flex: 1; font-size: 12px; padding: 6px;" onclick="copyToClipboard('${ingameCommand}')">
                        📋 Copiază Comanda
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Randare panou administrare (Ștergere rapidă)
function renderAdminPanel() {
    const list = document.getElementById('myItemsList');
    list.innerHTML = "";
    
    dataset.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manage-item';
        div.innerHTML = `
            <span>${item.emoji} ${item.title.substring(0, 22)}...</span>
            <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="deleteAd(${item.id})">Dezactivează</button>
        `;
        list.appendChild(div);
    });
}

// Ștergere / Dezactivare Anunț
function deleteAd(id) {
    dataset = dataset.filter(item => item.id !== id);
    renderListings(dataset);
    renderAdminPanel();
    showToast("Anunțul a fost eliminat/dezactivat cu succes!");
}

// Creare și adăugare Anunț Nou
function createNewAd(e) {
    e.preventDefault();
    const title = document.getElementById('adTitle').value;
    const category = document.getElementById('adCategory').value;
    const price = document.getElementById('adPrice').value;
    const badge = document.getElementById('adBadge').value;
    const emoji = document.getElementById('adEmoji').value || "📦";
    const seller = document.getElementById('mcUsername').value || "JucatorAnonim";

    const newAd = {
        id: Date.now(),
        title,
        price,
        category,
        seller,
        online: true,
        badge,
        emoji,
        date: "Acum"
    };

    dataset.unshift(newAd);
    renderListings(dataset);
    renderAdminPanel();
    toggleDrawer('createAdDrawer');
    document.getElementById('newAdForm').reset();
    showToast("Anunțul tău a fost publicat pe server!");
}

// Deschidere/Închidere Sertare Laterale
function toggleDrawer(id) {
    const drawer = document.getElementById(id);
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    } else {
        document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
        drawer.classList.add('open');
    }
}

// Controlul Tab-urilor din Profil
function switchTab(e, tabId) {
    const parent = e.target.parentElement;
    parent.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    const drawer = parent.parentElement;
    drawer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Căutări Populare (Trending Tags)
function quickSearch(term) {
    document.getElementById('searchInput').value = term;
    const filtered = dataset.filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
    renderListings(filtered);
}

// Filtre pe categorii principale
function filterCategory(cat, btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (cat === 'Toate') {
        renderListings(dataset);
    } else {
        const filtered = dataset.filter(item => item.category === cat);
        renderListings(filtered);
    }
}

// Copiere comenzi `/msg`
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Comandă copiată! Lipsește-o în chat-ul din joc (Ctrl+V)");
    });
}

// Afișare notificări discrete (Toast)
function showToast(msg) {
    const toast = document.getElementById('toastMessage');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// One-Time Login: Salvare profil în LocalStorage
function saveAuth() {
    const user = document.getElementById('mcUsername').value;
    localStorage.setItem('mc_market_user', user);
    document.getElementById('profileBtn').innerText = `👤 ${user}`;
    showToast("Datele de autentificare au fost salvate local!");
}

// One-Time Login: Încărcare profil din LocalStorage
function loadAuth() {
    const storedUser = localStorage.getItem('mc_market_user');
    if (storedUser) {
        document.getElementById('mcUsername').value = storedUser;
        document.getElementById('profileBtn').innerText = `👤 ${storedUser}`;
    }
}
