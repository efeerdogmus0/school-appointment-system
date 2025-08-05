'use client';

import { useEffect, useState } from 'react';
import { Container, Button, Alert, Form, Modal, Accordion, Row, Col, Card } from 'react-bootstrap';
import { ApplicationData } from '@/types/application';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';

const AdminPage = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Başvurular alınamadı.' }));
        throw new Error(errorData.message);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
        setError('Sunucudan beklenmedik bir veri formatı alındı.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu başvuruyu kalıcı olarak silmek istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/applications?id=${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || 'Silme işlemi başarısız oldu.');
        }
        alert(result.message);
        fetchApplications(); // Refresh the list
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Bir hata oluştu.');
        setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
    } else {
      alert('Yanlış şifre!');
    }
  };

  if (!isAuthenticated) {
    return (
      <Modal show={showPasswordModal} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Header><Modal.Title>Admin Girişi</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group>
              <Form.Label>Lütfen şifreyi giriniz:</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button type="submit" className="mt-3">Giriş Yap</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  // Map keys to human-readable labels
  const fieldLabels: Partial<Record<keyof ApplicationData, string>> = {
    appointmentDate: 'Randevu Tarihi',
    appointmentTime: 'Randevu Saati',
    studentTC: 'Öğrenci T.C.',
    studentName: 'Öğrenci Adı Soyadı',
    studentDob: 'Öğrenci Doğum Tarihi',
    studentPob: 'Öğrenci Doğum Yeri',
    studentPhone: 'Öğrenci Cep Telefonu',
    studentPrevSchool: 'Mezun Olduğu Okul',
    studentBloodType: 'Öğrenci Kan Grubu',
    studentDisability: 'Öğrenci Engel Durumu',
    studentChronicIllness: 'Öğrenci Kronik Hastalığı',
    parentsTogether: 'Anne-Baba Birlikte Mi?',
    parentsBiological: 'Anne-Baba Öz Mü?',
    guardianName: 'Veli Adı Soyadı',
    guardianEducation: 'Veli Öğrenim Durumu',
    guardianOccupation: 'Veli Mesleği',
    guardianPhoneCell: 'Veli Cep Telefonu',
    guardianPhoneHome: 'Veli Ev Telefonu',
    guardianPhoneWork: 'Veli İş Telefonu',
    guardianEmail: 'Veli E-Posta',
    guardianBloodType: 'Veli Kan Grubu',
    guardianAddressHome: 'Veli Ev Adresi',
    guardianAddressWork: 'Veli İş Adresi',
    guardianChronicIllness: 'Veli Kronik Hastalığı',
    guardianDisability: 'Veli Engel Durumu',
    guardianIncome: 'Veli Aylık Geliri',
    fatherName: 'Baba Adı Soyadı',
    fatherAlive: 'Baba Sağ Mı?',
    fatherEducation: 'Baba Öğrenim Durumu',
    fatherOccupation: 'Baba Mesleği',
    fatherPhoneCell: 'Baba Cep Telefonu',
    fatherPhoneHome: 'Baba Ev Telefonu',
    fatherPhoneWork: 'Baba İş Telefonu',
    fatherEmail: 'Baba E-Posta',
    fatherBloodType: 'Baba Kan Grubu',
    fatherAddressHome: 'Baba Ev Adresi',
    fatherAddressWork: 'Baba İş Adresi',
    fatherChronicIllness: 'Baba Kronik Hastalığı',
    fatherDisability: 'Baba Engel Durumu',
    fatherIncome: 'Baba Aylık Geliri',
    lgsScore: 'LGS Puanı',
    lgsPercentileTurkey: 'Türkiye Geneli Yüzdelik Dilimi',
    lgsPercentileCity: 'İl Geneli Yüzdelik Dilimi',
    scholarshipWon: 'Bursluluk Kazandı Mı?',
    tubitakInterest: 'TÜBİTAK Başvuru Alanı',
    turkishCorrect: 'Türkçe Doğru',
    turkishWrong: 'Türkçe Yanlış',
    mathCorrect: 'Matematik Doğru',
    mathWrong: 'Matematik Yanlış',
    scienceCorrect: 'Fen Bilimleri Doğru',
    scienceWrong: 'Fen Bilimleri Yanlış',
    englishCorrect: 'Yabancı Dil Doğru',
    englishWrong: 'Yabancı Dil Yanlış',
    religionCorrect: 'Din Kültürü Doğru',
    religionWrong: 'Din Kültürü Yanlış',
    historyCorrect: 'T.C. İnkılap Tarihi Doğru',
    historyWrong: 'T.C. İnkılap Tarihi Yanlış',
    opinionSchool: 'Okul Hakkındaki Görüşler',
    opinionExpectations: 'Okuldan Beklentiler',
    opinionSuggestions: 'Okul İçin Öneriler',
    supportSchool: 'Okula Destek Olma İsteği',
    joinPta: 'Okul Aile Birliğine Katılma İsteği',
    id: 'Başvuru ID',
  };

  const renderField = (app: ApplicationData, key: keyof ApplicationData) => {
    const value = app[key];
    if (value === null || value === undefined || value === '' || key === 'id') return null;
    const label = fieldLabels[key] || key;
    return (
      <Col md={6} lg={4} className="mb-2" key={key}>
        <strong>{label}:</strong> {String(value)}
      </Col>
    );
  };

  const renderGroup = (title: string, fields: (keyof ApplicationData)[], app: ApplicationData) => {
    // Check if any of the fields in this group have a value.
    const hasContent = fields.some(key => {
      const value = app[key];
      return value !== null && value !== undefined && value !== '';
    });

    if (!hasContent) return null;

    return (
      <Card className="mb-3">
        <Card.Header as="h6">{title}</Card.Header>
        <Card.Body>
          {fields.map(key => renderField(app, key))}
        </Card.Body>
      </Card>
    );
  };

  const studentFields: (keyof ApplicationData)[] = ['studentTC', 'studentName', 'studentDob', 'studentPob', 'studentPhone', 'studentPrevSchool', 'studentBloodType', 'studentDisability', 'studentChronicIllness', 'parentsTogether', 'parentsBiological'];
  const guardianFields: (keyof ApplicationData)[] = ['guardianName', 'guardianEducation', 'guardianOccupation', 'guardianPhoneCell', 'guardianPhoneHome', 'guardianPhoneWork', 'guardianEmail', 'guardianBloodType', 'guardianAddressHome', 'guardianAddressWork', 'guardianChronicIllness', 'guardianDisability', 'guardianIncome'];
  const fatherFields: (keyof ApplicationData)[] = ['fatherName', 'fatherAlive', 'fatherEducation', 'fatherOccupation', 'fatherPhoneCell', 'fatherPhoneHome', 'fatherPhoneWork', 'fatherEmail', 'fatherBloodType', 'fatherAddressHome', 'fatherAddressWork', 'fatherChronicIllness', 'fatherDisability', 'fatherIncome'];
  const lgsFields: (keyof ApplicationData)[] = ['lgsScore', 'lgsPercentileTurkey', 'lgsPercentileCity', 'scholarshipWon', 'tubitakInterest'];
  const examDetailsFields: (keyof ApplicationData)[] = ['turkishCorrect', 'turkishWrong', 'mathCorrect', 'mathWrong', 'scienceCorrect', 'scienceWrong', 'englishCorrect', 'englishWrong', 'religionCorrect', 'religionWrong', 'historyCorrect', 'historyWrong'];
  const opinionFields: (keyof ApplicationData)[] = ['opinionSchool', 'opinionExpectations', 'opinionSuggestions', 'supportSchool', 'joinPta'];

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Admin Paneli - Ön Kayıt Başvuruları</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button onClick={fetchApplications}>Listeyi Yenile</Button>
        <span className="text-muted">Toplam Başvuru: {applications.length}</span>
      </div>
      
      {applications.length > 0 ? (
        <Accordion alwaysOpen>
          {applications.map((app, index) => (
            <Accordion.Item eventKey={String(index)} key={app.id || index}>
              <Accordion.Header>
                <div className="w-100 d-flex justify-content-between align-items-center pe-2">
                  <span><strong>{app.studentName || 'İsimsiz Başvuru'}</strong> (T.C: {app.studentTC || 'N/A'})</span>
                  <span className="badge bg-primary rounded-pill">{app.appointmentDate} - {app.appointmentTime}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Card.Body>
                  {studentFields.map(key => renderField(app, key))}
                </Card.Body>
                {renderGroup('Veli Bilgileri', guardianFields, app)}
                {renderGroup('Baba Bilgileri', fatherFields, app)}
                {renderGroup('LGS ve Başvuru Bilgileri', lgsFields, app)}
                {renderGroup('Derslere Göre D/Y Sayıları', examDetailsFields, app)}
                {renderGroup('Görüş ve Öneriler', opinionFields, app)}
                <div className="text-end mt-3">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(app.id)}>
                        Başvuruyu Sil
                    </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Alert variant="info" className="text-center">Kayıtlı başvuru bulunmamaktadır.</Alert>
      )}
    </Container>
  );
};

export default AdminPage;
