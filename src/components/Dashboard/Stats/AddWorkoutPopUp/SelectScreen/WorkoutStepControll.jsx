import React, { useState } from "react";

export const WorkoutStepControll = () => {
  const [step, setStep] = useState(1); // Speichert den aktuellen Step

  const nextStep = () => setStep((prev) => prev + 1); // Vorwärts
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1)); // Rückwärts (min. 1)

  return (
    <div>
      {/* Je nach Schritt andere Inhalte anzeigen */}
      {step === 0}
      {step === 1}
      {step === 2}
      {step === 3}


      <div>
        {step > 1 && <button onClick={prevStep}>Zurück</button>}
        {step < 4 ? <button onClick={nextStep}>Weiter</button> : <button>Absenden</button>}
      </div>
    </div>
  );
};
