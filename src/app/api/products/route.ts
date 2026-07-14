import { NextRequest, NextResponse } from 'next/server';
import { searchProducts, getAllProducts } from '@/lib/products-db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('search');

  try {
    const products = query ? await searchProducts(query) : await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ success: false, error: 'Eroare server' }, { status: 500 });
  }
}
