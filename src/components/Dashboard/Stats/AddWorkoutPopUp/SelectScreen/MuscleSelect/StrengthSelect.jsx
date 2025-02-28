import React from 'react'
import '../SelectScreen.css';


export const StrengthSelect = ({ selectedMuscleValue, setSelectedMuscleValue, selectedWorkoutValue, setSelectedWorkoutValue }) => {
  
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

  return (
    <div className='select-field'> 
      <h4>Type of Muscle</h4>
      <select onChange={(e) => setSelectedMuscleValue(e.target.value)} value={selectedMuscleValue}>
        <option value=""></option>
        {Object.keys(muscleGroupOptions).map((muscle) => (
          <option key={muscle} value={muscle}>{muscle}</option>
        ))}
      </select>

      <h4>Type of Workout</h4>
      <select onChange={(e) => setSelectedWorkoutValue(e.target.value)} value={selectedWorkoutValue} disabled={!selectedMuscleValue}>
        <option value=""></option>
        {(muscleGroupOptions[selectedMuscleValue] || []).map((workout) => (
          <option key={workout} value={workout}>{workout}</option>
        ))}
      </select>
    </div>
  );
};
