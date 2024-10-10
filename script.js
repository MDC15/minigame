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
let timeLeft = 0;
let timer;
let maxScore = 100; // Tổng điểm tối đa
let questions = []; // Dữ liệu câu hỏi từ file JSON
let questionTimeLimit = 15; // Thời gian tối đa cho mỗi câu hỏi là 15 giây
let maxQuestionPoints = 10; // Mỗi câu hỏi tối đa 10 điểm

// Load Questions from JSON
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
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

// Start timer for a question
function startTimer() {
  clearInterval(timer);
  timeLeft = questionTimeLimit;
  timeDisplay.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(-1); // Người chơi không trả lời được
    }
  }, 1000);
}

// Load the current question
function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.innerText = currentQuestion.question;

    answerButtons.forEach((button, index) => {
      button.innerText = currentQuestion.answers[index];
      button.onclick = () => checkAnswer(index);
    });

    // Bắt đầu đếm thời gian cho câu hỏi
    startTimer();
  } else {
    endGame(); // Kết thúc trò chơi khi hết câu hỏi
  }
}

// Check Answer and calculate score
function checkAnswer(selectedIndex) {
  clearInterval(timer);

  const currentQuestion = questions[currentQuestionIndex];

  if (selectedIndex === currentQuestion.correctAnswer) {
    // Người chơi trả lời đúng -> Tính điểm dựa trên thời gian còn lại
    let pointsEarned = (timeLeft / questionTimeLimit) * maxQuestionPoints;
    score += pointsEarned;
    showNotification(`Đúng! +${Math.round(pointsEarned)} điểm`, 'success');
  } else {
    // Người chơi trả lời sai
    showNotification('Sai! Không có điểm.', 'error');
  }

  // Cập nhật điểm hiển thị
  scoreDisplay.innerText = Math.round(score);

  // Chuyển sang câu hỏi tiếp theo
  currentQuestionIndex++;
  loadQuestion();
}

// End game and display the final score
function endGame() {
  clearInterval(timer);

  // Điểm cuối cùng
  let finalScore = Math.min(Math.round(score), maxScore); // Đảm bảo điểm không vượt quá 100

  if (finalScore === 100) {
    finalScoreDisplay.innerText = "Xuất sắc! Bạn đã đạt 100 điểm!";
  } else {
    finalScoreDisplay.innerText = `Điểm cuối cùng của bạn: ${finalScore}`;
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
  }, 2000);
}
