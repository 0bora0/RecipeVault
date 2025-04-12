import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import '../Header/Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Начало', path: '/home' },
    { name: 'Рецепти', path: '/recipes' },
    { name: 'Любими', path: '/favorites' },
    { name: 'Мои рецепти', path: '/my-recipes' },
    { name: 'Добави рецепт', path: '/add-recipe' },
  ];

  return (
    <header className={`gourmet-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Logo */}
        <div className="header-logo-wrapper">
          <Link to="/" className="header-logo">
            Gourmet<span>.</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active-link' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="header-icons">
          <button className="header-icon">
            <FaSearch />
          </button>
          <button className="header-icon">
            <FaUser />
          </button>
          <button className="header-icon">
            <FaHeart />
          </button>
          <button className="header-icon cart-icon">
            <FaShoppingBag />
            <span className="cart-badge">3</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="mobile-nav-link"
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <div className="mobile-icons">
          <FaSearch className="header-icon" />
          <FaUser className="header-icon" />
          <FaHeart className="header-icon" />
          <FaShoppingBag className="header-icon" />
        </div>
      </div>
    </header>
  );
}
