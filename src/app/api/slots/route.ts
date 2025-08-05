import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { ApplicationData } from '@/types/application';

/**
 * Belirli bir tarihteki dolu randevu saatlerini döndürür.
 * @param request NextRequest objesi, '?date=YYYY-MM-DD' formatında bir query parametresi içermelidir.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ message: 'Tarih parametresi eksik.' }, { status: 400 });
  }

  try {
    // KV'deki tüm randevu anahtarlarını tara ('application:*' kalıbına uyanlar)
    const applicationKeys: string[] = [];
    for await (const key of kv.scanIterator({ match: 'application:*' })) {
      applicationKeys.push(key);
    }

    // Eğer hiç randevu yoksa, boş bir dizi döndür
    if (applicationKeys.length === 0) {
      return NextResponse.json({ booked: [] }, { status: 200 });
    }

    // Tüm randevu verilerini tek seferde çek
    const applications = await kv.mget<ApplicationData[]>(...applicationKeys);

    // 1. İstenen tarihe göre filtrele
    // 2. Sadece 'appointmentTime' alanını al
    // 3. Olası null/undefined değerleri temizle
    const bookedSlots = applications
      .filter(app => app?.appointmentDate === date)
      .map(app => app?.appointmentTime)
      .filter((time): time is string => typeof time === 'string');

    return NextResponse.json({ booked: bookedSlots }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching slots for date ${date}:`, error);
    return NextResponse.json({ message: 'Randevu saatleri alınırken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
