import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const [
    totalProducts,
    activeProducts,
    totalLeads,
    newLeadsToday,
    newLeadsWeek,
    unreadContacts,
    categories,
    recentLeads,
    recentAudit,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.category.count(),
    prisma.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { product: { select: { title: true } } } }),
    prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
  ]);

  return NextResponse.json({
    success: true,
    stats: { totalProducts, activeProducts, totalLeads, newLeadsToday, newLeadsWeek, unreadContacts, categories },
    recentLeads,
    recentAudit,
  });
}
