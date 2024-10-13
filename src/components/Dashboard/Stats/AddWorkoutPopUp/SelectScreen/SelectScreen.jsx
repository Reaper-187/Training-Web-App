import React, {useState, useContext}  from 'react'
import {ToastContainer, toast} from 'react-toastify'
import { WorkoutContext, CaloriesContext, PieCountContext } from '../../../../../WorkoutContext';
import { fetchCalories } from '../../../../../apiService';
import { calculateStrengthCalories } from '../../../../../strengthService';
import 'react-toastify/dist/ReactToastify.css';
import './SelectScreen.css'


export const SelectScreen = () => {

  // const [currentId, setCurrentId] = useState(1)
  const [typeOfTraining, setTypeOfTraining] = useState(null);
  const [selectedMuscleValue, setSelectedMuscleValue] = useState("");

  const { addWorkout } = useContext(WorkoutContext);
  
  const { setCurrentId } = useContext(WorkoutContext);
  
  const { updateCalories } = useContext(CaloriesContext);

  const { increasePieCount } = useContext(PieCountContext);
  
  const [selectedWorkoutValue, setSelectedWorkoutValue] = useState("");
  const [setsValue, setSetsValue] = useState("");
  const [repsValue, setRepsValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [timeValue, setTimeValue] = useState("")

  
  
  const notify = (isValid) => {
    if (isValid) {
      toast("💪Your Workout has been added💪",{ type: "success"});
      
    } else {
      toast("pleas fill up all fields",{type: 'error'});
      
    }
  }
  
  const handleAddWorkout = async () => {

    setCurrentId((prevId) => prevId + 1);

    const workoutData = {
      id: setCurrentId + 1,
      type: typeOfTraining,
      name: selectedMuscleValue,
      exsize: selectedWorkoutValue,
      sets: setsValue,
      reps: repsValue,
      weight: weightValue || '-',
      time: timeValue || '-',
    };
  
    let caloriesData;
    let caloriesBurned;
    let muscleGroup = workoutData.name
    console.log(muscleGroup);
    
    
    if (typeOfTraining === 'Cardio') {
      caloriesData = await fetchCalories(`${selectedMuscleValue} for ${timeValue} minutes.`);
      const apiCalories = caloriesData.exercises[0].nf_calories;
      updateCalories(apiCalories);
    } else {
      caloriesBurned = calculateStrengthCalories(weightValue, setsValue, repsValue)
      updateCalories(caloriesBurned)      
    }
  
    if (caloriesData || caloriesBurned) {
      addWorkout({ ...workoutData, calories: caloriesData, caloriesBurned});
      increasePieCount(muscleGroup)
    } else {
      console.log('Fehler bei Kalorienberechnung');
    }
  };
  

  function displayOptions() {
    if (typeOfTraining === 'Cardio') {

      const checkIfFieldEmpty = () => {
        if (selectedMuscleValue !== "" && timeValue !== "") {
          handleAddWorkout(selectedMuscleValue);
          return true
        } else {
          return false
        }
      };

      return (
      <div className='displayOptions'>

        <div>
          <h4>Type of Training</h4>
          <select className='cardioTrainings' onChange={(e) => setSelectedMuscleValue(e.target.value)}>
            <option value=""></option>
            <option value="running">running</option>
            <option value="Stepper">Stepper</option>
            <option value="Seilspringen">Seilspringen</option>
            <option value="Fahrrad">Fahrrad</option>
            <option value="Rudern">Rudern</option>
          </select>
        </div>

        <div >
          <h5>Time</h5>
          <div className='cardioTrainings' onChange={(e) => setTimeValue(e.target.value)}>
            <input type="number" value={timeValue} onInput={e => setTimeValue(e.target.value)} />   
          </div>
        </div>
        <a className='addWorkoutBtn' onClick={() =>{const isValid = checkIfFieldEmpty();notify(isValid);handleAddWorkout()}}><span>Add to!</span></a>
        <ToastContainer/>
        </div>
      );
    } else if (typeOfTraining === 'Krafttraining') {

      const checkIfFieldEmpty = () => {
        if (
          selectedMuscleValue !== "" &&
          selectedWorkoutValue !== "" &&
          weightValue !== "" &&
          repsValue !== "" &&
          setsValue !== "" 
        ) {
          handleAddWorkout(selectedMuscleValue);
          return true;
        } else {
          return false
        }
      };
      return (
        <div className='displayOptions'>
          <div>
            <h4>Type of Muscle</h4>
            <select className='cardioTrainings' onChange={(e) => setSelectedMuscleValue(e.target.value)}>
              <option value=""></option>
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Biceps">Biceps</option>
              <option value="Triceps">Triceps</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Booty">Booty</option>
              <option value="Abs">Abs</option>
            </select>
          </div>
          <div>
            <h4>Type of Training</h4>
            <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
              <option value=""></option>
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
            <div className='cardioTrainings' onChange={(e) => setWeightValue(e.target.value)}>
              <input type="number" value={weightValue} onInput={e => setWeightValue(e.target.value)} />
            </div>
          </div>

          <div>
            <h4>Reps</h4>
            <select className='cardioTrainings' onChange={(e) => setRepsValue(e.target.value)}>
              <option value=""></option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        
          <div>
            <h4>Sets</h4>
            <select className='cardioTrainings' onChange={(e) => setSetsValue(e.target.value)}>
              <option value=""></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>
        
          <a className='addWorkoutBtn' onClick={() =>{const isValid = checkIfFieldEmpty();notify(isValid);handleAddWorkout()}}><span>Add to!</span></a>
          <ToastContainer/>
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
};