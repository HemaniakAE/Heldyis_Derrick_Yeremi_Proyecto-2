import React from 'react';
import './ChessBoard.css';

function ChessBoard({size}) {
  return (
    <div
      className="chessboard"
      style={{ '--size': size }}
    >
      {Array.from({ length: size * size }).map((_, idx) => {
        const row = Math.floor(idx / size);
        const col = idx % size;
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