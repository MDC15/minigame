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
let maxScore = 100; // Maximum possible score
let timeBonusFactor = 0.5; // Bonus factor for time
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
  timeLeft = 30;
  scoreDisplay.innerText = score;
  timeDisplay.innerText = timeLeft;
  showScreen(gameScreen);
  loadQuestion();
  startTimer();
}

// Load Question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.innerText = currentQuestion.question;

  // Clear previous answer buttons and load new ones
  answerButtons.forEach((button, index) => {
    button.innerText = currentQuestion.answers[index];
    button.onclick = () => checkAnswer(currentQuestion.correctAnswer, index);
  });
}

// Check Answer
function checkAnswer(correctAnswer, selectedAnswer) {
  if (selectedAnswer === correctAnswer) {
    score++;
    scoreDisplay.innerText = score;
    showNotification("Correct!", "success");
  } else {
    showNotification("Wrong answer", "error");
  }

  // Move to the next question
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

// Timer Function
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// End Game
function endGame() {
  clearInterval(timer);
  calculateScore();
}

// Calculate Score
function calculateScore() {
  const totalQuestions = questions.length;
  const correctAnswers = score; // Assuming 'score' holds the count of correct answers
  const baseScore = (correctAnswers / totalQuestions) * maxScore; // Base score based on correct answers

  // Calculate bonus based on time left
  const timeBonus = (timeLeft / 30) * (maxScore * timeBonusFactor); // Max bonus is a portion of the total score

  // Final score is base score plus time bonus, but capped at maxScore
  let finalScore = Math.min(baseScore + timeBonus, maxScore);
  finalScore = Math.round(finalScore); // Round to nearest integer

  if (finalScore === 100) {
    finalScoreDisplay.innerText = "Bạn đã hoàn thành trò chơi với điểm tuyệt đối!";
  } else {
    finalScoreDisplay.innerText = `Điểm của bạn: ${finalScore}`;
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
