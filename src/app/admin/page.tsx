'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Button, Alert, Form, Modal, Accordion, Row, Col, Card } from 'react-bootstrap';
import { ApplicationData } from '@/types/application';
import PrintableApplicationForm from '@/components/PrintableApplicationForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';

const AdminPage = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  // State for editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);

  // State for printing
  const [printingApplication, setPrintingApplication] = useState<ApplicationData | null>(null);
  const printableFormRef = useRef<HTMLDivElement>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error('Başvurular yüklenemedi.');
      const data = await res.json();
      const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
        return dateA.getTime() - dateB.getTime();
      });
      setApplications(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      fetchApplications();
    } else {
      alert('Yanlış şifre!');
    }
  };

  const handleShowEditModal = (app: ApplicationData) => {
    setEditingApplication({ ...app });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingApplication(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingApplication) return;
    const { name, value } = e.target;
    setEditingApplication(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication || !editingApplication.id) return;

    try {
      const res = await fetch(`/api/applications/${editingApplication.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingApplication),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Başvuru güncellenemedi.');
      }

      const updatedApplication = await res.json();
      setApplications(apps => apps.map(app => app.id === updatedApplication.id ? updatedApplication : app));
      handleCloseEditModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Başvuru silinemedi.');
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Silme işlemi sırasında bir hata oluştu.');
      }
    }
  };

  const handleGeneratePdf = (app: ApplicationData) => {
    setPrintingApplication(app);
  };

  useEffect(() => {
    if (printingApplication && printableFormRef.current) {
      const element = printableFormRef.current;
      
      // A small delay to ensure all content, especially images, are fully rendered.
      setTimeout(() => {
        html2canvas(element, { 
          scale: 2, 
          useCORS: true, // Important for external images
          allowTaint: true,
        })
          .then(canvas => {
            if (canvas.width === 0 || canvas.height === 0) {
              throw new Error('Canvas is empty. The component might not be rendering correctly or is hidden.');
            }
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${printingApplication.studentName}_basvuru.pdf`);
          })
          .catch(err => {
            setError(`PDF oluşturulurken bir hata oluştu: ${err.message}`);
          })
          .finally(() => {
            setPrintingApplication(null); // Clean up state after operation
          });
      }, 500); // 500ms delay
    }
  }, [printingApplication]);

  if (!isAuthenticated) {
    return (
        <Modal show={showPasswordModal} onHide={() => {}} centered backdrop="static" keyboard={false}>
            <Modal.Header><Modal.Title>Admin Girişi</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group>
                        <Form.Label>Şifre</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">Giriş Yap</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
  }

  const fieldLabels: { [key: string]: string } = {
    appointmentDate: 'Randevu Tarihi',
    appointmentTime: 'Randevu Saati',
    studentTC: 'Öğrenci T.C. Kimlik No',
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
                  <Button variant="secondary" size="sm" className="me-2" onClick={() => handleGeneratePdf(app)}>
                    PDF İndir
                  </Button>
                  <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEditModal(app)}>
                    Düzenle
                  </Button>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Başvuruyu Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingApplication && (
            <Form onSubmit={handleUpdateApplication}>
              <Row>
                {Object.keys(editingApplication).map(key => {
                  if (key === 'id') return null;
                  const label = fieldLabels[key] || key;
                  return (
                    <Col md={6} key={key}>
                      <Form.Group className="mb-3">
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                          type="text"
                          name={key}
                          value={editingApplication[key as keyof ApplicationData] || ''}
                          onChange={handleEditInputChange}
                        />
                      </Form.Group>
                    </Col>
                  );
                })}
              </Row>
              <Button variant="primary" type="submit">Değişiklikleri Kaydet</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Conditionally render the printable form off-screen */}
      {printingApplication && (
        <PrintableApplicationForm 
          ref={printableFormRef} 
          application={printingApplication} 
        />
      )}

    </Container>
  );
};

export default AdminPage;
