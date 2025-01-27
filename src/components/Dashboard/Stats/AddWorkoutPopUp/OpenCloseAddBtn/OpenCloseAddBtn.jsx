import React from 'react'
import './open-close.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const OpenAdd = () => {
  return (
    <>
      <button className="add-btn">Add your Workout</button>

      <span className='responsive-add-btn'>
        <AddCircleIcon  className='add-btn'/>
      </span>

    </>
  )
}

export const CloseAdd = () => {
  return (
    <div className="close-container">
      <div className="leftright"></div>
      <div className="rightleft"></div>
      <label className="close">close</label>
    </div>

  )
}
