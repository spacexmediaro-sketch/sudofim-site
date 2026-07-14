import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL not set');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ț]/g, 't').replace(/[ș]/g, 's')
    .replace(/[ă]/g, 'a').replace(/[â]/g, 'a').replace(/[î]/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);
}

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const passwordHash = await argon2.hash('admin123', { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sudofimserv.ro' },
    update: {},
    create: { email: 'admin@sudofimserv.ro', passwordHash, firstName: 'Admin', lastName: 'Sudofim', role: 'SUPER_ADMIN' },
  });
  console.log(`Admin user: ${admin.email}`);

  // Read products data
  const jsFile = fs.readFileSync(path.join(__dirname, '..', 'products_data_backup.js'), 'utf-8');

  // Extract products array
  const productsMatch = jsFile.match(/const products=\[([\s\S]*?)\];\s*const categories/);
  if (!productsMatch) throw new Error('Could not parse products from JS file');

  // Parse using Function constructor (safe since it's our own data file)
  const productsData = new Function(`return [${productsMatch[1]}]`)() as Array<{
    id: number; title: string; state: string; category: string; description: string; photos: string[]; photoCount: number;
  }>;

  console.log(`Found ${productsData.length} products to import`);

  // Create categories
  const categoryNames = [...new Set(productsData.map(p => p.category))];
  const categoryMap: Record<string, string> = {};

  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = slugify(name);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, sortOrder: i },
    });
    categoryMap[name] = cat.id;
  }
  console.log(`Created ${categoryNames.length} categories`);

  // Create products
  let created = 0;
  const seenSlugs = new Set<string>();

  for (const p of productsData) {
    let slug = slugify(p.title);
    // Ensure unique slug
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${p.id}`;
    }
    seenSlugs.add(slug);

    try {
      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          title: p.title,
          slug,
          condition: p.state === 'Nou' ? 'NOU' : 'UTILIZAT',
          categoryId: categoryMap[p.category],
          description: p.description || null,
          images: p.photos,
          photoCount: p.photoCount,
          status: 'ACTIVE',
          oldId: p.id,
          metaTitle: `${p.title} | Sudofim Serv SRL`,
          metaDescription: p.description ? p.description.slice(0, 160) : `${p.title} - Disponibil la Sudofim Serv SRL, Ploiesti. Vanzare si inchiriere.`,
        },
      });
      created++;
    } catch (err) {
      console.error(`Error creating product ${p.id}: ${p.title}`, err);
    }
  }

  console.log(`Created ${created} products`);
  console.log('Seeding complete!');
  console.log(`\nAdmin login: admin@sudofimserv.ro / admin123`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
