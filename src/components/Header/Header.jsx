import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { Logout } from '../Logout/Logout';
import { FaSun, FaMoon } from "react-icons/fa";

export const Header = () => {
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null); // Referenz für die Navbar

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Schließe die Navbar, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Event-Listener hinzufügen
    document.addEventListener("mousedown", handleClickOutside);

    // Event-Listener aufräumen
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav ref={navRef}>
      <div className="menu" id="menu" onClick={toggleMenu}>
        <div>
          <span className={isMenuOpen ? "stripe-1 active" : "stripe-1"}></span>
          <span className={isMenuOpen ? "stripe-2 active" : "stripe-2"}></span>
          <span className={isMenuOpen ? "stripe-3 active" : "stripe-3"}></span>
        </div>
      </div>

      <ul className={isMenuOpen ? "openNav active" : "openNav"}>
        <div className='navRout'>
          <Link to="/dashboard" onClick={closeMenu}>
            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/dashboard' ? 'active' : ''}`} data-text="Dashboard">Dashboard</span>
            </div>
          </Link>

          <Link to="/workout" onClick={closeMenu}>
            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/workout' ? 'active' : ''}`} data-text="Workout">Workout</span>
            </div>
          </Link>

          <Link to="/blog" onClick={closeMenu}>
            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/blog' ? 'active' : ''}`} data-text="Blog">Blog</span>
            </div>
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/contact' ? 'active' : ''}`} data-text="Contact">Contact</span>
            </div>
          </Link>

          <Logout />

          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </ul>
    </nav>
  );
};