import React, { useState, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { WorkoutContext, BarChartContext } from '../../../../../WorkoutContext';
import { fetchCalories } from '../../../../../apiService';
import { calculateStrengthCalories } from '../../../../../strengthService';
import 'react-toastify/dist/ReactToastify.css';
import './SelectScreen.css'

export const SelectScreen = () => {

  const notify = (isValid) => {
    if (isValid) {
      toast("💪Your Workout has been added💪", { type: "success" });

    } else {
      toast("pleas fill up all fields", { type: 'error' });

    }
  }

  const [typeOfTraining, setTypeOfTraining] = useState(null);
  const [selectedMuscleValue, setSelectedMuscleValue] = useState("");
  const { addWorkout } = useContext(WorkoutContext);
  const { increaseBarCaloriesForDay } = useContext(BarChartContext);


  const muscleGroupOptions = {
    Chest: ["Bench Press", "Incline Bench Press", "Chest Press", "Butterfly"],
    Back: ["Pull-Ups", "Lat Pulldown", "Rowing"],
    Biceps: ["Bicep Curls", "Hammer Curls", "Scott Curls"],
    Triceps: ["Tricep Dips", "Tricep Pushdowns", "Overhead Extensions"],
    Legs: ["Squats", "Leg Press", "Lunges"],
    Shoulders: ["Shoulder Press", "Lateral Raises", "Front Raises"],
    Booty: ["Hip Thrust", "Glute Bridge"],
    Abs: ["Crunches", "Plank", "Russian Twists"],
  };


  const [selectedWorkoutValue, setSelectedWorkoutValue] = useState("");
  const [setsValue, setSetsValue] = useState("");
  const [repsValue, setRepsValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [timeValue, setTimeValue] = useState("")




  const handleMuscleChange = (e) => {
    setSelectedMuscleValue(e.target.value);
    setSelectedWorkoutValue(""); // Reset the workout selection
  };

  const handleAddWorkout = async () => {
    const workoutData = {
      type: typeOfTraining,
      name: selectedMuscleValue,
      exsize: selectedWorkoutValue,
      weight: weightValue || '-',
      sets: setsValue,
      reps: repsValue,
      time: timeValue || '-',
    };


    let cardioCaloriesData;
    let strengthCaloriesData;


    if (typeOfTraining === 'Cardio') {
      // debugger
      cardioCaloriesData = await fetchCalories(`${selectedWorkoutValue} for ${timeValue} minutes.`);
      const cardioApiCalBurned = cardioCaloriesData.exercises[0].nf_calories;
      workoutData.calories = cardioApiCalBurned;
      increaseBarCaloriesForDay(cardioApiCalBurned)
    } else {
      strengthCaloriesData = calculateStrengthCalories(
        selectedWorkoutValue,
        weightValue,
        setsValue,
        repsValue,
      );
      const strengthCaloBurned = strengthCaloriesData.burnedCalories;
      workoutData.calories = strengthCaloBurned
      increaseBarCaloriesForDay(strengthCaloBurned);
    }

    if (cardioCaloriesData || strengthCaloriesData) {
      addWorkout(workoutData);
      console.log(workoutData)
      console.log('Workout hinzugefügt');
    } else {
      console.log('Fehler bei Kalorienberechnung');
    }
  };

  function displayOptions() {
    if (typeOfTraining === "Cardio") {
      const checkIfFieldEmpty = () => {
        if (timeValue !== "") {
          return true;
        } else {
          return false;
        }
      };
      return (
        <div className="displayOptions">
          <h4>Type of Training</h4>
          <select
            className="cardioTrainings"
            onChange={(e) => setSelectedWorkoutValue(e.target.value)}
            value={selectedWorkoutValue}
          >
            <option value=""></option>
            {["running", "stepper", "jump-rope", "cycling", "rowing"].map((workout) => (
              <option key={workout} value={workout}>
                {workout}
              </option>
            ))}
          </select>
          <h4>Time (minutes)</h4>
          <input
            type="number"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            className="cardioTrainings"
          />

          <a className='addWorkoutBtn'
            onClick={() => {
              const isValid = checkIfFieldEmpty(); notify(isValid);
              if (isValid)
                handleAddWorkout();
              // notifyWorkoutAdded();
            }}>
            <span>Add to!</span>
          </a>
          <ToastContainer />

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

      const availableWorkouts = selectedMuscleValue && muscleGroupOptions[selectedMuscleValue]
        ? muscleGroupOptions[selectedMuscleValue] : [];


      return (
        <div className='displayOptions'>
          <div>
            <h4>Type of Muscle</h4>
            <select className="input-field" onChange={handleMuscleChange} value={selectedMuscleValue}>
              <option value=""></option>
              {Object.keys(muscleGroupOptions).map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4>Type of Training</h4>
            <select className="input-field" onChange={(e) => setSelectedWorkoutValue(e.target.value)} value={selectedWorkoutValue} disabled={!selectedMuscleValue}>
              <option value=""></option>
              {availableWorkouts.map((workout) => (
                <option key={workout} value={workout}>
                  {workout}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4>Gewicht in kg</h4>
            <div className="input-field">
              <input type="number" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} />
            </div>
          </div>
          <div>
            <h4>Reps</h4>
            <div className="input-field">
              <input type="number" value={repsValue} onChange={(e) => setRepsValue(e.target.value)} />
            </div>
          </div>
          <div>
            <h4>Sets</h4>
            <div className="input-field">
              <input type="number" value={setsValue} onChange={(e) => setSetsValue(e.target.value)}/>
            </div>
          </div>

          <a className='addWorkoutBtn'
            onClick={() => {
              const isValid = checkIfFieldEmpty(); notify(isValid);
              if (isValid)
                handleAddWorkout();
              // notifyWorkoutAdded();              
            }}>
            <span>Add to!</span>
          </a>
          <ToastContainer />
        </div>
      );
    }

    return null; //wenn nichts dann nichts
  }

  const handleTypeChange = (newType) => {
    setTypeOfTraining(newType);

    if (newType === "Cardio") {
      // Zurücksetzen der Krafttraining-spezifischen Felder
      setSelectedMuscleValue("");
      setWeightValue("");
      setSetsValue("");
      setRepsValue("");
    } else if (newType === "Krafttraining") {
      // Zurücksetzen der Cardio-spezifischen Felder
      setTimeValue("");
    }
  };

  return (
    <>
      <h2>Add Workout</h2>
      <div>
        <h4>What did you do</h4>
        <select onChange={(e) => handleTypeChange(e.target.value)} value={typeOfTraining || ""}>
          <option value="">-</option>
          <option value="Cardio">Cardio</option>
          <option value="Krafttraining">Krafttraining</option>
        </select>

        {displayOptions()}

      </div>
    </>
  )
};