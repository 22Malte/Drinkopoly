
function rollDice() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  document.getElementById('dice1').textContent = getDieFace(die1);
  document.getElementById('dice2').textContent = getDieFace(die2);
  document.getElementById('dice-result').textContent = `Du hast eine ${die1 + die2} gewürfelt`;
}

function getDieFace(n) {
  return ['⚀','⚁','⚂','⚃','⚄','⚅'][n-1];
}
