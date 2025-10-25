/*
  ChessBoard.jsx

  Componente que renderiza la cuadrícula del tablero y el caballo.

  Props principales:
  - size: entero, dimensión del tablero (n x n).
  - selectedCell: {row, col} — dónde dibujar el icono del caballo actualmente.
  - onCellClick: callback para seleccionar la celda inicial (solo antes de ejecutar).
  - board: matriz de enteros con el número de paso para cada celda (0 = no visitado).
  - backtrackedCells: array de claves "r-c" que indica casillas que fueron deshechas por el algoritmo.

  Comportamiento:
  - Muestra el número de paso dentro de la casilla si existe (>0).
  - Aplica clases CSS (`visited`, `backtracked`, `select`) para estilos visuales.
  - No muta el `board`: solo representa el estado recibido por props.

  Nota: Añadimos únicamente comentarios; no se modifica la lógica.
*/
import React from "react";
import { GiChessKnight } from "react-icons/gi";
import "./ChessBoard.css";

function ChessBoard({ size, selectedCell, onCellClick, board, backtrackedCells = [] }) {

  //Adaptación con IA para utilizar el programa en celulares

  // Calcular tamaño del caballo basado en el tamaño del tablero
  const getKnightSize = () => {
    if (window.innerWidth <= 480) {
      return 260 / size * 0.6; // 60% del tamaño de celda en móviles pequeños
    } else if (window.innerWidth <= 768) {
      return 300 / size * 0.65; // 65% del tamaño de celda en móviles
    }
    return 64; // Tamaño original en desktop
  };

  const knightSize = getKnightSize();

  return (
    <div
      className="chessboard"
      style={{ "--size": size }}
    >
      {Array.from({ length: size * size }).map((_, idx) => {
        const row = Math.floor(idx / size);
        const col = idx % size;
        const isBlack = (row + col) % 2 === 1;
        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
        const hasBoard = board && board.length > 0;
        const moveNumber = hasBoard ? board[row][col] : null;
        const isVisited = hasBoard && typeof moveNumber === 'number' && moveNumber > 0;
        const key = `${row}-${col}`;
        const isBacktracked = !isVisited && backtrackedCells && backtrackedCells.includes(key);

        return (
          <div
            key={`${row}-${col}`}
            className={`chessboard-cell ${isBlack ? "black" : "white"} ${isSelected ? "select" : ""} ${isVisited ? 'visited' : ''} ${isBacktracked ? 'backtracked' : ''}`}
            onClick={() => !hasBoard && onCellClick({ row, col })}
          >
            {hasBoard && moveNumber > 0 && (
              <span
                style={{
                  color: isVisited ? 'white' : (isBlack ? "white" : "black"),
                  fontWeight: "bold",
                  fontSize: "0.8em",
                }}
              >
                {moveNumber}
              </span>
            )}

            {isSelected && (
              <GiChessKnight
                size={knightSize}
                color={isVisited ? 'white' : (isBlack ? "white" : "black")}
                strokeWidth={2.5}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChessBoard;