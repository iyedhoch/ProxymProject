import { useState } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      await axios.post("http://localhost:8002/api/auth/register", {
        fullName,
        email,
        password,
      });
      setMessage("User registered successfully!");
      navigate("/loog");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* Background */}
      <div className="register-bg-pattern" />
      <div className="register-orb register-orb-1" />
      <div className="register-orb register-orb-2" />
      <div className="register-orb register-orb-3" />

      <div className="register-container">
        {/* Header */}
        <div className="header-section-register">
          <div className="logo-wrapper-register">
            <div className="register-header-icon">
              <img src="/logoproxym.png" alt="Logo" className="logo-register" />
            </div>
          </div>
          <h1 className="page-title-register">Create Account</h1>
          <p className="page-subtitle-register">Join us and start your journey</p>
        </div>

        {/* Card */}
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
                minLength={6}
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
                minLength={6}
              />
            </div>

            {/* Terms (perfect baseline alignment; links don't toggle checkbox) */}
            <div className="terms-group-register">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="checkbox-register"
                required
              />
              <span className="terms-text-register">
                I agree to the{" "}
                <button
                  type="button"
                  className="terms-link-register"
                  onClick={() => console.log("Terms of Service clicked")}
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="terms-link-register"
                  onClick={() => console.log("Privacy Policy clicked")}
                >
                  Privacy Policy
                </button>
              </span>
            </div>

            {/* Feedback message */}
            {message && (
              <div
                className={`register-message ${
                  message.toLowerCase().includes("success")
                    ? "register-message-success"
                    : message.toLowerCase().includes("failed") ||
                      message.toLowerCase().includes("error")
                    ? "register-message-error"
                    : "register-message-info"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-register btn-primary-register"
              disabled={!agreeToTerms || submitting}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>

            {/* Footer */}
            <div className="form-footer-register">
              <p className="footer-text-register">
                Already have an account?{" "}
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

        {/* Page footer */}
        <div className="page-footer-register">
          <p>Need assistance? Contact support team at support@portal.com</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPageClean;
