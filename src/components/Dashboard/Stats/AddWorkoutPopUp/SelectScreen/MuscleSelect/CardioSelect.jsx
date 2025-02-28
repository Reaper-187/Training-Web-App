import "react-toastify/dist/ReactToastify.css";
import '../SelectScreen.css';

export const CardioSelect = ({ selectedWorkoutValue, setSelectedWorkoutValue }) => {

  return (
    <div>
      <div className="select-field">
        <h4>Type of Workout</h4>
        <select
          onChange={(e) => setSelectedWorkoutValue(e.target.value)}
          value={selectedWorkoutValue}
        >
          <option value="">------</option>
          {["running", "stepper", "jump-rope", "cycling", "rowing"].map((workout) => (
            <option key={workout} value={workout}>{workout}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
