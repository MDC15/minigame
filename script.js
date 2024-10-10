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
let maxScore = 100; // Giới hạn điểm tối đa
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
  timeLeft = 30; // Khởi tạo lại thời gian cho mỗi trò chơi
  startTimer(); // Bắt đầu đếm ngược thời gian
  showScreen(gameScreen);
  loadQuestion();
}

// Timer countdown
function startTimer() {
  clearInterval(timer); // Đảm bảo không có đồng hồ đếm ngược cũ nào chạy
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// Load Question
function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;
    answerButtons.forEach((button, index) => {
      button.innerText = currentQuestion.answers[index];
      button.onclick = () => checkAnswer(index);
    });
  } else {
    endGame(); // Kết thúc trò chơi khi hết câu hỏi
  }
}

// Check Answer
function checkAnswer(selectedIndex) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedIndex === currentQuestion.correctAnswer) {
    score++;
    showNotification('Đúng!', 'success');
  } else {
    showNotification('Sai!', 'error');
  }
  currentQuestionIndex++;
  loadQuestion(); // Load câu hỏi tiếp theo
}

// Tính toán điểm cuối cùng dựa trên số câu trả lời đúng và thời gian còn lại
function calculateFinalScore() {
  const correctAnswersScore = (score / questions.length) * maxScore * 0.7; // 70% của tổng điểm từ câu trả lời đúng
  const timeBonus = (timeLeft / 30) * maxScore * 0.3; // 30% của tổng điểm từ thời gian còn lại

  let finalScore = correctAnswersScore + timeBonus;

  // Đảm bảo điểm không vượt quá 100
  if (finalScore > maxScore) {
    finalScore = maxScore;
  }

  return Math.round(finalScore); // Trả về số điểm làm tròn
}

// End Game
function endGame() {
  clearInterval(timer);
  const finalScore = calculateFinalScore();
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
