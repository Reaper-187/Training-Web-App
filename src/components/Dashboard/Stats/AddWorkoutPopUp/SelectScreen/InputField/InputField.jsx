import React from "react";
import '../SelectScreen.css';

export const InputField = ({ 
  weightValue, setWeightValue, 
  repsValue, setRepsValue, 
  setsValue, setSetsValue, 
  timeValue, setTimeValue, 
  typeOfTraining 
}) => {
  return (
    <div className="strengh-inputs">
      {typeOfTraining === "Strength" && (
        <>
          <div className="input-field">
            <h4>Weight in kg</h4>
            <input type="number" value={weightValue} onChange={(e) => setWeightValue(e.target.value)} />
          </div>
          <div className="input-field">
            <h4>Reps</h4>
            <input type="number" value={repsValue} onChange={(e) => setRepsValue(e.target.value)} />
          </div>
          <div className="input-field">
            <h4>Sets</h4>
            <input type="number" value={setsValue} onChange={(e) => setSetsValue(e.target.value)} />
          </div>
        </>
      )}

      {typeOfTraining === "Cardio" && (
        <div className="input-field">
          <h4>Time in minutes</h4>
          <input type="number" value={timeValue} onChange={(e) => setTimeValue(e.target.value)} />
        </div>
      )}
    </div>
  );
};
