import React, {useState, useContext}  from 'react'
import './SelectScreen.css'

import { WorkoutContext } from '../../../../../WorkoutContext';


export const SelectScreen = () => {

  const [typeOfTraining, setTypeOfTraining] = useState(null);

  const { addWorkout } = useContext(WorkoutContext);

  const [selectedWorkoutValue, setSelectedWorkoutValue] = useState("");

  const [safeSelected, setSafeSelected] = useState([])

  const handleAddWorkout = (selectedWorkout) => {
    setSafeSelected([...safeSelected, selectedWorkout])
  }


  function displayOptions() {
    if (typeOfTraining === 'Cardio') {
      return (
      <div className='displayOptions'>

        <div>
          <h4>Type of Training</h4>
          <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
            <option value="Lafuband">Laufband</option>
            <option value="Stepper">Stepper</option>
            <option value="Seilspringen">Seilspringen</option>
            <option value="Fahrrad">Fahrrad</option>
            <option value="Rudern">Rudern</option>
          </select>
        </div>

        <div >
          <h5>Time</h5>
          <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
            <option value="5">+5 min</option>
            <option value="10">+10 min</option>
            <option value="15">+15 min</option>
            <option value="30">+30 min</option>
            <option value="45">+45 min</option>
            <option value="1">+1 h</option>
          </select>
        </div>
        <a className='addWorkoutBtn' onClick={() => handleAddWorkout(selectedWorkoutValue)}><span>Add to!</span></a>
        </div>
      );
    } else if (typeOfTraining === 'Krafttraining') {
      return (
        <div className='displayOptions'>
          <div>
            <h4>Type of Training</h4>
            <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
              <option value="Bankdrücken">Bankdrücken</option>
              <option value="Schrägbankdrücken">Schrägbankdrücken</option>
              <option value="Brustprässe">Brustprässe</option>
              <option value="Hammer">Hammer</option>
              <option value="Butterfly">Butterfly</option>
              <option value="Squads">Squads</option>
              <option value="Beinpresse">Beinpresse</option>
            </select>
          </div>
          <div>
            <h4>Gewicht</h4>
            <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
              <option value="5">5 kg</option>
              <option value="10">10 kg</option>
              <option value="15">15 kg</option>
              <option value="20">20 kg</option>
            </select>
          </div>
        
          <a className='addWorkoutBtn' onClick={() => handleAddWorkout(selectedWorkoutValue)}><span>Add to!</span></a>
        
        </div>
      );
    }
    return null; //wenn nichts dann nichts
  }

  

  return (
    <>
      <h2>Add Workout</h2>
        <div>
          <h4>What did you do</h4>
          <select onChange={(e) => setTypeOfTraining(e.target.value)}>
            <option value="">-</option>
            <option value="Cardio">Cardio</option>
            <option value="Krafttraining">Krafttraining</option>
          </select>      
          {displayOptions()}
        </div>
    </>
  )
}