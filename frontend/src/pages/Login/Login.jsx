import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { handleAuthResponse } from "../../utils/api";

function LoginPageClean() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please make sure to fill all the fields");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");
      const response = await fetch("http://localhost:8002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

<<<<<<< HEAD
      // ✅ USE THE HELPER FUNCTION
      await handleAuthResponse(response);
      setMessage("Login successful!");
      navigate("/test");
      
=======
      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful!");
        navigate("/Form-Page"); // redirect on success
      } else {
        setMessage("Login failed!");
      }
>>>>>>> feed6377348f0c52828c1548a7e3264f231732da
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "Login failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-container">
        <div className="header-section-login">
          <div className="logo-wrapper-login">
            <div className="login-header-icon">
              <img src="/logoproxym.png" alt="Logo" className="logo-login" />
            </div>
          </div>
          <h1 className="page-title-login">Welcome Back</h1>
          <p className="page-subtitle-login">Sign in to access your account</p>
        </div>

        <div className="form-container-login">
          <form onSubmit={handleLogin} className="auth-form-login">
            <div className="form-group-login">
              <label htmlFor="email" className="form-label-login">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input-login"
                required
              />
            </div>

            <div className="form-group-login">
              <label htmlFor="password" className="form-label-login">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input-login"
                required
              />
            </div>

            {/* Options Row */}
            <div className="form-options-login">
              <div className="checkbox-group-login">
                <input
                  type="checkbox"
                  id="remember"
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
                onClick={() => console.log("Forgot password clicked")}
              >
                Forgot password?
              </button>
            </div>

            {message && (
              <div
                className={`login-message ${
                  message.toLowerCase().includes("success")
                    ? "login-message-success"
                    : message.toLowerCase().includes("error")
                    ? "login-message-error"
                    : "login-message-info"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-login btn-primary-login"
              disabled={submitting}
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>

            <div className="form-footer-login">
              <p className="footer-text-login">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="auth-link-login"
                >
                  Create account
                </button>
              </p>
            </div>
          </form>
        </div>

        <div className="page-footer-login">
          <p>Need assistance? Contact support team at support@portal.com</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPageClean;