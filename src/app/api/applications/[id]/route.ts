import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { ApplicationData } from '@/types/application';

/**
 * Handles DELETE requests to delete a specific application by its ID.
 * @param request - The incoming NextRequest.
 * @param params - The route parameters, containing the application ID.
 * @returns A NextResponse with the result of the operation.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Get ID from the dynamic route segment

    if (!id) {
      return NextResponse.json({ message: 'Silinecek başvuru IDsi belirtilmedi.' }, { status: 400 });
    }

    // The ID from the client is the full KV key, e.g., "application:169..."
    await kv.del(id);

    return NextResponse.json({ message: 'Başvuru başarıyla silindi.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ message: 'Başvuru silinirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}

/**
 * Handles PUT requests to update a specific application by its ID.
 * @param request - The incoming NextRequest containing the application data.
 * @param params - The route parameters, containing the application ID.
 * @returns A NextResponse with the updated application data.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // Get ID from the dynamic route segment
    const body = await request.json(); // Hata ayıklama için tip ataması kaldırıldı

    if (!id) {
      return NextResponse.json({ message: 'Güncellenecek başvuru IDsi belirtilmedi.' }, { status: 400 });
    }

    // The body contains the full application data. We'll use the ID from the URL to set it in KV.
    // We can spread the body to ensure all fields are updated.
    await kv.set(id, body);

    // Return the updated data
    const updatedApplication = await kv.get(id);

    return NextResponse.json(updatedApplication, { status: 200 });

  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ message: 'Başvuru güncellenirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
