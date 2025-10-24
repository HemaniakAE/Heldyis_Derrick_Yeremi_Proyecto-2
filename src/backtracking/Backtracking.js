let move_x = [2, 1, -1, -2, -2, -1, 1, 2];
let move_y = [1, 2, 2, 1, -1, -2, -2, -1];

function validateMove(bo, row, col, n) {
  return row < n && row >= 0 && col < n && col >= 0 && bo[row][col] === 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function solve(bo, srow, scol, n, counter, closed, statistics, onSelect, delay, row = srow, col = scol) {
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

      // mark the cell with the move number
      bo[new_x][new_y] = counter;

      // notify UI about the selected cell and current board so React can render
      try {
        if (typeof onSelect === "function") {
          const snapshot = bo.map((r) => r.slice());
          await onSelect({ row: new_x, col: new_y, board: snapshot, move: counter });
          if (delay) await sleep(delay);
          else await sleep(0);
        }
      } catch (e) {
        // ignore UI callback errors
      }

      if (await solve(bo, srow, scol, n, counter + 1, closed, statistics, onSelect, delay, new_x, new_y)) {
        return true;
      }

      statistics.backtracks++;
      bo[new_x][new_y] = 0;

      // notify UI about the backtrack (board updated) and which cell was undone
      try {
        if (typeof onSelect === "function") {
          const snapshotAfterBack = bo.map((r) => r.slice());
          await onSelect({ row: row, col: col, board: snapshotAfterBack, move: null, backtracked: { row: new_x, col: new_y } });
          if (delay) await sleep(delay);
          else await sleep(0);
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return false;
}

export async function solveKnightsTour(n, start_row, start_col, onSelect = () => {}, delay = 0) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  const startTime = performance.now();
  board[start_row][start_col] = 1;

    // notify starting cell immediately (include board snapshot)
    try {
      if (typeof onSelect === "function") {
        const snapshot = board.map((r) => r.slice());
        await onSelect({ row: start_row, col: start_col, board: snapshot, move: 1 });
        if (delay) await sleep(delay);
        else await sleep(0);
      }
    } catch (e) {}

  const success = await solve(board, start_row, start_col, n, 2, false, statistics, onSelect, delay);
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

export async function solveKnightsTourClosed(n, start_row, start_col, onSelect = () => {}, delay = 0) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  try {
    if (typeof onSelect === "function") {
      await onSelect({ row: start_row, col: start_col });
      if (delay) await sleep(delay);
      else await sleep(0);
    }
  } catch (e) {}
    // notify starting cell immediately (include board snapshot)
    try {
      if (typeof onSelect === "function") {
        const snapshot = board.map((r) => r.slice());
        await onSelect({ row: start_row, col: start_col, board: snapshot, move: 1 });
        if (delay) await sleep(delay);
        else await sleep(0);
      }
    } catch (e) {}

  const success = await solve(board, start_row, start_col, n, 2, true, statistics, onSelect, delay);
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
