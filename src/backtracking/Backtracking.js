let move_x = [2, 1, -1, -2, -2, -1, 1, 2];
let move_y = [1, 2, 2, 1, -1, -2, -2, -1];

function validateMove(bo, row, col, n) {
  return row < n && row >= 0 && col < n && col >= 0 && bo[row][col] === 0;
}

function solve(bo, srow, scol, n, counter, closed, statistics, row = srow, col = scol) {
  if (counter > n * n) {
    if (closed) {
      for (let i = 0; i < 8; i++) {
        let new_x = row + move_x[i];
        let new_y = col + move_y[i];
        if (new_x === srow && new_y === scol) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  for (let i = 0; i < 8; i++) {
    let new_x = row + move_x[i];
    let new_y = col + move_y[i];
    if (validateMove(bo, new_x, new_y, n)) {
      statistics.moveTries++;
      bo[new_x][new_y] = counter;
      if (solve(bo, srow, scol, n, counter + 1, closed, statistics, new_x, new_y)) {
        return true;
      }
      statistics.backtracks++;
      bo[new_x][new_y] = 0;
    }
  }
  return false;
}

export function solveKnightsTour(n, start_row, start_col) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  const success = solve(board, start_row, start_col, n, 2, false, statistics);
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    success,
    board,
    statistics,
    executionTime,
    sum: success ? board.flat().reduce((a, b) => a + b, 0) : 0,
  };
}

export function solveKnightsTourClosed(n, start_row, start_col) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  const success = solve(board, start_row, start_col, n, 2, true, statistics);
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return {
    success,
    board,
    statistics,
    executionTime,
    sum: success ? board.flat().reduce((a, b) => a + b, 0) : 0,
  };
}
