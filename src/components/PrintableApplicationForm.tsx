import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Define a specific type for the form data to avoid 'any'
interface ApplicationData {
  appointment?: { startTime: string };
  studentTC?: string;
  studentName?: string;
  studentDob?: string;
  studentPob?: string;
  studentPhone?: string;
  studentPrevSchool?: string;
  primaryGuardianType?: string;
  primaryGuardianName?: string;
  primaryGuardianTC?: string;
  primaryGuardianPhone?: string;
  primaryGuardianEmail?: string;
  primaryGuardianJob?: string;
  primaryGuardianWorkAddress?: string;
  secondaryGuardianType?: string;
  secondaryGuardianName?: string;
  secondaryGuardianTC?: string;
  secondaryGuardianPhone?: string;
  secondaryGuardianEmail?: string;
  secondaryGuardianJob?: string;
  secondaryGuardianWorkAddress?: string;
  lgsScore?: string;
  lgsRankTurkey?: string;
  lgsRankProvince?: string;
  examNetTurkishD?: string; examNetTurkishY?: string;
  examNetMathD?: string; examNetMathY?: string;
  examNetScienceD?: string; examNetScienceY?: string;
  examNetSocialD?: string; examNetSocialY?: string;
  examNetReligionD?: string; examNetReligionY?: string;
  examNetForeignLangD?: string; examNetForeignLangY?: string;
  scholarshipScore?: string;
  tubitakInterest?: string;
  discoveryChannel?: string;
  additionalNotes?: string;
}

interface PrintableApplicationFormProps {
  formData: ApplicationData;
}

