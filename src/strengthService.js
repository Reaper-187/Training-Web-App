const MET_VALUES = {
  "Bench Press": 6.0,
  "Incline Bench Press": 6.0,
  "Chest Press": 6.0,
  "Butterfly": 4.2,
  "Pull-Ups": 5.0,
  "Lat Pulldown": 5.0,
  "Rowing": 5.0,
  "Bicep Curls": 3.8,
  "Hammer Curls": 3.8,
  "Scott Curls": 3.8,
  "Tricep Dips": 5.0,
  "Tricep Pushdowns": 3.8,
  "Overhead Extensions": 3.8,
  "Squats": 6.0,
  "Leg Press": 4.5,
  "Lunges": 5.0,
  "Shoulder Press": 5.0,
  "Lateral Raises": 3.8,
  "Front Raises": 3.8,
  "Hip Thrust": 4.5,
  "Glute Bridge": 4.0,
  "Crunches": 3.8,
  "Plank": 2.0,
  "Russian Twists": 3.8,
};

export const calculateStrengthCalories = (exsize, weightValue, setsValue, repsValue) => {

  const metValue = MET_VALUES[exsize];
  const totalWeight = weightValue;
  const durationHours = (setsValue * repsValue * 0.3) / 60; // 0.03 = geschätzte Zeit pro Wiederholung
  const burnedCalories = metValue * totalWeight * durationHours;

  return {
    exercise: exsize,
    weight: weightValue,
    sets: setsValue,
    reps: repsValue,
    metValue,
    burnedCalories: parseFloat(burnedCalories.toFixed(2)), //convert von String => num
  };
};