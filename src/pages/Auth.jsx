import React, { useState, useEffect } from 'react';
import { authenticate, authenticateWithGoogle } from '../api/authApi.js';
import authLogo from '../assets/auth-logo.png';
import { useAuth } from "../components/Context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AlertMessage from '../components/AlertMessages.jsx';

function Auth() {
  const { handleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      setError('Please fill in all fields.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!isLoginMode && !passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one digit.');
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await authenticate(isLoginMode, email, password);
      console.log('Response from auth API:', response);

      if (response.success) {
        if (isLoginMode) {
          const token = response.token;
          localStorage.setItem('token', token);
          handleLogin(token);
          setSuccessMessage('Login successful');
          setEmail('');
          setPassword('');
          navigate('/');
        } else {
          setSuccessMessage('Registration successful! You can now log in.');
          setEmail('');
          setPassword('');
          setLoginMode(true);
        }
      } else {
        const msg = response.message?.toLowerCase() || '';

        if (!isLoginMode && (msg.includes('already exists') || msg.includes('user exists') || msg.includes('email'))) {
          setError('A user with this email already exists.');
        } else if (isLoginMode && msg.includes('invalid credentials')) {
          setError('Incorrect email or password.');
        } else {
          setError(response.message || 'An error occurred during authentication.');
        }
      }
    } catch (error) {
      console.error(error);
      setError('Unexpected error.');
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;

      if (!googleToken) {
        setError('Google authentication failed.');
        return;
      }

      const authResponse = await authenticateWithGoogle(googleToken);

      if (authResponse.token) {
        localStorage.setItem('token', authResponse.token);
        handleLogin(authResponse.token);
        setSuccessMessage('Google login successful!');
        navigate('/');
      } else {
        setError(authResponse.message || 'Google login failed.');
      }
    } catch (error) {
      console.error(error);
      setError('Google login error.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 className="auth-title">
          {isLoginMode ? 'Welcome back!' : 'Create an Account!'}
        </h2>
        <h3 className="auth-info">
          {isLoginMode ? 'Log in to your account' : 'Join us now!'}
        </h3>

        <AlertMessage 
          message={error || successMessage} 
          variant={error ? "danger" : "success"} 
        />

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <div className="password-input-container">
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
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
            {isLoginMode ? 'Log In' : 'Register'}
          </button>
        </form>

        {isLoginMode && !isAuthenticated && (
          <>
            <div className="or-divider">
              <span>OR</span>
            </div>
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed.')}
              />
            </div>
          </>
        )}

        <p className="form-toggle" onClick={handleToggleMode}>
          {isLoginMode ? (
            <span>New here? <strong>Create an account!</strong></span>
          ) : (
            <span>Already have an account? <strong>Log in here</strong></span>
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
