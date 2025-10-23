import React from "react";
import { GiChessKnight } from "react-icons/gi";
import "./ChessBoard.css";

function ChessBoard({ size, selectedCell, onCellClick }) {
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
            key={`${row}-${col}`}
            className={`chessboard-cell ${isBlack ? "black" : "white"} ${
              isSelected ? "select" : ""
            }`}
            onClick={() => onCellClick({ row, col })}
          >
            {isSelected && (
              <GiChessKnight
                size={64}
                color={isBlack ? "white" : "black"}
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
