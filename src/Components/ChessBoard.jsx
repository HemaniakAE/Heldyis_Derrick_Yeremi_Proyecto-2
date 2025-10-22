import React, { useState } from "react";
import { GiChessKnight } from "react-icons/gi";
import "./ChessBoard.css";

function ChessBoard({ size }) {
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  return (
    <div
      className="chessboard"
      style={{ "--size": size }}
    >
      {Array.from({ length: size * size }).map((_, idx) => {
        const row = Math.floor(idx / size);
        const col = idx % size;
        const isBlack = (row + col) % 2 === 1;
        const isSelected =
          selectedCell?.row === row && selectedCell?.col === col;

        return (
          <div
            key={idx}
            className={`chessboard-cell ${isBlack ? "black" : "white"} ${
              isSelected ? "select" : ""
            }`}
            onClick={() => handleCellClick(row, col)}
          >
            {isSelected && (
              <GiChessKnight
                size={32}
                color={isBlack ? "white" : "black"} // Cambia de color al caballo dependiendo del color de fondo
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
