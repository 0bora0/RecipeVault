import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setSearchQuery,
  setCategoryFilter,
} from "../../features/recipes/recipeSlice";

import {
  FaHome,
  FaUtensils,
  FaHeart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
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
  const [localSearch, setLocalSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
  };

  const handleCategoryChange = (e) => {
    dispatch(setCategoryFilter(e.target.value));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation and Search - Wrapped for mobile */}
        <div className={`nav-search-container ${mobileMenuOpen ? "open" : ""}`}>
          <nav className="main-nav">
            <NavLink to="/" className="nav-link" activeClassName="active" exact>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/my-recipes"
              className="nav-link"
              activeClassName="active"
            >
              <FaUtensils className="nav-icon" />
              <span>My Recipes</span>
            </NavLink>
            <NavLink
              to="/favorites"
              className="nav-link"
              activeClassName="active"
            >
              <FaHeart className="nav-icon" />
              <span>Favorites</span>
            </NavLink>
            <NavLink
              to="/profile-edit"
              className="nav-link"
              activeClassName="active"
            >
              <FaUser className="nav-icon" />
              <span>Edit Profile</span>
            </NavLink>
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

          
        </div>
      </div>
    </header>
  );
}
