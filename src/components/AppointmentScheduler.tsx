'use client';

import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import Calendar, { type CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- Ayarlar ve Yardımcı Fonksiyonlar ---
const AVAILABLE_DATES = ["2025-08-18", "2025-08-19", "2025-08-20", "2025-08-21", "2025-08-22", "2025-08-25", "2025-08-26"];
const SLOT_DURATION = 5; // Dakika
const START_HOUR = 10;
const END_HOUR = 16;
const BREAK_START_MINUTE = 12 * 60;
const BREAK_END_MINUTE = 12 * 60 + 20;

const formatDate = (date: Date) => date.toISOString().split('T')[0];

// --- Arayüz Bileşeni ---
interface AppointmentSchedulerProps {
  onSlotSelect: (slot: { date: string; time: string } | null) => void;
  isInvalid: boolean;
}

type CalendarValue = Parameters<NonNullable<CalendarProps['onChange']>>[0];

const AppointmentScheduler = ({ onSlotSelect, isInvalid }: AppointmentSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(AVAILABLE_DATES[0]));
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Müsait saat aralıklarını hesapla
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        const totalMinutes = hour * 60 + minute;
        if (totalMinutes < BREAK_START_MINUTE || totalMinutes >= BREAK_END_MINUTE) {
          slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
        }
      }
    }
    return slots;
  }, []);

  // Müsait saatleri (saat başlarını) hesapla
  const availableHours = useMemo(() => {
    return [...new Set(timeSlots.map(slot => parseInt(slot.split(':')[0])))];
  }, [timeSlots]);

  // Seçilen tarih değiştiğinde dolu slotları API'den çek
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/slots?date=${formatDate(selectedDate)}`);
        if (!response.ok) throw new Error('API isteği başarısız oldu');
        const data = await response.json();
        setBookedSlots(data.booked || []);
      } catch (error) {
        console.error('Dolu randevular alınamadı:', error);
        setBookedSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();
    setSelectedHour(null); // Tarih değişince saat ve dakika seçimini sıfırla
    setSelectedTime(null);
    onSlotSelect(null);
  }, [selectedDate, onSlotSelect]);

    const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) setSelectedDate(value);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    setSelectedTime(null); // Saat değişince dakika seçimini sıfırla
    onSlotSelect(null);
  };

  const handleMinuteSelect = (minute: number) => {
    if (selectedHour === null) return;
    const time = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect({ date: formatDate(selectedDate), time });
    }
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    return view === 'month' && !AVAILABLE_DATES.includes(formatDate(date));
  };

  const renderTimeSlots = () => {
    if (isLoading) return <div className="text-center"><Spinner animation="border" /></div>;

    // 1. Adım: Saat Seçimi
    if (selectedHour === null) {
      return (
        <div className="d-flex flex-wrap justify-content-center gap-2 p-2">
          {availableHours.map(hour => (
            <Button key={hour} variant="outline-primary" onClick={() => handleHourSelect(hour)}>
              {`${hour}:00`}
            </Button>
          ))}
        </div>
      );
    }

    // 2. Adım: Dakika Seçimi
    const minuteSlots = timeSlots.filter(slot => slot.startsWith(`${String(selectedHour).padStart(2, '0')}:`));
    return (
      <div>
        <Button variant="link" size="sm" onClick={() => setSelectedHour(null)} className="mb-2">‹ Geri</Button>
        <div className="d-flex flex-wrap justify-content-center gap-2 p-2">
          {minuteSlots.map(time => {
            const minute = parseInt(time.split(':')[1]);
            const isBooked = bookedSlots.includes(time);
            return (
              <Button
                key={time}
                variant={selectedTime === time ? 'success' : 'outline-primary'}
                onClick={() => handleMinuteSelect(minute)}
                disabled={isBooked}
              >
                {time}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-3 border rounded ${isInvalid ? 'border-danger' : ''}`}>
      <h5 className="mb-4 text-center">Randevu Tarihi ve Saati Seçin <span className="text-danger">(Zorunlu)</span></h5>
      <Row>
        <Col md={6} className="d-flex justify-content-center mb-3 mb-md-0">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={tileDisabled}
            locale="tr-TR"
            className="border-0 shadow-sm"
          />
        </Col>
        <Col md={6}>
          {selectedDate ? (
            <div style={{ minHeight: '250px' }}>
              <h6 className="text-center sticky-top bg-white py-2">
                {selectedHour === null ? 'Saat Seçin' : `Saat ${selectedHour}:00 için Dakika Seçin`}
              </h6>
              {renderTimeSlots()}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <Alert variant="info">Lütfen takvimden bir tarih seçiniz.</Alert>
            </div>
          )}
        </Col>
      </Row>
      {isInvalid && <div className="text-danger mt-2 text-center">Lütfen bir randevu tarihi ve saati seçiniz.</div>}
    </div>
  );
};

export default AppointmentScheduler;
