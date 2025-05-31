import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import BoardGamesTab from '../components/AdminPanelTabs/BoardGamesTab.jsx';
import '../styles/AdminPanel.scss';

function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-panel">
      <div className="mobile-header">
        <button
          className="burger-button"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <FaTimes size={24} color="#222" /> : <FaBars size={24} color="#222" />}
        </button>
        <hr />
      </div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar__header">
          <h2
            className="navbar-title"
            style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold' }}
          >
            Tabletop
          </h2>
          <hr />
        </div>
        <nav className="sidebar__nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li className={activeTab === 'users' ? 'active' : ''} onClick={() => handleTabChange('users')}>
              <FaUsers /> <span>Users</span>
            </li>
            <li className={activeTab === 'boardgames' ? 'active' : ''} onClick={() => handleTabChange('boardgames')}>
              <FaGamepad /> <span>Board Games</span>
            </li>
            <li className={activeTab === 'events' ? 'active' : ''} onClick={() => handleTabChange('events')}>
              <FaCalendarAlt /> <span>Events</span>
            </li>
            <li className="logout">
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div
          className="main-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {activeTab === 'boardgames' ? <h2 style={{ margin: 0 }}>Board Games</h2> : <div />}
          <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Admin</span>
            <FaUserCircle size={40} />
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="cards">
            <div className="card">
              <h3>Total Users</h3>
              <p>1,204</p>
            </div>
            <div className="card">
              <h3>Games Listed</h3>
              <p>87</p>
            </div>
            <div className="card">
              <h3>Upcoming Events</h3>
              <p>15</p>
            </div>
          </div>
        )}

        {activeTab === 'boardgames' && <BoardGamesTab />}

        {activeTab === 'users' && <h2>Users Section (Coming soon...)</h2>}
        {activeTab === 'events' && <h2>Events Section (Coming soon...)</h2>}
      </main>
    </div>
  );
}

export default AdminPanel;
