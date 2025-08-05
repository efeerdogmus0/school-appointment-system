'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- Ayarlar ve Yardımcı Fonksiyonlar ---
const AVAILABLE_DATES = ["2025-08-18", "2025-08-19", "2025-08-20", "2025-08-21", "2025-08-22", "2025-08-25", "2025-08-26"];
const SLOT_DURATION = 5; // Dakika
const START_HOUR = 10;
const END_HOUR = 16;
const BREAK_START_MINUTE = 12 * 60;
const BREAK_END_MINUTE = 12 * 60 + 20;

// Tarih formatını YYYY-MM-DD'ye çevirir
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// --- Arayüz Bileşeni ---
interface AppointmentSchedulerProps {
  onSlotSelect: (slot: { date: string; time: string } | null) => void;
  isInvalid: boolean;
}

const AppointmentScheduler = ({ onSlotSelect, isInvalid }: AppointmentSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(AVAILABLE_DATES[0]));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Seçilen tarih değiştiğinde saat aralıklarını ve dolu slotları güncelle
  useEffect(() => {
    if (!selectedDate) return;

    // 1. Saat aralıklarını oluştur
    const slots: string[] = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        const totalMinutes = hour * 60 + minute;
        if (totalMinutes < BREAK_START_MINUTE || totalMinutes >= BREAK_END_MINUTE) {
          const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          slots.push(time);
        }
      }
    }
    setTimeSlots(slots);

    // 2. Dolu slotları API'den çek
    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        // TODO: Gerçek API endpoint'i oluşturulacak
        // const response = await fetch(`/api/slots?date=${formatDate(selectedDate)}`);
        // const data = await response.json();
        // setBookedSlots(data.booked || []);

        // Geçici Mock Data
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockData = formatDate(selectedDate) === '2025-08-18' ? ['10:05', '14:30'] : [];
        setBookedSlots(mockData);

      } catch (error) {
        console.error('Dolu randevular alınamadı:', error);
        setBookedSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();
    setSelectedTime(null); // Tarih değişince saat seçimini sıfırla
    onSlotSelect(null);
  }, [selectedDate, onSlotSelect]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect({ date: formatDate(selectedDate), time });
    }
  };

  // Sadece randevuya açık tarihlerin seçilebilmesini sağlar
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      return !AVAILABLE_DATES.includes(formatDate(date));
    }
    return false;
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
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <h6 className="text-center sticky-top bg-white py-2">Müsait Saatler</h6>
              {isLoading ? <div className="text-center"><Spinner animation="border" /></div> : 
                <div className="d-flex flex-wrap justify-content-center gap-2 p-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map(time => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'success' : 'outline-primary'}
                          onClick={() => handleTimeSelect(time)}
                          disabled={isBooked}
                          className="flex-grow-1"
                        >
                          {time}
                        </Button>
                      );
                    })
                  ) : (
                    <Alert variant="warning">Bu tarih için uygun saat bulunmuyor.</Alert>
                  )}
                </div>
              }
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
