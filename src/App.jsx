import React, { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import ChessBoard from './Components/ChessBoard'
import StatsBoard from './Components/StatsBoard'
import ControlPanel from './Components/ControlPanel'
import Instructions from './Components/Instructions'
import ResetButton from './Components/ResetButton'

function App() {
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(7); //Tamaño predeterminado de la matriz
  const [mode, setMode] = useState("Abierto");
  const [selectedCell, setSelectedCell] = useState(null);
  const [moves, setMoves] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [time, setTime] = useState(0);

  const handlePauseResume = () => setPaused(prev => !prev);
  const handleStart = () => {};   // función vacía temporal
  const handleReboot = () => {};  // función vacía temporal

  const resetearTodo = () => {
    setSelectedCell(null);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
  };

  return (
    <div className="App">
      <Header />
      <ResetButton onReset={resetearTodo} />
      <div className="left-area">
        <Instructions />
      </div>
      <div className="right-area">
        <StatsBoard moves={moves} backtracks={backtracks} time={time} />
        <ControlPanel
          Start={handleStart}
          Reboot={handleReboot}
          Pause={handlePauseResume}
          paused={paused}
          size={size}
          mode={mode}
          setSize={setSize}
          setMode={setMode}
        />
      </div>
      <div className="card">
        <ChessBoard 
        size={size} 
        selectedCell={selectedCell}
        onCellClick={setSelectedCell}
      />
      </div>
    </div>
  );
}

export default App
