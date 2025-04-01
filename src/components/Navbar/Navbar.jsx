import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';  
import { useAuth } from '../Context/AuthContext.jsx';  

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { handleLogout } = useAuth();

  const token = localStorage.getItem('token');

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
    <BootstrapNavbar expand="lg" className={`w-100 ${scrolled ? 'scrolled' : ''} bg-body-tertiary`}>
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/">
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
            <Nav.Link as={Link} to="/" className="nav-item">Home</Nav.Link>
            <Nav.Link as={Link} to="/events" className="nav-item">Events</Nav.Link> 
            <Nav.Link as={Link} to="/contact" className="nav-item">Contact</Nav.Link>
          </Nav>

          <div className="navbar-text">
            {token ? (
              <Link to="/profile">
                <button className="login-btn">Profile</button>
              </Link>
            ) : (
              <Link to="/auth">
                <button className="login-btn">Login</button>
              </Link>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
