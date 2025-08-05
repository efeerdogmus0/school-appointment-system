import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const keys: string[] = [];
    for await (const key of kv.scanIterator({ match: 'application:*' })) {
      keys.push(key);
    }

    if (keys.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const applicationsData = await kv.mget(...keys);

    const applicationsWithIds = applicationsData.map((app, index) => ({
      id: keys[index], // Use the actual KV key as the ID
      ...(app as object), // Spread the application data
    }));

    // Sort by date, assuming the key contains a timestamp
    applicationsWithIds.sort((a, b) => {
        const timeA = parseInt(a.id.split(':')[1]);
        const timeB = parseInt(b.id.split(':')[1]);
        return timeB - timeA; // Sort descending (newest first)
    });

    return NextResponse.json(applicationsWithIds, { status: 200 });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ message: 'Başvurular alınırken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Silinecek başvuru IDsi belirtilmedi.' }, { status: 400 });
    }

    await kv.del(id);

    return NextResponse.json({ message: 'Başvuru başarıyla silindi.' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ message: 'Başvuru silinirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}



export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    // Basic validation to ensure we have some data
    if (!applicationData || Object.keys(applicationData).length === 0) {
      return NextResponse.json({ message: 'Başvuru verisi boş olamaz.' }, { status: 400 });
    }

    // Generate a unique ID for the application
    const applicationId = `application:${Date.now()}`;

    // Save the application data to Vercel KV
    await kv.set(applicationId, applicationData);

    return NextResponse.json({ message: 'Başvuru başarıyla alındı.', id: applicationId }, { status: 201 });

  } catch (error) {
    console.error('Error saving application:', error);
    return NextResponse.json({ message: 'Başvuru kaydedilirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
