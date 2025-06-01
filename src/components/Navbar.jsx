import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../components/Context/AuthContext.jsx';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../components/Context/LanguageContext';
import { roles } from '../enums/roles.js'

function Navbar() {
  const { isAuthenticated, userRole } = useAuth();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container wrapper">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Logo" className="navbar-logo" />
            <span className="navbar-title">Tabletop Connect</span>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/board-games" className="nav-item">{t('navbar.games')}</Link>
          <Link to="/events" className="nav-item">{t('navbar.events')}</Link>
          <Link to="#" className="nav-item">{t('navbar.gameClubs')}</Link>
          <Link to="/contact" className="nav-item">{t('navbar.contact')}</Link>
          { userRole === roles.find(role => role.name === 'Admin')?.id && <Link to="/adminpanel" className="nav-item">{t('navbar.admin')}</Link>} 
        </div>

        <div
          className="navbar-right d-none d-md-flex"
          style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', width: 'auto' }}
        >
          <Dropdown onSelect={changeLanguage} style={{ width: 'auto' }}>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-language"
              className="language-switcher"
              style={{ width: 'auto', textAlign: 'center' }}
            >
              {language === 'uk' ? 'UA' : 'EN'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="en" active={language === 'en'}>English</Dropdown.Item>
              <Dropdown.Item eventKey="uk" active={language === 'uk'}>Українська</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {isAuthenticated ? (
            <Link to="/profile" style={{ width: 'auto' }}>
              <button className="auth-btn btn btn-primary">
                {t('navbar.profile')}
              </button>
            </Link>
          ) : (
            <button
              className="auth-btn btn btn-outline-primary"
              style={{ width: 'auto' }}
              onClick={() => navigate('/login')}
            >
              {t('navbar.login')}
            </button>
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
              {t('navbar.games')}
              <span className={`dropdown-arrow ${gamesDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>
            {gamesDropdownOpen && (
              <div className="dropdown-submenu">
                <a href="/all" className="dropdown-item">{t('navbar.allBoardgames')}</a>
                <a href="#" className="dropdown-item">{t('navbar.game2')}</a>
                <a href="#" className="dropdown-item">{t('navbar.game3')}</a>
              </div>
            )}
          </div>

          <Link to="/events" className="nav-item" onClick={() => setMenuOpen(false)}>
            {t('navbar.events')}
          </Link>
          <Link to="/contact" className="nav-item" onClick={() => setMenuOpen(false)}>
            {t('navbar.contact')}
          </Link>

          <div style={{ marginTop: '1rem', position: 'relative', width: '100%' }}>
            <div
              onClick={() => setLanguageDropdownOpen(prev => !prev)}
              style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'background 0.3s',
              }}
            >
              {language === 'uk' ? 'UA' : 'EN'}
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '12px',
                  transition: 'transform 0.3s ease',
                  transform: languageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▼
              </span>
            </div>

            {languageDropdownOpen && (
              <div
                style={{
                  marginTop: '6px',
                  background: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  zIndex: 999,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {[{ code: 'en', label: 'English' }, { code: 'uk', label: 'Українська' }].map(({ code, label }) => (
                  <div
                    key={code}
                    onClick={() => {
                      changeLanguage(code);
                      setLanguageDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: language === code ? '#f1f3f5' : 'transparent',
                      fontWeight: language === code ? 'bold' : 'normal',
                      transition: 'background 0.2s',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="nav-item" style={{ marginTop: '1rem' }}>
            {isAuthenticated ? (
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <button className="auth-btn btn btn-primary w-100">{t('navbar.profile')}</button>
              </Link>
            ) : (
              <button
                className="auth-btn btn btn-outline-primary w-100"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/login');
                }}
              >
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
