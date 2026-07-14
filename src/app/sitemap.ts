import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { BUSINESS } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticPages = [
    { url: BUSINESS.url, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${BUSINESS.url}/echipamente/`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BUSINESS.url}/servicii/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BUSINESS.url}/despre-noi/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BUSINESS.url}/contact/`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ];

  const productPages = products.map((p: { slug: string; updatedAt: Date }) => ({
    url: `${BUSINESS.url}/echipamente/${p.slug}/`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const categoryPages = categories.map((c: { slug: string; updatedAt: Date }) => ({
    url: `${BUSINESS.url}/echipamente/?categorie=${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
