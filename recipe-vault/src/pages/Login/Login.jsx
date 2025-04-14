import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../features/recipes/recipeSlice';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, authStatus } = useSelector(state => state.recipes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 'auth/user-not-found':
        return "A user with this email does not exist.";
      case 'auth/wrong-password':
        return "Wrong password. Please try again.";
      case 'auth/too-many-requests':
        return "Too many attempts. Please try again later.";
      default:
        return "Error signing in. Please try again.";
    }
  };

  return (
    <div className="login-page">
      <div className="login-image">
        <div className="login-image-content">
          <h1>RecipeApp</h1>
          <p>Log in to your account to access your favorite recipes and culinary ideas.</p>
        </div>
      </div>
      <div className="login-container">
        <div className="login-header">
          <h2>Log in to your account</h2>
          <p>Please enter your login details.</p>
        </div>

        {error && (
          <div className="error-message">
            {getErrorMessage(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="forgot-password">
              <Link to="/login">Forgot password?</Link>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={authStatus === 'loading'}
            >
              {authStatus === 'loading' ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Login in progress...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt /> Log in
                </>
              )}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              className="google-login-btn"
              onClick={() => {
                console.log("Login with Google");
              }}
            >
              <FcGoogle /> Login with Google
            </button>
          </div>

          <div className="register-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;