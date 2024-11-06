import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/workouts';

export const getAllWorkouts = () => axios.get(apiUrl);
export const addWorkout = (workout) => axios.post(apiUrl, workout);
export const updateWorkout = (id, updatedData) => axios.put(`${apiUrl}/${id}`, updatedData);
export const deleteWorkout = (id) => axios.delete(`${apiUrl}/${id}`);
