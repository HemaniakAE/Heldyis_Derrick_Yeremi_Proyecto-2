/*
  App.jsx

  Componente raíz que orquesta la aplicación.

  Resumen de responsabilidades:
  - Mantener el estado global de la aplicación (tablero, celda seleccionada, estadísticas y flags de ejecución).
  - Orquestar la ejecución del algoritmo de backtracking (con o sin animación).
  - Proveer un handler `onSelectHandler` que recibe snapshots del algoritmo para actualizar la UI.
  - Manejar cancelación/skip/pausa mediante refs (`executingRef`, `isSkippingRef`, `pausedRef`).

  Importante: Solo se añaden comentarios en este archivo — no se cambia ninguna lógica ni comportamiento.
*/
import React, { useState, useRef, useEffect } from 'react';
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
  const [calculating, setCalculating] = useState(false);
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
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Handlers para los controles del panel
  const handlePauseResume = () => setPaused(prev => !prev);

  const handleSizeChange = (newSize) => {
    if (executingRef.current || board.length > 0) {
      alert("No puede cambiar el tamaño durante o después de la ejecución. Presione el botón de reiniciar primero.");
      return;
    }
    setSize(newSize);
  };

  // Handler para cambiar el modo (Open/Close)
  const handleModeChange = (newMode) => {
    if (executingRef.current || board.length > 0) {
      alert("No puede cambiar el modo durante o después de la ejecución. Presione el botón de reiniciar primero.");
      return;
    }
    setMode(newMode);
  };

  // Handler para iniciar o saltar la ejecución
  const handleStartSkip = async () => {
    if (paused) {
      alert("No puede saltar mientras la ejecución está pausada. Presione reanudar primero.");
      return;
    }

    if (!selectedCell) {
      alert("Seleccione una casilla inicial en el tablero.");
      return;
    }

    // Lógica para manejar el skip durante la ejecución
    if (started && executingRef.current) {
      isSkippingRef.current = true;
      cancelCurrentExecution();
      
      // Espera a que se cancele la ejecución actual
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setCalculating(true);
      
      // Le da espacio al navegador para renderizar el cargador del skip
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Ejecuta el algoritmo sin animación para completar el recorrido rápidamente
      await executeWithoutAnimation();
      
      setCalculating(false);
      isSkippingRef.current = false;
      return;
    }

    initialCellRef.current = { row: selectedCell.row, col: selectedCell.col };
    await executeWithAnimation();
  };


  // Lógica para ejecutar el algoritmo con animación
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
      while (pausedRef.current && executingRef.current && !isSkippingRef.current) {
        await new Promise(res => setTimeout(res, 50));
      }
      // Actualiza el estado con el snapshot recibido del algoritmo
      if (info?.board) setBoard(info.board);

      // Actualiza las celdas backtracked
      if (info?.backtracked) {
        const key = `${info.backtracked.row}-${info.backtracked.col}`;
        setBacktrackedCells((prev) =>
          prev.includes(key) ? prev : [...prev, key]
        );
      }

      // Limpia las celdas que ya no están marcadas como backtracked
      if (info?.board) {
        setBacktrackedCells((prev) =>
          prev.filter((k) => {
            const [r, c] = k.split("-").map(Number);
            return !(info.board[r] && info.board[r][c] > 0);
          })
        );
      }

      // Actualiza la celda seleccionada
      if (typeof info?.row === "number" && typeof info?.col === "number") {
        setSelectedCell({ row: info.row, col: info.col });
      }

      return Promise.resolve();
    };

    let result;
    try {
      if (mode === "Open") {// Modo abierto
        result = await solveKnightsTour(size, startRow, startCol, onSelectHandler, visualizationDelay);
      } else {
        result = await solveKnightsTourClosed(size, startRow, startCol, onSelectHandler, visualizationDelay);
      }

      // Manejo del caso cuando la ejecución fue cancelada (skip)
      if (result && result.cancelled) {
        if (!isSkippingRef.current && initialCellRef.current) {
          setSelectedCell({ 
            row: initialCellRef.current.row, 
            col: initialCellRef.current.col 
          });
        }
        return;
      }

      // Manejo del resultado final
      if (result && result.success) {
        setBoard(result.board);
        setMoves(result.statistics.moveTries);
        setBacktracks(result.statistics.backtracks);
        setTime(result.executionTime.toFixed(2));
        setBacktrackedCells([]);
        // Selecciona la última celda del recorrido
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
        
        if (lastRow !== -1 && lastCol !== -1) {// Selecciona la última celda
          setSelectedCell({ row: lastRow, col: lastCol });
        }
      } else if (result && !result.cancelled) {// No se encontró solución
        alert("No se encontró una solución para este punto de inicio.");
      }
    } catch (error) {
      console.error("Error en ejecución:", error);
    } finally {
      setStart(false);
      executingRef.current = false;
    }
  };

  // Lógica para ejecutar el algoritmo sin animación (skip)
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

    // Permitir que React actualice el DOM
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    let result;
    try {
      if (mode === "Open") {
        result = await solveKnightsTour(size, startRow, startCol, undefined, 0);
      } else {
        result = await solveKnightsTourClosed(size, startRow, startCol, undefined, 0);
      }

      // Manejo del resultado final
      if (result && result.success) {
        setBoard(result.board);
        setMoves(result.statistics.moveTries);
        setBacktracks(result.statistics.backtracks);
        setTime(result.executionTime.toFixed(2));
        setBacktrackedCells([]);
        
        // Selecciona la última celda del recorrido
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

  // Handler para reiniciar el estado de la aplicación
  const handleReboot = () => {
    if (paused) {
      alert("No puede reiniciar mientras la ejecución está pausada. Presione reanudar primero.");
      return;
    }

    cancelCurrentExecution();
    setBoard([]);
    setBacktrackedCells([]);
    setMoves(0);
    setBacktracks(0);
    setTime(0);
    setStart(false);
    executingRef.current = false;
    setCalculating(false);
    
    if (initialCellRef.current) {
      setSelectedCell({ 
        row: initialCellRef.current.row, 
        col: initialCellRef.current.col 
      });
    }
  };

  // Handler para el botón de reset externo
  const resetearTodo = () => {
    if (paused) {
      alert("No puede resetear mientras la ejecución está pausada. Presione reanudar primero.");
      return;
    }

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
    setCalculating(false);
  };

  return (
    <div className="App">
      <Header />
      <ResetButton onReset={resetearTodo} />

      {calculating && ( //Indicador de carga durante el skip
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '8px',
          zIndex: 999,
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Terminando recorrido...
        </div>
      )}

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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;