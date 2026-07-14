import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { id } = await context.params;
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return NextResponse.json({ error: 'Produs negasit' }, { status: 404 });

  return NextResponse.json({ success: true, product });
}

export async function PUT(request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        condition: body.condition,
        categoryId: body.categoryId,
        description: body.description,
        images: body.images,
        photoCount: body.images?.length || 0,
        status: body.status,
        featured: body.featured,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    await prisma.auditLog.create({
      data: { userId: session.user.id, userEmail: session.user.email, action: 'UPDATE_PRODUCT', entity: 'product', entityId: id },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Eroare la actualizarea produsului' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { id } = await context.params;

  try {
    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { userId: session.user.id, userEmail: session.user.email, action: 'DELETE_PRODUCT', entity: 'product', entityId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: 'Eroare la stergerea produsului' }, { status: 500 });
  }
}
