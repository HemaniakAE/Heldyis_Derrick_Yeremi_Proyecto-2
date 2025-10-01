import React from 'react';
import './ChessBoard.css';

const SIZE = 7;

function ChessBoard() {
  return (
    <div
      className="chessboard"
      style={{ '--size': SIZE }}
    >
      {Array.from({ length: SIZE * SIZE }).map((_, idx) => {
        const row = Math.floor(idx / SIZE);
        const col = idx % SIZE;
        const isBlack = (row + col) % 2 === 1;
        return (
          <div
            key={idx}
            className={`chessboard-cell ${isBlack ? 'black' : 'white'}`}
          >
            {/* Los nodos deben ir aquí */}
          </div>
        );
      })}
    </div>
  );
}

export default ChessBoard;