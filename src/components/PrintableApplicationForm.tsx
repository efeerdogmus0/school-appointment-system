import React, { forwardRef } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { ApplicationData } from '@/types/application';

interface PrintableFormProps {
  application: ApplicationData;
}

// Helper to display data or a placeholder
const DataField = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
  <div className="d-flex justify-content-between border-bottom py-1">
    <span className="fw-bold">{label}:</span>
    <span>{value || 'N/A'}</span>
  </div>
);

const PrintableApplicationForm = forwardRef<HTMLDivElement, PrintableFormProps>(({ application }, ref) => {
  return (
    // This wrapper is positioned off-screen to be captured by html2canvas
    <div 
      ref={ref} 
      style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: 0, 
        width: '210mm', 
        minHeight: '297mm', 
        background: 'white', 
        color: 'black', 
        zIndex: -1, // Ensure it's not interactive
        padding: '20px' 
      }}
    >
        {/* Header */}
        <Row className="align-items-center mb-4 text-center">
          <Col xs={12}>
            <Image src="/logo.png" alt="Okul Logosu" style={{ maxWidth: '100px' }} className="mb-3" />
            <h4 className="fw-bold">NİŞANTAŞI NURİ AKIN ANADOLU LİSESİ</h4>
            <h5 className="fw-bold">ÖN KAYIT BAŞVURU FORMU</h5>
            <hr />
          </Col>
          <Col xs={12} className="text-center">
            <div><strong>Başvuru Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}</div>
            <div><strong>Talep Edilen Randevu:</strong> {application.appointmentDate} - {application.appointmentTime}</div>
            <hr />
          </Col>
        </Row>

        {/* Main Content */}
        <div className="border p-3">
          <Row>
            {/* Left Column */}
            <Col xs={6} className="border-end pe-3">
              <h6 className="bg-light p-2 border mb-3 text-center">Öğrenci Bilgileri</h6>
              <DataField label="T.C. Numarası" value={application.studentTC} />
              <DataField label="Adı Soyadı" value={application.studentName} />
              <DataField label="Doğum Tarihi" value={application.studentDob} />
              <DataField label="Doğum Yeri" value={application.studentPob} />
              <DataField label="Cep Telefonu" value={application.studentPhone} />
              <DataField label="Mezun Olduğu Okul" value={application.studentPrevSchool} />
              <DataField label="Kan Grubu" value={application.studentBloodType} />
              <DataField label="Engel Durumu" value={application.studentDisability} />
              <DataField label="Sürekli Hastalık" value={application.studentChronicIllness} />
              <DataField label="Anne-Baba Birlikte mi?" value={application.parentsTogether} />
              <DataField label="Anne-Baba Öz mü?" value={application.parentsBiological} />
            </Col>

            {/* Right Column */}
            <Col xs={6} className="ps-3">
              <h6 className="bg-light p-2 border mb-3 text-center">Veli Bilgileri (Anne, Baba veya Vasi)</h6>
              <DataField label="Adı Soyadı" value={application.guardianName} />
              <DataField label="Öğrenim Durumu" value={application.guardianEducation} />
              <DataField label="Mesleği" value={application.guardianOccupation} />
              <DataField label="Cep Telefonu" value={application.guardianPhoneCell} />
              <DataField label="E-Posta" value={application.guardianEmail} />
              <DataField label="Ev Adresi" value={application.guardianAddressHome} />
              <DataField label="İş Adresi" value={application.guardianAddressWork} />
              <DataField label="Aylık Gelir" value={application.guardianIncome} />
            </Col>
          </Row>

          <hr />

          <Row>
            <Col xs={12}>
                <h6 className="bg-light p-2 border mb-3 text-center">LGS ve Sınav Bilgileri</h6>
            </Col>
            {/* LGS Info */}
            <Col xs={6} className="border-end pe-3">
              <DataField label="LGS Puanı" value={application.lgsScore} />
              <DataField label="Türkiye Geneli %" value={application.lgsPercentileTurkey} />
              <DataField label="İl Geneli %" value={application.lgsPercentileCity} />
              <DataField label="Bursluluk Kazandı mı?" value={application.scholarshipWon} />
              <DataField label="TÜBİTAK İlgisi" value={application.tubitakInterest} />
            </Col>

            {/* Exam Scores */}
            <Col xs={6} className="ps-3">
              <DataField label="Türkçe D/Y" value={`${application.turkishCorrect || '0'} / ${application.turkishWrong || '0'}`} />
              <DataField label="Matematik D/Y" value={`${application.mathCorrect || '0'} / ${application.mathWrong || '0'}`} />
              <DataField label="Fen Bil. D/Y" value={`${application.scienceCorrect || '0'} / ${application.scienceWrong || '0'}`} />
              <DataField label="İngilizce D/Y" value={`${application.englishCorrect || '0'} / ${application.englishWrong || '0'}`} />
              <DataField label="Din Kültürü D/Y" value={`${application.religionCorrect || '0'} / ${application.religionWrong || '0'}`} />
              <DataField label="T.C. İnkılap D/Y" value={`${application.historyCorrect || '0'} / ${application.historyWrong || '0'}`} />
            </Col>
          </Row>
          
          <hr />

          <Row>
            <Col xs={12}>
                <h6 className="bg-light p-2 border mb-3 text-center">Görüş ve Öneriler</h6>
                <p className="mb-1"><strong>Okul Hakkındaki Görüş:</strong> {application.opinionSchool || 'N/A'}</p>
                <p className="mb-1"><strong>Okuldan Beklentiler:</strong> {application.opinionExpectations || 'N/A'}</p>
                <p className="mb-1"><strong>Okul İçin Öneriler:</strong> {application.opinionSuggestions || 'N/A'}</p>
                <DataField label="Okula Destek Olmak İster misiniz?" value={application.supportSchool} />
                <DataField label="Okul Aile Birliğinde Görev Almak İster misiniz?" value={application.joinPta} />
            </Col>
          </Row>
        </div>
        <footer className="mt-4 text-muted text-center small">
          <p>Bu form, Nişantaşı Nuri Akın Anadolu Lisesi için Efe Erdoğmuş tarafından geliştirilen randevu sistemi tarafından oluşturulmuştur.</p>
        </footer>
    </div>
  );
});

PrintableApplicationForm.displayName = 'PrintableApplicationForm';

export default PrintableApplicationForm;
