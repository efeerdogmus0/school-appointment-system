'use client';

import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 mt-auto border-top">
      <Container className="text-center">
        <h5>Nişantaşı Nuri Akın Anadolu Lisesi</h5>
        <div className="mt-3">
          <p className="mb-1">Adres: Teşvikiye, Vali Konağı Cd. No:79, 34365 Şişli/İstanbul</p>
          <p className="mb-1">Telefon: (0212) 225 62 22</p>
          <p className="mb-1">
            Web: <a href="https://nuriakin.meb.k12.tr" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-medium">nuriakin.meb.k12.tr</a>
          </p>
        </div>
        <div className="mt-3 text-muted">
          <small>&copy; {new Date().getFullYear()} - Tüm hakları saklıdır.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
