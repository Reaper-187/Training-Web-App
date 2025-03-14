import React, { useContext, useEffect, useState } from 'react'
import './Workout.css'
import { Calender } from './Calender'
import { WorkoutContext, CaloriesContext } from '../../WorkoutContext'
import axios from 'axios'

const APP_URL = import.meta.env.VITE_API_URL

export const Workout = () => {

  const WorkoutList = () => {
    const { selectWorkouts, setSelectWorkouts } = useContext(WorkoutContext);
    const { fetchWorkouts } = useContext(CaloriesContext);

    function deleteWorkoutCard(_id) {
      const workoutToDelete = selectWorkouts.find((workout) => workout._id === _id);
      if (workoutToDelete) {
        axios.delete(APP_URL + '/' + workoutToDelete._id)
          .then(() => {
            const newList = selectWorkouts.filter((workout) => workout._id !== _id);
            setSelectWorkouts(newList);
            fetchWorkouts()
          })
          .catch((err) => {
            console.error('Lösung konnte nicht durchgeführt werden', err);
          })
      }
    }

    useEffect(() => {
      const GetWorkoutsData = async () => {
        try {
          const response = await axios.get(APP_URL)
          setSelectWorkouts(response.data.eachWorkout)
          console.log('response.data.eachWorkout', response.data.eachWorkout);
          
        } catch (err) {
          console.error('GET-Data not found', err);
        }
      }
      GetWorkoutsData()
    }, []);

    const [selectedDate, setSelectedDate] = useState();
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };


    useEffect(() => {
      let currentDay = selectedDate;
      if (!selectedDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        currentDay = today
      } else {
        const formattedSelectedDate = currentDay.toISOString().split('T')[0]; //Object-date wird zu einem toISOString die Zeit wird entfernt

        console.log("Formatted Selected Date:", formattedSelectedDate);

        const filteredWorkouts = selectWorkouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          workoutDate.setHours(0, 0, 0, 0); // Uhrzeit auf Mitternacht gesetzt
          const formattedWorkoutDate = workoutDate.toISOString().split('T')[0];

          return formattedWorkoutDate === formattedSelectedDate;
        });

        console.log("Filtered Workouts:", filteredWorkouts);

        // Setze die gefilterten Workouts
        setFilteredWorkouts(filteredWorkouts);
      }
    }, [selectedDate, selectWorkouts]);

    return (
<>
  <div className="workouts-container">
    <div className="calender-container">
      <h2>Workout-History</h2>
      <Calender handleDateChange={handleDateChange} selectedDate={selectedDate} />
    </div>

    <div className="cards workout-card-container">
      {filteredWorkouts.length === 0 ? (
        <p className="not-found-card">No Workouts for this Day</p>
      ) : (
        filteredWorkouts.map((workout, index) => {
          // 🔹 Workout-Werte als Key-Value-Paare speichern
          const workoutDetails = [
            { label: 'Count', value: workout.sets && workout.reps ? `${workout.sets} sets x ${workout.reps} reps` : null },
            { label: 'Weight', value: workout.weight ? `${workout.weight} kg` : null },
            { label: 'Time', value: workout.time ? `${workout.time} min` : null },
            { label: 'Burned-Calories', value: workout.calories ? workout.calories : null },
          ].filter(detail => detail.value !== null);

          return (
            <div
              className="workout-card"
              key={index}
              style={{ '--delay': `${index * 0.2}s` }}
              date = {workout.date}
              >
              <div className="topElements">
                <span>{workout.type}</span>
                <svg
                  onClick={() => deleteWorkoutCard(workout._id)}
                  className="removeCardBtn"
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </div>

              {/* 🔹 Workout-Name nur anzeigen, wenn vorhanden */}
              {workout.name && <h3>{workout.name}</h3>}
              {workout.exsize && <h3>{workout.exsize}</h3>}

              {/* 🔹 Dynamische Stat-Liste */}
              <span className="card-stats">
                {workoutDetails.map((detail, i) => (
                  <p key={i}>
                    {detail.label}: {detail.value}
                  </p>
                ))}
              </span>
            </div>
          );
        })
      )}
    </div>
  </div>
</>

    )
  }
  return <WorkoutList />;
}
