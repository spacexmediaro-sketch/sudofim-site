// Product rendering and interaction logic
// products & categories arrays loaded from products_data.js

const ITEMS_PER_PAGE = 20;
let currentPage = 1;
let currentCategory = 'all';
let filteredProducts = products;

// Render product cards
function renderProducts() {
  const grid = document.getElementById('product-grid');
  filteredProducts = currentCategory === 'all'
    ? products
    : products.filter(p => p.category === currentCategory);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProducts = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

  // Update count
  const countEl = document.getElementById('product-count');
  if (countEl) countEl.textContent = filteredProducts.length + ' produse';

  grid.innerHTML = pageProducts.map(p => `
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover cursor-pointer group" onclick="openModal(${p.id})">
      <div class="relative aspect-square bg-gray-50 overflow-hidden">
        <img src="${p.photos[0]}" alt="${p.title}" class="w-full h-full object-contain p-4 product-img" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 800%22><rect fill=%22%23f3f4f6%22 width=%22800%22 height=%22800%22/><text x=%22400%22 y=%22400%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2240%22>Fara imagine</text></svg>'">
        <div class="absolute top-3 left-3">
          <span class="${p.state === 'Nou' ? 'badge-new' : 'badge-used'} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">${p.state}</span>
        </div>
        ${p.photoCount > 1 ? `<div class="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          ${p.photoCount}
        </div>` : ''}
      </div>
      <div class="p-5">
        <p class="text-gray-400 text-[11px] uppercase tracking-wider mb-2">${p.category}</p>
        <h3 class="text-dark font-semibold text-[15px] leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2" title="${p.title}">${p.title}</h3>
        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <span class="text-primary font-bold text-sm">La cerere</span>
          <span class="text-xs text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1">
            Detalii
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </div>
  `).join('');

  renderPagination(totalPages);
  window.scrollTo({ top: document.getElementById('produse').offsetTop - 80, behavior: 'smooth' });
}

// Pagination
function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="flex items-center justify-center gap-2 mt-10">';

  // Prev
  if (currentPage > 1) {
    html += `<button onclick="goToPage(${currentPage - 1})" class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">&laquo; Prev</button>`;
  }

  // Page numbers
  const maxVisible = 7;
  let startP = Math.max(1, currentPage - 3);
  let endP = Math.min(totalPages, startP + maxVisible - 1);
  if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

  if (startP > 1) {
    html += `<button onclick="goToPage(1)" class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">1</button>`;
    if (startP > 2) html += '<span class="text-gray-400 px-1">...</span>';
  }

  for (let i = startP; i <= endP; i++) {
    if (i === currentPage) {
      html += `<button class="px-3 py-2 rounded-lg bg-primary text-white text-sm font-bold">${i}</button>`;
    } else {
      html += `<button onclick="goToPage(${i})" class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">${i}</button>`;
    }
  }

  if (endP < totalPages) {
    if (endP < totalPages - 1) html += '<span class="text-gray-400 px-1">...</span>';
    html += `<button onclick="goToPage(${totalPages})" class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">${totalPages}</button>`;
  }

  // Next
  if (currentPage < totalPages) {
    html += `<button onclick="goToPage(${currentPage + 1})" class="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">Next &raquo;</button>`;
  }

  html += '</div>';
  html += `<p class="text-center text-gray-400 text-xs mt-3">Pagina ${currentPage} din ${totalPages} (${filteredProducts.length} produse)</p>`;
  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
}

// Modal
function openModal(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  document.getElementById('modal-main-image').src = p.photos[0];
  document.getElementById('modal-main-image').alt = p.title;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-category').textContent = p.category;
  document.getElementById('modal-description').textContent = p.description || 'Contactati-ne pentru detalii despre acest echipament.';

  const badge = document.getElementById('modal-badge');
  badge.textContent = p.state;
  badge.className = 'inline-flex w-fit items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold mb-4 ' + (p.state === 'Nou' ? 'badge-new' : 'badge-used');

  // Thumbnails
  const thumbs = document.getElementById('modal-thumbnails');
  thumbs.innerHTML = p.photos.map((photo, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''} aspect-square bg-white rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-all cursor-pointer" onclick="changeImage('${photo}', this)">
      <img src="${photo}" alt="Photo ${i+1}" class="w-full h-full object-contain p-1" loading="lazy">
    </div>
  `).join('');

  const modal = document.getElementById('product-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function changeImage(src, thumb) {
  document.getElementById('modal-main-image').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => {
    t.classList.remove('active', 'border-primary');
    t.classList.add('border-transparent');
  });
  thumb.classList.add('active', 'border-primary');
  thumb.classList.remove('border-transparent');
}

function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// Event listeners
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('product-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('product-modal')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Build filter buttons dynamically
function buildFilters() {
  const container = document.getElementById('filter-buttons');
  container.innerHTML = categories.map(cat => `
    <button class="filter-btn ${cat.key === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'} px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary whitespace-nowrap"
            data-category="${cat.key}"
            onclick="filterCategory('${cat.key}')">
      ${cat.name} <span class="opacity-60">(${cat.count})</span>
    </button>
  `).join('');
}

function filterCategory(category) {
  currentCategory = category;
  currentPage = 1;

  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('bg-primary', 'text-white');
    b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
  });
  const activeBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
  if (activeBtn) {
    activeBtn.classList.add('bg-primary', 'text-white');
    activeBtn.classList.remove('bg-white', 'text-gray-600');
  }

  renderProducts();
}

// Search
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        filteredProducts = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
      } else {
        const base = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
        filteredProducts = base.filter(p => p.title.toLowerCase().includes(query));
      }
      currentPage = 1;
      const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
      const pageProducts = filteredProducts.slice(0, ITEMS_PER_PAGE);

      const grid = document.getElementById('product-grid');
      const countEl = document.getElementById('product-count');
      if (countEl) countEl.textContent = filteredProducts.length + ' produse';

      grid.innerHTML = pageProducts.map(p => `
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover cursor-pointer group" onclick="openModal(${p.id})">
          <div class="relative aspect-square bg-gray-50 overflow-hidden">
            <img src="${p.photos[0]}" alt="${p.title}" class="w-full h-full object-contain p-4 product-img" loading="lazy">
            <div class="absolute top-3 left-3">
              <span class="${p.state === 'Nou' ? 'badge-new' : 'badge-used'} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">${p.state}</span>
            </div>
          </div>
          <div class="p-5">
            <p class="text-gray-400 text-[11px] uppercase tracking-wider mb-2">${p.category}</p>
            <h3 class="text-dark font-semibold text-[15px] leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2">${p.title}</h3>
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <span class="text-primary font-bold text-sm">La cerere</span>
              <span class="text-xs text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1">Detalii <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></span>
            </div>
          </div>
        </div>
      `).join('');

      renderPagination(totalPages);
    }, 300);
  });
}

// Mobile menu
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => document.getElementById('mobile-menu').classList.add('hidden'));
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

// Header scroll
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.classList.toggle('shadow-lg', window.scrollY > 100);
});

// Contact form
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const subject = encodeURIComponent('Mesaj de la ' + fd.get('name') + ' - sudofimserv.ro');
  const body = encodeURIComponent('Nume: ' + fd.get('name') + '\nTelefon: ' + fd.get('phone') + '\nEmail: ' + fd.get('email') + '\n\nMesaj:\n' + fd.get('message'));
  window.location.href = 'mailto:sudofim2006@gmail.com?subject=' + subject + '&body=' + body;
});

// Init
buildFilters();
setupSearch();
renderProducts();
