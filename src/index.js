const ROWS = 20;
const COLUMNS = 10;
const SPEED = 600;
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [[1, 1, 1]], // T (vereinfacht)
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // J
];

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let currentPiece = getRandomShape();
let position = { row: 0, col: Math.floor(COLUMNS / 3) };
let score = 0;
let gameOver = false;

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");

// Event Listener für Tastatursteuerung
document.addEventListener("keydown", (event) => {
  if (gameOver) return;
  switch (event.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowUp":
      rotatePiece();
      break;
  }
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

function moveRight() {
  if (isValidMove(position.row, position.col + 1)) position.col++;
  render();
}

function rotatePiece() {
  const newShape = currentPiece[0].map((_, i) =>
    currentPiece.map((row) => row[i]).reverse()
  );
  if (isValidMove(position.row, position.col, newShape))
    currentPiece = newShape;
  render();
}

function lockPiece() {
  currentPiece.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell) {
        const boardRow = position.row + rIdx;
        if (boardRow >= 0) board[boardRow][position.col + cIdx] = 1;
      }
    });
  });

  checkRows();
  resetPiece();
}

function resetPiece() {
  currentPiece = getRandomShape();
  position = { row: 0, col: Math.floor(COLUMNS / 3) };
  if (!isValidMove(position.row, position.col)) {
    gameOver = true;
    gameOverElement.style.display = "block";
  }
}

function checkRows() {
  board = board.filter((row) => row.some((cell) => !cell));
  const newRows = ROWS - board.length;
  if (newRows > 0) {
    board.unshift(
      ...Array(newRows)
        .fill()
        .map(() => Array(COLUMNS).fill(0))
    );
    score += newRows * 10;
    scoreElement.textContent = score;
  }
}

function render() {
  boardElement.innerHTML = "";

  // Render board
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.className = `cell ${cell ? "filled" : ""}`;
      cellElement.style.gridRowStart = rowIndex + 1;
      cellElement.style.gridColumnStart = colIndex + 1;
      boardElement.appendChild(cellElement);
    });
  });

  // Render current piece
  currentPiece.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell) {
        const pieceCell = document.createElement("div");
        pieceCell.className = "cell filled";
        pieceCell.style.gridRowStart = position.row + rIdx + 1;
        pieceCell.style.gridColumnStart = position.col + cIdx + 1;
        boardElement.appendChild(pieceCell);
      }
    });
  });
}

setInterval(moveDown, SPEED);
render();
