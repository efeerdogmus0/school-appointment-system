'use client';

import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Alert, Spinner, Card } from 'react-bootstrap';
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

  const availableHours = useMemo(() => {
    return [...new Set(timeSlots.map(slot => parseInt(slot.split(':')[0])))];
  }, [timeSlots]);

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
    setSelectedHour(null);
    setSelectedTime(null);
    onSlotSelect(null);
  }, [selectedDate, onSlotSelect]);

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) setSelectedDate(value);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    setSelectedTime(null);
    onSlotSelect(null);
  };

  const handleMinuteSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect({ date: formatDate(selectedDate), time });
    }
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    return view === 'month' && !AVAILABLE_DATES.includes(formatDate(date));
  };

  const renderTimeSelection = () => {
    if (!selectedDate) {
      return <Alert variant="info">Lütfen takvimden bir tarih seçiniz.</Alert>;
    }
    if (isLoading) {
      return <div className="text-center"><Spinner animation="border" /> Yükleniyor...</div>;
    }

    // 1. Adım: Saat Seçimi
    if (selectedHour === null) {
      return (
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {availableHours.map(hour => (
            <Button key={hour} variant="outline-primary" size="lg" onClick={() => handleHourSelect(hour)}>
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
        <Button variant="link" onClick={() => { setSelectedHour(null); setSelectedTime(null); onSlotSelect(null); }} className="mb-3 fw-bold">‹ Saat Seçimine Geri Dön</Button>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {minuteSlots.map(time => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;
            return (
              <Button
                key={time}
                variant={isSelected ? 'success' : isBooked ? 'danger' : 'outline-primary'}
                onClick={() => handleMinuteSelect(time)}
                disabled={isBooked}
                style={{ minWidth: '80px' }}
              >
                {isBooked ? 'Dolu' : time}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-3 border rounded ${isInvalid ? 'border-danger' : ''}`}>
      <h4 className="mb-4 text-center fw-bold">Randevu Tarihi ve Saati Seçin</h4>
      <Row>
        <Col lg={5} md={12} className="d-flex flex-column align-items-center mb-4 mb-lg-0">
            <h6 className="text-muted mb-2">1. Adım: Tarih Seçin</h6>
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={tileDisabled}
                locale="tr-TR"
                className="border-0 shadow-sm p-3 rounded"
            />
        </Col>
        <Col lg={7} md={12} className="d-flex flex-column">
            <h6 className="text-muted mb-2 text-center">2. Adım: {selectedHour === null ? 'Saat Seçin' : `Saat ${selectedHour}:00 için Uygun Zamanı Seçin`}</h6>
            <Card className="flex-grow-1">
                <Card.Body className="d-flex align-items-center justify-content-center">
                    {renderTimeSelection()}
                </Card.Body>
            </Card>
        </Col>
      </Row>
      {selectedTime && selectedDate && (
        <Alert variant="success" className="mt-4 text-center fw-bold">
          Seçilen Randevu: {new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} - Saat: {selectedTime}
        </Alert>
      )}
      {isInvalid && !selectedTime && <div className="text-danger mt-2 text-center">Lütfen bir randevu tarihi ve saati seçiniz.</div>}
    </div>
  );
};

export default AppointmentScheduler;
