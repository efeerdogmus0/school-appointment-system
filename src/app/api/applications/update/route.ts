import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { ApplicationData } from '@/types/application';

/**
 * Handles PUT requests to update a specific application by its ID.
 * Uses query parameter instead of dynamic route to avoid Vercel build issues.
 */
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Güncellenecek başvuru IDsi belirtilmedi.' }, { status: 400 });
    }

    const body: ApplicationData = await request.json();

    // Check if the application exists
    const existingApplication = await kv.get(id);
    if (!existingApplication) {
      return NextResponse.json({ message: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    // Update the application in KV
    await kv.set(id, body);

    // Return the updated data
    const updatedApplication = await kv.get(id);

    return NextResponse.json(updatedApplication, { status: 200 });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ message: 'Başvuru güncellenirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
