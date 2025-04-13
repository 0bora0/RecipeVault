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
    if (file.size > 2 * 1024 * 1024) {
      setError("The photo must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setPreviewImage(reader.result);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords do not match!");
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength < 3) {
      setError("The password is too weak. Use at least 8 characters, including uppercase letters and numbers.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
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
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error.message);
      if (error.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak. Use at least 8 characters, including uppercase letters and numbers.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("An error occurred while registering. Please try again.");
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
          <h2><FaSignInAlt /> Create your account</h2>
          <p>Join our community</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">
              <MdDriveFileRenameOutline /> Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">
              <MdDriveFileRenameOutline /> Last name*
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Your last name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Username*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
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
              <MdPassword /> Conifirm password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Conifirm password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">
              <FaImage /> Profile picture
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
                <i className="bi bi-image"></i> {previewImage ? "Change photo" : "Choose photo"}
              </label>
              <small className="form-hint">Max size 2 MB</small>
            </div>
            
            {previewImage && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img 
                    src={previewImage} 
                    alt="Preview Image" 
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewImage(null);
                      setProfilePicture(null);
                    }}
                    className="remove-image-btn"
                    aria-label="Remove image"
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
                  <span>REgistration in progress...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt /> Create your account
                </>
              )}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;