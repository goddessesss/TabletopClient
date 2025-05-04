import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../components/Context/AuthContext.jsx';

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <span className="navbar-title">Tabletop</span>
          </Link>
        </div>

        <div className="navbar-center">
          <div className="dropdown">
            <span className="dropdown-toggle">
              GAMES
              <span className="dropdown-arrow"></span>
            </span>
            <div className="dropdown-menu">
              <a href="/all" className="dropdown-item">All Boardgames</a>
              <a href="#" className="dropdown-item">Game 2</a>
              <a href="#" className="dropdown-item">Game 3</a>
            </div>
          </div>
          <Link to="/events" className="nav-item">EVENTS</Link>
          <Link to="/contact" className="nav-item">CONTACT</Link>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <Link to="/profile">
              <button className="auth-btn">Profile</button>
            </Link>
          ) : (
            <Link to="/auth">
              <button className="auth-btn">Login</button>
            </Link>
          )}
        </div>

        <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <button className="close-menu" onClick={() => setMenuOpen(false)}>✖</button>
          </div>
          <div className="mobile-dropdown">
            <div className="nav-item" onClick={() => setGamesDropdownOpen(!gamesDropdownOpen)}>
              GAMES
              <span className={`dropdown-arrow ${gamesDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>
            {gamesDropdownOpen && (
              <div className="dropdown-submenu">
                <a href="/all" className="dropdown-item">All boardgames</a>
                <a href="#" className="dropdown-item">Game 2</a>
                <a href="#" className="dropdown-item">Game 3</a>
              </div>
            )}
          </div>

          <Link to="/events" className="nav-item" onClick={() => setMenuOpen(false)}>EVENTS</Link>
          <Link to="/contact" className="nav-item" onClick={() => setMenuOpen(false)}>CONTACT</Link>

          {isAuthenticated ? (
            <Link to="/profile" className="auth-btn" onClick={() => setMenuOpen(false)}>Profile</Link>
          ) : (
            <Link to="/auth" className="auth-btn" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
