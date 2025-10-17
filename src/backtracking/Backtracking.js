let move_x = [2, 1, -1, -2, -2, -1, 1, 2];
let move_y = [1, 2, 2, 1, -1, -2, -2, -1];

let statistics = {
    moveTries: 0,
    backtracks: 0
};

function validateMove(bo, row, col, n) {
    if (row < n && row >= 0 && col < n && col >= 0 && bo[row][col] === 0) {
        return true;
    }
}

function solve(bo, row, col, n, counter) {
    if (counter > n*n) {
        return true;
    }

    
    for (let i = 0; i < 8; i++) {
        let new_x = row + move_x[i];
        let new_y = col + move_y[i];
        if (validateMove(bo, new_x, new_y, n)) {
            statistics.moveTries++;
            bo[new_x][new_y] = counter;
            if (solve(bo,new_x, new_y, n, counter+1)) {
                return true;
            }
            statistics.backtracks++;
            bo[new_x][new_y] = 0;
        }
    }
    return false;
}

let n = 6;
let board = Array.from({length : n}, () => Array(n).fill(0));
let [start_row, start_col] = [2,2];

// Reiniciar estadísticas
statistics.moveTries = 0;
statistics.backtracks = 0;

console.time("Tiempo de ejecución");
board[start_row][start_col] = 1;

if (solve(board, start_row, start_col, n, 2)) {
    console.timeEnd("Tiempo de ejecución");
    let suma = board.flat().reduce((a, b) => a + b, 0);
    console.log(`\nSolución encontrada para tablero ${n}x${n}`);
    console.log(`Suma: ${suma}`);
    console.log("\nEstadísticas:");
    console.log(`   Movimientos intentados: ${statistics.moveTries}`);
    console.log(`   Backtracks realizados: ${statistics.backtracks}`);
    console.log("\nTablero final:");
    board.forEach(row => console.log(row.join('\t')));
} else {
    console.timeEnd("Tiempo de ejecución");
    console.log(`\nNo hay solución para tablero ${n}x${n} desde (${start_row},${start_col})`);
    console.log("\nEstadísticas del intento:");
    console.log(`   Movimientos intentados: ${statistics.moveTries}`);
    console.log(`   Backtracks realizados: ${statistics.backtracks}`);
}
