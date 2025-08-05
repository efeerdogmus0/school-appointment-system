'use client';

import { useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Takvim stilini import et

// Demo için müsait zaman aralıkları. Gerçek bir uygulamada bu veriler API'den gelmelidir.
const availableSlots = {
  "2025-08-18": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "2025-08-19": ["09:30", "10:30", "11:30", "14:30", "15:30"],
  "2025-08-20": ["09:00", "11:00", "14:00"],
  "2025-08-21": [], // Boş gün
  "2025-08-22": ["10:00", "11:00", "15:00"],
};

type AvailableSlots = typeof availableSlots;

interface AppointmentSchedulerProps {
  onSlotSelect: (slot: { date: string; time: string } | null) => void;
  isInvalid: boolean;
}

const AppointmentScheduler = ({ onSlotSelect, isInvalid }: AppointmentSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Tarih formatını YYYY-MM-DD'ye çevirir
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    // Kütüphane tarih aralığı da döndürebilir, biz sadece tek tarih seçimini işliyoruz.
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null); // Yeni tarih seçildiğinde saat seçimini sıfırla
      onSlotSelect(null); // Ana forma seçimin sıfırlandığını bildir
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect({ date: formatDate(selectedDate), time });
    }
  };

  // Takvimde sadece müsait günlerin seçilebilmesini sağlar
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateString = formatDate(date);
      return !(availableSlots[dateString as keyof AvailableSlots]?.length > 0);
    }
    return false;
  };

  const selectedDateString = selectedDate ? formatDate(selectedDate) : null;
  const timeSlotsForSelectedDate = selectedDateString ? availableSlots[selectedDateString as keyof AvailableSlots] : [];

  return (
    <div className={`p-3 border rounded ${isInvalid ? 'border-danger' : ''}`}>
      <h5 className="mb-3">Randevu Tarihi ve Saati Seçin <span className="text-danger">(Zorunlu)</span></h5>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="d-flex justify-content-center">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={tileDisabled}
            minDate={new Date()} // Geçmiş tarihleri devre dışı bırak
            locale="tr-TR"
            className="border-0 shadow-sm"
          />
        </Col>
      </Row>

      {selectedDate && (
        <div className="mt-4">
          <h6 className="text-center mb-3">Müsait Saatler ({selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })})</h6>
          <div className="d-flex flex-wrap justify-content-center gap-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {timeSlotsForSelectedDate.length > 0 ? (
              timeSlotsForSelectedDate.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'primary' : 'outline-primary'}
                  onClick={() => handleTimeSelect(time)}
                  style={{ minWidth: '80px' }}
                >
                  {time}
                </Button>
              ))
            ) : (
              <Alert variant="warning" className="w-100 text-center">Bu tarih için uygun saat bulunmuyor.</Alert>
            )}
          </div>
        </div>
      )}
      {isInvalid && <div className="text-danger mt-2">Lütfen bir randevu tarihi ve saati seçiniz.</div>}
    </div>
  );
};

export default AppointmentScheduler;
