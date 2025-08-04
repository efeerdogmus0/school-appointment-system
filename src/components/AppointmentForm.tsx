'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Button, Alert, Spinner, Accordion, Row, Col } from 'react-bootstrap';

interface AppointmentFormProps {
  selectedDateTime: Date;
}

const initialFormData = {
  ogrenciNo: '',
  ogrenciTC: '',
  ogrenciAdSoyad: '',
  ogrenciDogumTarihi: '',
  ogrenciDogumYeri: '',
  ogrenciCepTel: '',
  mezunOlduguOkul: '',
  surekliHastalik: '',
  engelDurumu: '',
  ogrenciKanGrubu: '',
  anneBabaBirlikteMi: '',
  anneBabaOzMu: '',
  veliTuru: '', // Anne, Baba, Diğer
  veliAdSoyad: '',
  veliOgrenimDurumu: '',
  veliMeslek: '',
  veliTelEv: '',
  veliTelIs: '',
  veliTelCep: '',
  veliKanGrubu: '',
  veliEposta: '',
  veliEvAdres: '',
  veliIsAdres: '',
  veliSurekliHastalik: '',
  veliEngelDurumu: '',
  veliAylikGelir: '',
  lgsPuani: '',
  lgsGenelYuzdelik: '',
  lgsIlYuzdelik: '',
  burslulukKazandiMi: '',
  tubitakOlimpiyatBasvurusu: '',
  turkceDogru: '',
  turkceYanlis: '',
  matematikDogru: '',
  matematikYanlis: '',
  fenDogru: '',
  fenYanlis: '',
  yabanciDilDogru: '',
  yabanciDilYanlis: '',
  dinKulturuDogru: '',
  dinKulturuYanlis: '',
  inkilapDogru: '',
  inkilapYanlis: '',
  meslekiGorev: '',
  okulAileBirligiGorev: '',
  baskaGorusOneri: '',
};

