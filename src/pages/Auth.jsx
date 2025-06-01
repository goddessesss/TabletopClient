import React, { useState, useEffect } from 'react';
import { authenticate, authenticateWithGoogle } from '../api/authApi.js';
import authLogo from '../assets/auth-logo.png';
import { useAuth } from "../components/Context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AlertMessage from '../components/AlertMessages.jsx';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../components/NotificationsHandling/NotificationContext.jsx';

function Auth() {
  const { t } = useTranslation();
  const { handleLogin, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      handleLogin(token);
    }
  }, []); 

  const handleToggleMode = () => {
    setLoginMode(prevMode => !prevMode);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      addNotification({message: t('auth.errors.fillAllFields'), variant: 'warning'});
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!isLoginMode && !passwordRegex.test(password)) {
      addNotification({message: t('auth.errors.passwordComplexity'), variant: 'warning'});
      return;
    }

    try {
      const response = await authenticate(isLoginMode, email, password);

      if (response.success) {
        if (isLoginMode) {
          const token = response.token;
          localStorage.setItem('token', token);
          handleLogin(token);
          addNotification({message: t('auth.messages.loginSuccess'), variant: 'success'});
          setEmail('');
          setPassword('');
          navigate('/');
        } else {
          addNotification({message: t('auth.messages.registrationSuccess'), variant: 'success'});
          setEmail('');
          setPassword('');
          setLoginMode(true);
        }
      } else {
        const msg = response.message?.toLowerCase() || '';
        if (!isLoginMode && (msg.includes('already exists') || msg.includes('user exists') || msg.includes('email'))) {
          addNotification({message: t('auth.errors.emailExists'), variant: 'danger'});
        } else if (isLoginMode && msg.includes('invalid credentials')) {
          addNotification({message: t('auth.errors.invalidCredentials'), variant: 'danger'});
        } else {
          addNotification({message: response.message || t('auth.errors.general'), variant: 'danger'});
        }
      }
    } catch (error) {
      console.error(error);
      addNotification({message: t('auth.errors.unexpected'), variant: 'danger'});
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;

      if (!googleToken) {
        addNotification({message: t('auth.errors.googleFailed'), variant: 'danger'});
        return;
      }

      const authResponse = await authenticateWithGoogle(googleToken);

      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
        handleLogin(authResponse.token);
        addNotification({message: t('auth.messages.googleSuccess'), variant: 'success'});
        navigate('/');
      } else {
        addNotification({message: authResponse.message || t('auth.errors.googleFailed'), variant: 'danger'});
      }
    } catch (error) {
      console.error(error);
      addNotification({message: t('auth.errors.googleError'), variant: 'danger'});
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 className="auth-title">
          {isLoginMode ? t('auth.titles.welcomeBack') : t('auth.titles.createAccount')}
        </h2>
        <h3 className="auth-info">
          {isLoginMode ? t('auth.titles.loginToContinue') : t('auth.titles.joinUs')}
        </h3>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.labels.email')}</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('auth.placeholders.email')}
            />
          </div>
          <div className="form-group">
            <label>{t('auth.labels.password')}</label>
            <div className="password-input-container">
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('auth.placeholders.password')}
              />
              <button
                onClick={handleTogglePasswordVisibility}
                className="eye-icon"
                type="button"
              >
                {showPassword ?
                  <FaEyeSlash style={{ fontSize: '30px' }} /> :
                  <FaEye style={{ fontSize: '30px' }} />
                }
              </button>
            </div>
          </div>
          <button type="submit" className="button-submit">
            {isLoginMode ? t('auth.buttons.login') : t('auth.buttons.register')}
          </button>
        </form>

        {isLoginMode && !isAuthenticated && (
          <>
            <div className="or-divider">
              <span>{t('auth.or')}</span>
            </div>
            <div className="google-login-wrapper">
              <GoogleLogin
                theme='filled_black'
                type='standard'
                size='large'
                locale='en'
                shape='pill'
                onSuccess={handleGoogleLogin}
                onError={() => addNotification({message: (t('auth.errors.googleFailed')), variant: 'danger'})}
              />
            </div>
          </>
        )}

        <p className="form-toggle" onClick={handleToggleMode}>
          {isLoginMode ? (
            <span>{t('auth.toggle.registerPrompt')}</span>
          ) : (
            <span>{t('auth.toggle.loginPrompt')}</span>
          )}
        </p>
      </div>

      <div className="auth-image-container">
        <img src={authLogo} alt="Auth Logo" className="auth-logo" />
      </div>
    </div>
  );
}

export default Auth;
