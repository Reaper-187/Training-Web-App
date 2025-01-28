import React, { useState, useEffect } from 'react'
import './Header.css'
import { Link, useLocation } from 'react-router-dom'
import { Logout } from '../Logout/Logout';
import { FaSun, FaMoon } from "react-icons/fa";


export const Header = () => {


  const [theme, setTheme] = useState("light");

  // Lade den gespeicherten Modus oder setze das Standard-Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Wechseln des Modus
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };



  const location = useLocation(); // Erhalte den aktuellen Pfad

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="menu" id="menu" onClick={toggleMenu}>
        <div>
          <span className={isMenuOpen ? "stripe-1 active" : "stripe-1"}></span>
          <span className={isMenuOpen ? "stripe-2 active" : "stripe-2"}></span>
          <span className={isMenuOpen ? "stripe-3 active" : "stripe-3"}></span>
        </div>

      </div>


      <ul className={isMenuOpen ? "openNav" : ""} >
        <div className='navRout'>

          <Link to="/dashboard">

            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/dashboard' ? 'active' : ''}`} data-text="Dashboard">Dashboard</span>
            </div>

          </Link>

          <Link to="/workout">

            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/workout' ? 'active' : ''}`} data-text="Workout">Workout</span>
            </div>

          </Link>

          <Link to="/blog">

            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/blog' ? 'active' : ''}`} data-text="Blog">Blog</span>
            </div>

          </Link>

          <Link to="/contact">

            <div className="btn nav-btn">
              <span className={`word ${location.pathname === '/contact' ? 'active' : ''}`} data-text="Contact">Contact</span>
            </div>

          </Link>

        </div>
        
        <Logout />

        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </ul>


    </nav>
  )
}