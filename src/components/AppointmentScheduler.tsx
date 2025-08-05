'use client';

import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';

// --- Ayarlar ve Yardımcı Fonksiyonlar ---
const AVAILABLE_DATES = ["2025-08-18", "2025-08-19", "2025-08-20", "2025-08-21", "2025-08-22", "2025-08-25", "2025-08-26"];
const SLOT_DURATION = 5; // Dakika
const START_HOUR = 10;
const END_HOUR = 16;
const BREAK_START = { hour: 12, minute: 0 };
const BREAK_END = { hour: 12, minute: 20 };

// Saat ve dakika aralıklarını oluşturan fonksiyon
const generateTimeSlots = () => {
  const slots = new Map<number, number[]>();
  for (let hour = START_HOUR; hour < END_HOUR; hour++) {
    const minutes: number[] = [];
    for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
      const isBreakTime = hour === BREAK_START.hour && minute >= BREAK_START.minute && minute < BREAK_END.minute;
      if (!isBreakTime) {
        minutes.push(minute);
      }
    }
    if (minutes.length > 0) {
      slots.set(hour, minutes);
    }
  }
  return slots;
};

// --- Arayüz Bileşeni ---
interface AppointmentSchedulerProps {
  onSlotSelect: (slot: { date: string; time: string } | null) => void;
  isInvalid: boolean;
}

const AppointmentScheduler = ({ onSlotSelect, isInvalid }: AppointmentSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Tarih seçildiğinde dolu randevuları çek
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchBookedSlots = async () => {
      setIsLoading(true);
      try {
        // TODO: Gerçek API endpoint'i oluşturulacak
        // const response = await fetch(`/api/slots?date=${selectedDate}`);
        // const data = await response.json();
        // setBookedSlots(data.booked || []);

        // Geçici Mock Data
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms bekle
        const mockData = selectedDate === '2025-08-18' ? ['10:05', '14:30'] : [];
        setBookedSlots(mockData);

      } catch (error) {
        console.error('Dolu randevular alınamadı:', error);
        setBookedSlots([]); // Hata durumunda boş döndür
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedHour(null);
    setSelectedMinute(null);
    onSlotSelect(null);
  };

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    setSelectedMinute(null);
    onSlotSelect(null);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    if (selectedDate && selectedHour !== null) {
      const time = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      onSlotSelect({ date: selectedDate, time });
    }
  };

  const renderStep = (title: string, children: React.ReactNode) => (
    <div className="mb-4">
      <h6 className="text-center text-muted mb-3">{title}</h6>
      <div className="d-flex flex-wrap justify-content-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className={`p-3 p-md-4 border rounded shadow-sm bg-light ${isInvalid ? 'border-danger' : ''}`}>
      <h5 className="text-center mb-4">Randevu Tarihi ve Saati Seçin <span className="text-danger">(Zorunlu)</span></h5>

      {renderStep('1. Adım: Tarih Seçin', 
        AVAILABLE_DATES.map(date => (
          <Button key={date} variant={selectedDate === date ? 'primary' : 'outline-primary'} onClick={() => handleDateSelect(date)}>
            {new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
          </Button>
        ))
      )}

      {selectedDate && renderStep('2. Adım: Saat Seçin', 
        Array.from(timeSlots.keys()).map(hour => (
          <Button key={hour} variant={selectedHour === hour ? 'primary' : 'outline-primary'} onClick={() => handleHourSelect(hour)}>
            {`${hour}:00`}
          </Button>
        ))
      )}

      {selectedHour !== null && renderStep('3. Adım: Dakika Seçin', 
        isLoading ? <Spinner animation="border" /> : 
        timeSlots.get(selectedHour)?.map(minute => {
          const time = `${String(selectedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          const isBooked = bookedSlots.includes(time);
          return (
            <Button key={minute} variant={selectedMinute === minute ? 'success' : 'outline-success'} disabled={isBooked} onClick={() => handleMinuteSelect(minute)}>
              {time}
            </Button>
          );
        })
      )}

      {isInvalid && <Alert variant="danger" className="mt-3 text-center">Lütfen bir randevu tarihi ve saati seçiniz.</Alert>}
    </div>
  );
};

export default AppointmentScheduler;
