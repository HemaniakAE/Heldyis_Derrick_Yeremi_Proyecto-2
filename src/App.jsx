import React, { useState, useRef } from 'react';
import './App.css';
import Header from './Components/Header';
import ChessBoard from './Components/ChessBoard';
import StatsBoard from './Components/StatsBoard';
import ControlPanel from './Components/ControlPanel';
import Instructions from './Components/Instructions';
import ResetButton from './Components/ResetButton';
import { solveKnightsTour, solveKnightsTourClosed, cancelCurrentExecution } from './backtracking/Backtracking'; 

function App() {
  const [started, setStart] = useState(false);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(7);
  const [mode, setMode] = useState("Open");
  const [selectedCell, setSelectedCell] = useState(null);
  const [board, setBoard] = useState([]);
  const [backtrackedCells, setBacktrackedCells] = useState([]);
  const [moves, setMoves] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const [time, setTime] = useState(0);
  
  const executingRef = useRef(false);
  const initialCellRef = useRef(null);
  const isSkippingRef = useRef(false);

  const handlePauseResume = () => setPaused(prev => !prev);

  const handleSizeChange = (newSize) => {
    if (executingRef.current || board.length > 0) {
      alert("No puede cambiar el tamaño durante o después de la ejecución. Presione el botón de reiniciar primero.");
      return;
    }
    setSize(newSize);
  };

  const handleModeChange = (newMode) => {
    if (executingRef.current || board.length > 0) {
      alert("No puede cambiar el modo durante o después de la ejecución. Presione el botón de reiniciar primero.");
      return;
    }
    setMode(newMode);
  };

  const handleStartSkip = async () => {
    if (!selectedCell) {
      alert("Seleccione una casilla inicial en el tablero.");
      return;
    }

    if (started && executingRef.current) {
      isSkippingRef.current = true;
      cancelCurrentExecution();
      await new Promise(resolve => setTimeout(resolve, 250));
      await executeWithoutAnimation();
      isSkippingRef.current = false;
      return;
    }

    initialCellRef.current = { row: selectedCell.row, col: selectedCell.col };
    await executeWithAnimation();
  };

  const executeWithAnimation = async () => {
    if (executingRef.current) return;
    
    const startRow = initialCellRef.current.row;
    const startCol = initialCellRef.current.col;
    const visualizationDelay = 40;

    setBoard([]);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
    setStart(true);
    executingRef.current = true;

    const onSelectHandler = async (info) => {
      if (info?.board) setBoard(info.board);

      if (info?.backtracked) {
        const key = `${info.backtracked.row}-${info.backtracked.col}`;
        setBacktrackedCells((prev) =>
          prev.includes(key) ? prev : [...prev, key]
        );
      }

      if (info?.board) {
        setBacktrackedCells((prev) =>
          prev.filter((k) => {
            const [r, c] = k.split("-").map(Number);
            return !(info.board[r] && info.board[r][c] > 0);
          })
        );
      }

      if (typeof info?.row === "number" && typeof info?.col === "number") {
        setSelectedCell({ row: info.row, col: info.col });
      }

      return Promise.resolve();
    };

    let result;
    try {
      if (mode === "Open") {
        result = await solveKnightsTour(size, startRow, startCol, onSelectHandler, visualizationDelay);
      } else {
        result = await solveKnightsTourClosed(size, startRow, startCol, onSelectHandler, visualizationDelay);
      }

      if (result && result.cancelled) {
        if (!isSkippingRef.current && initialCellRef.current) {
          setSelectedCell({ 
            row: initialCellRef.current.row, 
            col: initialCellRef.current.col 
          });
        }
        return;
      }

      if (result && result.success) {
        setBoard(result.board);
        setMoves(result.statistics.moveTries);
        setBacktracks(result.statistics.backtracks);
        setTime(result.executionTime.toFixed(2));
        setBacktrackedCells([]);
        
        const maxValue = size * size;
        let lastRow = -1, lastCol = -1;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (result.board[r][c] === maxValue) {
              lastRow = r;
              lastCol = c;
              break;
            }
          }
          if (lastRow !== -1) break;
        }
        
        if (lastRow !== -1 && lastCol !== -1) {
          setSelectedCell({ row: lastRow, col: lastCol });
        }
      } else if (result && !result.cancelled) {
        alert("No se encontró una solución para este punto de inicio.");
      }
    } catch (error) {
      console.error("Error en ejecución:", error);
    } finally {
      setStart(false);
      executingRef.current = false;
    }
  };

  const executeWithoutAnimation = async () => {
    if (!initialCellRef.current) {
      return;
    }

    const startRow = initialCellRef.current.row;
    const startCol = initialCellRef.current.col;

    setBoard([]);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
    setSelectedCell({ row: startRow, col: startCol });

    if (mode === "Close") {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    let result;
    try {
      if (mode === "Open") {
        result = await solveKnightsTour(size, startRow, startCol, undefined, 0);
      } else {
        result = await solveKnightsTourClosed(size, startRow, startCol, undefined, 0);
      }

      if (result && result.success) {
        setBoard(result.board);
        setMoves(result.statistics.moveTries);
        setBacktracks(result.statistics.backtracks);
        setTime(result.executionTime.toFixed(2));
        setBacktrackedCells([]);
        
        const maxValue = size * size;
        let lastRow = -1, lastCol = -1;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (result.board[r][c] === maxValue) {
              lastRow = r;
              lastCol = c;
              break;
            }
          }
          if (lastRow !== -1) break;
        }
        
        if (lastRow !== -1 && lastCol !== -1) {
          setSelectedCell({ row: lastRow, col: lastCol });
        }
      } else if (!result || !result.cancelled) {
        alert("No se encontró una solución para este punto de inicio.");
      }
    } catch (error) {
      console.error("Error en ejecución sin animación:", error);
      alert("Error al calcular la solución.");
    } finally {
      setStart(false);
      executingRef.current = false;
    }
  };

  const handleReboot = () => {
    cancelCurrentExecution();
    setBoard([]);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
    setStart(false);
    executingRef.current = false;
    
    if (initialCellRef.current) {
      setSelectedCell({ 
        row: initialCellRef.current.row, 
        col: initialCellRef.current.col 
      });
    }
  };

  const resetearTodo = () => {
    cancelCurrentExecution();
    setBoard([]);
    setSelectedCell(null);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
    setStart(false);
    executingRef.current = false;
    initialCellRef.current = null;
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
          setSize={handleSizeChange}
          setMode={handleModeChange}
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