import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from '../../services/firebaseConfig';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/my-recipes");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/user-not-found") {
        setError("Потребител с този email не съществува");
      } else if (err.code === "auth/wrong-password") {
        setError("Грешна парола. Моля, опитайте отново.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Твърде много опити. Моля, опитайте по-късно.");
      } else {
        setError("Грешка при влизане. Моля, опитайте отново.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Left Side - Full Page Image Section */}
      <div className="login-image">
        <div className="login-image-content">
          <h1>Добре дошли в RecipeApp</h1>
          <p>Влезте в своя акаунт, за да получите достъп до вашите любими рецепти и кулинарни идеи.</p>
        </div>
      </div>

      {/* Right Side - Full Page Form Section */}
      <div className="login-container">
        <div className="login-header">
          <h2><FaSignInAlt /> Влезте в профила си</h2>
          <p>Моля, въведете вашите данни за вход</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email адрес
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Въведете вашия email"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Парола
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Въведете вашата парола"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Скрий парола" : "Покажи парола"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="forgot-password">
              <Link to="/forgot-password">Забравена парола?</Link>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Влизане...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt /> Вход
                </>
              )}
            </button>

            <div className="divider">
              <span>или</span>
            </div>

            <button 
              type="button" 
              className="google-login-btn"
              onClick={() => {
                console.log("Login with Google");
              }}
            >
              <FcGoogle /> Вход с Google
            </button>
          </div>

          <div className="register-link">
            Нямате акаунт? <Link to="/register">Регистрирайте се</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;