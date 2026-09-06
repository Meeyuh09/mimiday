// =========================
// DOM ELEMENTS
// =========================
const birthdayText = document.getElementById("birthdayText");
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

// Sounds & Audio Elements
const clickSound = new Audio("click.mp3");
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
const gameMusic = document.getElementById("gameMusic");

// =========================
// MUSIC & AUDIO CONTROLLERS
// =========================
let musicStarted = false;
let wasSiteMusicPlaying = false;

document.addEventListener("click", function startMusic() {
    if (!musicStarted && music) {
        music.play()
            .then(() => {
                musicStarted = true;
                if (musicButton) musicButton.textContent = "⏸";
            })
            .catch(error => {
                console.log("Music could not start:", error);
            });
    }
}, { once: true });

if (musicButton) {
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
}

function startGameMusic() {
    // 1. Remember if site music was playing and pause it
    if (music && !music.paused) {
        wasSiteMusicPlaying = true;
        music.pause();
    }

    // 2. Reset volume & play game music
    if (gameMusic) {
        gameMusic.volume = 1; // Ensure full volume on start
        if (gameMusic.paused) {
            gameMusic.play().catch(error => {
                console.log("Game music play blocked:", error);
            });
        }
    }
}

// Crossfade settings
const FADE_DURATION = 1500; // Fade time in milliseconds (1 second)
const FADE_STEPS = 20; // Slightly increased steps for extra smooth transitions
const STEP_TIME = FADE_DURATION / FADE_STEPS;

function stopGameMusic() {
    if (!gameMusic) return;

    let stepsCount = 0;
    const initialGameVolume = gameMusic.volume || 1;
    
    // Prepare background music to fade in
    if (music && wasSiteMusicPlaying) {
        music.volume = 0;
        music.play().catch(error => console.log("Main music fade error:", error));
    }

    const fadeInterval = setInterval(() => {
        stepsCount++;
        const progress = stepsCount / FADE_STEPS;

        // 1. Fade OUT game music
        gameMusic.volume = Math.max(0, initialGameVolume * (1 - progress));

        // 2. Fade IN site background music
        if (music && wasSiteMusicPlaying) {
            music.volume = Math.min(1, progress);
        }

        // When crossfade finishes:
        if (stepsCount >= FADE_STEPS) {
            clearInterval(fadeInterval);
            gameMusic.pause();
            gameMusic.currentTime = 0;
            gameMusic.volume = initialGameVolume; // Reset volume for next round
            
            if (music) music.volume = 1;
            wasSiteMusicPlaying = false;
        }
    }, STEP_TIME);
}

// =========================
// POPUP NAVIGATION
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

    birthdayImage.style.display = "block";
    if (birthdayText) birthdayText.style.display = "block"; // 👈 Show with Doodle
    
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";
    ticTacToe.style.display = "none";
});

doodleButton.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    birthdayImage.style.display = "none";
    if (birthdayText) birthdayText.style.display = "none"; // 👈 Hide for Tic Tac Toe
    
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";

    ticTacToe.style.display = "block";

    resetGame();
    startGameMusic();
});

closePopup.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup.style.display = "none";
    popup2.style.display = "none";

    birthdayImage.style.display = "block";
    if (birthdayText) birthdayText.style.display = "block"; // 👈 Reset to default
    
    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";
    ticTacToe.style.display = "none";

    resetGame();
    stopGameMusic();
});

// =========================
// DOWNLOAD BUTTON
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

        // Player Win Check
        if (checkWinner("X")) {
    gameStatus.textContent = "YOU WIN! 🎉";
    gameOver = true;

    stopGameMusic();

    ticTacToe.style.display = "none";
    birthdayImage.style.display = "none";

    if (birthdayText) birthdayText.style.display = "block"; // 👈 Show with Hidden Picture

    hiddenPicture.style.display = "block";
    hiddenPicture.classList.remove("reveal-active");
    void hiddenPicture.offsetWidth;
    hiddenPicture.classList.add("reveal-active");

    return;
}

        // Draw Check
        if (checkDraw()) {
            gameStatus.textContent = "It's a draw! :3";
            gameOver = true;
            stopGameMusic();
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
        gameStatus.textContent = "YOU LOSE, YOU SNOOZE NYAAAAAHAHAH";
        gameOver = true;
        stopGameMusic();
        return;
    }

    if (checkDraw()) {
        gameStatus.textContent = "It's a draw! :3";
        gameOver = true;
        stopGameMusic();
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

function resetGame() {
    board = Array(9).fill("");
    gameOver = false;

    cells.forEach(cell => {
        cell.textContent = "";
    });

    hiddenPicture.classList.remove("reveal-active");
    hiddenPicture.style.display = "none";

    gameStatus.textContent = "Your turn! You are X";
}

// Restart button only resets the game board (music continues playing without restarting)
restartGame.addEventListener("click", () => {
    resetGame();
});