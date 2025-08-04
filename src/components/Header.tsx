'use client';

import Image from 'next/image';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <Image
            src="/logo.png"
            alt="Nişantaşı Nuri Akın Anadolu Lisesi Logosu"
            width={50}
            height={50}
            priority
            className="me-3"
          />
          <span className="fw-bold fs-5">Nuri Akın Lisesi Randevu Sistemi</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
