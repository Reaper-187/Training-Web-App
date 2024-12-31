import React from 'react'

import { CloseAdd } from './OpenCloseAddBtn/OpenCloseAddBtn'
import { SelectScreen } from './SelectScreen/SelectScreen'


export const AddWorkoutScreen = ({onClose}) => {
  
  return (
    
    <div className='addContainer'>
      <div className='closeBtn' onClick={() => onClose() }>
        <CloseAdd/>
      </div>
      <SelectScreen/>
    </div>
    
  )
}
