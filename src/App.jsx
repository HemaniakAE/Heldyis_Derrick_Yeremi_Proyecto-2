import React, { useState } from 'react'
import './App.css'
import Header from './Components/header'
import ChessBoard from './Components/ChessBoard'
import StatsBoard from './Components/StatsBoard'
import ControlPanel from './Components/ControlPanel'
import Instructions from './Components/Instructions'

function App() {
  const [paused, setPaused] = useState(false);

  const handlePauseResume = () => setPaused(prev => !prev);
  const handleStart = () => {};   // función vacía temporal
  const handleReboot = () => {};  // función vacía temporal

  return (
    <div className="App">
      <Header />
      <div className="main-layout">
        <div className="center-area">
          <div className="card">
            <ChessBoard />
          </div>
        </div>
        <div className="right-area">
          <StatsBoard />
          <ControlPanel 
            Start={handleStart}
            Reboot={handleReboot}
            Pause={handlePauseResume}
            paused={paused} 
          />
        </div>
        <div className='left-area'>
          <Instructions />
        </div>
      </div>
    </div>
  )
}

export default App
