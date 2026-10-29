// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdown;
let timeLeft = 30;
let score = 0;
const winningMessages = ["You win!", "Great job, you win!", "You did it!"];
const losingMessages = ["Try again!", "Almost there - try again!", "Keep practicing!"];
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const resultDisplay = document.getElementById("game-result");
const milestoneMessage = document.getElementById("milestone-message");
const startButton = document.getElementById("start-btn");
const replayButton = document.getElementById("replay-btn");
const difficultySelect = document.getElementById("difficulty");
const difficultyDescription = document.getElementById("difficulty-description");
const gameStartSound = document.getElementById("game-start-sound");
const gameOverSound = document.getElementById("game-over-sound");
const gameWinSound = document.getElementById("game-win-sound");
const scoreTargets = { easy: 5, medium: 10, hard: 15 };
const difficultyDescriptions = {
  easy: "Reach 5 points in 30 seconds. Red drops subtract a point.",
  medium: "Reach 10 points in 30 seconds. Red drops subtract a point.",
  hard: "Reach 15 points in 30 seconds. Avoid red drops—they end the game."
};
const badDropChances = { easy: 0.2, medium: 0.3, hard: 0.5 };
const dropFallDurations = { easy: "4s", medium: "3s", hard: "2s" };
let gameDifficulty = difficultySelect.value;

// Wait for button click to start the game
startButton.addEventListener("click", startGame);
replayButton.addEventListener("click", startGame);
difficultySelect.addEventListener("change", updateDifficultyDescription);
updateDifficultyDescription();

function updateDifficultyDescription() {
  difficultyDescription.textContent = difficultyDescriptions[difficultySelect.value];
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch((error) => {
    console.error("Unable to play game sound:", error);
  });
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  startButton.hidden = true;
  replayButton.hidden = true;
  difficultySelect.disabled = true;
  gameDifficulty = difficultySelect.value;
  score = 0;
  scoreDisplay.textContent = score;
  milestoneMessage.hidden = true;
  timeLeft = 30;
  timeDisplay.textContent = timeLeft;
  resultDisplay.textContent = "";
  playSound(gameStartSound);

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
  countdown = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0) endGame(score >= scoreTargets[gameDifficulty]);
  }, 1000);
}

function endGame(won, message) {
  if (!gameRunning) return;

  clearInterval(countdown);
  clearInterval(dropMaker);
  gameRunning = false;
  document.querySelectorAll("#game-container .water-drop").forEach((drop) => drop.remove());
  difficultySelect.disabled = false;
  replayButton.hidden = false;
  playSound(won ? gameWinSound : gameOverSound);

  if (message) {
    resultDisplay.textContent = message;
    return;
  }

  const messages = won ? winningMessages : losingMessages;
  resultDisplay.textContent = messages[Math.floor(Math.random() * messages.length)];
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  const isBadDrop = Math.random() < badDropChances[gameDifficulty];
  if (isBadDrop) drop.classList.add("bad-drop");

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  drop.style.animationDuration = dropFallDurations[gameDifficulty];

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    if (isBadDrop && gameDifficulty === "hard") {
      endGame(false, "You caught a red drop! Game over.");
      return;
    }

    score += isBadDrop ? -1 : 1;
    scoreDisplay.textContent = score;
    if (score >= Math.ceil(scoreTargets[gameDifficulty] / 2)) {
      milestoneMessage.hidden = false;
    }
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
