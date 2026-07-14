import Link from 'next/link';
import Image from 'next/image';

type Props = {
  product: {
    slug: string;
    title: string;
    condition: string;
    category: { name: string };
    images: string[];
    photoCount: number;
  };
};

export default function ProductCard({ product }: Props) {
  const firstImage = product.images[0] || '/placeholder.svg';

  return (
    <Link href={`/echipamente/${product.slug}/`} className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover cursor-pointer group block">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={firstImage}
          alt={product.title}
          fill
          className="object-contain p-4 product-img"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className={`${product.condition === 'NOU' ? 'badge-new' : 'badge-used'} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
            {product.condition === 'NOU' ? 'Nou' : 'Utilizat'}
          </span>
        </div>
        {product.photoCount > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {product.photoCount}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-2">{product.category.name}</p>
        <h3 className="text-dark font-semibold text-[15px] leading-snug mb-4 group-hover:text-primary transition-colors line-clamp-2" title={product.title}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-primary font-bold text-sm">La cerere</span>
          <span className="text-xs text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1">
            Detalii
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
