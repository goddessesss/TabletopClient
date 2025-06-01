import React, { useState } from 'react';
import logo from '../assets/logo.png';
import {
  FaTachometerAlt,
  FaUsers,
  FaGamepad,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { MdClass } from "react-icons/md";
import BoardGamesTab from '../components/AdminPanelTabs/BoardGames/BoardGamesTab.jsx';
import DashboardTab from '../components/AdminPanelTabs/DashboardTab.jsx';
import UsersTab from '../components/AdminPanelTabs/UsersTab.jsx';
import ClassifiersTab from '../components/AdminPanelTabs/Classifiers/ClassifiersTab.jsx';
import { AdminPanelTabs } from '../enums/adminPanelTabs.js';
import { useTranslation } from 'react-i18next';
import '../styles/AdminPanel.scss';

function AdminPanel() {
  const { t } = useTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case AdminPanelTabs.BoardGames:
        return <BoardGamesTab></BoardGamesTab>
      case AdminPanelTabs.Classifiers:
        return <ClassifiersTab></ClassifiersTab>
      case AdminPanelTabs.Dashboard:
        return <DashboardTab></DashboardTab>
      case AdminPanelTabs.Users:
        return <UsersTab></UsersTab>
      default:
        break;
    }
  }

  const tabTitles = {
    [AdminPanelTabs.BoardGames]: 'admin.boardGames',
    [AdminPanelTabs.Users]: 'admin.users',
    [AdminPanelTabs.Classifiers]: 'admin.classifiers',
    [AdminPanelTabs.Dashboard]: 'admin.dashboard'
  }

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
          <div className="logo">
            <img className="logo__img" src={logo}></img>
            <h2
            className="logo__text navbar-title"
            style={{ textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold' }}
            >
              Tabletop Connect
            </h2>
          </div>
          <hr />
        </div>
        <nav className="sidebar__nav">
          <ul>
            <li className={activeTab === AdminPanelTabs.Dashboard ? 'active' : ''} onClick={() => handleTabChange(AdminPanelTabs.Dashboard)}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li className={activeTab === AdminPanelTabs.Users ? 'active' : ''} onClick={() => handleTabChange(AdminPanelTabs.Users)}>
              <FaUsers /> <span>Users</span>
            </li>
            <li className={activeTab === AdminPanelTabs.BoardGames ? 'active' : ''} onClick={() => handleTabChange(AdminPanelTabs.BoardGames)}>
              <FaGamepad /> <span>Board Games</span>
            </li>
            <li className={activeTab === AdminPanelTabs.Classifiers ? 'active' : ''} onClick={() => handleTabChange(AdminPanelTabs.Classifiers)}>
              <MdClass /> <span>Classifiers</span>
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
            <h2 style={{ margin: 0 }}>{ t(tabTitles[activeTab]) }</h2>
            <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Admin</span>
              <FaUserCircle size={40} />
            </div>
          </div>
          <div className='main-innerContent'>
            { renderActiveTabContent() }
          </div>
        </main>
    </div>
  );
}

export default AdminPanel;
