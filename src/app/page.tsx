'use client';

'use client';

import { useState, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Accordion, Alert, Card } from 'react-bootstrap';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { tr } from 'date-fns/locale/tr';

// Register Turkish locale for datepicker
registerLocale('tr', tr);

// Helper component for required fields
// Define the shape of our form data
interface FormData {
  [key: string]: string; 
}

// State for the selected appointment slot
interface AppointmentSlot {
  date: string;
  time: string;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Form.Label>
    {children} <span className="text-danger">(Zorunlu)</span>
  </Form.Label>
);

const PreRegistrationPage = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [studentDob, setStudentDob] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [errors, setErrors] = useState<Partial<FormData & { appointment: string }>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prevErrors: Partial<FormData & { appointment: string }>) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setStudentDob(date);
    const dateString = date ? date.toISOString().split('T')[0] : ''; // Format: YYYY-MM-DD
    setFormData((prev) => ({ ...prev, studentDob: dateString }));
    if (errors.studentDob) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.studentDob;
        return newErrors;
      });
    }
  };

  const handleSlotSelect = useCallback((slot: AppointmentSlot | null) => {
    setSelectedSlot(slot);
    // Clear error for the appointment slot when a selection is made
    if (slot) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.appointment;
        return newErrors;
      });
    }
  }, []); // Empty dependency array means this function is created only once

  const validateForm = () => {
    const newErrors: Partial<FormData & { appointment: string }> = {};

    const requiredFields = [
      // Öğrenci
      { key: 'studentTC', name: 'Öğrenci T.C. Numarası' },
      { key: 'studentName', name: 'Öğrenci Adı Soyadı' },
      { key: 'studentDob', name: 'Öğrenci Doğum Tarihi' },
      { key: 'studentPob', name: 'Öğrenci Doğum Yeri' },
      { key: 'studentPhone', name: 'Öğrenci Cep Telefonu' },
      { key: 'studentPrevSchool', name: 'Mezun Olduğu Okul' },
      { key: 'studentBloodType', name: 'Öğrenci Kan Grubu' },
      { key: 'parentsTogether', name: 'Anne - Baba Birlikte mi?' },
      { key: 'parentsBiological', name: 'Anne - Baba öz mü?' },
      // Veli
      { key: 'guardianRelationship', name: 'Veli Yakınlık Derecesi' },
      { key: 'guardianName', name: 'Veli Adı Soyadı' },
      { key: 'guardianEducation', name: 'Veli Öğrenim Durumu' },
      { key: 'guardianOccupation', name: 'Veli Mesleği' },
      { key: 'guardianPhoneCell', name: 'Veli Cep Telefonu' },
      { key: 'guardianEmail', name: 'Veli E-Posta' },
      { key: 'guardianBloodType', name: 'Veli Kan Grubu' },
      { key: 'guardianAddressHome', name: 'Veli Ev Adresi' },
      // İş adresi artık zorunlu değil, bu yüzden validasyon listesinden kaldırıldı.
      { key: 'guardianIncome', name: 'Veli Aylık Geliri' },
      // Sınav
      { key: 'lgsScore', name: 'LGS Puanı' },
      { key: 'lgsPercentileTurkey', name: 'LGS Türkiye Yüzdelik Dilimi' },
      { key: 'lgsPercentileCity', name: 'LGS İl Yüzdelik Dilimi' },
      { key: 'scholarshipWon', name: 'Bursluluk Sınavı Durumu' },
      { key: 'tubitakInterest', name: 'TÜBİTAK İlgi Alanı' },
      { key: 'turkishCorrect', name: 'Türkçe Doğru' },
      { key: 'turkishWrong', name: 'Türkçe Yanlış' },
      { key: 'mathCorrect', name: 'Matematik Doğru' },
      { key: 'mathWrong', name: 'Matematik Yanlış' },
      { key: 'scienceCorrect', name: 'Fen Bilimleri Doğru' },
      { key: 'scienceWrong', name: 'Fen Bilimleri Yanlış' },
      { key: 'englishCorrect', name: 'Yabancı Dil Doğru' },
      { key: 'englishWrong', name: 'Yabancı Dil Yanlış' },
      { key: 'religionCorrect', name: 'Din Kültürü Doğru' },
      { key: 'religionWrong', name: 'Din Kültürü Yanlış' },
      { key: 'historyCorrect', name: 'T.C. İnkılap Doğru' },
      { key: 'historyWrong', name: 'T.C. İnkılap Yanlış' },
      // Diğer
      { key: 'supportSchool', name: 'Okula Destek' },
      { key: 'joinPta', name: 'Okul Aile Birliği' },
    ];

    requiredFields.forEach(field => {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        newErrors[field.key] = `${field.name} alanı zorunludur.`;
      }
    });
    
    // Email validation
    if (formData.guardianEmail && !/\S+@\S+\.\S+/.test(formData.guardianEmail)) {
        newErrors.guardianEmail = 'Geçerli bir e-posta adresi giriniz.';
    }

    // TC Kimlik No validation
    if (formData.studentTC && !/^\d{11}$/.test(formData.studentTC)) {
        newErrors.studentTC = 'T.C. Kimlik Numarası 11 haneli olmalıdır.';
    }

    // Phone number validation (basic)
    if (formData.studentPhone && !/^\d{10,}$/.test(formData.studentPhone.replace(/\s/g, ''))) {
        newErrors.studentPhone = 'Geçerli bir telefon numarası giriniz (en az 10 rakam).';
    }
    if (formData.guardianPhoneCell && !/^\d{10,}$/.test(formData.guardianPhoneCell.replace(/\s/g, ''))) {
        newErrors.guardianPhoneCell = 'Geçerli bir telefon numarası giriniz (en az 10 rakam).';
    }

    // Appointment slot validation
    if (!selectedSlot) {
      newErrors.appointment = 'Lütfen bir randevu tarihi ve saati seçiniz.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            const firstErrorKey = errorKeys[0];
            const errorMessage = errors[firstErrorKey];
            
            setAlertVariant('danger');
            setAlertMessage(errorMessage || 'Lütfen tüm zorunlu alanları doldurunuz.');
            setShowAlert(true);

            // Scroll to the element with the error
            const elementId = firstErrorKey === 'appointment' ? 'appointment-scheduler-card' : firstErrorKey;
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        return;
    }

    // Clear previous alerts before new submission
    setShowAlert(false);

    const submissionData = {
      ...formData,
      appointmentDate: selectedSlot?.date,
      appointmentTime: selectedSlot?.time,
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Bir hata oluştu.');
      }

      setAlertVariant('success');
      setAlertMessage('Başvurunuz ve randevunuz başarıyla alınmıştır. Teşekkür ederiz!');
      setFormData({}); // Reset form
      setSelectedSlot(null); // Reset selected slot
    } catch (error) {
      if (error instanceof Error) {
        setAlertVariant('danger');
        setAlertMessage(error.message);
      }
    } finally {
      setShowAlert(true);
      window.scrollTo(0, 0); // Scroll to top to show alert
    }
  };

  return (
      <Container fluid className="my-5 flex-grow-1" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Row className="justify-content-center">
          <Col md={11} lg={10} xl={9}>
            <Card className="p-4 shadow-sm">
              <h1 className="text-center mb-4">Nuri Akın Anadolu Lisesi Kayıt Randevu Formu</h1>
              {showAlert && <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}

              <Alert variant="info">
                <Alert.Heading as="h6">Randevu Tarihleri Hakkında Bilgilendirme</Alert.Heading>
                <p className="mb-1">
                  Kayıt randevuları <strong>18-22 Ağustos</strong> ve <strong>25-26 Ağustos</strong> tarihleri arasında alınabilmektedir.
                </p>
                <hr/>
                <p className="mb-0">
                  <strong>Not:</strong> 12:00 ve 12:20 saatleri arasında randevu verilmemektedir.
                </p>
              </Alert>
              <Form onSubmit={handleSubmit}>
                <Card id="appointment-scheduler-card" className="mb-4 shadow-sm">
                  <Card.Body>
                    <AppointmentScheduler 
                      onSlotSelect={handleSlotSelect} 
                      isInvalid={!!errors.appointment} 
                    />
                  </Card.Body>
                </Card>

                <Accordion defaultActiveKey="0" alwaysOpen>
                  {/* Öğrenci Bilgileri */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Öğrenci Bilgileri</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>T.C. Numarası</RequiredLabel><Form.Control id="studentTC" type="text" name="studentTC" onChange={handleInputChange} isInvalid={!!errors.studentTC} /><Form.Control.Feedback type="invalid">{errors.studentTC}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Adı Soyadı</RequiredLabel><Form.Control id="studentName" type="text" name="studentName" onChange={handleInputChange} isInvalid={!!errors.studentName} /><Form.Control.Feedback type="invalid">{errors.studentName}</Form.Control.Feedback></Form.Group></Col>
                                                <Col md={6}>
                          <Form.Group className="mb-3">
                            <RequiredLabel>Doğum Tarihi</RequiredLabel>
                            <DatePicker
                              id="studentDob"
                              selected={studentDob}
                              onChange={handleDateChange}
                              locale="tr"
                              dateFormat="dd/MM/yyyy"
                              className={`form-control ${errors.studentDob ? 'is-invalid' : ''}`}
                              placeholderText="GG/AA/YYYY"
                              showYearDropdown
                              scrollableYearDropdown
                              yearDropdownItemNumber={80}
                              maxDate={new Date()}
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid" className="d-block">
                              {errors.studentDob}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Doğum Yeri (İl-İlçe)</RequiredLabel><Form.Control id="studentPob" type="text" name="studentPob" onChange={handleInputChange} isInvalid={!!errors.studentPob} /><Form.Control.Feedback type="invalid">{errors.studentPob}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Cep Telefonu</RequiredLabel><Form.Control id="studentPhone" type="tel" name="studentPhone" onChange={handleInputChange} isInvalid={!!errors.studentPhone} /><Form.Control.Feedback type="invalid">{errors.studentPhone}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Mezun Olduğu Okul</RequiredLabel><Form.Control id="studentPrevSchool" type="text" name="studentPrevSchool" onChange={handleInputChange} isInvalid={!!errors.studentPrevSchool} /><Form.Control.Feedback type="invalid">{errors.studentPrevSchool}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Kan Grubu</RequiredLabel><Form.Control id="studentBloodType" type="text" name="studentBloodType" onChange={handleInputChange} isInvalid={!!errors.studentBloodType} /><Form.Control.Feedback type="invalid">{errors.studentBloodType}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Engel Durumu</Form.Label><Form.Control type="text" name="studentDisability" placeholder="Yoksa boş bırakınız" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><Form.Label>Sürekli hastalığı var ise belirtiniz</Form.Label><Form.Control as="textarea" rows={2} name="studentChronicIllness" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Anne - Baba Birlikte mi?</RequiredLabel><Form.Select id="parentsTogether" name="parentsTogether" onChange={handleInputChange} isInvalid={!!errors.parentsTogether}><option value="">Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select><Form.Control.Feedback type="invalid">{errors.parentsTogether}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Anne - Baba öz mü?</RequiredLabel><Form.Select id="parentsBiological" name="parentsBiological" onChange={handleInputChange} isInvalid={!!errors.parentsBiological}><option value="">Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select><Form.Control.Feedback type="invalid">{errors.parentsBiological}</Form.Control.Feedback></Form.Group></Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Birincil Veli Bilgileri */}
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Birincil Veli Bilgileri</Accordion.Header>
                    <Accordion.Body>
                       <Row>
                                                <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Yakınlık Derecesi</RequiredLabel><Form.Select id="guardianRelationship" name="guardianRelationship" onChange={handleInputChange} isInvalid={!!errors.guardianRelationship}><option value="">Seçiniz...</option><option value="Anne">Anne</option><option value="Baba">Baba</option><option value="Vasi">Vasi</option><option value="Yakın">Yakın</option></Form.Select><Form.Control.Feedback type="invalid">{errors.guardianRelationship}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Adı Soyadı</RequiredLabel><Form.Control id="guardianName" type="text" name="guardianName" onChange={handleInputChange} isInvalid={!!errors.guardianName} /><Form.Control.Feedback type="invalid">{errors.guardianName}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Öğrenim Durumu</RequiredLabel><Form.Control id="guardianEducation" type="text" name="guardianEducation" onChange={handleInputChange} isInvalid={!!errors.guardianEducation} /><Form.Control.Feedback type="invalid">{errors.guardianEducation}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Mesleği</RequiredLabel><Form.Control id="guardianOccupation" type="text" name="guardianOccupation" onChange={handleInputChange} isInvalid={!!errors.guardianOccupation} /><Form.Control.Feedback type="invalid">{errors.guardianOccupation}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Telefon Cep</RequiredLabel><Form.Control id="guardianPhoneCell" type="tel" name="guardianPhoneCell" onChange={handleInputChange} isInvalid={!!errors.guardianPhoneCell} /><Form.Control.Feedback type="invalid">{errors.guardianPhoneCell}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon Ev</Form.Label><Form.Control type="tel" name="guardianPhoneHome" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon İş</Form.Label><Form.Control type="tel" name="guardianPhoneWork" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>E-Posta</RequiredLabel><Form.Control id="guardianEmail" type="email" name="guardianEmail" onChange={handleInputChange} isInvalid={!!errors.guardianEmail} /><Form.Control.Feedback type="invalid">{errors.guardianEmail}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Kan Grubu</RequiredLabel><Form.Control id="guardianBloodType" type="text" name="guardianBloodType" onChange={handleInputChange} isInvalid={!!errors.guardianBloodType} /><Form.Control.Feedback type="invalid">{errors.guardianBloodType}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><RequiredLabel>Ev Adresi</RequiredLabel><Form.Control id="guardianAddressHome" as="textarea" rows={2} name="guardianAddressHome" onChange={handleInputChange} isInvalid={!!errors.guardianAddressHome} /><Form.Control.Feedback type="invalid">{errors.guardianAddressHome}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><Form.Label>İş Adresi</Form.Label><Form.Control id="guardianAddressWork" as="textarea" rows={2} name="guardianAddressWork" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Sürekli hastalığı var mı?</Form.Label><Form.Control type="text" name="guardianChronicIllness" placeholder="Yoksa boş bırakınız" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Engel Durumu</Form.Label><Form.Control type="text" name="guardianDisability" placeholder="Yoksa boş bırakınız" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Aylık Geliri</RequiredLabel><Form.Control id="guardianIncome" type="text" name="guardianIncome" onChange={handleInputChange} isInvalid={!!errors.guardianIncome} /><Form.Control.Feedback type="invalid">{errors.guardianIncome}</Form.Control.Feedback></Form.Group></Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* İkincil Veli Bilgileri (İsteğe Bağlı) */}
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>İkincil Veli Bilgileri (İsteğe Bağlı)</Accordion.Header>
                    <Accordion.Body>
                       <Row>
                                                <Col md={6}><Form.Group className="mb-3"><Form.Label>Yakınlık Derecesi</Form.Label><Form.Select name="fatherRelationship" onChange={handleInputChange}><option value="">Seçiniz...</option><option value="Anne">Anne</option><option value="Baba">Baba</option><option value="Vasi">Vasi</option><option value="Yakın">Yakın</option></Form.Select></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Adı Soyadı</Form.Label><Form.Control type="text" name="fatherName" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Sağ mı?</Form.Label><Form.Select name="fatherAlive" onChange={handleInputChange}><option>Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Öğrenim Durumu</Form.Label><Form.Control type="text" name="fatherEducation" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Mesleği</Form.Label><Form.Control type="text" name="fatherOccupation" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon Cep</Form.Label><Form.Control type="tel" name="fatherPhoneCell" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon Ev</Form.Label><Form.Control type="tel" name="fatherPhoneHome" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon İş</Form.Label><Form.Control type="tel" name="fatherPhoneWork" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>E-Posta</Form.Label><Form.Control type="email" name="fatherEmail" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Kan Grubu</Form.Label><Form.Control type="text" name="fatherBloodType" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><Form.Label>Ev Adresi</Form.Label><Form.Control as="textarea" rows={2} name="fatherAddressHome" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><Form.Label>İş Adresi</Form.Label><Form.Control as="textarea" rows={2} name="fatherAddressWork" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Sürekli hastalığı var mı?</Form.Label><Form.Control type="text" name="fatherChronicIllness" placeholder="Yoksa boş bırakınız" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Engel Durumu</Form.Label><Form.Control type="text" name="fatherDisability" placeholder="Yoksa boş bırakınız" onChange={handleInputChange} /></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><Form.Label>Aylık Geliri</Form.Label><Form.Control type="text" name="fatherIncome" onChange={handleInputChange} /></Form.Group></Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                  {/* Sınav Bilgileri */}
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>Sınav ve Başvuru Bilgileri</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>LGS Yerleştirme Puanı</RequiredLabel><Form.Control id="lgsScore" type="number" step="0.01" name="lgsScore" onChange={handleInputChange} isInvalid={!!errors.lgsScore} /><Form.Control.Feedback type="invalid">{errors.lgsScore}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Türkiye Geneli Yüzdelik Dilimi</RequiredLabel><Form.Control id="lgsPercentileTurkey" type="number" step="0.01" name="lgsPercentileTurkey" onChange={handleInputChange} isInvalid={!!errors.lgsPercentileTurkey} /><Form.Control.Feedback type="invalid">{errors.lgsPercentileTurkey}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>İl Geneli Yüzdelik Dilimi</RequiredLabel><Form.Control id="lgsPercentileCity" type="number" step="0.01" name="lgsPercentileCity" onChange={handleInputChange} isInvalid={!!errors.lgsPercentileCity} /><Form.Control.Feedback type="invalid">{errors.lgsPercentileCity}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={6}><Form.Group className="mb-3"><RequiredLabel>Bursluluk Sınavını kazandı mı?</RequiredLabel><Form.Select id="scholarshipWon" name="scholarshipWon" onChange={handleInputChange} isInvalid={!!errors.scholarshipWon}><option value="">Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select><Form.Control.Feedback type="invalid">{errors.scholarshipWon}</Form.Control.Feedback></Form.Group></Col>
                        <Col md={12}><Form.Group className="mb-3"><RequiredLabel>TÜBİTAK Bilim Olimpiyatlarına hangi alanda başvuru yapmak istersiniz?</RequiredLabel><Form.Control id="tubitakInterest" type="text" name="tubitakInterest" onChange={handleInputChange} isInvalid={!!errors.tubitakInterest} /><Form.Control.Feedback type="invalid">{errors.tubitakInterest}</Form.Control.Feedback></Form.Group></Col>
                      </Row>
                      <hr />
                      <h6>Derslere Göre Doğru/Yanlış Sayıları</h6>
                      <Row>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>Türkçe D/Y</RequiredLabel><div className="d-flex"><Form.Control id="turkishCorrect" type="number" name="turkishCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.turkishCorrect} /><Form.Control id="turkishWrong" type="number" name="turkishWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.turkishWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.turkishCorrect || errors.turkishWrong}</Form.Control.Feedback></Form.Group></Col>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>Matematik D/Y</RequiredLabel><div className="d-flex"><Form.Control id="mathCorrect" type="number" name="mathCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.mathCorrect} /><Form.Control id="mathWrong" type="number" name="mathWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.mathWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.mathCorrect || errors.mathWrong}</Form.Control.Feedback></Form.Group></Col>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>Fen Bil. D/Y</RequiredLabel><div className="d-flex"><Form.Control id="scienceCorrect" type="number" name="scienceCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.scienceCorrect} /><Form.Control id="scienceWrong" type="number" name="scienceWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.scienceWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.scienceCorrect || errors.scienceWrong}</Form.Control.Feedback></Form.Group></Col>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>Yabancı Dil D/Y</RequiredLabel><div className="d-flex"><Form.Control id="englishCorrect" type="number" name="englishCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.englishCorrect} /><Form.Control id="englishWrong" type="number" name="englishWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.englishWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.englishCorrect || errors.englishWrong}</Form.Control.Feedback></Form.Group></Col>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>Din Kültürü D/Y</RequiredLabel><div className="d-flex"><Form.Control id="religionCorrect" type="number" name="religionCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.religionCorrect} /><Form.Control id="religionWrong" type="number" name="religionWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.religionWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.religionCorrect || errors.religionWrong}</Form.Control.Feedback></Form.Group></Col>
                        <Col xs={6} md={3}><Form.Group className="mb-3"><RequiredLabel>T.C. İnkılap D/Y</RequiredLabel><div className="d-flex"><Form.Control id="historyCorrect" type="number" name="historyCorrect" placeholder="D" onChange={handleInputChange} isInvalid={!!errors.historyCorrect} /><Form.Control id="historyWrong" type="number" name="historyWrong" placeholder="Y" className="ms-2" onChange={handleInputChange} isInvalid={!!errors.historyWrong} /></div><Form.Control.Feedback type="invalid" className="d-block">{errors.historyCorrect || errors.historyWrong}</Form.Control.Feedback></Form.Group></Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>

                   {/* Görüş ve Öneriler */}
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Görüş ve Öneriler</Accordion.Header>
                    <Accordion.Body>
                        <Form.Group className="mb-3"><Form.Label>Okulumuz Hakkındaki Görüşleriniz</Form.Label><Form.Control as="textarea" rows={3} name="opinionSchool" onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Okulumuz&apos;dan Beklentileriniz</Form.Label><Form.Control as="textarea" rows={3} name="opinionExpectations" onChange={handleInputChange} /></Form.Group>
                        <Form.Group className="mb-3"><RequiredLabel>Mesleğinizle ilgili konularda okula destek olmak ister misiniz?</RequiredLabel><Form.Select id="supportSchool" name="supportSchool" onChange={handleInputChange} isInvalid={!!errors.supportSchool}><option value="">Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select><Form.Control.Feedback type="invalid">{errors.supportSchool}</Form.Control.Feedback></Form.Group>
                        <Form.Group className="mb-3"><RequiredLabel>Okul Aile Birliği&apos;nde görev almak ister misiniz?</RequiredLabel><Form.Select id="joinPta" name="joinPta" onChange={handleInputChange} isInvalid={!!errors.joinPta}><option value="">Seçiniz...</option><option value="Evet">Evet</option><option value="Hayır">Hayır</option></Form.Select><Form.Control.Feedback type="invalid">{errors.joinPta}</Form.Control.Feedback></Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Button variant="primary" type="submit" className="w-100 mt-4 py-2">Başvuruyu Gönder</Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default PreRegistrationPage;
