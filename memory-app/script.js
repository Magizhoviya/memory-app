const emojis = ["🍎","🍌","🍓","🍇","🍒","🍉","🥝","🍍"];
let cards = [...emojis, ...emojis];

// Shuffle the cards
cards.sort(() => Math.random() - 0.5);

const game = document.getElementById("game");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restartBtn");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timerInterval;

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timerDisplay.textContent = time;
    }, 1000);
}

// Create game board
function generateBoard() {
    game.innerHTML = "";
    cards.forEach((emoji) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-inner">
                <div class="front">${emoji}</div>
                <div class="back">?</div>
            </div>
        `;

        card.addEventListener("click", handleCardClick);
        game.appendChild(card);
    });
}

function handleCardClick() {
    if (lockBoard) return;
    if (this.classList.contains("flipped")) return;

    // Start timer on first flip
    if (moves === 0 && time === 0) startTimer();

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    let firstEmoji = firstCard.querySelector(".front").textContent;
    let secondEmoji = secondCard.querySelector(".front").textContent;

    if (firstEmoji === secondEmoji) {
        firstCard = null;
        secondCard = null;

        checkGameComplete(); // ✅ Check if all cards are matched

    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        }, 1000);
    }
}


function restartGame() {
    clearInterval(timerInterval);
    time = 0;
    moves = 0;
    timerDisplay.textContent = 0;
    movesDisplay.textContent = 0;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    cards.sort(() => Math.random() - 0.5);
    generateBoard();
}

function checkGameComplete() {
    const allFlipped = document.querySelectorAll(".flipped").length;
    if (allFlipped === cards.length) {
        clearInterval(timerInterval);   // ⏳ Stop timer
        alert("🎉 Game Completed in " + time + " seconds and " + moves + " moves!");
    }
}


restartBtn.addEventListener("click", restartGame);


// Initialize
generateBoard();
