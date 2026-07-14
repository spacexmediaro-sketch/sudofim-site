import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getAllProducts, getAllCategories } from '@/lib/products-db';

export const metadata: Metadata = {
  title: 'Echipamente Industriale - Catalog Complet',
  description: 'Catalog complet cu peste 400 echipamente industriale: aparate de sudura, generatoare de curent, compactoare, compresoare si multe altele. Vanzare si inchiriere.',
};

export default async function EchipamentePage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <section className="bg-gray-50 py-20 sm:py-28 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Catalog Complet</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mt-2">Echipamente <span className="text-primary">Industriale</span></h1>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Vanzare si inchiriere echipamente profesionale de sudura, generatoare si utilaje industriale.</p>
        </div>

        <ProductGrid products={products} categories={categories} />
      </div>
    </section>
  );
}
