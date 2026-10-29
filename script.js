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

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = score;
  timeLeft = 30;
  timeDisplay.textContent = timeLeft;
  resultDisplay.textContent = "";

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);
  countdown = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(countdown);
      clearInterval(dropMaker);
      gameRunning = false;
      document.getElementById("game-container").replaceChildren();

      let messages;
      if (score >= 20) {
        messages = winningMessages;
      } else {
        messages = losingMessages;
      }
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      resultDisplay.textContent = randomMessage;
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

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

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  drop.addEventListener("click", () => {
    if (!gameRunning) return;

    score += 1;
    scoreDisplay.textContent = score;
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
