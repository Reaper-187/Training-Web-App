import React, { useContext }  from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckAuthContext } from "../../CheckAuthContext";
import axios from 'axios';


axios.defaults.withCredentials = true

const logOut = import.meta.env.VITE_API_LOGOUT


export const Logout = () => {
  const { toggleAuthentication } = useContext(CheckAuthContext);

  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      const response = await axios.get(logOut)      
      if (response.data.success) {
        console.log('You successfully logged out');
        toggleAuthentication(false)
        navigate('/login')
      }
    }catch (error) {
      console.error('Error on request for logout:', error);
    }
  } 


  return (
    <button className='logout-btn' method='GET' action="/logout" onClick={handleLogout}>
      <div className="btn nav-btn">
        <span className='word'data-text="Logout">Logout</span>
      </div>
    </button>
  )
}
