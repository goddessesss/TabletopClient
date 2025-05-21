import React, { useState, useEffect } from 'react';
import { authenticate, authenticateWithGoogle } from '../api/authApi.js';
import authLogo from '../assets/auth-logo.png';
import { useAuth } from "../components/Context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AlertMessage from '../components/AlertMessages.jsx';
import { useTranslation } from 'react-i18next';

function Auth() {
  const { t } = useTranslation();
  const { handleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      handleLogin(token);
      navigate('/');
    }
  }, [navigate, handleLogin]);

  if (isAuthenticated) {
    return null;
  }

  const handleToggleMode = () => {
    setLoginMode(prevMode => !prevMode);
    setError('');
    setSuccessMessage('');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t('auth.errors.fillAllFields'));
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!isLoginMode && !passwordRegex.test(password)) {
      setError(t('auth.errors.passwordComplexity'));
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await authenticate(isLoginMode, email, password);

      if (response.success) {
        if (isLoginMode) {
          const token = response.token;
          localStorage.setItem('token', token);
          handleLogin(token);
          setSuccessMessage(t('auth.messages.loginSuccess'));
          setEmail('');
          setPassword('');
          navigate('/');
        } else {
          setSuccessMessage(t('auth.messages.registrationSuccess'));
          setEmail('');
          setPassword('');
          setLoginMode(true);
        }
      } else {
        const msg = response.message?.toLowerCase() || '';
        if (!isLoginMode && (msg.includes('already exists') || msg.includes('user exists') || msg.includes('email'))) {
          setError(t('auth.errors.emailExists'));
        } else if (isLoginMode && msg.includes('invalid credentials')) {
          setError(t('auth.errors.invalidCredentials'));
        } else {
          setError(response.message || t('auth.errors.general'));
        }
      }
    } catch (error) {
      console.error(error);
      setError(t('auth.errors.unexpected'));
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;

      if (!googleToken) {
        setError(t('auth.errors.googleFailed'));
        return;
      }

      const authResponse = await authenticateWithGoogle(googleToken);

      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
        handleLogin(authResponse.token);
        setSuccessMessage(t('auth.messages.googleSuccess'));
        navigate('/');
      } else {
        setError(authResponse.message || t('auth.errors.googleFailed'));
      }
    } catch (error) {
      console.error(error);
      setError(t('auth.errors.googleError'));
    }
  };

  const addAlert = (message, variant) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, variant, id: Date.now() },
    ]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    if (error) {
      addAlert(error, 'danger');
      setError('');
    }
    if (successMessage) {
      addAlert(successMessage, 'success');
      setSuccessMessage('');
    }
  }, [error, successMessage]);

  return (
    <div className="auth-container">
      <div className="alerts-container">
        {alerts.map((alert) => (
          <AlertMessage
            key={alert.id}
            id={alert.id}
            message={alert.message}
            variant={alert.variant}
            onClose={removeAlert}
          />
        ))}
      </div>

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
                onError={() => setError(t('auth.errors.googleFailed'))}
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
