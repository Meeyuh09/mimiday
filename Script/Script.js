const button = document.getElementById("myButton");
const popup = document.getElementById("popup");
const popup2 = document.getElementById("popup2");

const nextButton = document.getElementById("nextButton");
const closePopup = document.getElementById("closePopup");

const doodleButton = document.getElementById("doodleButton");
const birthdayImage = document.getElementById("birthdayImage");
const hiddenPicture = document.getElementById("hiddenPicture");
const downloadButton = document.getElementById("downloadButton");

const ticTacToe = document.getElementById("ticTacToe");
const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("gameStatus");
const restartGame = document.getElementById("restartGame");

// Sounds
const clickSound = new Audio("click.mp3");
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");

// =========================
// MUSIC
// =========================

let musicStarted = false;

document.addEventListener("click", function startMusic() {
    if (!musicStarted) {
        music.play()
            .then(() => {
                musicStarted = true;
                musicButton.textContent = "⏸";
            })
            .catch(error => {
                console.log("Music could not start:", error);
            });
    }
}, { once: true });

musicButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (music.paused) {
        music.play().then(() => {
            musicButton.textContent = "⏸";
        });
    } else {
        music.pause();
        musicButton.textContent = "▶";
    }
});

// =========================
// POPUPS NAVIGATION
// =========================

button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
    popup.style.display = "flex";
});

nextButton.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup.style.display = "none";
    popup2.style.display = "flex";

    // Ensure only the doodle image shows initially
    birthdayImage.style.display = "block";
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";
    ticTacToe.style.display = "none";
});

doodleButton.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    birthdayImage.style.display = "none";
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";

    ticTacToe.style.display = "block";
    resetGame();
});

closePopup.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup.style.display = "none";
    popup2.style.display = "none";

    // Reset visibility states
    birthdayImage.style.display = "block";
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";
    ticTacToe.style.display = "none";

    resetGame();
});

// =========================
// DOWNLOAD
// =========================

downloadButton.addEventListener("click", () => {
    const isHiddenActive = hiddenPicture.classList.contains("reveal-active") || hiddenPicture.style.display === "block";
    const image = isHiddenActive ? hiddenPicture : birthdayImage;

    const link = document.createElement("a");
    link.href = image.src;
    link.download = isHiddenActive ? "HappyBirthday.png" : "Doodle.png";
    link.click();
});

// =========================
// TIC TAC TOE GAME LOGIC
// =========================

let board = Array(9).fill("");
let gameOver = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

cells.forEach(cell => {
    cell.addEventListener("click", function () {
        const index = parseInt(this.dataset.index, 10);

        if (board[index] !== "" || gameOver) {
            return;
        }

        board[index] = "X";
        this.textContent = "X";

        // =========================
// PLAYER MOVE WIN CHECK
// =========================

if (checkWinner("X")) {
    gameStatus.textContent = "YOU WIN! 🎉";
    gameOver = true;

    // 1. Hide Tic Tac Toe game
    ticTacToe.style.display = "none";

    // 2. Hide original doodle image
    birthdayImage.style.display = "none";

    // 3. Clear inline style override & apply display + animation
    hiddenPicture.style.display = "block";
    hiddenPicture.classList.remove("reveal-active");
    
    void hiddenPicture.offsetWidth; // Force CSS reflow to restart animation
    
    hiddenPicture.classList.add("reveal-active");

    return;
}

        // Draw
        if (checkDraw()) {
            gameStatus.textContent = "It's a draw! :3";
            gameOver = true;
            return;
        }

        gameStatus.textContent = "Bot is thinking...";
        setTimeout(botMove, 600);
    });
});

// =========================
// BOT LOGIC
// =========================

function botMove() {
    if (gameOver) return;

    let move;

    // 1. Win
    move = findWinningMove("O");
    if (move !== null) {
        makeBotMove(move);
        return;
    }

    // 2. Block
    move = findWinningMove("X");
    if (move !== null) {
        makeBotMove(move);
        return;
    }

    // 3. Center
    if (board[4] === "") {
        makeBotMove(4);
        return;
    }

    // 4. Corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => board[index] === "");

    if (availableCorners.length > 0 && Math.random() < 0.7) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeBotMove(randomCorner);
        return;
    }

    // 5. Random Move
    const emptySpaces = board
        .map((value, index) => (value === "" ? index : null))
        .filter(index => index !== null);

    if (emptySpaces.length > 0) {
        const randomMove = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        makeBotMove(randomMove);
    }
}

function makeBotMove(index) {
    if (gameOver) return;

    board[index] = "O";
    cells[index].textContent = "O";

    if (checkWinner("O")) {
        gameStatus.textContent = "The bot wins! 🤖";
        gameOver = true;
        return;
    }

    if (checkDraw()) {
        gameStatus.textContent = "It's a draw! :3";
        gameOver = true;
        return;
    }

    gameStatus.textContent = "Your turn! You are X";
}

function findWinningMove(player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== "") continue;

        board[i] = player;
        const wins = checkWinner(player);
        board[i] = "";

        if (wins) return i;
    }
    return null;
}

function checkWinner(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function checkDraw() {
    return board.every(cell => cell !== "");
}

// =========================
// RESET GAME FUNCTION
// =========================

function resetGame() {
    board = Array(9).fill("");
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
    });

    // Reset hidden picture back to hidden state
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";

    gameStatus.textContent = "Your turn! You are X";
}
restartGame.addEventListener("click", () => {
    resetGame();
});