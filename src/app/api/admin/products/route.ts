import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, products });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const body = await request.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100);

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug,
        condition: body.condition || 'UTILIZAT',
        categoryId: body.categoryId,
        description: body.description || null,
        images: body.images || [],
        photoCount: body.images?.length || 0,
        status: body.status || 'ACTIVE',
        featured: body.featured || false,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    });

    await prisma.auditLog.create({
      data: { userId: session.user.id, userEmail: session.user.email, action: 'CREATE_PRODUCT', entity: 'product', entityId: product.id },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Eroare la crearea produsului' }, { status: 500 });
  }
}
