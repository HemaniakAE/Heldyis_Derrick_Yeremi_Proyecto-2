import React, { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import ChessBoard from './Components/ChessBoard';
import StatsBoard from './Components/StatsBoard';
import ControlPanel from './Components/ControlPanel';
import Instructions from './Components/Instructions';
import ResetButton from './Components/ResetButton';
import { solveKnightsTour, solveKnightsTourClosed } from './backtracking/Backtracking'; 

function App() {
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(7); // Tamaño predeterminado
  const [mode, setMode] = useState("Open");
  const [selectedCell, setSelectedCell] = useState(null);
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [time, setTime] = useState(0);

  // Pausar/Reanudar
  const handlePauseResume = () => setPaused(prev => !prev);

  // Ejecutar recorrido
  const handleStart = () => {
    if (!selectedCell) {
      alert("Seleccione una casilla inicial en el tablero.");
      return;
    }

    const startRow = selectedCell.row;
    const startCol = selectedCell.col;

    let result;

    // Abierto
    if (mode === "Open") {
      result = solveKnightsTour(size, startRow, startCol);
    }

    // Cerrado
    else if (mode === "Close") {
      result = solveKnightsTourClosed(size, startRow, startCol);
    }

    if (!result || !result.success) {
      alert("No se encontró una solución para este punto de inicio.");
      return;
    }

    setBoard(result.board);
    setMoves(result.statistics.moveTries);
    setBacktracks(result.statistics.backtracks);
    setTime(result.executionTime.toFixed(2));
  };

  // Reiniciar ejecución
  const handleReboot = () => {
    setBoard([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
  };

  // Reinicio completo de la ventana
  const resetearTodo = () => {
    setBoard([]);
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
          board={board}
        />
      </div>
    </div>
  );
}

export default App;
