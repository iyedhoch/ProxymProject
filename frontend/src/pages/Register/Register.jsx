import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { handleAuthResponse } from "../../utils/api";

function RegisterPageClean() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }
  if (!agreeToTerms) {
    setMessage("Please agree to the terms and conditions.");
    return;
  }

  try {
    setSubmitting(true);
    setMessage("");
    
    console.log("Attempting to connect to backend...");
    
    const response = await fetch("http://localhost:8002/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fullName, email, password }),
    }).catch(networkError => {
      console.error("Network error:", networkError);
      throw new Error("Cannot connect to server. Please make sure the backend is running on port 8002.");
    });

    console.log("Response received, status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem('authToken', data.token);
    setMessage("Registration successful!");
    navigate("/Form-Page");
    
  } catch (error) {
    console.error("Registration error:", error);
    setMessage(error.message || "Registration failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="register-page">
      <div className="register-bg-pattern" />
      <div className="register-orb register-orb-1" />
      <div className="register-orb register-orb-2" />
      <div className="register-orb register-orb-3" />

      <div className="register-container">
        <div className="header-section-register">
          <div className="logo-wrapper-register">
            <div className="register-header-icon">
              <img src="/logoproxym.png" alt="Logo" className="logo-register" />
            </div>
          </div>
          <h1 className="page-title-register">Create Account</h1>
          <p className="page-subtitle-register">Join us to get started with your internship journey</p>
        </div>

        <div className="form-container-register">
          <form onSubmit={handleSubmit} className="auth-form-register">
            <div className="form-group-register">
              <label htmlFor="fullName" className="form-label-register">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input-register"
                required
              />
            </div>

            <div className="form-group-register">
              <label htmlFor="email" className="form-label-register">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input-register"
                required
              />
            </div>

            <div className="form-group-register">
              <label htmlFor="password" className="form-label-register">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="form-input-register"
                required
              />
            </div>

            <div className="form-group-register">
              <label htmlFor="confirmPassword" className="form-label-register">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-input-register"
                required
              />
            </div>

            <div className="form-options-register">
              <div className="checkbox-group-register">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="checkbox-register"
                />
                <label htmlFor="agreeToTerms" className="checkbox-label-register">
                  I agree to the Terms and Conditions
                </label>
              </div>
            </div>

            {message && (
              <div
                className={`register-message ${
                  message.toLowerCase().includes("success")
                    ? "register-message-success"
                    : "register-message-error"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-register btn-primary-register"
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className="form-footer-register">
              <p className="footer-text-register">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="auth-link-register"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="page-footer-register">
          <p>Need assistance? Contact support team at support@portal.com</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPageClean;