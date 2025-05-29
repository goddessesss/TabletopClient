import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaSignOutAlt, FaLock, FaEnvelope } from 'react-icons/fa';

const SettingsTab = ({ handlePasswordReset, handleLogoutClick, handleGoogleLoginSuccess }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h4>Settings</h4>
      <div style={{ marginTop: '20px' }}>
        <Card>
          <Card.Body>
            <Card.Title>Account Settings</Card.Title>

            <Button
              variant="outline-danger"
              onClick={handleLogoutClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '15px',
                padding: '10px',
              }}
            >
              <FaSignOutAlt style={{ marginRight: '10px' }} />
              Log out
            </Button>

            <Button
              variant="outline-warning"
              onClick={handlePasswordReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '15px',
                padding: '10px',
              }}
            >
              <FaLock style={{ marginRight: '10px' }} />
              Reset Password
            </Button>

            <Button
              variant="outline-success"
              onClick={handleGoogleLoginSuccess}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginBottom: '15px',
                padding: '10px',
              }}
            >
              <FaEnvelope style={{ marginRight: '10px' }} />
              Link Google Account
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTab;
