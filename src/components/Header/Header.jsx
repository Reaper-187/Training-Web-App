import React, {useState}  from 'react'
import './Header.css'
import { Link } from 'react-router-dom'




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
            <div className="box-3">
              <div className="btn nav-btn">
                Dashboard
              </div>
            </div>
          </Link>

          <Link to="/workout">
            <div className="box-3">
              <div className="btn nav-btn">
                Workout
              </div>
            </div>
          </Link>

          <Link to="/blog">
            <div className="box-3">
              <div className="btn nav-btn">
                Blog
              </div>
            </div>
          </Link>

          <Link to="/contact">
            <div className="box-3">
              <div className="btn nav-btn">
                Contact
              </div>
            </div>
          </Link>

        </div>
        <form type='submit' method='POST' action="/logut?_method=DELETE">
          <div className="box-3">
            <div className="btn nav-btn">
              <span>Log-out</span>
            </div>
          </div>
        </form>
      </ul>
    </nav>
  )
}