import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setCategoryFilter, logoutUser } from "../../features/recipes/recipeSlice";
import { FaHome, FaUtensils, FaHeart, FaUser, FaSearch, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi";
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
  const { currentUser } = useSelector(state => state.recipes);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryChange = (e) => {
    dispatch(setCategoryFilter(e.target.value));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <GiCookingPot className="logo-icon" />
            <span className="logo-text">RecipeVault</span>
          </Link>
        </div>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-search-container ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="main-nav">
            <NavLink to="/" className="nav-link" activeclassname="active" end>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/my-recipes" className="nav-link" activeclassname="active">
                  <FaUtensils className="nav-icon" />
                  <span>My Recipes</span>
                </NavLink>
                <NavLink to="/favorites" className="nav-link" activeclassname="active">
                  <FaHeart className="nav-icon" />
                  <span>Favorites</span>
                </NavLink>
              </>
            )}
          </nav>

          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipes..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button onClick={handleSearch} className="search-button">
                <FaSearch />
              </button>
            </div>

            <select
              onChange={handleCategoryChange}
              defaultValue=""
              className="category-select"
            >
              <option value="">All Cuisines</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {currentUser ? (
            <div className="profile-section">
              <div 
                className="profile-info"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="avatar-image"
                    />
                  ) : (
                    <span className="avatar-initial">
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span className="profile-name">
                  {currentUser.displayName || 'User'}
                </span>
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <NavLink
                    to="/profile-edit"
                    className="dropdown-item"
                    onClick={() => setShowProfileMenu(false)}
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
          ) : (
            <NavLink
              to="/login"
              className="nav-link login-link"
              activeclassname="active"
            >
              <FaUser className="nav-icon" />
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}