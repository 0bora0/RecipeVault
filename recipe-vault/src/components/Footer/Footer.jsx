import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <GiCookingPot className="footer-logo-icon" />
            <span>RecipeVault</span>
          </Link>
          <p className="footer-tagline">Discover, create and share your culinary masterpieces</p>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaPinterest /></a>
            <a href="#" className="social-link"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h3 className="links-title">Explore</h3>
            <Link to="/" className="footer-link">All Recipes</Link>
            <Link to="/" className="footer-link">Categories</Link>
            <Link to="/" className="footer-link">Popular</Link>
            <Link to="/" className="footer-link">Seasonal</Link>
          </div>
          
          <div className="links-column">
            <h3 className="links-title">Community</h3>
            <Link to="/" className="footer-link">Blog</Link>
            <Link to="/" className="footer-link">Forums</Link>
            <Link to="/" className="footer-link">Contribute</Link>
            <Link to="/" className="footer-link">Events</Link>
          </div>
          
          <div className="links-column">
            <h3 className="links-title">Company</h3>
            <Link to="/" className="footer-link">About Us</Link>
            <Link to="/" className="footer-link">Contact</Link>
            <Link to="/" className="footer-link">Privacy Policy</Link>
            <Link to="/" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RecipeVault. All rights reserved.</p>
      </div>
    </footer>
  );
}