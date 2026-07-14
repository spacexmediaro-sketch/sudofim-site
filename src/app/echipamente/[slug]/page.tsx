import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getProductsByCategory, type ProductListItem } from '@/lib/products-db';
import { BUSINESS } from '@/lib/constants';
import ProductCard from '@/components/ProductCard';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import ProductGallery from '@/components/ProductGallery';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description || `${product.title} - Disponibil la ${BUSINESS.companyName}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProductsByCategory(product.category.slug))
    .filter((p: ProductListItem) => p.id !== product.id)
    .slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.title,
    image: product.images[0] ? `${BUSINESS.url}/${product.images[0]}` : undefined,
    brand: { '@type': 'Brand', name: BUSINESS.companyName },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'RON',
      price: '0',
      priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: BUSINESS.companyName },
    },
    category: product.category.name,
    itemCondition: product.condition === 'NOU' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">Acasa</Link>
          <span>/</span>
          <Link href="/echipamente/" className="hover:text-primary transition-colors">Echipamente</Link>
          <span>/</span>
          <Link href={`/echipamente/?categorie=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Info */}
          <div>
            <span className={`inline-block ${product.condition === 'NOU' ? 'badge-new' : 'badge-used'} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4`}>
              {product.condition === 'NOU' ? 'Nou' : 'Utilizat'}
            </span>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{product.category.name}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-4">{product.title}</h1>

            {product.description && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-dark mb-2">Descriere</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="text-2xl font-bold text-primary mb-6">Pret la cerere</div>

            {/* Phone CTAs */}
            <div className="space-y-3 mb-8">
              <a href={`tel:${BUSINESS.salesPhone1}`} className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Suna: {BUSINESS.salesPhone1}
              </a>
              <a href={`tel:${BUSINESS.salesPhone2}`} className="flex items-center justify-center gap-2 w-full px-6 py-3.5 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold text-sm uppercase tracking-wider rounded-lg transition-all">
                Suna: {BUSINESS.salesPhone2}
              </a>
            </div>

            {/* Lead Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-dark text-lg mb-4">Solicita Oferta</h3>
              <LeadCaptureForm productId={product.id} productTitle={product.title} />
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-dark mb-8">Echipamente similare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p: ProductListItem) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
