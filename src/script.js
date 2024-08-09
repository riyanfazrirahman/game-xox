const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const statusPlay = document.getElementById("play");
const statusWin = document.getElementById("win");
const statusLose = document.getElementById("lose");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let computerPlayer = "O";

let win = 0;
let lose = 0;

let boardState = Array(9).fill(null);
let moveHistory = [[], []];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

function removeOldestMove(playerIndex) {
  if (moveHistory[playerIndex].length >= 3) {
    const oldestMoveIndex = moveHistory[playerIndex].shift();
    boardState[oldestMoveIndex] = null;
    cells[oldestMoveIndex].textContent = "";
    cells[oldestMoveIndex].classList.remove("x", "o");
  }
}

function getEmptyIndices() {
  return boardState
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);
}

function findWinningMove(player) {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    const values = [boardState[a], boardState[b], boardState[c]];
    if (
      values.filter((value) => value === player).length === 2 &&
      values.includes(null)
    ) {
      return combination[values.indexOf(null)];
    }
  }
  return null;
}

function computerMove() {
  const randomChance = Math.random();
  let moveIndex;

  if (randomChance < 1) {
    // 75% chance for optimal play
    moveIndex = findWinningMove(computerPlayer); // Check if computer can win
    if (moveIndex === null) {
      moveIndex = findWinningMove(currentPlayer); // Block player from winning
    }
  }

  if (moveIndex === null) {
    const emptyIndices = getEmptyIndices();
    if (emptyIndices.length > 0) {
      moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  }

  if (moveIndex !== null) {
    removeOldestMove(1); // Hapus langkah pertama komputer jika sudah ada 3 langkah
    boardState[moveIndex] = computerPlayer;
    moveHistory[1].push(moveIndex);

    cells[moveIndex].textContent = computerPlayer;
    cells[moveIndex].classList.add(computerPlayer.toLowerCase());

    const winner = checkWinner();

    if (winner) {
      statusText.innerHTML = `😭You Lose!😭`;
      statusText.style.display = "flex";
      lose += 1;
      statusLose.innerHTML = `${lose}`;
      restartButton.innerHTML = "Play Again!";
      board.removeEventListener("click", handleClick);
    } else {
      currentPlayer = "X";
      statusPlay.innerHTML = "Anda";
    }
  }
}

function handleClick(event) {
  if (event.target.classList.contains("cell")) {
    const index = event.target.dataset.index;
    if (!boardState[index]) {
      removeOldestMove(0); // Hapus langkah pertama pemain manusia jika sudah ada 3 langkah
      boardState[index] = currentPlayer;
      moveHistory[0].push(index);

      event.target.textContent = currentPlayer;
      event.target.classList.add(currentPlayer.toLowerCase());

      const winner = checkWinner();
      if (winner) {
        statusText.innerHTML = `🎉You Wins!🎉`;
        statusText.style.display = "flex";
        win += 1;
        statusWin.innerHTML = `${win}`;
        restartButton.innerHTML = "Play Again!";
        board.removeEventListener("click", handleClick);
      } else {
        currentPlayer = "O";
        statusPlay.innerHTML = "Computer";
        setTimeout(computerMove, 1500);
      }
    }
  }
}

function restartGame() {
  boardState.fill(null);
  moveHistory = [[], []];
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
  statusText.textContent = "";
  statusText.style.display = "none";
  currentPlayer = "X";
  statusPlay.innerHTML = "Anda";
  restartButton.innerHTML = "Restart Game";
  board.addEventListener("click", handleClick);
}

board.addEventListener("click", handleClick);
restartButton.addEventListener("click", restartGame);
