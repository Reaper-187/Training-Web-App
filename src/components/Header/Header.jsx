import React, { useState }  from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { Logout } from '../Logout/Logout';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
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
        <div className='navRout'>

          <Link to="/dashboard">
            
              <div className="btn nav-btn">
                <span className='word' data-text="Dashboard">Dashboard</span>
              </div>
            
          </Link>

          <Link to="/workout">
            
              <div className="btn nav-btn">
              <span className='word'data-text="Workout">Workout</span>
              </div>
            
          </Link>

          <Link to="/blog">
            
              <div className="btn nav-btn">
              <span className='word'data-text="Blog">Blog</span>
              </div>
            
          </Link>

          <Link to="/contact">
            
              <div className="btn nav-btn">
                <span className='word'data-text="Contact">Contact</span>
              </div>
            
          </Link>

        </div>
        <Logout/>
      </ul>
    </nav>
  )
}