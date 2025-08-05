'use client';

import { useEffect, useState } from 'react';
import { Container, Button, Alert, Form, Modal, Accordion, Row, Col, Card } from 'react-bootstrap';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';

// A comprehensive interface for the application data
interface ApplicationData {
  id: string; // The key from KV, e.g., 'application:1678886400000'
  [key: string]: any; // All other fields from the form
}

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
  const fieldLabels: { [key: string]: string } = {
    studentTC: 'Öğrenci T.C.',
    studentName: 'Öğrenci Adı Soyadı',
    studentDob: 'Öğrenci Doğum Tarihi',
    studentPob: 'Öğrenci Doğum Yeri',
    studentPhone: 'Öğrenci Cep Telefonu',
    studentPrevSchool: 'Mezun Olduğu Okul',
    studentBloodType: 'Öğrenci Kan Grubu',
    studentDisability: 'Engel Durumu',
    guardianName: 'Veli Adı Soyadı',
    guardianEducation: 'Veli Öğrenim Durumu',
    guardianOccupation: 'Veli Mesleği',
    guardianPhoneCell: 'Veli Cep Telefonu',
    guardianPhoneHome: 'Veli Ev Telefonu',
    guardianPhoneWork: 'Veli İş Telefonu',
    guardianEmail: 'Veli E-Posta',
    guardianBloodType: 'Veli Kan Grubu',
    guardianAddressHome: 'Ev Adresi',
    guardianAddressWork: 'İş Adresi',
    fatherName: 'Baba Adı Soyadı',
    fatherOccupation: 'Baba Mesleği',
    fatherPhone: 'Baba Telefonu',
    fatherEmail: 'Baba E-Posta',
    lgsScore: 'LGS Puanı',
    lgsPercentileTurkey: 'Türkiye Yüzdelik Dilimi',
    lgsPercentileCity: 'İl Yüzdelik Dilimi',
    scholarshipWon: 'Bursluluk Kazandı Mı?',
    tubitakInterest: 'TÜBİTAK Başvuru Alanı',
    opinionSchool: 'Okulumuz Hakkındaki Görüşler',
    opinionExpectations: 'Okulumuzdan Beklentiler',
    opinionSuggestions: 'Okulumuz İçin Öneriler',
    id: 'Başvuru ID',
  };

  // Helper to render a field if it exists
  const renderField = (key: string, value: any) => {
    if (!value || key === 'id') return null; // Don't render the ID field here
    const label = fieldLabels[key] || key; // Use mapped label or fallback to key
    return (
      <Col md={6} lg={4} className="mb-2">
        <strong>{label}:</strong> {value}
      </Col>
    );
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Admin Paneli - Ön Kayıt Başvuruları</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button onClick={fetchApplications} className="mb-3">Listeyi Yenile</Button>
      
      {applications.length > 0 ? (
        <Accordion>
          {applications.map((app, index) => (
            <Accordion.Item eventKey={String(index)} key={app.id || index}>
              <Accordion.Header>
                {app.studentName || 'İsimsiz Başvuru'} - (T.C: {app.studentTC || 'Belirtilmemiş'})
              </Accordion.Header>
              <Accordion.Body>
                <Card>
                    <Card.Body>
                        <Row>
                            {Object.entries(app).map(([key, value]) => renderField(key, value))}
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(app.id)}>
                            Başvuruyu Sil
                        </Button>
                    </Card.Footer>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Alert variant="info">Kayıtlı başvuru bulunmamaktadır.</Alert>
      )}
    </Container>
  );
};

export default AdminPage;
