import { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

function LoginPageClean(/*{ onNavigateToRegister }*/) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    if (!email || !password) {
      setMessage("Please make sure to fill all the fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:8002/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful!");
      } else {
        setMessage("Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error");
    }

  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header Section */}
        <div className="header-section-login">
          <div className="logo-wrapper-login">
            <img 
              src="/logoproxym.png" 
              alt="Logo" 
              className="logo-login"
            />
          </div>
          <h1 className="page-title-login">Welcome Back</h1>
          <p className="page-subtitle-login">Sign in to access your account</p>
        </div>

        {/* Login Form Container */}
        <div className="form-container-login">
          <form onSubmit={handleLogin} className="auth-form-login">
            {/* Email Field */}
            <div className="form-group-login">
              <label htmlFor="email" className="form-label-login">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input-login"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group-login">
              <label htmlFor="password" className="form-label-login">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input-login"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options-login">
              <div className="checkbox-group-login">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-login"
                />
                <label htmlFor="remember" className="checkbox-label-login">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="forgot-link-login"
                onClick={() => console.log('Forgot password clicked')}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" className="btn-login btn-primary" onClick={()=>navigate("/test")}>
              Sign In
            </button>

            {/* Register Link */}
            <div className="form-footer-login">
              <p className="footer-text-login">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={()=>navigate("/test2_register")}
                  className="auth-link-login"
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="page-footer-login">
          <p>Need assistance? Contact support team at support@portal.com</p>
        </div>
      </div>
    </div>
  );
};
export default LoginPageClean;