import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const leads = await prisma.lead.findMany({
    include: { product: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, leads });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json();
  const { id, status, internalNotes } = body;

  const lead = await prisma.lead.update({
    where: { id },
    data: { status, internalNotes, assignedToId: session.user.id },
  });

  return NextResponse.json({ success: true, lead });
}