const PrintableApplicationForm = forwardRef<HTMLDivElement, PrintableApplicationFormProps>(({ formData }, ref) => {
  if (!formData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Belirtilmemiş';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, EEEE HH:mm', { locale: tr });
    } catch {
      return 'Geçersiz Tarih';
    }
  };

  const formatSimpleDate = (dateString: string) => {
    if (!dateString) return 'Belirtilmemiş';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: tr });
    } catch {
      return 'Geçersiz Tarih';
    }
  };

  return (
    <div ref={ref} className="p-4 bg-white text-dark printable-content">
        <style type="text/css" media="print">
        {`
          @page { 
            size: A4; 
            margin: 15mm; 
          }
          body {
            -webkit-print-color-adjust: exact; 
            background-color: #ffffff !important;
          }
          .printable-content {
            font-family: 'Times New Roman', serif;
            font-size: 9.5pt;
            color: #000000 !important;
          }
          .printable-content h2, .printable-content h3 {
            font-family: 'Arial Black', sans-serif;
            text-align: center;
            margin: 0;
            color: #000000 !important;
          }
          .printable-content h2 { font-size: 16pt; }
          .printable-content h3 { font-size: 14pt; font-weight: normal; margin-bottom: 10px; }
          .printable-content .card {
            border: 1px solid #dee2e6 !important;
            margin-bottom: 8px !important;
            break-inside: avoid;
          }
          .printable-content .card-header {
            font-size: 11pt;
            font-weight: bold;
            background-color: #e9ecef !important;
            padding: 4px 8px;
            border-bottom: 1px solid #dee2e6 !important;
            color: #000000 !important;
          }
          .printable-content .card-body {
            padding: 8px;
          }
          .printable-content p {
            margin-bottom: 2px;
          }
          .printable-content .info-label {
            font-weight: bold;
          }
          .printable-content .info-value {
            font-weight: normal;
          }
          .printable-content .row {
            display: flex;
            flex-wrap: wrap;
          }
          .printable-content .col-4, .printable-content .col-6, .printable-content .col-12, .printable-content .col-2, .printable-content .col-10 {
            padding: 1px 5px;
          }
          .printable-content hr {
            margin: 4px 0;
            border-top: 1px solid #ccc;
          }
          .printable-content footer {
            font-size: 8pt;
            text-align: center;
            margin-top: 15px;
          }
        `}
        </style>

      <Container>
        <header className="text-center mb-4">
          <Image src="/logo-nnl.png" alt="Okul Logosu" width={120} height={120} style={{ marginBottom: '10px' }} />
          <h2>NİŞANTAŞI NURİ AKIN ANADOLU LİSESİ</h2>
          <h3>ÖN KAYIT BAŞVURU FORMU</h3>
        </header>

        <Card>
          <Card.Header>RANDEVU BİLGİLERİ</Card.Header>
          <Card.Body>
            <p><span className="info-label">Randevu Tarihi ve Saati:</span> <span className="info-value">{formData.appointment ? formatDate(formData.appointment.startTime) : 'Belirtilmemiş'}</span></p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>ÖĞRENCİ BİLGİLERİ</Card.Header>
          <Card.Body>
            <Row>
              <Col xs={6}><p><span className="info-label">T.C. Kimlik No:</span> <span className="info-value">{formData.studentTC}</span></p></Col>
              <Col xs={6}><p><span className="info-label">Adı Soyadı:</span> <span className="info-value">{formData.studentName}</span></p></Col>
              <Col xs={6}><p><span className="info-label">Doğum Tarihi:</span> <span className="info-value">{formatSimpleDate(formData.studentDob!)}</span></p></Col>
              <Col xs={6}><p><span className="info-label">Doğum Yeri:</span> <span className="info-value">{formData.studentPob}</span></p></Col>
              <Col xs={6}><p><span className="info-label">Cep Telefonu:</span> <span className="info-value">{formData.studentPhone}</span></p></Col>
              <Col xs={6}><p><span className="info-label">Mezun Olduğu Okul:</span> <span className="info-value">{formData.studentPrevSchool}</span></p></Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>BİRİNCİL VELİ BİLGİLERİ</Card.Header>
          <Card.Body>
            <Row>
                <Col xs={4}><p><span className="info-label">Yakınlık:</span> <span className="info-value">{formData.primaryGuardianType}</span></p></Col>
                <Col xs={8}><p><span className="info-label">Adı Soyadı:</span> <span className="info-value">{formData.primaryGuardianName}</span></p></Col>
                <Col xs={6}><p><span className="info-label">T.C. Kimlik No:</span> <span className="info-value">{formData.primaryGuardianTC}</span></p></Col>
                <Col xs={6}><p><span className="info-label">Cep Telefonu:</span> <span className="info-value">{formData.primaryGuardianPhone}</span></p></Col>
                <Col xs={6}><p><span className="info-label">E-posta:</span> <span className="info-value">{formData.primaryGuardianEmail}</span></p></Col>
                <Col xs={6}><p><span className="info-label">Mesleği:</span> <span className="info-value">{formData.primaryGuardianJob}</span></p></Col>
                <Col xs={12}><p><span className="info-label">İş Adresi:</span> <span className="info-value">{formData.primaryGuardianWorkAddress || 'Belirtilmemiş'}</span></p></Col>
            </Row>
          </Card.Body>
        </Card>

        {formData.secondaryGuardianName && (
            <Card>
                <Card.Header>İKİNCİL VELİ BİLGİLERİ</Card.Header>
                <Card.Body>
                    <Row>
                        <Col xs={4}><p><span className="info-label">Yakınlık:</span> <span className="info-value">{formData.secondaryGuardianType}</span></p></Col>
                        <Col xs={8}><p><span className="info-label">Adı Soyadı:</span> <span className="info-value">{formData.secondaryGuardianName}</span></p></Col>
                        <Col xs={6}><p><span className="info-label">T.C. Kimlik No:</span> <span className="info-value">{formData.secondaryGuardianTC}</span></p></Col>
                        <Col xs={6}><p><span className="info-label">Cep Telefonu:</span> <span className="info-value">{formData.secondaryGuardianPhone}</span></p></Col>
                        <Col xs={6}><p><span className="info-label">E-posta:</span> <span className="info-value">{formData.secondaryGuardianEmail}</span></p></Col>
                        <Col xs={6}><p><span className="info-label">Mesleği:</span> <span className="info-value">{formData.secondaryGuardianJob}</span></p></Col>
                        <Col xs={12}><p><span className="info-label">İş Adresi:</span> <span className="info-value">{formData.secondaryGuardianWorkAddress || 'Belirtilmemiş'}</span></p></Col>
                    </Row>
                </Card.Body>
            </Card>
        )}

        <Card>
          <Card.Header>SINAV VE BAŞVURU BİLGİLERİ</Card.Header>
          <Card.Body>
            <Row>
                <Col xs={4}><p><span className="info-label">LGS Puanı:</span> <span className="info-value">{formData.lgsScore}</span></p></Col>
                <Col xs={4}><p><span className="info-label">Türkiye %:</span> <span className="info-value">{formData.lgsRankTurkey}</span></p></Col>
                <Col xs={4}><p><span className="info-label">İl %:</span> <span className="info-value">{formData.lgsRankProvince}</span></p></Col>
            </Row>
            <hr />
            <Row>
                <Col xs={2}><span className="info-label">Türkçe:</span></Col><Col xs={2}><span className="info-value">{formData.examNetTurkishD}D/{formData.examNetTurkishY}Y</span></Col>
                <Col xs={2}><span className="info-label">Mat.:</span></Col><Col xs={2}><span className="info-value">{formData.examNetMathD}D/{formData.examNetMathY}Y</span></Col>
                <Col xs={2}><span className="info-label">Fen:</span></Col><Col xs={2}><span className="info-value">{formData.examNetScienceD}D/{formData.examNetScienceY}Y</span></Col>
                <Col xs={2}><span className="info-label">İnkılap:</span></Col><Col xs={2}><span className="info-value">{formData.examNetSocialD}D/{formData.examNetSocialY}Y</span></Col>
                <Col xs={2}><span className="info-label">Din K.:</span></Col><Col xs={2}><span className="info-value">{formData.examNetReligionD}D/{formData.examNetReligionY}Y</span></Col>
                <Col xs={2}><span className="info-label">Y. Dil:</span></Col><Col xs={2}><span className="info-value">{formData.examNetForeignLangD}D/{formData.examNetForeignLangY}Y</span></Col>
            </Row>
             <hr />
            <Row>
                <Col xs={6}><p><span className="info-label">Bursluluk Puanı:</span> <span className="info-value">{formData.scholarshipScore || 'Girilmedi'}</span></p></Col>
                <Col xs={6}><p><span className="info-label">TÜBİTAK İlgi Alanı:</span> <span className="info-value">{formData.tubitakInterest || 'Yok'}</span></p></Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>EK BİLGİLER</Card.Header>
          <Card.Body>
            <p><span className="info-label">Okulumuzu Nereden Duydunuz:</span> <span className="info-value">{formData.discoveryChannel}</span></p>
            <p><span className="info-label">Görüş ve Öneriler:</span> <span className="info-value">{formData.additionalNotes || 'Yok'}</span></p>
          </Card.Body>
        </Card>

        <footer className="mt-4 text-muted text-center small">
          <p>Bu form, Nişantaşı Nuri Akın Anadolu Lisesi Robotik Kulübü tarafından geliştirilen randevu sistemi tarafından oluşturulmuştur.</p>
        </footer>
      </Container>
    </div>
  );
});

PrintableApplicationForm.displayName = 'PrintableApplicationForm';

export default PrintableApplicationForm;
