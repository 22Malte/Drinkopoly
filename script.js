function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice').innerText = `Du hast eine ${dice} gewürfelt`;
}