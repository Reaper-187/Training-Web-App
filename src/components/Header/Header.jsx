import React, { useContext, useState}  from 'react'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { CheckAuthContext } from "../../CheckAuthContext";
import axios from 'axios'


axios.defaults.withCredentials = true
const logOut = import.meta.env.VITE_API_LOGOUT

export const Header = () => {
  const { toggleAuthentication } = useContext(CheckAuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      const response = await axios.get(logOut)
      console.log('Das ist der ganze response',response);
      
      if (response.data.success) {
        console.log('You successfully logged out');
        toggleAuthentication(false)
        navigate('/login')
      }
    }catch (error) {
      console.error('Error on request for logout:', error);
    }
  } 

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
        <button className='logout-btn' method='GET' action="/logout" onClick={handleLogout}>
          <div className="box-3">
            <div className="btn nav-btn">
              <span>Log-out</span>
            </div>
          </div>
        </button>
      </ul>
    </nav>
  )
}