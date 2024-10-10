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
let basePoints = 25;

// Load Questions from JSON
fetch('questions.json')
  .then(response => response.json())
  .then(questions => {
    // Event Listeners
    startButton.addEventListener('click', () => startGame(questions));
    restartButton.addEventListener('click', () => restartGame(questions));
  });

// Start Game
function startGame(questions) {
  score = 0;
  currentQuestionIndex = 0;
  scoreDisplay.innerText = score;
  showScreen(gameScreen);
  loadQuestion(questions);
}

// Load Question
function loadQuestion(questions) {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;
  answerButtons.forEach((button, index) => {
    button.innerText = currentQuestion.answers[index];
    button.onclick = () => checkAnswer(questions, index);
  });
  resetTimer();
}

// Check Answer
function checkAnswer(questions, selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].correct;
  if (selectedIndex === correctIndex) {
    score += basePoints;
    // Award bonus points only if timeLeft is greater than 25 seconds
    if (timeLeft > 25) {
      const bonusPoints = 25);
      score += bonusPoints;
      showNotification(`Chính xác! Bạn nhận được ${basePoints + bonusPoints} điểm.`, 'success');
    } else {
      showNotification(`Chính xác! Bạn nhận được ${basePoints} điểm.`, 'success');
    }
    scoreDisplay.innerText = score;
  } else {
    showNotification("Sai rồi!", 'error');
  }
  nextQuestion(questions);
}

// Next Question or End Game
function nextQuestion(questions) {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion(questions);
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
function restartGame(questions) {
  startGame(questions);
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
