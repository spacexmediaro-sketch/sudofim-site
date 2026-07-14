import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message, productId, productTitle } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Nume si telefon sunt obligatorii' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        message: message || (productTitle ? `Interesat de: ${productTitle}` : null),
        productId: productId || null,
        source: 'WEBSITE_FORM',
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ success: false, error: 'Eroare server' }, { status: 500 });
  }
}
