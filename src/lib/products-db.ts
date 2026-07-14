import { prisma } from './db';
import { unstable_cache } from 'next/cache';

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  condition: string;
  category: { id: string; name: string; slug: string };
  description: string | null;
  images: string[];
  photoCount: number;
  status: string;
  featured: boolean;
};

const productSelect = {
  id: true,
  title: true,
  slug: true,
  condition: true,
  description: true,
  images: true,
  photoCount: true,
  status: true,
  featured: true,
  metaTitle: true,
  metaDescription: true,
  category: { select: { id: true, name: true, slug: true } },
} as const;

function mapProduct(p: Record<string, unknown>): ProductListItem {
  return {
    id: p.id as string,
    title: p.title as string,
    slug: p.slug as string,
    condition: p.condition as string,
    category: p.category as { id: string; name: string; slug: string },
    description: p.description as string | null,
    images: ((p.images as string[]) || []).map(img => img.startsWith('/') ? img : `/${img}`),
    photoCount: p.photoCount as number,
    status: p.status as string,
    featured: p.featured as boolean,
  };
}

export const getAllProducts = unstable_cache(
  async (): Promise<ProductListItem[]> => {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: productSelect,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return products.map(mapProduct);
  },
  ['all-products'],
  { revalidate: 60 }
);

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<(ProductListItem & { tags: string[]; oldId: number | null; createdAt: Date; metaTitle: string | null; metaDescription: string | null }) | null> => {
    const p = await prisma.product.findUnique({
      where: { slug },
      select: { ...productSelect, tags: true, oldId: true, createdAt: true },
    });
    return p ? { ...mapProduct(p as Record<string, unknown>), tags: (p.tags as string[]) || [], oldId: p.oldId, createdAt: p.createdAt, metaTitle: p.metaTitle, metaDescription: p.metaDescription } : null;
  },
  ['product-by-slug'],
  { revalidate: 60 }
);

export const getProductsByCategory = unstable_cache(
  async (categorySlug: string): Promise<ProductListItem[]> => {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE', category: { slug: categorySlug } },
      select: productSelect,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return products.map(mapProduct);
  },
  ['products-by-category'],
  { revalidate: 60 }
);

export type CategoryInfo = { id: string; name: string; slug: string; description: string | null; count: number };

export const getAllCategories = unstable_cache(
  async (): Promise<CategoryInfo[]> => {
    const cats = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { status: 'ACTIVE' } } } } },
    });
    return cats.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      count: c._count.products,
    }));
  },
  ['all-categories'],
  { revalidate: 60 }
);

export const getFeaturedProducts = unstable_cache(
  async (limit = 6): Promise<ProductListItem[]> => {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE', featured: true },
      select: productSelect,
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });
    return products.map(mapProduct);
  },
  ['featured-products'],
  { revalidate: 60 }
);

export async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: productSelect,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return products.map(mapProduct);
}
