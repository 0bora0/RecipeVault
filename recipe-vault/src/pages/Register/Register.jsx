import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaImage, FaSignInAlt } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdPassword } from "react-icons/md";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Проверка за сила на паролата
    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка за размер на файла (макс. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Снимката трябва да е по-малка от 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setPreviewImage(reader.result);
    };
    reader.onerror = () => {
      setError("Грешка при прочитане на файла");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Валидации
    if (formData.password !== formData.confirmPassword) {
      setError("Паролите не съвпадат!");
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength < 3) {
      setError("Паролата е твърде слаба. Използвайте поне 8 символа, включително главни букви и цифри.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Създаване на потребител в Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Запазване на допълнителни данни във Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: formData.name,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        profilePicture,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      // Пренасочване след успешна регистрация
      navigate("/dashboard");
    } catch (error) {
      console.error("Грешка при регистрация:", error.message);
      // Превод на често срещани грешки
      if (error.code === "auth/email-already-in-use") {
        setError("Този email адрес вече се използва.");
      } else if (error.code === "auth/weak-password") {
        setError("Паролата е твърде слаба.");
      } else if (error.code === "auth/invalid-email") {
        setError("Невалиден email адрес.");
      } else {
        setError("Възникна грешка при регистрация. Моля, опитайте отново.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#ff4d4d", "#ff7b25", "#ffbb33", "#a5d610", "#00c851"];
    return colors[passwordStrength - 1] || "#ff4d4d";
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h2><FaSignInAlt /> Създайте своя профил</h2>
          <p>Присъединете се към нашата общност</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">
              <MdDriveFileRenameOutline /> Име*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Въведете вашето име"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">
              <MdDriveFileRenameOutline /> Фамилия*
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Въведете вашата фамилия"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Потребителско име*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Изберете потребителско име"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email адрес*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Въведете вашия email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Парола*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Създайте парола"
              required
              minLength="6"
            />
            <div className="password-strength">
              <div 
                className="strength-meter"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getPasswordStrengthColor()
                }}
              ></div>
              <div className="strength-labels">
                <span style={{ color: passwordStrength >= 1 ? getPasswordStrengthColor() : "#ccc" }}>Слаба</span>
                <span style={{ color: passwordStrength >= 3 ? getPasswordStrengthColor() : "#ccc" }}>Средна</span>
                <span style={{ color: passwordStrength >= 5 ? getPasswordStrengthColor() : "#ccc" }}>Силна</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <MdPassword /> Потвърдете паролата*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Потвърдете паролата"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">
              <FaImage /> Профилна снимка
            </label>
            <div className="file-input-container">
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="profilePicture" className="file-input-label">
                <i className="bi bi-image"></i> {previewImage ? "Смяна на снимка" : "Изберете снимка"}
              </label>
              <small className="form-hint">Макс. размер: 2MB</small>
            </div>
            
            {previewImage && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Преглед на профилната снимка" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewImage(null);
                      setProfilePicture(null);
                    }}
                    className="remove-image-btn"
                    aria-label="Премахни снимка"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-footer">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span>Регистриране...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt /> Регистрация
                </>
              )}
            </button>

            <div className="login-link">
              Вече имате акаунт? <Link to="/login">Влезте от тук</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;