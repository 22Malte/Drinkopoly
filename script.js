document.addEventListener("DOMContentLoaded", () => {
  const playerForm = document.getElementById("player-form");
  const playerInputs = document.getElementById("player-inputs");
  const addPlayerBtn = document.getElementById("add-player");

  const emojis = ["😎","🤪","🥴","👽","👻","🧠","🦑","🦖","🍺","🍷","🍸","🥃"];
  let emojiIndex = 0;

  function createPlayerInput() {
    const row = document.createElement("div");
    row.classList.add("player-row");

    const nameInput = document.createElement("input");
    nameInput.placeholder = "Name";

    const emojiInput = document.createElement("input");
    emojiInput.placeholder = "Emoji";

    row.appendChild(nameInput);
    row.appendChild(emojiInput);
    playerInputs.appendChild(row);
  }

  addPlayerBtn.addEventListener("click", () => {
    createPlayerInput();
  });

  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const players = [];
    const rows = playerInputs.querySelectorAll(".player-row");
    let valid = true;

    const usedNames = new Set();
    const usedEmojis = new Set();

    rows.forEach((row) => {
      const name = row.children[0].value.trim();
      const emoji = row.children[1].value.trim() || emojis[emojiIndex++ % emojis.length];

      row.children[0].classList.remove("error");
      row.children[1].classList.remove("error");

      if (!name) {
        row.children[0].classList.add("error");
        valid = false;
      } else if (usedNames.has(name)) {
        row.children[0].classList.add("error");
        valid = false;
      }

      if (usedEmojis.has(emoji)) {
        row.children[1].classList.add("error");
        valid = false;
      }

      if (valid) {
        usedNames.add(name);
        usedEmojis.add(emoji);
        players.push({ name, emoji });
      }
    });

    if (!valid) return;

    localStorage.setItem("drinkopoly_players", JSON.stringify(players));
    document.getElementById("setup-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    const orderBar = document.getElementById("player-order");
    players.forEach(p => {
      const span = document.createElement("span");
      span.textContent = p.emoji;
      orderBar.appendChild(span);
    });

    // TODO: Init game board & start logic
  });

  // Starte mit zwei Spielern
  createPlayerInput();
  createPlayerInput();
});


function createBoard(players) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const totalFields = 40;

  for (let i = 0; i < totalFields; i++) {
    const field = document.createElement("div");
    field.classList.add("board-field");
    field.textContent = i;
    board.appendChild(field);
  }

  // Spielerpositionen vorbereiten
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

let currentPlayerIndex = 0;
let players = [];

function startGame() {
  players = JSON.parse(localStorage.getItem("drinkopoly_players")) || [];
  createBoard(players);

  const diceButton = document.getElementById("roll-dice");
  diceButton.addEventListener("click", () => {
    const player = players[currentPlayerIndex];
    const roll = rollDice();
    player.position = (player.position + roll) % 40;
    updatePlayerTokens(players);

    // TODO: Hier Feldaktion auslösen

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    highlightCurrentPlayer();
  });

  highlightCurrentPlayer();
}

function highlightCurrentPlayer() {
  const orderBar = document.getElementById("player-order");
  Array.from(orderBar.children).forEach((el, index) => {
    if (index === currentPlayerIndex) {
      el.style.border = "2px solid white";
    } else {
      el.style.border = "none";
    }
  });
}

startGame();
