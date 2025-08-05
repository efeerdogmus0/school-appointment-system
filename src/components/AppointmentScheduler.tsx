'use client';

import { useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // Tarih değiştiğinde saati sıfırla
    onSlotSelect(null); // Seçimi sıfırla
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSlotSelect({ date: selectedDate, time });
    }
  };

  const availableDates = Object.keys(availableSlots).filter(date => availableSlots[date as keyof AvailableSlots].length > 0);

  return (
    <div className={`p-3 border rounded ${isInvalid ? 'border-danger' : ''}`}>
      <h5 className="mb-3">Randevu Tarihi ve Saati Seçin <span className="text-danger">(Zorunlu)</span></h5>
      <h6>Müsait Günler</h6>
      <Row className="mb-3">
        {availableDates.map(date => (
          <Col key={date} xs="auto" className="mb-2">
            <Button
              variant={selectedDate === date ? 'primary' : 'outline-primary'}
              onClick={() => handleDateSelect(date)}
            >
              {new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Button>
          </Col>
        ))}
      </Row>

      {selectedDate && (
        <div>
          <h6>Müsait Saatler ({new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })})</h6>
          <Row>
            {(availableSlots[selectedDate as keyof AvailableSlots] || []).length > 0 ? (
              (availableSlots[selectedDate as keyof AvailableSlots] || []).map(time => (
                <Col key={time} xs="auto" className="mb-2">
                  <Button
                    variant={selectedTime === time ? 'success' : 'outline-success'}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="warning">Seçili tarih için uygun randevu saati bulunmamaktadır.</Alert>
              </Col>
            )}
          </Row>
        </div>
      )}
      {isInvalid && <div className="text-danger mt-2">Lütfen bir randevu tarihi ve saati seçiniz.</div>}
    </div>
  );
};

export default AppointmentScheduler;
