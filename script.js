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
