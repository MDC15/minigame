// DOM Elements
const questionText = document.getElementById('question-text');
const answerButtons = document.querySelectorAll('.answer-btn');
const timeDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const nameInput = document.getElementById('name');
const rankingList = document.getElementById('rankingList');

// Game Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let basePoints = 25;
let playerName = '';
let questions = [];

// Load Questions from API
fetch('http://127.0.0.1:8081/questions')
    .then(response => response.json())
    .then(data => {
        questions = data.questions; // Access the questions array inside the JSON
        startButton.addEventListener('click', () => startGame());
        restartButton.addEventListener('click', () => restartGame());
    })
    .catch(error => {
        console.error("Error loading questions:", error);
        alert("Lỗi khi tải câu hỏi, vui lòng kiểm tra lại!");
    });

// Start Game
function startGame() {
    playerName = nameInput.value.trim();
    if (playerName === "") {
        alert("Vui lòng nhập tên của bạn!");
        return;
    }
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
        button.innerText = currentQuestion.options[index];
        button.onclick = () => checkAnswer(index); // Attach click handler to check answer
    });
    resetTimer();
}

// Check Answer
function checkAnswer(selectedIndex) {
    const correctIndex = parseInt(questions[currentQuestionIndex].correct_answer) - 1; // Adjust to zero-based index
    if (selectedIndex === correctIndex) {
        score += basePoints;
        if (timeLeft > 25) {
            const bonusPoints = Math.floor(Math.random() * 5);
            score += bonusPoints;
        }
        scoreDisplay.innerText = score;
        alert("Đáp án đúng! Điểm: " + score); // Thông báo đáp án đúng
    } else {
        alert("Đáp án sai! Điểm: " + score); // Thông báo đáp án sai
    }

    // Move to next question after short delay
    setTimeout(() => {
        nextQuestion();
    }, 1000); // Delay to let the player see the feedback
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
            setTimeout(() => {
                nextQuestion(); // Automatically move to next question if time runs out
            }, 1000);
        }
    }, 1000);
}

// End Game and Submit Score
function endGame() {
    clearInterval(timer);
    finalScoreDisplay.innerText = score;
    showScreen(endScreen);
}

// Submit Score to Server
function submitScore() {
    if (!playerName || score === undefined || timeLeft < 0) {
        alert('Thông tin điểm không hợp lệ!');
        return;
    }

    const scoreData = {
        name: playerName,
        score: score,
        time: timeLeft // Include time in the payload
    };

    fetch('http://127.0.0.1:8081/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scoreData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Response error:', errorData);
                    throw new Error('Error submitting score: ' + errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Điểm của bạn đã được gửi thành công!');
            fetchRanking(); // Fetch ranking after score submission
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi gửi điểm!');
        });
}

// Fetch Ranking from Server
function fetchRanking() {
    fetch('http://127.0.0.1:8081/ranking')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching ranking');
            }
            return response.json();
        })
        .then(rankingData => {
            displayRanking(rankingData);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi lấy bảng xếp hạng!');
        });
}

// Display Ranking
function displayRanking(rankingData) {
    rankingList.innerHTML = ''; // Clear previous ranking data

    if (rankingData.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'Chưa có dữ liệu bảng xếp hạng!';
        rankingList.appendChild(message);
        return;
    }

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Hạng';
    headerRow.insertCell().textContent = 'Tên';
    headerRow.insertCell().textContent = 'Điểm';
    headerRow.insertCell().textContent = 'Thời gian còn lại';

    rankingData.forEach((player, index) => {
        const row = table.insertRow();
        row.insertCell().textContent = index + 1; // Rank
        row.insertCell().textContent = player.name; // Player's Name
        row.insertCell().textContent = player.score; // Player's Score
        row.insertCell().textContent = player.time; // Player's Remaining Time
    });

    rankingList.appendChild(table);
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
