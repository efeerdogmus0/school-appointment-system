import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Define the Appointment type for type safety
interface Appointment {
  id: string;
  createdAt: string;
  appointmentDateTime: string;
  studentName: string;
  studentTC: string;
  parentRelation: string;
  parentName: string;
  parentOccupation: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  notes: string;
}

// GET all appointments
export async function GET() {
  try {
    const appointments = await kv.get<Appointment[]>('appointments');
    // Return empty array if no appointments found
    return NextResponse.json(appointments || []);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ message: 'Veritabanından randevular alınamadı.' }, { status: 500 });
  }
}

// POST a new appointment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentDateTime, studentName, studentTC, parentPhone } = body;

    // Basic validation
    if (!appointmentDateTime || !studentName || !studentTC || !parentPhone) {
      return NextResponse.json({ message: 'Eksik bilgi. Lütfen tüm zorunlu alanları doldurun.' }, { status: 400 });
    }

    const allAppointments = await kv.get<Appointment[]>('appointments') || [];

    // Duplicate check
    const isDuplicate = allAppointments.some(
      (apt) => new Date(apt.appointmentDateTime).getTime() === new Date(appointmentDateTime).getTime()
    );

    if (isDuplicate) {
      return NextResponse.json({ message: 'Bu saat zaten dolu. Lütfen başka bir saat seçin.' }, { status: 409 });
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    allAppointments.push(newAppointment);

    await kv.set('appointments', allAppointments);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ message: 'Randevu oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}

// DELETE an appointment by ID from URL query parameter
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Silinecek randevu için ID belirtilmedi.' }, { status: 400 });
    }

    const allAppointments = await kv.get<Appointment[]>('appointments') || [];
    
    const initialLength = allAppointments.length;
    const updatedAppointments = allAppointments.filter((apt) => apt.id !== id);

    if (updatedAppointments.length === initialLength) {
      return NextResponse.json({ message: 'Belirtilen ID ile eşleşen randevu bulunamadı.' }, { status: 404 });
    }

    await kv.set('appointments', updatedAppointments);

    // Return a success message, which the client expects
    return NextResponse.json({ message: 'Randevu başarıyla iptal edildi.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ message: 'Randevu silinirken bir hata oluştu.' }, { status: 500 });
  }
}
