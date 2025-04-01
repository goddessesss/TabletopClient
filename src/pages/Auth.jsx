import React, { useState } from 'react';
import { authenticate } from '../api/authApi.js';
import authLogo from '../assets/auth-logo.png'; 
import { useAuth } from "../components/Context/AuthContext.jsx";
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  
import '../styles/auth.css';

function Auth() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleToggleMode = () => {
    setLoginMode((prevMode) => !prevMode);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setError('');

    try {
      const response = await authenticate(isLoginMode, email, password);
      const token = response.token;

      if (typeof token !== 'string' || token.trim() === '') {
        setError('Invalid token received.');
        return;
      }

      localStorage.setItem('token', token);

      handleLogin(token);

      if (response.success) {
        window.alert(`${isLoginMode ? 'Login' : 'Registration'} successful`);
        setEmail('');
        setPassword('');

        navigate('/');
      } else {
        setError(response.message || 'An error occurred during authentication.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2 className="auth-title">
          {isLoginMode ? 'Welcome back!' : 'Create an Account!'}
        </h2>
        {isLoginMode ? (
          <h3 className="auth-info">Enter your details to sign in to your account</h3>
        ) : (
          <h3 className="auth-info">Join us and start your journey!</h3>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
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
                placeholder="Enter your password"
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
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {isLoginMode && (
          <button className="button-google">
            <FaGoogle style={{ fontSize: '20px', marginRight: '10px' }} />
            Sign in with Google
          </button>
        )}

        <p className="form-toggle" onClick={handleToggleMode}>
          {isLoginMode ? (
            <span>New here? <strong>Join us today!</strong></span>
          ) : (
            <span>Already a member? <strong>Sign in here</strong></span>
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
