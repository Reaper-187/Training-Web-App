


export const calculateStrengthCalories = (weight, sets, reps) => {
  let intensityLevel;
  if (weight < 20) {
    intensityLevel = 'leicht';
  } else if (weight >= 20 && weight < 50) {
    intensityLevel = 'mittel';
  } else {
    intensityLevel = 'intensiv';
  }

  // Anpassung des Kalorienverbrauchs je nach Intensität
  const baseCalories = sets * reps; 
  let caloriesBurned;
  switch (intensityLevel) {
    case 'leicht':
      caloriesBurned = baseCalories * 0.8; // z.B. 80% des Basiswerts
      break;
    case 'mittel':
      caloriesBurned = baseCalories * 1.0; // 100% des Basiswerts
      break;
    case 'intensiv':
      caloriesBurned = baseCalories * 1.2; // 120% des Basiswerts
      break;
  }
  
  return caloriesBurned;
};
