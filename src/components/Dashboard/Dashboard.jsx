import { useState, useEffect, useRef } from 'react'
import './Dashboard.css'

import { CaloriesBurnedCard } from './Stats/CaloriesCalc/CaloriesBurnedCard'
import { CaloriesPerDay } from './Stats/CaloriesCalc/CaloriesPerDay'
import { CaloriesAverageBruned } from './Stats/CaloriesCalc/CaloriesAverageBruned'
import { BarChart } from './Stats/BarChart'
import { PieChart } from './Stats/PieChart'
import { CloseAdd, OpenAdd } from './Stats/AddWorkoutPopUp/OpenCloseAddBtn/OpenCloseAddBtn'
import { StatsSlider } from './Stats/StatsSlider'
import { SelectScreen } from './Stats/AddWorkoutPopUp/SelectScreen/SelectScreen'

export const Dashboard = () => {


  const [openAddWorkout, setOpenAddWorkout] = useState(false)
  const selectRef = useRef(null); // Referenz für die Navbar

  const openAddBtn = () => {
    setOpenAddWorkout(true);
  };

  const closeAddBtn = () => {
    setOpenAddWorkout(false)
  }

  // Schließe die Navbar, wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        closeAddBtn();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" || event.code === "Escape") {
        closeAddBtn();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);





  return (

    <div className='dashboard-container'>

      <div className="stat-card calories-burned">
        <CaloriesBurnedCard />
      </div>

      <div className='stat-card workout-streak'>
        <CaloriesPerDay />
      </div>

      <div className='stat-card calories-average-burned'>
        <CaloriesAverageBruned />
      </div>

      <div className='stat-card bar-chart'>
        <h4>Weekly Calories Burned</h4>
        <BarChart />
      </div>

      <div className='stat-card pie-chart'>
        <h4>Workout Categories</h4>
        <PieChart />
      </div>

      <div className='stat-card resp-graph'>
        <StatsSlider />
      </div>

      {/* stat-card add-btn-comp */}
      <div className='stat-card add-btn-comp'>
        <span onClick={openAddBtn}>
          <OpenAdd />
        </span>
      </div>

      <div className={`select-screen-container ${openAddWorkout ? 'active' : ''}`}>
        <div className='add-container'  ref={selectRef}>
          <div className='closeBtn' onClick={closeAddBtn} >
            <CloseAdd />
          </div>
          <SelectScreen />
        </div>
      </div>
    </div>
  )
}
