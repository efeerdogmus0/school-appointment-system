'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Button, Alert, Spinner, Accordion, Row, Col } from 'react-bootstrap';

interface AppointmentFormProps {
  selectedDateTime: Date;
}

const initialFormData = {
  studentName: '',
  studentTC: '',
  studentSchoolNumber: '',
  studentClass: '', // Bu alan formda yok ama state'de kalabilir
  parentRelation: 'Anne',
  parentName: '',
  parentOccupation: '',
  parentPhone: '',
  parentEmail: '',
  parentAddress: '',
  notes: '',
  // Önceki formdan kalan ve şu an kullanılmayan diğer alanlar temizlendi.
};

const AppointmentForm = ({ selectedDateTime }: AppointmentFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For general/API errors
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof initialFormData, string>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | string[] | undefined>('0');

  const validateField = (name: keyof typeof initialFormData, value: string) => {
    switch (name) {
      case 'studentName':
      case 'parentName':
        return value.trim().length < 2 ? 'Ad Soyad en az 2 karakter olmalıdır.' : '';
      case 'studentTC':
        return /^\d{11}$/.test(value) ? '' : 'T.C. Kimlik Numarası 11 rakamdan oluşmalıdır.';
      case 'parentPhone':
        return /^\d{10,11}$/.test(value.replace(/\s/g, '')) ? '' : 'Geçerli bir telefon numarası giriniz.';
      case 'parentEmail':
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? '' : 'Geçerli bir e-posta adresi giriniz.';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as { name: keyof typeof initialFormData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof typeof initialFormData; value: string };
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Full form validation
    const newErrors: Partial<Record<keyof typeof initialFormData, string>> = {};
    let firstErrorKey: string | null = null;
    let firstErrorAccordion: string | null = null;

    (Object.keys(formData) as Array<keyof typeof initialFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        if (!firstErrorKey) {
          firstErrorKey = key;
          if (['studentName', 'studentTC', 'studentSchoolNumber', 'studentClass'].includes(key)) {
            firstErrorAccordion = '0';
          } else if (['parentRelation', 'parentName', 'parentOccupation', 'parentPhone', 'parentEmail', 'parentAddress'].includes(key)) {
            firstErrorAccordion = '1';
          }
        }
      }
    });

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (firstErrorAccordion) {
        setActiveKey(firstErrorAccordion);
      }
      setError('Lütfen formdaki hataları düzeltin.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appointmentDateTime: selectedDateTime.toISOString(),
          ...formData 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sunucudan bir hata döndü.');
      }

      setSuccess('Okul ziyaret randevunuz başarıyla oluşturulmuştur. Teşekkür ederiz.');
      setFormData(initialFormData);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Bir hata oluştu.');
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return <Alert variant="success">{success}</Alert>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h3 className="text-center mb-4 fw-bold">Okul Ziyaret Randevu Formu</h3>
      <p className="text-center mb-4">Seçilen Randevu Tarihi: <strong>{selectedDateTime.toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'short' })}</strong></p>
      <p className="text-center text-muted mb-4 fst-italic">Tüm alanların doldurulması zorunludur.</p>

      <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k === null ? undefined : k)} className="mb-4">
        {/* ÖĞRENCİ BİLGİLERİ */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Öğrenci Bilgileri</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="studentName">
                  <Form.Label>Adı Soyadı</Form.Label>
                  <Form.Control name="studentName" type="text" value={formData.studentName} onChange={handleChange} onBlur={handleBlur} isInvalid={!!formErrors.studentName} required />
                  <Form.Control.Feedback type="invalid">{formErrors.studentName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="studentTC">
                  <Form.Label>T.C. Kimlik Numarası</Form.Label>
                  <Form.Control name="studentTC" type="text" value={formData.studentTC} onChange={handleChange} onBlur={handleBlur} isInvalid={!!formErrors.studentTC} required maxLength={11} />
                  <Form.Control.Feedback type="invalid">{formErrors.studentTC}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="studentSchoolNumber">
                  <Form.Label>Okul Numarası</Form.Label>
                  <Form.Control name="studentSchoolNumber" type="text" value={formData.studentSchoolNumber} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                 <Form.Group className="mb-3" controlId="studentClass">
                  <Form.Label>Sınıfı</Form.Label>
                  <Form.Control name="studentClass" type="text" value={formData.studentClass} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        {/* VELİ BİLGİLERİ */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Veli Bilgileri (Anne, Baba veya Diğer)</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3" controlId="parentRelation">
              <Form.Label>Veli</Form.Label>
              <Form.Select name="parentRelation" value={formData.parentRelation} onChange={handleChange}>
                <option>Seçiniz...</option>
                <option value="Anne">Anne</option>
                <option value="Baba">Baba</option>
                <option value="Diğer">Diğer</option>
              </Form.Select>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="parentName">
                  <Form.Label>Adı Soyadı</Form.Label>
                  <Form.Control name="parentName" type="text" value={formData.parentName} onChange={handleChange} onBlur={handleBlur} isInvalid={!!formErrors.parentName} required />
                  <Form.Control.Feedback type="invalid">{formErrors.parentName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="parentOccupation">
                  <Form.Label>Mesleği</Form.Label>
                  <Form.Control name="parentOccupation" type="text" value={formData.parentOccupation} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="parentPhone">
                  <Form.Label>Cep Telefonu</Form.Label>
                  <Form.Control name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleChange} onBlur={handleBlur} isInvalid={!!formErrors.parentPhone} required />
                  <Form.Control.Feedback type="invalid">{formErrors.parentPhone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="parentEmail">
                  <Form.Label>E-Posta</Form.Label>
                  <Form.Control name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} onBlur={handleBlur} isInvalid={!!formErrors.parentEmail} required />
                  <Form.Control.Feedback type="invalid">{formErrors.parentEmail}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="parentAddress">
              <Form.Label>Ev Adresi</Form.Label>
              <Form.Control name="parentAddress" as="textarea" rows={2} value={formData.parentAddress} onChange={handleChange} />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>

        {/* EK NOTLAR */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Ek Notlar</Accordion.Header>
          <Accordion.Body>
            <Form.Group controlId="notes">
              <Form.Label>Ziyaretinizle ilgili eklemek istediğiniz özel bir not veya soru varsa buraya yazabilirsiniz.</Form.Label>
              <Form.Control as="textarea" rows={4} name="notes" value={formData.notes} onChange={handleChange} />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-grid mt-4">
        <Button variant="danger" type="submit" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Gönderiliyor...
            </>
          ) : (
            'Ziyaret Randevusunu Onayla'
          )}
        </Button>
      </div>
      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
    </Form>
  );
};

export default AppointmentForm;
