import React from 'react'

import { CloseAdd } from './OpenCloseAddBtn/CloseAdd'
import { SelectScreen } from './SelectScreen/SelectScreen'


export const AddWorkoutScreen = ({onClose}) => {
  
  return (
    <div className='parentDiv'>
      <div className='addContainer'>
        <div className='closeBtn' onClick={() => onClose() }>
          <CloseAdd/>
        </div>
        <SelectScreen/>
      </div>
    </div>
  )
}
