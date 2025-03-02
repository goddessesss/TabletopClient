import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import logo from '../../assets/logo.png';  
import { BrowserRouter as Router } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

function Navbar() {
  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Router>
      <BootstrapNavbar expand="lg" className={`w-100 ${scrolled ? 'scrolled' : ''} bg-body-tertiary`}>
        <Container fluid>
          <BootstrapNavbar.Brand href="#home">
            <img
              src={logo}
              alt="Logo"
              className="navbar-logo"
            />
            Tabletop
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto nav-links">
              <Nav.Link className="nav-item" href="#home">Home</Nav.Link>
              <Nav.Link className="nav-item" href="#event">Event</Nav.Link>
              <Nav.Link className="nav-item" href="#contact">Contact</Nav.Link>
            </Nav>

            <div className="navbar-text">
              <HashLink to="#connect">
                <button className="login-btn">Login</button>
              </HashLink>
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </Router>
  );
}

export default Navbar;
