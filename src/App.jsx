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
  const [started, setStart] =useState(false);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(7); // Tamaño predeterminado
  const [mode, setMode] = useState("Open");
  const [selectedCell, setSelectedCell] = useState(null);
  const [board, setBoard] = useState([]);
  const [backtrackedCells, setBacktrackedCells] = useState([]);
  const [moves, setMoves] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [time, setTime] = useState(0);

  //Iniciar/saltar
  //const handleStartSkip = () => setStart(prev => !prev);

  // Pausar/Reanudar
  const handlePauseResume = () => setPaused(prev => !prev);

  // Ejecutar recorrido
  const handleStartSkip = async () => {
    if (!selectedCell) {
      alert("Seleccione una casilla inicial en el tablero.");
      return;
    }
    setStart(true)
    const startRow = selectedCell.row;
    const startCol = selectedCell.col;

    // Visualization delay in ms (0 = instant, increase to slow down)
    const visualizationDelay = 40;

  // Resetea el tablero y la tabla de estadísticas
  setBoard([]);
  setBacktrackedCells([]);
  setMoves(0);
  setBacktracks(0);
  setTime(0);

    let result;

    const onSelectHandler = async (info) => {
      if (info?.board) {
        setBoard(info.board);
        // Remueve las casillas que no han sido visitadas
        setBacktrackedCells((prev) => prev.filter((k) => {
          const [r, c] = k.split('-').map(Number);
          return !(info.board[r] && info.board[r][c] > 0);
        }));
      }

      if (typeof info?.row === 'number' && typeof info?.col === 'number') {
        setSelectedCell({ row: info.row, col: info.col });
      }

      if (info?.backtracked) {
        const key = `${info.backtracked.row}-${info.backtracked.col}`;
        setBacktrackedCells((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }

      return Promise.resolve();
    };

    // Abierto
    if (mode === "Open") {
      result = await solveKnightsTour(size, startRow, startCol, onSelectHandler, visualizationDelay);
    }

    // Cerrado
    else if (mode === "Close") {
      result = await solveKnightsTourClosed(size, startRow, startCol, onSelectHandler, visualizationDelay);
    }

    if (!result || !result.success) {
      alert("No se encontró una solución para este punto de inicio.");
      return;
    }

    setBoard(result.board);
    setMoves(result.statistics.moveTries);
    setBacktracks(result.statistics.backtracks);
    setTime(result.executionTime.toFixed(2));
    setStart(false);
  };

  // Reiniciar ejecución
  const handleReboot = () => {
    setBoard([]);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
  };

  // Reinicio completo de la ventana
  const resetearTodo = () => {
    setBoard([]);
    setSelectedCell(null);
    setBacktrackedCells([]);
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
          Start={handleStartSkip}
          Reboot={handleReboot}
          Pause={handlePauseResume}
          paused={paused}
          started={started}
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
          backtrackedCells={backtrackedCells}
        />
      </div>
    </div>
  );
}

export default App;
