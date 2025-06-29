
let currentPlayer = 0;
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const rollBtn = document.getElementById('rollBtn');

function rollDice() {
    rollBtn.disabled = true;
    dice1.style.transform = "rotate(360deg)";
    dice2.style.transform = "rotate(360deg)";
    setTimeout(() => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        dice1.textContent = d1;
        dice2.textContent = d2;
        dice1.style.transform = "rotate(0deg)";
        dice2.style.transform = "rotate(0deg)";
        rollBtn.disabled = false;
    }, 500);
}

rollBtn.addEventListener('click', rollDice);
