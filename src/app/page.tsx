'use client';

import { useState } from 'react';
import AppointmentCalendar from "@/components/AppointmentCalendar";
import AppointmentForm from '@/components/AppointmentForm';
import { Container, Alert } from 'react-bootstrap';

export default function Home() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <main className="my-5">
      <Container>
        <h1 className="text-center mb-4 fw-bold">Okul Ziyaret Randevu Sistemi</h1>
        <p className="text-center mb-5 lead">
          Okulumuzu ziyaret etmek için lütfen aşağıdan uygun bir tarih ve saat seçiniz.
        </p>

        <Alert variant="info" className="text-center">
          <Alert.Heading as="h5">Önemli Bilgilendirme</Alert.Heading>
          <p className="mb-0">
            Ziyaret randevuları yalnızca <strong>18-22 Ağustos</strong> ve <strong>25-26 Ağustos</strong> tarihlerinde, <strong>10:00 - 16:00</strong> saatleri arasında verilmektedir.
          </p>
        </Alert>

        <AppointmentCalendar onDateTimeSelect={setSelectedDateTime} />

        {selectedDateTime && (
          <div className="mt-5 pt-5 border-top">
            <AppointmentForm selectedDateTime={selectedDateTime} />
          </div>
        )}
      </Container>
    </main>
  );
}
