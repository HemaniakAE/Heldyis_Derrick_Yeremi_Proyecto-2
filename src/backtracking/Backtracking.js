let move_x = [2, 1, -1, -2, -2, -1, 1, 2];
let move_y = [1, 2, 2, 1, -1, -2, -2, -1];

let shouldCancel = false;

function validateMove(bo, row, col, n) {
  return row < n && row >= 0 && col < n && col >= 0 && bo[row][col] === 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function solve(bo, srow, scol, n, counter, closed, statistics, onSelect, delay, row = srow, col = scol) {
  if (shouldCancel) {
    throw new Error('CANCELLED');
  }

  if (counter > n * n) {
    if (closed) {
      for (let i = 0; i < 8; i++) {
        let new_x = row + move_x[i];
        let new_y = col + move_y[i];
        if (new_x === srow && new_y === scol) return true;
      }
      return false;
    }
    return true;
  }

  for (let i = 0; i < 8; i++) {
    if (shouldCancel) {
      throw new Error('CANCELLED');
    }

    let new_x = row + move_x[i];
    let new_y = col + move_y[i];
    if (validateMove(bo, new_x, new_y, n)) {
      statistics.moveTries++;
      bo[new_x][new_y] = counter;

      if (typeof onSelect === "function") {
        const snapshot = bo.map(r => r.slice());
        await onSelect({ row: new_x, col: new_y, board: snapshot, move: counter });
        if (delay > 0) await sleep(delay);
      } else {
        if (statistics.moveTries % 1000 === 0) {
          await sleep(0);
        }
      }

      if (shouldCancel) {
        throw new Error('CANCELLED');
      }

      if (await solve(bo, srow, scol, n, counter + 1, closed, statistics, onSelect, delay, new_x, new_y)) {
        return true;
      }

      statistics.backtracks++;
      bo[new_x][new_y] = 0;

      if (typeof onSelect === "function") {
        const snapshotAfterBack = bo.map(r => r.slice());
        await onSelect({ row: row, col: col, board: snapshotAfterBack, move: null, backtracked: { row: new_x, col: new_y } });
        if (delay > 0) await sleep(delay);
      }

      if (shouldCancel) {
        throw new Error('CANCELLED');
      }
    }
  }

  return false;
}

export async function solveKnightsTour(n, start_row, start_col, onSelect = () => {}, delay = 0) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  shouldCancel = false;

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  try {
    if (typeof onSelect === "function" && onSelect !== undefined) {
      const snapshot = board.map((r) => r.slice());
      await onSelect({ row: start_row, col: start_col, board: snapshot, move: 1 });
      if (delay > 0) await sleep(delay);
    }
  } catch (e) {
    if (e.message === 'CANCELLED') {
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
  }

  try {
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
  } catch (e) {
    if (e.message === 'CANCELLED') {
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
    throw e;
  }
}

export async function solveKnightsTourClosed(n, start_row, start_col, onSelect = () => {}, delay = 0) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  shouldCancel = false;

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  try {
    if (typeof onSelect === "function" && onSelect !== undefined) {
      const snapshot = board.map((r) => r.slice());
      await onSelect({ row: start_row, col: start_col, board: snapshot, move: 1 });
      if (delay > 0) await sleep(delay);
    }
  } catch (e) {
    if (e.message === 'CANCELLED') {
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
  }

  try {
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
  } catch (e) {
    if (e.message === 'CANCELLED') {
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
    throw e;
  }
}

export function cancelCurrentExecution() {
  shouldCancel = true;
}