// DOM Elements
const questionText = document.getElementById('question-text');
const answerButtons = document.querySelectorAll('.answer-btn');
const timeDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const notification = document.getElementById('notification');

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Game Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let basePoints = 80; // Điểm cơ bản cho mỗi câu (80/100)

let questions = []; // Store questions data here

// Load Questions from JSON
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
  });

// Start Game
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  scoreDisplay.innerText = score;
  showScreen(gameScreen);
  loadQuestion();
}

// Load Question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;
  answerButtons.forEach((button, index) => {
    button.innerText = currentQuestion.answers[index];
    button.onclick = () => checkAnswer(index);
  });
  resetTimer();
}

// Check Answer
function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].correct;
  if (selectedIndex === correctIndex) {
    score += basePoints; // Add base points
    const timeBonus = calculateTimeBonus(timeLeft); // Calculate time bonus
    score += timeBonus; // Add time bonus
    showNotification(
      `Chính xác! Bạn nhận được ${basePoints + timeBonus} điểm.`,
      'success'
    );
    scoreDisplay.innerText = score;
  } else {
    showNotification("Sai rồi!", 'error');
  }
  nextQuestion();
}

// Calculate Time Bonus
function calculateTimeBonus(timeRemaining) {
  // Time bonus is calculated based on the percentage of remaining time
  const maxBonus = 20; // Maximum bonus points (20/100)
  const timePercentage = (timeRemaining / 30) * 100; // Time used as a percentage
  const bonus = Math.round((maxBonus * timePercentage) / 100); // Calculate bonus based on percentage
  return bonus;
}

// Next Question or End Game
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

// Reset Timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timeDisplay.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showNotification("Hết giờ!", 'warning');
      nextQuestion();
    }
  }, 1000);
}

// End Game
function endGame() {
  clearInterval(timer);
  finalScoreDisplay.innerText = score;
  showScreen(endScreen);
}

// Restart Game
function restartGame() {
  startGame();
}

// Show Screen
function showScreen(screen) {
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  endScreen.classList.remove('active');
  screen.classList.add('active');
}

// Show Notification
function showNotification(message, type) {
  notification.innerText = message;
  notification.classList.add(type);
  notification.classList.add('active');
  setTimeout(() => {
    notification.classList.remove('active');
    notification.classList.remove(type);
  }, 2500);
}