const AppointmentForm = ({ selectedDateTime }: AppointmentFormProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

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

      <Accordion defaultActiveKey="0">
        {/* ÖĞRENCİ BİLGİLERİ */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Öğrenci Bilgileri</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={6}><Form.Group className="mb-3" controlId="ogrenciAdSoyad"><Form.Label>Adı Soyadı</Form.Label><Form.Control value={formData.ogrenciAdSoyad} onChange={handleChange} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3" controlId="ogrenciTC"><Form.Label>T.C. Kimlik Numarası</Form.Label><Form.Control value={formData.ogrenciTC} onChange={handleChange} required maxLength={11} /></Form.Group></Col>
            </Row>
            <Row>
                <Col md={4}><Form.Group className="mb-3" controlId="ogrenciDogumTarihi"><Form.Label>Doğum Tarihi</Form.Label><Form.Control type="date" value={formData.ogrenciDogumTarihi} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3" controlId="ogrenciDogumYeri"><Form.Label>Doğum Yeri (İlçe)</Form.Label><Form.Control value={formData.ogrenciDogumYeri} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3" controlId="ogrenciCepTel"><Form.Label>Cep Telefonu</Form.Label><Form.Control type="tel" value={formData.ogrenciCepTel} onChange={handleChange} /></Form.Group></Col>
            </Row>
             <Row>
                <Col md={6}><Form.Group className="mb-3" controlId="mezunOlduguOkul"><Form.Label>Mezun Olduğu Okul</Form.Label><Form.Control value={formData.mezunOlduguOkul} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3" controlId="ogrenciKanGrubu"><Form.Label>Kan Grubu</Form.Label><Form.Control value={formData.ogrenciKanGrubu} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3" controlId="surekliHastalik"><Form.Label>Sürekli hastalığı var ise belirtiniz</Form.Label><Form.Control as="textarea" rows={2} value={formData.surekliHastalik} onChange={handleChange} /></Form.Group>
          </Accordion.Body>
        </Accordion.Item>

        {/* VELİ BİLGİLERİ */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Veli Bilgileri (Anne, Baba veya Diğer)</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3" controlId="veliTuru">
                <Form.Label>Veli</Form.Label>
                <Form.Select value={formData.veliTuru} onChange={handleChange}>
                    <option>Seçiniz...</option>
                    <option value="Anne">Anne</option>
                    <option value="Baba">Baba</option>
                    <option value="Diğer">Diğer</option>
                </Form.Select>
            </Form.Group>
            <Row>
                <Col md={6}><Form.Group className="mb-3" controlId="veliAdSoyad"><Form.Label>Adı Soyadı</Form.Label><Form.Control value={formData.veliAdSoyad} onChange={handleChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3" controlId="veliMeslek"><Form.Label>Mesleği</Form.Label><Form.Control value={formData.veliMeslek} onChange={handleChange} /></Form.Group></Col>
            </Row>
             <Row>
                <Col md={6}><Form.Group className="mb-3" controlId="veliTelCep"><Form.Label>Telefon Cep</Form.Label><Form.Control type="tel" value={formData.veliTelCep} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3" controlId="veliEposta"><Form.Label>E-Posta</Form.Label><Form.Control type="email" value={formData.veliEposta} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3" controlId="veliEvAdres"><Form.Label>Ev Adresi</Form.Label><Form.Control as="textarea" rows={2} value={formData.veliEvAdres} onChange={handleChange} /></Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        


        {/* AKADEMİK BİLGİLER */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Akademik Bilgiler</Accordion.Header>
          <Accordion.Body>
            <Row>
                <Col md={4}><Form.Group className="mb-3" controlId="lgsPuani"><Form.Label>LGS Yerleştirme Puanı</Form.Label><Form.Control value={formData.lgsPuani} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3" controlId="lgsGenelYuzdelik"><Form.Label>Türkiye Geneli Yüzdelik Dilim</Form.Label><Form.Control value={formData.lgsGenelYuzdelik} onChange={handleChange} /></Form.Group></Col>
                <Col md={4}><Form.Group className="mb-3" controlId="lgsIlYuzdelik"><Form.Label>İl Geneli Yüzdelik Dilim</Form.Label><Form.Control value={formData.lgsIlYuzdelik} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <hr />
            <p>LGS Sınavı Doğru/Yanlış Sayıları</p>
            <Row>
                <Col><Form.Group className="mb-3" controlId="turkceDogru"><Form.Label>Türkçe D.</Form.Label><Form.Control type="number" value={formData.turkceDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="turkceYanlis"><Form.Label>Türkçe Y.</Form.Label><Form.Control type="number" value={formData.turkceYanlis} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="matematikDogru"><Form.Label>Matematik D.</Form.Label><Form.Control type="number" value={formData.matematikDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="matematikYanlis"><Form.Label>Matematik Y.</Form.Label><Form.Control type="number" value={formData.matematikYanlis} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="fenDogru"><Form.Label>Fen D.</Form.Label><Form.Control type="number" value={formData.fenDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="fenYanlis"><Form.Label>Fen Y.</Form.Label><Form.Control type="number" value={formData.fenYanlis} onChange={handleChange} /></Form.Group></Col>
            </Row>
             <Row>
                <Col><Form.Group className="mb-3" controlId="inkilapDogru"><Form.Label>İnkılap D.</Form.Label><Form.Control type="number" value={formData.inkilapDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="inkilapYanlis"><Form.Label>İnkılap Y.</Form.Label><Form.Control type="number" value={formData.inkilapYanlis} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="dinKulturuDogru"><Form.Label>Din Kültürü D.</Form.Label><Form.Control type="number" value={formData.dinKulturuDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="dinKulturuYanlis"><Form.Label>Din Kültürü Y.</Form.Label><Form.Control type="number" value={formData.dinKulturuYanlis} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="yabanciDilDogru"><Form.Label>Yabancı Dil D.</Form.Label><Form.Control type="number" value={formData.yabanciDilDogru} onChange={handleChange} /></Form.Group></Col>
                <Col><Form.Group className="mb-3" controlId="yabanciDilYanlis"><Form.Label>Yabancı Dil Y.</Form.Label><Form.Control type="number" value={formData.yabanciDilYanlis} onChange={handleChange} /></Form.Group></Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        {/* DİĞER BİLGİLER */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>Diğer Bilgiler</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3" controlId="baskaGorusOneri"><Form.Label>Başka Görüş ve Önerileriniz</Form.Label><Form.Control as="textarea" rows={3} value={formData.baskaGorusOneri} onChange={handleChange} /></Form.Group>
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
