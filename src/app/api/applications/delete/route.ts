import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

/**
 * Handles DELETE requests to remove a specific application by its ID.
 * Uses query parameter instead of dynamic route to avoid Vercel build issues.
 */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Silinecek başvuru IDsi belirtilmedi.' }, { status: 400 });
    }

    // Check if the application exists
    const existingApplication = await kv.get(id);
    if (!existingApplication) {
      return NextResponse.json({ message: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    // Delete the application from KV
    await kv.del(id);

    return NextResponse.json({ message: 'Başvuru başarıyla silindi.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ message: 'Başvuru silinirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
