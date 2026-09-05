const button = document.getElementById("myButton");
const popup = document.getElementById("popup");
const popup2 = document.getElementById("popup2");

const nextButton = document.getElementById("nextButton");
const closePopup = document.getElementById("closePopup");

// Sounds
const clickSound = new Audio("click.mp3");
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");


// =========================
// START MUSIC ON FIRST PAGE CLICK
// =========================

let musicStarted = false;

document.addEventListener("click", () => {
    if (!musicStarted) {
        music.play()
            .then(() => {
                musicStarted = true;
                musicButton.textContent = "⏸";
            })
            .catch((error) => {
                console.log("Music could not start:", error);
            });
    }
}, { once: true });


// =========================
// OPEN FIRST POPUP
// =========================

button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup.style.display = "flex";
});


// =========================
// OPEN SECOND POPUP
// =========================

nextButton.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup.style.display = "none";

    popup2.classList.remove("show");

    void popup2.offsetWidth;

    popup2.classList.add("show");
});


// =========================
// CLOSE SECOND POPUP
// =========================

closePopup.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    popup2.classList.remove("show");
});


// =========================
// PLAY / PAUSE MUSIC
// =========================

musicButton.addEventListener("click", (event) => {
    // Stop this click from being treated as the first-page click
    event.stopPropagation();

    if (music.paused) {
        music.play();
        musicButton.textContent = "⏸";
    } else {
        music.pause();
        musicButton.textContent = "▶";
    }
});
const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", function () {
    const image = document.getElementById("birthdayImage");

    const link = document.createElement("a");
    link.href = image.src;
    link.download = "HappyBirthday.png";

    link.click();
});
