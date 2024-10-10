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
  const currentQuestion = questions[curre100) {
    finalScoreDisplay.innerText = "Bạn đã hoàn thành trò chơi với điểm tuyệt đối!";
  } else {
    finalScoreDisplay.innerText = `Điểm của bạn: ${score}`;
  }
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
