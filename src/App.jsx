import React, { useState } from 'react'
import './App.css'
import Header from './Components/header'
import ChessBoard from './Components/ChessBoard'
import StatsBoard from './Components/StatsBoard'
import ControlPanel from './Components/ControlPanel'
import Instructions from './Components/Instructions'
import ResetButton from './Components/ResetButton'

function App() {
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(7); //Tamaño predeterminado de la matriz

  const handlePauseResume = () => setPaused(prev => !prev);
  const handleStart = () => {};   // función vacía temporal
  const handleReboot = () => {};  // función vacía temporal

  const resetearTodo = () => {
    setLimit("");
    setNumbers([]);
    setInitialPop([]);
    setBestSolution([]);
    setBestSum(null);
    setBestGen(null);
  };

  return (
    <div className="App">
      <Header />
      <ResetButton onReset={resetearTodo} />
      <div className="left-area">
        <Instructions />
      </div>
      <div className="right-area">
        <StatsBoard />
        <ControlPanel
          Start={handleStart}
          Reboot={handleReboot}
          Pause={handlePauseResume}
          paused={paused}
          size={size}
          setSize={setSize}
        />
      </div>
      <div className="card">
        <ChessBoard size={size} />
      </div>
    </div>
  );
}

export default App
