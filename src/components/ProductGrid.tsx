'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  slug: string;
  title: string;
  condition: string;
  category: { id: string; name: string; slug: string };
  images: string[];
  photoCount: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

const ITEMS_PER_PAGE = 18;

export default function ProductGrid({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = products;
    if (currentCategory !== 'all') {
      result = result.filter(p => p.category.slug === currentCategory);
    }
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    return result;
  }, [products, currentCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (slug: string) => {
    setCurrentCategory(slug);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cauta echipament... (ex: generator, sudura, compactor)"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {filtered.length} produse
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 overflow-x-auto pb-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary whitespace-nowrap ${
            currentCategory === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Toate <span className="opacity-60">({products.length})</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all hover:bg-primary hover:text-white hover:border-primary whitespace-nowrap ${
              currentCategory === cat.slug ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat.name} <span className="opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pageProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pageProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Niciun echipament gasit.</p>
          <button onClick={() => { setSearchQuery(''); setCurrentCategory('all'); }} className="mt-4 text-primary font-semibold text-sm hover:underline">
            Reseteaza filtrele
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-10">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">
                &laquo; Prev
              </button>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    page === currentPage
                      ? 'bg-primary text-white font-bold'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary text-sm transition-all">
                Next &raquo;
              </button>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-3">Pagina {currentPage} din {totalPages} ({filtered.length} produse)</p>
        </div>
      )}
    </>
  );
}
