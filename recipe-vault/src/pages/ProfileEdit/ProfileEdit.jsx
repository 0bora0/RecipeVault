import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaTimes } from 'react-icons/fa';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function ProfileEdit() {
  const [userData, setUserData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          if (docSnap.data().profilePicture) {
            setPreviewImage(docSnap.data().profilePicture);
          }
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...userData,
        ...(profileImage && { profilePicture: profileImage }),
        updatedAt: new Date()
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-edit-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-edit-page">
              <Header />
    <div className="profile-edit-container">
      <div className="profile-edit-card">
        <div className="profile-header">
          <h2><FaUser /> Edit Profile</h2>
          <button onClick={() => navigate(-1)} className="close-button">
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <i className="bi bi-check-circle"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-image-section">
            <div className="image-preview-container">
              <div className="image-preview">
                <img 
                  src={previewImage || '/images/default-profile.png'} 
                  alt="Profile preview" 
                />
              </div>
              <div className="image-upload-controls">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="profileImage" className="upload-button">
                  Change Photo
                </label>
                {previewImage && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewImage(null);
                      setProfileImage(null);
                    }}
                    className="remove-button"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <MdDriveFileRenameOutline /> First Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname">
                <MdDriveFileRenameOutline /> Last Name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <FaPhone /> Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FaMapMarkerAlt /> Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={userData.bio || ''}
                onChange={handleChange}
                rows="4"
                maxLength="200"
              />
              <small className="char-count">{userData.bio?.length || 0}/200</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              <FaSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </div>
  );
}