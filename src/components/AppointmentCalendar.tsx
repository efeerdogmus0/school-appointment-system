'use client';

import { useState, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Row, Col, Card, Button } from 'react-bootstrap';

// Function to generate time slots
// Belirli randevu tarihleri (JavaScript'te aylar 0'dan başlar, bu yüzden Ağustos için 7 kullanılır)
const availableDates = [
  new Date(2025, 7, 18),
  new Date(2025, 7, 19),
  new Date(2025, 7, 20),
  new Date(2025, 7, 21),
  new Date(2025, 7, 22),
  new Date(2025, 7, 25),
  new Date(2025, 7, 26),
];

const isDateAvailable = (date: Date) => {
  return availableDates.some(
    (d) =>
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
  );
};

const generateTimeSlots = (day: Date) => {
  const slots = [];
  // Saatleri 10:00 - 16:00 arasına ayarla
  const startTime = new Date(day);
  startTime.setHours(10, 0, 0, 0);

  const endTime = new Date(day);
  endTime.setHours(16, 0, 0, 0);

  // Mola saatleri
  const breakStart = new Date(day);
  breakStart.setHours(12, 0, 0, 0);

  const breakEnd = new Date(day);
  breakEnd.setHours(12, 20, 0, 0);

  // eslint-disable-next-line prefer-const
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    // Mola saatleri dışında kalan zamanları ekle
    if (currentTime < breakStart || currentTime >= breakEnd) {
      slots.push(new Date(currentTime));
    }
    currentTime.setMinutes(currentTime.getMinutes() + 5);
  }

  return slots;
};

interface AppointmentCalendarProps {
  onDateTimeSelect: (dateTime: Date) => void;
}

const AppointmentCalendar = ({ onDateTimeSelect }: AppointmentCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    setSelectedHour(undefined);
    setSelectedTime(undefined);
  };

  const timeSlots = useMemo(() => {
    return selectedDay ? generateTimeSlots(selectedDay) : [];
  }, [selectedDay]);

  const hourSlots = useMemo(() => {
    const hours = timeSlots.filter((slot, index, self) => 
      index === self.findIndex((s) => s.getHours() === slot.getHours())
    );
    return hours;
  }, [timeSlots]);

  const minuteSlots = useMemo(() => {
    if (!selectedHour) return [];
    return timeSlots.filter(slot => slot.getHours() === selectedHour.getHours());
  }, [selectedHour, timeSlots]);

  const css = `
    .rdp-day_selected {
      background-color: #dc3545; /* Bootstrap's danger color */
      color: white;
    }
    .rdp-day_selected:hover {
      background-color: #c82333; /* Darker danger color */
    }
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #f8d7da; /* Lighter danger color */
    }
    .rdp-button:focus:not([disabled]):not(.rdp-day_selected) {
      border-color: #dc3545;
    }
  `;

  return (
    <Row className="g-4">
      <style>{css}</style>
      {/* Left Column: Calendar */}
      <Col md={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title as="h2" className="text-center mb-4">1. Bir Tarih Seçin</Card.Title>
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={handleDaySelect}
              month={new Date(2025, 7)} // Doğrudan Ağustos 2025'i göster
              disabled={(date) => !isDateAvailable(date)} // Sadece belirli günleri etkinleştir
              classNames={{
                caption: 'text-danger fw-bold',
                head_cell: 'text-danger',
                day_selected: 'bg-danger text-white',
                day_today: 'text-danger fw-bold',
              }}
            />
          </Card.Body>
        </Card>
      </Col>

      {/* Right Column: Time Slots & Form */}
      <Col md={6}>
        <Card className="h-100 shadow-sm">
          <Card.Body>
            {selectedDay ? (
              <div>
                <h2 className="text-center mb-4">2. Bir Saat Seçin</h2>
                <div>
                  <h4 className="text-center mb-3">Saat Seçin</h4>
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    {hourSlots.map((hour, index) => (
                      <Button
                        key={index}
                        variant={selectedHour?.getHours() === hour.getHours() ? 'primary' : 'outline-primary'}
                        onClick={() => {
                          setSelectedHour(hour);
                          setSelectedTime(undefined); // Reset minute selection
                        }}
                      >
                        {hour.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </Button>
                    ))}
                  </div>

                  {selectedHour && (
                    <div>
                      <h4 className="text-center mb-3">Dakika Seçin</h4>
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {minuteSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedTime?.getTime() === slot.getTime() ? 'danger' : 'outline-danger'}
                            onClick={() => {
                              setSelectedTime(slot);
                              onDateTimeSelect(slot);
                            }}
                          >
                            {slot.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100">
                <p className="text-muted text-center">Lütfen randevu almak için takvimden bir gün seçin.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentCalendar;
