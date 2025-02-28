import React from 'react';
import '../SelectScreen.css';

export const WorkoutTypeSelect = ({ typeOfTraining, handleTypeChange }) => {
  return (
    <div className="training-type-selector">
      <h4>What kind of Workout ?</h4>
      <select onChange={(e) => handleTypeChange(e.target.value)} value={typeOfTraining}>
        <option value="">------</option>
        <option value="Cardio">Cardio</option>
        <option value="Strength">Strength</option>
      </select>
    </div>
  );
};
