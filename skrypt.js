const gridContainer = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const gridSize = 50;
let grid = [];
let intervalId;
let liveCellsCount = 0;
const counter = document.getElementById('counter');

// Tworzenie siatki
function createGrid() {
    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => toggleCellState(row, col));
            gridContainer.appendChild(cell);
            grid[row][col] = 0;
        }
    }
}

// Zmiana stanu komórki
function toggleCellState(row, col) {
    const cell = gridContainer.childNodes[row * gridSize + col];
    grid[row][col] = grid[row][col] === 0 ? 1 : 0;
    cell.style.backgroundColor = grid[row][col] === 0 ? 'white' : 'black';
    countLiveCells();
}

// Uruchomienie automatu komórkowego
function startAutomaton() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    clearBtn.disabled = true;
    intervalId = setInterval(updateAutomaton, 100);
}

// Zatrzymanie automatu komórkowego
function stopAutomaton() {
    clearInterval(intervalId);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearBtn.disabled = false;
}

// Wyczyszczenie automatu komórkowego
function clearAutomaton() {
    stopAutomaton();
    grid = [];
    gridContainer.innerHTML = '';
    createGrid();
    countLiveCells();
}

// Aktualizacja stanu automatu komórkowego
function updateAutomaton() {
    const newGrid = [];

    for (let row = 0; row < gridSize; row++) {
        newGrid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = grid[row][col];
            const neighbors = countNeighbors(row, col);

            if (cell === 0 && neighbors === 3) {
                newGrid[row][col] = 1;
            } else if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[row][col] = 0;
            } else {
                newGrid[row][col] = cell;
            }
        }
    }

    grid = newGrid;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const gridCell = gridContainer.childNodes[row * gridSize + col];
            gridCell.style.backgroundColor = grid[row][col] === 0 ? 'white' : 'black';
        }
    }

    countLiveCells();
}

// Zliczanie sąsiadujących komórek
function countNeighbors(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            const neighborRow = (row + i + gridSize) % gridSize;
            const neighborCol = (col + j + gridSize) % gridSize;
            count += grid[neighborRow][neighborCol];
        }
    }

    return count;
}

// Losowe wypełnienie siatki
function randomizeGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            grid[row][col] = Math.round(Math.random());
            const gridCell = gridContainer.childNodes[row * gridSize + col];
            gridCell.style.backgroundColor = grid[row][col] === 0 ? 'white' : 'black';
        }
    }

    countLiveCells();
}

createGrid();
startBtn.addEventListener('click', () => {
    clearAutomaton();
    randomizeGrid();
    startAutomaton();
});
clearBtn.addEventListener('click', clearAutomaton);

stopBtn.addEventListener('click', stopAutomaton);

// Zliczanie żywych komórek
function countLiveCells() {
    liveCellsCount = 0;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 1) {
                liveCellsCount++;
            }
        }
    }

    counter.textContent = `Żywe komórki: ${liveCellsCount}`;
}
