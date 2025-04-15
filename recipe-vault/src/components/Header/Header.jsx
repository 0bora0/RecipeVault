import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setCategoryFilter, logoutUser } from "../../features/recipes/recipeSlice";
import { FaHome, FaUtensils, FaHeart, FaUser, FaSearch, FaBars, FaTimes, FaSignOutAlt, FaEdit } from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import "./Header.css";

const CATEGORIES = [
  "italian",
  "asian",
  "mexican",
  "american",
  "mediterranean",
  "vegetarian",
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useSelector(state => state.recipes);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleCategoryChange = (e) => {
    dispatch(setCategoryFilter(e.target.value));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setShowProfileMenu(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
      setShowProfileMenu(false);
      setMobileMenuOpen(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <GiCookingPot className="logo-icon" />
            <span className="logo-text">RecipeVault</span>
          </Link>
        </div>

        {isMobile && (
          <button 
            className="mobile-menu-button" 
            onClick={toggleMobileMenu} 
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        <div className={`nav-search-container ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="main-nav">
            <NavLink to="/" className="nav-link" activeclassname="active" end onClick={closeMobileMenu}>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/my-recipes" className="nav-link" activeclassname="active" onClick={closeMobileMenu}>
                  <FaUtensils className="nav-icon" />
                  <span>User's Recipes</span>
                </NavLink>
                <NavLink to="/favorites" className="nav-link" activeclassname="active" onClick={closeMobileMenu}>
                  <FaHeart className="nav-icon" />
                  <span>Favorites</span>
                </NavLink>
                <NavLink to="/profile-edit" className="nav-link" activeclassname="active" onClick={closeMobileMenu}>
                  <FaEdit className="nav-icon" />
                  <span>Edit profile</span>
                </NavLink>
              </>
            )}
          </nav>

          <div className="search-filter-container">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  aria-label="Search recipes"
                />
                <button onClick={handleSearch} className="search-button" aria-label="Search">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="filter-container">
              <select
                onChange={handleCategoryChange}
                defaultValue=""
                className="category-select"
                aria-label="Filter by category"
              >
                <option value="">All Cuisines</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="auth-section">
            {currentUser ? (
              <>
                <div className="profile-section">
                  <div 
                    className="profile-info"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-haspopup="true"
                    aria-expanded={showProfileMenu}
                  >
                    <div className="profile-avatar">
                      {userData?.profilePicture ? (
                        <img 
                          src={userData.profilePicture} 
                          alt={userData.displayName || 'User'} 
                          className="avatar-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="avatar-initial">
                          {(userData?.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {!isMobile && (
                      <span className="profile-name">
                        {userData?.name || 'Loading...'}
                      </span>
                    )}
                  </div>

                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <NavLink
                        to="/profile-edit"
                        className="dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          closeMobileMenu();
                        }}
                      >
                        <FaUser className="dropdown-icon" />
                        <span>Edit Profile</span>
                      </NavLink>
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="dropdown-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {isMobile && (
                  <button 
                    className="mobile-logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                )}
              </>
            ) : (
              <NavLink
                to="/login"
                className="nav-link login-link"
                activeclassname="active"
                onClick={closeMobileMenu}
              >
                <FaUser className="nav-icon" />
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}