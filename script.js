
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("player-form");
  const inputs = document.getElementById("player-inputs");
  const addBtn = document.getElementById("add-player");
  const clearBtn = document.getElementById("clear-players");
  const emojis = ["😎","🤪","🥴","👽","👻","🧠","🦑","🦖","🍺","🍷","🍸","🥃"];
  let emojiIndex = 0;

  const saved = JSON.parse(localStorage.getItem("drinkopoly_players") || "[]");
  saved.forEach(p => addPlayerInput(p.name, p.emoji));

  addBtn.onclick = () => addPlayerInput();

  clearBtn.onclick = () => {
    localStorage.removeItem("drinkopoly_players");
    location.reload();
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const rows = inputs.querySelectorAll(".player-row");
    const players = [];
    const usedNames = new Set();
    const usedEmojis = new Set();
    let valid = true;

    rows.forEach(row => {
      const name = row.children[0].value.trim();
      const emoji = row.children[1].value.trim() || emojis[emojiIndex++ % emojis.length];
      row.children[0].classList.remove("error");
      row.children[1].classList.remove("error");
      if (!name || usedNames.has(name)) {
        row.children[0].classList.add("error"); valid = false;
      }
      if (usedEmojis.has(emoji)) {
        row.children[1].classList.add("error"); valid = false;
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
  };

  function addPlayerInput(name = "", emoji = "") {
    const row = document.createElement("div");
    row.className = "player-row";
    row.innerHTML = \`<input placeholder="Name" value="\${name}"><input placeholder="Emoji" value="\${emoji}">\`;
    inputs.appendChild(row);
  }
});

function startGame(players) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const fieldTypes = Array(40).fill("sip");
  [1, 4, 7, 10, 15, 20, 25, 30, 35].forEach(i => fieldTypes[i] = "shot");

  // Monopoly Anordnung (index auf grid anpassen)
  const order = [
    [10,10], [9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[0,10],
    [0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
    [10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9]
  ];

  for (let i = 0; i < 40; i++) {
    const div = document.createElement("div");
    div.className = "board-field";
    if (i % 10 === 0) div.classList.add("corner");
    div.dataset.index = i;
    div.style.gridColumnStart = order[i][0] + 1;
    div.style.gridRowStart = order[i][1] + 1;
    board.appendChild(div);
  }

  updateTokens(players);

  let current = 0;
  document.getElementById("roll-dice").onclick = () => {
    const r1 = Math.floor(Math.random()*6)+1;
    const r2 = Math.floor(Math.random()*6)+1;
    showDice(r1, r2);
    setTimeout(() => {
      const total = r1 + r2;
      players[current].position = (players[current].position + total) % 40;
      updateTokens(players);
      const type = fieldTypes[players[current].position];
      if (type === "shot") showPopup(\`\${players[current].name} trinkt 1 Shot!\`);
      if (type === "sip") showPopup(\`\${players[current].name} trinkt 2 Schlücke!\`);
      current = (current + 1) % players.length;
    }, 400);
  };

  document.getElementById("popup-close").onclick = () => {
    document.getElementById("popup").classList.add("hidden");
  };
}

function updateTokens(players) {
  const fields = document.querySelectorAll(".board-field");
  fields.forEach(f => f.innerHTML = "");
  players.forEach(p => {
    const el = document.createElement("div");
    el.className = "player-token";
    el.textContent = p.emoji;
    fields[p.position].appendChild(el);
  });
}

function showDice(r1, r2) {
  document.getElementById("die1").textContent = ["","⚀","⚁","⚂","⚃","⚄","⚅"][r1];
  document.getElementById("die2").textContent = ["","⚀","⚁","⚂","⚃","⚄","⚅"][r2];
}

function showPopup(text) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-text").textContent = text;
  popup.classList.remove("hidden");
}
