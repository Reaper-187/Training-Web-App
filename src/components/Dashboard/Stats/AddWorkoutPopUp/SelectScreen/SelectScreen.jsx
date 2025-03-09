import React, { useState, useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutContext } from '../../../../../WorkoutContext';
import { fetchCalories } from '../../../../../apiService';
import { calculateStrengthCalories } from '../../../../../strengthService';
import 'react-toastify/dist/ReactToastify.css';
import './SelectScreen.css';
import { WorkoutTypeSelect } from './WorkoutTypeSelect/WorkoutTypeSelect';
import { CardioSelect } from './MuscleSelect/CardioSelect';
import { StrengthSelect } from './MuscleSelect/StrengthSelect';
import { InputField } from './InputField/InputField';


const steps = ["Workout-Typ", "Excirsize", "Details", "Add-Workout"];


const stepVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100, // Kommt von rechts, wenn `direction > 0`, sonst von links
  }),
  visible: { opacity: 1, x: 0 },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100, // Verlassen nach links oder rechts
  }),
};


export const SelectScreen = () => {

  const [activeStep, setActiveStep] = useState(0);
  const [summarizeValue, setSummarizeValue] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = vorwärts, -1 = zurück

  const handleNext = () => {
    if (activeStep === 2) {
      // Daten für die Zusammenfassung setzen, wenn der User auf "Weiter" klickt
      const newWorkoutData = {
        type: typeOfTraining,
        name: selectedMuscleValue,
        exsize: selectedWorkoutValue,
        weight: weightValue || null,
        sets: setsValue || null,
        reps: repsValue || null,
        time: timeValue || null,
      };

      setDirection(1);
      setSummarizeValue(newWorkoutData);
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 3) {
      setSummarizeValue(null);
    }
    setDirection(-1);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const notify = (isValid) => {
    if (isValid) {
      toast("💪Your Workout has been added💪", {
        type: "success",
        position: 'top-center',
        autoClose: 1500,
        pauseOnFocusLoss: false,
        pauseOnHover: false
      });

    } else {
      toast("pleas fill up all fields", {
        type: 'error',
        position: 'top-center',
        autoClose: 1500,
        pauseOnFocusLoss: false,
        pauseOnHover: false
      });
    }
  }

  const [typeOfTraining, setTypeOfTraining] = useState("");
  const [selectedWorkoutValue, setSelectedWorkoutValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [selectedMuscleValue, setSelectedMuscleValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [setsValue, setSetsValue] = useState("");
  const [repsValue, setRepsValue] = useState("");

  const { addWorkout } = useContext(WorkoutContext);

  const handleTypeChange = (newType) => {
    setTypeOfTraining(newType);

    if (newType === "Cardio") {
      // Zurücksetzen der Strength-spezifischen Werte
      setSelectedMuscleValue("");
      setWeightValue("");
      setSetsValue("");
      setRepsValue("");
    } else if (newType === "Strength") {
      // Zurücksetzen der Cardio-spezifischen Werte
      setTimeValue("");
    }
  };

  const handleAddWorkout = async () => {
    if (!summarizeValue) return;

    let caloriesBurned = 0;

    if (summarizeValue.type === 'Cardio') {
      const cardioCaloriesData = await fetchCalories(`${summarizeValue.exsize} for ${summarizeValue.time} minutes.`);
      caloriesBurned = cardioCaloriesData.exercises[0].nf_calories;
    } else {
      const strengthCaloriesData = calculateStrengthCalories(
        summarizeValue.exsize,
        summarizeValue.weight,
        summarizeValue.sets,
        summarizeValue.reps
      );
      caloriesBurned = strengthCaloriesData.burnedCalories;
    }

    const workoutToSave = { ...summarizeValue, calories: caloriesBurned  };

    addWorkout(workoutToSave);
    notify(true);

    //reset zu step 0 und der Felder
    setActiveStep(0);
    setSummarizeValue(null);
    setTypeOfTraining("");
    setSelectedWorkoutValue("");
    setTimeValue("");
    setSelectedMuscleValue("");
    setWeightValue("");
    setSetsValue("");
    setRepsValue("");
  };

  useEffect(() => {
    if (activeStep === 3) {
      setSummarizeValue({
        type: typeOfTraining,
        name: selectedMuscleValue || "",
        exsize: selectedWorkoutValue,
        weight: weightValue || null,
        sets: setsValue || null,
        reps: repsValue || null,
        time: timeValue || null,
      });
    }
  }, [activeStep, typeOfTraining, selectedMuscleValue, selectedWorkoutValue, weightValue, setsValue, repsValue, timeValue]);


  return (

    <div className='top-options'>
      <div className='ops'>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStep}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 0 && <WorkoutTypeSelect typeOfTraining={typeOfTraining} handleTypeChange={handleTypeChange} />}

            {activeStep === 1 && (
              typeOfTraining === "Cardio" ? (
                <CardioSelect
                  selectedWorkoutValue={selectedWorkoutValue}
                  setSelectedWorkoutValue={setSelectedWorkoutValue}
                />
              ) : typeOfTraining === "Strength" ? (
                <StrengthSelect
                  selectedMuscleValue={selectedMuscleValue}
                  setSelectedMuscleValue={setSelectedMuscleValue}
                  selectedWorkoutValue={selectedWorkoutValue}
                  setSelectedWorkoutValue={setSelectedWorkoutValue}
                />
              ) : null
            )}

            {activeStep === 2 && (
              <InputField
                typeOfTraining={typeOfTraining}
                weightValue={weightValue} setWeightValue={setWeightValue}
                setsValue={setsValue} setSetsValue={setSetsValue}
                repsValue={repsValue} setRepsValue={setRepsValue}
                timeValue={timeValue} setTimeValue={setTimeValue}
              />
            )}

            {summarizeValue && (
              <div>
                <ul className='summarize-container'>
                  <h3>Summarize</h3>
                  {Object.entries(summarizeValue).map(([key, value]) =>
                    value ? <li className='summarize-value' key={key}><strong>{key}:</strong> {value}</li> : null
                  )}
                </ul>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <div className='forward-backward-btn'>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Zurück
        </Button>


        {
          activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !typeOfTraining) ||
                (activeStep === 1 && !selectedWorkoutValue) ||
                (activeStep === 2 && typeOfTraining === "Strength" && (!weightValue || !setsValue || !repsValue))
              }
            >
              {activeStep === steps.length - 1 ? "Abschließen" : "Weiter"}
            </Button>

          ) : (

            <a className="addWorkoutBtn" onClick={handleAddWorkout}>
              <span>Add to!</span>
            </a>
          )
        }
      </div>
      <ToastContainer />
    </div >
  );
};
