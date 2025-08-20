import { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


function RegisterPageClean(/*onNavigateToLogin*/ ) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8002/api/auth/register', {
        fullName,
        email,
        password
      });

      console.log('Response:', response.data);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Registration failed. Check console for details.');
    }


    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    console.log('Registration attempt:', { fullName, email, password });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Header Section */}
        <div className="header-section-register">
          <div className="logo-wrapper-register">
            <img 
              src="/logoproxym.png" 
              alt="Logo" 
              className="logo-register"
            />
          </div>
          <h1 className="page-title-register">Create Account</h1>
          <p className="page-subtitle-register">Join us and start your journey</p>
        </div>

        {/* Register Form Container */}
        <div className="form-container-register">
          <form onSubmit={handleSubmit} className="auth-form-register">
            {/* Full Name Field */}
            <div className="form-group-register">
              <label htmlFor="fullName" className="form-label-register">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input-register"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group-register">
              <label htmlFor="email" className="form-label-register">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input-register"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group-register">
              <label htmlFor="password" className="form-label-register">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="form-input-register"
                required
                minLength="6"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group-register">
              <label htmlFor="confirmPassword" className="form-label-register">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-input-register"
                required
                minLength="6"
              />
            </div>

            {/* Terms Agreement */}
            <div className="terms-group-register">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="checkbox-register"
                required
              />

              
              <label htmlFor="terms" className="terms-label-register">
                I agree to the{' '}
              </label>
              <button
                  type="button"
                  className="terms-link-register"
                  //onClick={() => console.log('Terms clicked')}
                  onClick={(e) => {e.stopPropagation();}}
                >
                Terms of Service
                </button>
                <label htmlFor="terms" className="terms-label-register">
                  {' '}and{' '}
                </label>
                <button
                  type="button"
                  className="terms-link-register"
                  onClick={() => console.log('Privacy policy clicked')}
                >
                  Privacy Policy
                </button>
            </div>

            {/* Register Button */}
            <button 
              type="submit" 
              className="btn-register btn-secondary"
              disabled={!agreeToTerms}
            >
              Create Account
            </button>

            {/* Login Link */}
            <div className="form-footer-register">
              <p className="footer-text-register">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/loog")}
                  className="auth-link-register"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="page-footer-register">
          <p>Need assistance? Contact support team at support@portal.com</p>
        </div>
      </div>
    </div>
  );
}
export default RegisterPageClean;