import React, {useState}  from 'react'
import './Header.css'
import { Link } from 'react-router-dom'




export const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {

    // Zustand umschalten
    setIsMenuOpen(!isMenuOpen);
  };

  return(
    <nav>
      <div className="menu" id="menu" onClick={toggleMenu}>
        <div>
          <span className={isMenuOpen ? "stripe-1 active" : "stripe-1"}></span>
          <span className={isMenuOpen ? "stripe-2 active" : "stripe-2"}></span>
          <span className={isMenuOpen ? "stripe-3 active" : "stripe-3"}></span>
        </div>
      </div>

     
      <ul className={isMenuOpen ? "openNav" : ""} >
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li><Link to="/Workout">Workout</Link></li>
        <li><Link to="/Blog">Blogs</Link></li>
        <li><Link to="/Contact">Contact</Link></li>
      </ul>

    </nav>
  )
}