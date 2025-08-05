import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { ApplicationData } from '../../../types/application';

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


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Destructure all expected data from the body
    const {
      appointmentDate,
      appointmentTime,
      studentTC,
      studentName,
      studentDob,
      studentPhone,
      guardianName,
      guardianPhoneCell,
      guardianEmail,
      lgsScore,
      lgsPercentileTurkey
    } = body;

    // 2. Server-side validation for required fields
    const requiredFields = {
      appointmentDate, appointmentTime, studentTC, studentName, studentDob, studentPhone,
      guardianName, guardianPhoneCell, guardianEmail, lgsScore, lgsPercentileTurkey
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return NextResponse.json({ message: `Eksik bilgi: ${key} alanı zorunludur.` }, { status: 400 });
      }
    }

    // 3. Concurrency Check: Ensure the slot is not already taken
    const allApplicationKeys = [];
    for await (const key of kv.scanIterator({ match: 'application:*' })) {
      allApplicationKeys.push(key);
    }

    if (allApplicationKeys.length > 0) {
        const existingApplications = await kv.mget<ApplicationData[]>(...allApplicationKeys);

        // 4. Check for appointment conflicts
        const isConflict = existingApplications.some(
          (app) => app.appointmentDate === appointmentDate && app.appointmentTime === appointmentTime
        );

        if (isConflict) {
            return NextResponse.json({ message: 'Bu randevu saati daha önce alınmış. Lütfen farklı bir saat seçiniz.' }, { status: 409 }); // 409 Conflict
        }
    }

    // 4. If all checks pass, create and save the application data
    const applicationId = `application:${Date.now()}`;
    const applicationData = { ...body, id: applicationId };

    await kv.set(applicationId, applicationData);

    return NextResponse.json({ message: 'Başvurunuz ve randevunuz başarıyla alınmıştır.', id: applicationId }, { status: 201 });

  } catch (error) {
    console.error('Error saving application:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Geçersiz veri formatı.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Başvuru kaydedilirken bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
