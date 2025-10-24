import React from "react";
import { GiChessKnight } from "react-icons/gi";
import "./ChessBoard.css";

function ChessBoard({ size, selectedCell, onCellClick, board, backtrackedCells = [] }) {
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
                size={64}
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
