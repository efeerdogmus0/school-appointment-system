'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Form, Container, Row, Col } from 'react-bootstrap';

// Bu şifreyi daha güvenli bir yöntemle (örneğin .env.local) saklamak en iyisidir.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1234';

interface Appointment {
  id: number;
  appointmentDateTime: string;
  studentName: string;
  studentTC: string;
  parentName: string;
  parentPhone: string;
  createdAt: string;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      if (!res.ok) throw new Error('Randevular alınamadı.');
      const data = await res.json();
      setAppointments(data.sort((a: Appointment, b: Appointment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu randevuyu kalıcı olarak silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Randevu silinemedi.');
      setMessage('Randevu başarıyla silindi.');
      fetchAppointments(); // Listeyi yenile
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Yanlış şifre. Lütfen tekrar deneyin.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={4}>
            <h2 className="text-center mb-4">Admin Girişi</h2>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Şifre</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">Giriş Yap</Button>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Randevu Yönetim Paneli</h1>
      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Randevular yükleniyor...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Randevu Tarihi</th>
              <th>Öğrenci Adı</th>
              <th>Veli Adı</th>
              <th>Veli Telefon</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt, index) => (
              <tr key={apt.id}>
                <td>{index + 1}</td>
                <td>{new Date(apt.appointmentDateTime).toLocaleString('tr-TR')}</td>
                <td>{apt.studentName}</td>
                <td>{apt.parentName}</td>
                <td>{apt.parentPhone}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(apt.id)}>
                    İptal Et
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminPage;
