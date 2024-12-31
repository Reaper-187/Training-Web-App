import React, {useState, useContext}  from 'react'
import {ToastContainer, toast} from 'react-toastify'
import { WorkoutContext, CaloriesContext, BarChartContext, PieCountContext } from '../../../../../WorkoutContext';
import { fetchCalories } from '../../../../../apiService';
import { calculateStrengthCalories } from '../../../../../strengthService';
import 'react-toastify/dist/ReactToastify.css';
import './SelectScreen.css'

export const SelectScreen = () => {

  const [typeOfTraining, setTypeOfTraining] = useState(null);
  const [selectedMuscleValue, setSelectedMuscleValue] = useState("");

  const { addWorkout } = useContext(WorkoutContext);

  const { notifyWorkoutAdded } = useContext(PieCountContext);
  
  const { increaseCalories } = useContext(CaloriesContext);

  const { increaseCaloriesForDay } = useContext(BarChartContext);
  
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
    const workoutData = {
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

    if (typeOfTraining === 'Cardio') {
      caloriesData = await fetchCalories(`${selectedWorkoutValue} for ${timeValue} minutes.`);
      const apiCalories = caloriesData.exercises[0].nf_calories;
      workoutData.calories = apiCalories;
      increaseCalories(apiCalories);
      increaseCaloriesForDay(apiCalories)
    } else {
      caloriesBurned = calculateStrengthCalories(weightValue, setsValue, repsValue)
      workoutData.calories = caloriesBurned;
      increaseCalories(caloriesBurned)
      increaseCaloriesForDay(caloriesBurned)
    }
    
    if (caloriesData || caloriesBurned) {
      addWorkout(workoutData);
      console.log('Workout hinzugefügt');
      // increasePieCount(muscleGroup)
    } else {
      console.log('Fehler bei Kalorienberechnung');
    }
  };

  function displayOptions() {
    if (typeOfTraining === 'Cardio') {

      const checkIfFieldEmpty = () => {
        if (
          selectedWorkoutValue !== "" && 
          (typeOfTraining === "Cardio" ? timeValue !== "" : true)
        ) {
          return true;
        } else {
          return false;
        }
      };

      return (
      <div className='displayOptions'>

        <div>
          <h4>Type of Training</h4>
          <select className='cardioTrainings' onChange={(e) => setSelectedWorkoutValue(e.target.value)}>
            <option value=""></option>
            <option value="running">running</option>
            <option value="stepper">Stepper</option>
            <option value="Seilspringen">Seilspringen</option>
            <option value="cycling">Fahrrad</option>
            <option value="Rudern">Rudern</option>
          </select>
        </div>

        <div >
          <h5>Time</h5>
          <div className='cardioTrainings' onChange={(e) => setTimeValue(e.target.value)}>
            <input type="number" value={timeValue} onInput={e => setTimeValue(e.target.value)} />   
          </div>
        </div>

        <a className='addWorkoutBtn' 
            onClick={() => {const isValid = checkIfFieldEmpty();notify(isValid);
              if (isValid)
                handleAddWorkout();
                notifyWorkoutAdded();
            ;}}>
              <span>Add to!</span>
        </a>
        <ToastContainer/>

        </div>
      );
    } else if (typeOfTraining === 'Krafttraining') {

    const checkIfFieldEmpty = () => {
      if (
        selectedWorkoutValue !== "" &&
        (typeOfTraining === "Krafttraining" ? (weightValue !== "" && repsValue !== "" && setsValue !== "" && selectedMuscleValue !== "") : true)
      ) {
        return true;
      } else {
        return false;
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
        
          <a className='addWorkoutBtn' 
            onClick={() => {const isValid = checkIfFieldEmpty();notify(isValid);
              if (isValid)
              {
                handleAddWorkout();
                notifyWorkoutAdded()
              }
              }}>
              <span>Add to!</span>
          </a>
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