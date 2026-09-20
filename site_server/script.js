// Date inițiale de test
let ads = [
    {
        id: 1,
        title: "Târnăcop Netherite Eficiență V",
        category: "Netherite",
        price: "48 Diamante",
        description: "Târnăcop full enchant (Efficiency V, Unbreaking III, Fortune III, Mending). Durabilitate maximă.",
        author: "AlexPro123",
        image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "Beacon Max Level (Full Pyramide)",
        category: "Beacon",
        price: "2 Shulker Box Diamante",
        description: "Beacon complet funcțional pregătit de livrare. Oferă viteze și rezistență sporită.",
        author: "CraftMaster",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "Elytra Unbreaking III + Mending",
        category: "Elytra",
        price: "64 Diamante",
        description: "Aripă Elytra nouă, pregătită pentru zbor lung. Vine la pachet cu un stack de rachete level 3.",
        author: "FlyGuy99",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=60"
    }
];

let activeCategory = 'all';

// Elementele din DOM
const adsGrid = document.getElementById('adsGrid');
const searchInput = document.getElementById('searchInput');
const resetSearchBtn = document.getElementById('resetSearchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');

// Modale
const addModal = document.getElementById('addModal');
const deleteModal = document.getElementById('deleteModal');
const profileModal = document.getElementById('profileModal');

// Butoane de deschidere/închidere
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeAddModalBtn = document.getElementById('closeAddModal');
const openDeleteModalBtn = document.getElementById('openDeleteModalBtn');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
const openProfileBtn = document.getElementById('openProfileBtn');
const closeProfileModalBtn = document.getElementById('closeProfileModal');

// Formular
const addAdForm = document.getElementById('addAdForm');

// Inițializare
document.addEventListener('DOMContentLoaded', () => {
    renderAds();
    setupEventListeners();
});

// Afișare anunțuri pe pagină
function renderAds() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredAds = ads.filter(ad => {
        const matchesCategory = activeCategory === 'all' || ad.category === activeCategory;
        const matchesSearch = ad.title.toLowerCase().includes(searchTerm) || 
                              ad.description.toLowerCase().includes(searchTerm) ||
                              ad.author.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    adsGrid.innerHTML = '';

    if (filteredAds.length === 0) {
        adsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Nu s-au găsit anunțuri corespunzătoare.</p>';
        return;
    }

    filteredAds.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'ad-card';
        card.innerHTML = `
            <img src="${ad.image}" alt="${ad.title}" class="ad-image">
            <div class="ad-body">
                <span class="ad-category-tag">${ad.category}</span>
                <h3 class="ad-title">${escapeHtml(ad.title)}</h3>
                <div class="ad-price"><i class="fa-solid fa-gem"></i> ${escapeHtml(ad.price)}</div>
                <p class="ad-desc">${escapeHtml(ad.description)}</p>
                <div class="ad-footer">
                    <span><i class="fa-solid fa-user"></i> ${escapeHtml(ad.author)}</span>
                    <button class="btn btn-danger" onclick="deleteAd(${ad.id})" style="padding: 4px 8px; font-size:0.75rem;">
                        <i class="fa-solid fa-trash"></i> Șterge
                    </button>
                </div>
            </div>
        `;
        adsGrid.appendChild(card);
    });
}

// Setare Ascultători de Evenimente (Event Listeners)
function setupEventListeners() {
    // Căutare text
    searchInput.addEventListener('input', renderAds);

    // Resetare Filtre
    resetSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        activeCategory = 'all';
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        categoryBtns[0].classList.add('active');
        renderAds();
    });

    // Filtre Categorie
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            renderAds();
        });
    });

    // Deschidere/Închidere Modale
    openAddModalBtn.addEventListener('click', () => toggleModal(addModal, true));
    closeAddModalBtn.addEventListener('click', () => toggleModal(addModal, false));

    openDeleteModalBtn.addEventListener('click', () => {
        renderDeleteList();
        toggleModal(deleteModal, true);
    });
    closeDeleteModalBtn.addEventListener('click', () => toggleModal(deleteModal, false));

    openProfileBtn.addEventListener('click', () => {
        document.getElementById('profileAdCount').textContent = ads.length;
        toggleModal(profileModal, true);
    });
    closeProfileModalBtn.addEventListener('click', () => toggleModal(profileModal, false));

    // Închidere la click în afara ferestrei modale
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            toggleModal(e.target, false);
        }
    });

    // Trimitere Formular Adăugare Anunț
    addAdForm.addEventListener('submit', handleFormSubmit);
}

// Deschidere/Închidere Modal
function toggleModal(modal, show) {
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

// Salvare Anunț Nou
function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('adTitle').value;
    const category = document.getElementById('adCategory').value;
    const price = document.getElementById('adPrice').value;
    const description = document.getElementById('adDescription').value;
    const author = document.getElementById('adAuthor').value;
    const imageInput = document.getElementById('adImage');

    let imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60";

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageUrl = event.target.result;
            createNewAd(title, category, price, description, author, imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        createNewAd(title, category, price, description, author, imageUrl);
    }
}

function createNewAd(title, category, price, description, author, image) {
    const newAd = {
        id: Date.now(),
        title,
        category,
        price,
        description,
        author,
        image
    };

    ads.unshift(newAd);
    renderAds();
    addAdForm.reset();
    toggleModal(addModal, false);
}

// Ștergere Anunț
function deleteAd(id) {
    ads = ads.filter(ad => ad.id !== id);
    renderAds();
    renderDeleteList();
}

// Lista Anunțuri în Modalul de Ștergere
function renderDeleteList() {
    const container = document.getElementById('deleteAdsList');
    container.innerHTML = '';

    if (ads.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">Nu există anunțuri de șters.</p>';
        return;
    }

    ads.forEach(ad => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `
            <div>
                <strong>${escapeHtml(ad.title)}</strong>
                <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(ad.author)}</div>
            </div>
            <button class="btn btn-danger" onclick="deleteAd(${ad.id})" style="padding: 6px 12px; font-size: 0.8rem;">
                Șterge
            </button>
        `;
        container.appendChild(item);
    });
}

// Securizare text (XSS Prevention)
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}