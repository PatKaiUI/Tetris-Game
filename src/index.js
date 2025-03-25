const ROWS = 20;
const COLUMNS = 10;
const SPEED = 600;
const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let currentPiece = getRandomShape();
let position = { row: 0, col: Math.floor(COLUMNS / 3) };
let score = 0;
let gameOver = false;

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");

document.addEventListener("keydown", (event) => {
  if (gameOver) return;
  if (event.key === "ArrowLeft") moveLeft();
  if (event.key === "ArrowRight") moveRight();
  if (event.key === "ArrowDown") moveDown();
  if (event.key === "ArrowUp") rotatePiece();
});

function getRandomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function isValidMove(newRow, newCol, shape = currentPiece) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const boardRow = newRow + r;
        const boardCol = newCol + c;
        if (boardCol < 0 || boardCol >= COLUMNS || boardRow >= ROWS)
          return false;
        if (boardRow >= 0 && board[boardRow][boardCol]) return false;
      }
    }
  }
  return true;
}

function moveDown() {
  if (isValidMove(position.row + 1, position.col)) {
    position.row++;
  } else {
    lockPiece();
  }
  render();
}

function moveLeft() {
  if (isValidMove(position.row, position.col - 1)) position.col--;
  render();
}

function moveLeft() {
  if (isValidMove(position.row, position.col - 1)) position.col--;
  render();
}

// function moveDown() {
//   position.row++;
//   render();
// }

// function moveLeft() {
//   position.col = Math.max(0, position.col - 1);
//   render();
// }

// function moveRight() {
//   position.col = Math.min(COLUMNS - currentPiece[0].length, position.col + 1);
//   render();
// }

// function rotatePiece() {
//   currentPiece = currentPiece[0].map((_, i) =>
//     currentPiece.map((row) => row[i]).reverse()
//   );
//   render();
// }

// function checkRows() {
//   board = board.filter((row) => row.some((cell) => cell === 0));
//   while (board.length < ROWS) {
//     board.unshift(Array(COLUMNS).fill(0));
//   }
//   score += 10;
//   scoreElement.textContent = score;
// }

// function render() {
//   boardElement.innerHTML = "";
//   for (let row = 0; row < ROWS; row++) {
//     for (let col = 0; col < COLUMNS; col++) {
//       const cell = document.createElement("div");
//       cell.classList.add("cell");
//       if (board[row][col] === 1) cell.classList.add("filled");
//       boardElement.appendChild(cell);
//     }
//   }

// Render the current piece
currentPiece.forEach((row, rIdx) => {
  row.forEach((cell, cIdx) => {
    if (cell === 1) {
      const pieceCell = document.createElement("div");
      pieceCell.classList.add("cell", "filled");
      pieceCell.style.gridRowStart = position.row + rIdx + 1;
      pieceCell.style.gridColumnStart = position.col + cIdx + 1;
      boardElement.appendChild(pieceCell);
    }
  });
});

setInterval(moveDown, SPEED);
render();
