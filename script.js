// Check Answer
function checkAnswer(questions, selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].correct;
  if (selectedIndex === correctIndex) {
    score += basePoints;
    // Award bonus points only if timeLeft is greater than 25 seconds
    if (timeLeft > 25) {
      const bonusPoints = Math.floor(Math.random() * 5);
      score += bonusPoints;
      showNotification(`Chính xác! Bạn nhận được ${basePoints + bonusPoints} điểm.`, 'success');
    } else {
      showNotification(`Chính xác! Bạn nhận được ${basePoints} điểm.`, 'success');
    }
    // Kiểm tra và giới hạn điểm tối đa là 100
    score = Math.min(score, 100); // Giới hạn điểm tối đa là 100
    scoreDisplay.innerText = score;
  } else {
    showNotification("Sai rồi!", 'error');
  }
  nextQuestion(questions);
}
