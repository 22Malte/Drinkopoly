
let players = JSON.parse(localStorage.getItem("drinkopoly_players")) || [];
let currentPlayerIndex = 0;
let cards = null;

function fetchCards() {
  return fetch('cards.json')
    .then(response => response.json())
    .then(data => { cards = data; });
}

function createBoard(players) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const totalFields = 40;

  for (let i = 0; i < totalFields; i++) {
    const field = document.createElement("div");
    field.classList.add("board-field");
    field.dataset.index = i;
    board.appendChild(field);
  }

  players.forEach(p => p.position = 0);
  updatePlayerTokens(players);
}

function updatePlayerTokens(players) {
  const fields = document.querySelectorAll(".board-field");
  fields.forEach(f => f.innerHTML = "");

  players.forEach(p => {
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.textContent = p.emoji;
    fields[p.position].appendChild(token);
  });
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function highlightCurrentPlayer() {
  const orderBar = document.getElementById("player-order");
  orderBar.innerHTML = "";
  players.forEach((p, idx) => {
    const el = document.createElement("span");
    el.textContent = p.emoji;
    if (idx === currentPlayerIndex) {
      el.style.border = "2px solid white";
    }
    orderBar.appendChild(el);
  });
}

function getRandomCard(type, players) {
  const deck = cards[type];
  const card = deck[Math.floor(Math.random() * deck.length)];

  const shuffled = players.slice().sort(() => 0.5 - Math.random());
  let text = card.text
    .replace(/{{spieler1}}/g, shuffled[0].name)
    .replace(/{{spieler2}}/g, shuffled[1] ? shuffled[1].name : shuffled[0].name);

  return { title: card.titel, text };
}

function showCard(card) {
  const popup = document.getElementById("card-popup");
  document.getElementById("card-title").textContent = card.title;
  document.getElementById("card-text").textContent = card.text;
  popup.classList.remove("hidden");
}

function hideCard() {
  document.getElementById("card-popup").classList.add("hidden");
}

document.getElementById("card-done").addEventListener("click", hideCard);

function startGame() {
  fetchCards().then(() => {
    createBoard(players);
    highlightCurrentPlayer();

    const diceBtn = document.getElementById("roll-dice");
    diceBtn.addEventListener("click", () => {
      const player = players[currentPlayerIndex];
      const roll = rollDice();
      player.position = (player.position + roll) % 40;
      updatePlayerTokens(players);

      // Wenn Feld Ereignisfeld (z. B. jede 5.)
      if (player.position % 5 === 0) {
        const card = getRandomCard("ereignis", players);
        showCard(card);
      }

      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      highlightCurrentPlayer();
    });
  });
}

startGame();
