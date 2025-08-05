import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const appointmentsFilePath = path.join(process.cwd(), 'db.json');

async function getAppointments() {
  try {
    const data = await fs.readFile(appointmentsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const appointments = await getAppointments();
  return NextResponse.json(appointments);
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Randevu IDsi gerekli.' }, { status: 400 });
    }

    const appointments = await getAppointments();
    const filteredAppointments = appointments.filter((apt: { id: number }) => apt.id.toString() !== id);

    if (appointments.length === filteredAppointments.length) {
      return NextResponse.json({ message: 'Randevu bulunamadı.' }, { status: 404 });
    }

    await fs.writeFile(appointmentsFilePath, JSON.stringify(filteredAppointments, null, 2));

    return NextResponse.json({ message: 'Randevu başarıyla silindi.' });

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ message: 'Randevu silinirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentDateTime, studentName, studentTC, parentPhone } = body;

    if (!appointmentDateTime || !studentName || !studentTC || !parentPhone) {
      return NextResponse.json({ message: 'Eksik bilgi. Lütfen tüm zorunlu alanları doldurun (Öğrenci Adı, TC, Veli Cep Telefonu).' }, { status: 400 });
    }

    const appointments = await getAppointments();

    const isDuplicate = appointments.some((apt: { appointmentDateTime: string | number | Date }) => new Date(apt.appointmentDateTime).getTime() === new Date(appointmentDateTime).getTime());
    if (isDuplicate) {
      return NextResponse.json({ message: 'Bu saat zaten dolu. Lütfen başka bir saat seçin.' }, { status: 409 });
    }

    const newAppointment = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...body
    };

    appointments.push(newAppointment);

    await fs.writeFile(appointmentsFilePath, JSON.stringify(appointments, null, 2));

    return NextResponse.json({ message: 'Randevu başarıyla oluşturuldu.', appointment: newAppointment }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Bilinmeyen bir sunucu hatası oluştu.' }, { status: 500 });
  }
}
