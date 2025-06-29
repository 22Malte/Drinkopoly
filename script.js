
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
        players.push({ name, emoji, position: 0 });
      }
    });

    if (!valid) return;

    localStorage.setItem("drinkopoly_players", JSON.stringify(players));
    startGame(players);
    document.getElementById("setup-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
  });

  createPlayerInput();
  createPlayerInput();
});

function startGame(players) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const field = document.createElement("div");
    field.classList.add("board-field");
    field.textContent = i;
    board.appendChild(field);
  }

  const orderBar = document.getElementById("player-order");
  orderBar.innerHTML = "";
  players.forEach((p, i) => {
    const el = document.createElement("span");
    el.textContent = p.emoji;
    orderBar.appendChild(el);
  });

  let currentPlayer = 0;
  updateTokens(players);

  document.getElementById("roll-dice").addEventListener("click", () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    players[currentPlayer].position = (players[currentPlayer].position + roll) % 40;
    updateTokens(players);
    currentPlayer = (currentPlayer + 1) % players.length;
  });
}

function updateTokens(players) {
  const fields = document.querySelectorAll(".board-field");
  fields.forEach(f => f.innerHTML = "");
  players.forEach(p => {
    const token = document.createElement("div");
    token.classList.add("player-token");
    token.textContent = p.emoji;
    fields[p.position].appendChild(token);
  });
}
