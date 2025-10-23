import React from 'react';
import './StatsBoard.css';

function StatsBoard({ moves, backtracks, time }) {
  return (
    <div className="stats-board">
      <h2>Statistics</h2>
      <table>
        <tbody>
          <tr>
            <td>Attempts:</td>
            <td>{moves}</td>
          </tr>
          <tr>
            <td>Backtracks:</td>
            <td>{backtracks}</td>
          </tr>
          <tr>
            <td>Execution time:</td>
            <td>{time} ms</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StatsBoard;