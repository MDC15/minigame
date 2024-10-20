let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;
let playerName = '';
let questions = [];
let startTime; // Biến để lưu thời gian bắt đầu trò chơi

// Load Questions from API
fetch('http://127.0.0.1:3080/questions')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('view-ranking-btn').addEventListener('click', viewRanking);
    })
    .catch(error => alert("Lỗi khi tải câu hỏi, vui lòng kiểm tra lại!"));

// Start Game
function startGame() {
    playerName = document.getElementById('name').value.trim();
    if (!playerName) return alert("Tên không hợp lệ!");

    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 30;
    startTime = Date.now(); // Ghi lại thời gian bắt đầu trò chơi

    document.getElementById('start-screen').style.display = 'none'; // Ẩn màn hình bắt đầu
    renderGameScreen();
    loadQuestion();
}

// Render Game Screen
function renderGameScreen() {
    document.getElementById('app').style.display = 'block'; // Hiện giao diện app
    document.getElementById('app').innerHTML = `
        <div id="game-screen" class="screen active">
            <div class="game-container">
                <div class="question">
                    <h2 id="question-text">Câu hỏi sẽ xuất hiện ở đây</h2>
                </div>
                <div class="answers">
                    ${[0, 1, 2, 3].map(i => `<button class="answer-btn" data-index="${i}">Đáp án ${i + 1}</button>`).join('')}
                </div>
                <div class="timer">
                    <p>Thời gian còn lại: <span id="time-left">30</span> giây</p>
                </div>
                <div class="score">
                    <p>Điểm: <span id="score">0</span></p>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', () => checkAnswer(button.dataset.index));
    });

    resetTimer();
}

// Load Question
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = currentQuestion.question;
    document.querySelectorAll('.answer-btn').forEach((button, index) => {
        button.innerText = currentQuestion.options[index];
    });
}

// Check Answer
function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct_answer - 1;
    score += (selectedIndex == correctIndex) ? (timeLeft > 25 ? Math.floor(Math.random() * 5) + 25 : 25) : 0;
    document.getElementById('score').innerText = score;
    alert(selectedIndex == correctIndex ? `Đáp án đúng! Điểm: ${score}` : `Đáp án sai! Điểm: ${score}`);
    setTimeout(nextQuestion, 1000);
}

// Next Question or End Game
function nextQuestion() {
    if (++currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

// Timer Functions
function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('time-left').innerText = timeLeft;
    timer = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(timer);
            alert("Thời gian đã hết!");
            endGame();
        }
        document.getElementById('time-left').innerText = timeLeft;
    }, 1000);
}

// End Game
function endGame() {
    clearInterval(timer);
    document.getElementById('final-score').innerText = score;
    document.getElementById('end-screen').style.display = 'block'; // Hiện màn hình kết thúc
    document.getElementById('app').style.display = 'none'; // Ẩn màn hình game
    alert(`Kết thúc trò chơi! Điểm của bạn: ${score}`);

    // Gửi dữ liệu điểm và tên người chơi lên server
    submitScore();
}

// Submit Score to Server
function submitScore() {
    const timePlayed = Math.floor((Date.now() - startTime) / 1000); // Tính thời gian đã chơi (giây)

    const scoreData = {
        name: playerName,
        score: score,
        time: timePlayed // Gửi thời gian đã chơi
    };

    fetch('http://127.0.0.1:3080/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi gửi điểm');
            }
            return response.json();
        })
        .then(data => {
            alert('Điểm của bạn đã được gửi thành công!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi gửi điểm: ' + error.message);
        });
}

// View Ranking
function viewRanking() {
    window.open('http://localhost:8501', '_blank'); // Mở bảng xếp hạng trong tab mới
}
