/*
  Backtracking.js

  Implementa una solución del Knight's Tour (abierto y cerrado) usando backtracking recursivo.

  Responsabilidades y notas importantes:
  - `solveKnightsTour` y `solveKnightsTourClosed` son los entrypoints públicos.
  - `solve` es la función recursiva que prueba movimientos, aplica backtracking y puede notificar
    a la UI mediante el callback `onSelect` (se le pasa un snapshot del tablero).
  - Para permitir visualización en React, `onSelect` debe ser una función async; cuando se pasa,
    el algoritmo `await` a la llamada para ceder el control y dejar que React renderice.
  - `delay` controla el tiempo de espera entre pasos cuando hay visualización.
  - El flag `shouldCancel` permite cancelar una ejecución en curso desde fuera llamando
    a `cancelCurrentExecution()`; la función lanza un error con mensaje 'CANCELLED' que es
    capturado por los entrypoints y convertido en resultado `cancelled: true`.
  - `statistics` es un objeto pasado por referencia que acumula `moveTries` y `backtracks`.

  Nota: Este archivo sólo contiene lógica algorítmica y utilidades. No realiza manipulación
  directa del DOM ni del estado de React. Las notificaciones a la UI se hacen exclusivamente
  a través de `onSelect`.
*/

// Movimientos posibles del caballo en el tablero.
let move_x = [2, 1, -1, -2, -2, -1, 1, 2];
let move_y = [1, 2, 2, 1, -1, -2, -2, -1];

// Flag para cancelar la ejecución en curso.
let shouldCancel = false;

// Valida si un movimiento es legal en el tablero dado.
function validateMove(bo, row, col, n) {
  return row < n && row >= 0 && col < n && col >= 0 && bo[row][col] === 0;
}
// Utilidad para pausar la ejecución por un tiempo dado (ms)
// Esto permite ceder el control a la UI para renderizar actualizaciones.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Función recursiva que intenta resolver el Knight's Tour.
async function solve(bo, srow, scol, n, counter, closed, statistics, onSelect, delay, row = srow, col = scol) {
  if (shouldCancel) {
    throw new Error('CANCELLED');
  }
// Caso base: si se han visitado todas las casillas
  if (counter > n * n) {
    if (closed) {// Verifica si el último movimiento puede volver al inicio, es decir, si es un tour cerrado
      for (let i = 0; i < 8; i++) {
        let new_x = row + move_x[i];
        let new_y = col + move_y[i];
        if (new_x === srow && new_y === scol) return true;
      }
      return false;
    }
    return true;
  }
// Intenta todos los movimientos posibles desde la posición actual
  for (let i = 0; i < 8; i++) {
    if (shouldCancel) {// Verifica si se ha solicitado cancelar la ejecución
      throw new Error('CANCELLED');
    }

    let new_x = row + move_x[i];// Calcula la nueva posición del caballo (fila)
    let new_y = col + move_y[i];// Calcula la nueva posición del caballo (columna)
    if (validateMove(bo, new_x, new_y, n)) {
      statistics.moveTries++;
      bo[new_x][new_y] = counter;

      if (typeof onSelect === "function") {
        const snapshot = bo.map(r => r.slice());// Crea un snapshot del tablero actual
        await onSelect({ row: new_x, col: new_y, board: snapshot, move: counter });// Notifica a la UI el nuevo movimiento
        if (delay > 0) await sleep(delay);
      } else {
        if (statistics.moveTries % 1000 === 0) {
          await sleep(0);
        }
      }

      if (shouldCancel) {// Verifica si se ha solicitado cancelar la ejecución
        throw new Error('CANCELLED');
      }
      
      // Llamada recursiva para intentar continuar el tour desde la nueva posición
      if (await solve(bo, srow, scol, n, counter + 1, closed, statistics, onSelect, delay, new_x, new_y)) {
        return true;
      }

      statistics.backtracks++;
      bo[new_x][new_y] = 0;// Marca la casilla como no visitada (backtrack)
      
      // Notifica a la UI el backtrack si se proporciona el callback
      if (typeof onSelect === "function") {
        const snapshotAfterBack = bo.map(r => r.slice());// Crea un snapshot del tablero después del backtrack  
        // Llama al callback para notificar el backtrack y actualizar la UI con la nueva posición del caballo
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

// Entry point público para resolver el Knight's Tour abierto.
export async function solveKnightsTour(n, start_row, start_col, onSelect = () => {}, delay = 0) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  let statistics = { moveTries: 0, backtracks: 0 };

  shouldCancel = false;

  const startTime = performance.now();
  board[start_row][start_col] = 1;

  try {// Notifica a la UI la posición inicial si se proporciona el callback
    if (typeof onSelect === "function" && onSelect !== undefined) {
      const snapshot = board.map((r) => r.slice());
      await onSelect({ row: start_row, col: start_col, board: snapshot, move: 1 });// Notifica a la UI el nuevo movimiento
      if (delay > 0) await sleep(delay);
    }
  } catch (e) {
    if (e.message === 'CANCELLED') {// Captura la cancelación durante la notificación inicial
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
  }

  try {// Llama a la función recursiva para resolver el tour
    const success = await solve(board, start_row, start_col, n, 2, false, statistics, onSelect, delay);
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Devuelve el resultado con estadísticas y tiempo de ejecución
    return {
      success,
      board,
      statistics,
      executionTime,
      sum: success ? board.flat().reduce((a, b) => a + b, 0) : 0,
    };
  } catch (e) {
    if (e.message === 'CANCELLED') {// Captura la cancelación durante la resolución
      return { success: false, cancelled: true, board, statistics, executionTime: 0, sum: 0 };
    }
    throw e;
  }
}


// Entry point público para resolver el Knight's Tour cerrado.
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

// Permite cancelar la ejecución en curso del algoritmo.
export function cancelCurrentExecution() {
  shouldCancel = true;
}