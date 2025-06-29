let players = [];
let current = 0;
let fieldTypes = Array(40).fill("sip");
let ownedStations = {};

document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("drinkopoly_players") || "[]");
  const inputs = document.getElementById("player-inputs");
  if (saved.length === 0) {
    addInput();
    addInput();
  } else {
    saved.forEach(p => addInput(p.name, p.emoji));
  }

  document.getElementById("add-player").onclick = () => addInput();
  document.getElementById("clear-players").onclick = () => { localStorage.removeItem("drinkopoly_players"); location.reload(); };
  document.getElementById("popup-close").onmousedown = handleHold;
  document.getElementById("popup-close").onmouseup = cancelHold;

  document.getElementById("player-form").onsubmit = e => {
    e.preventDefault();
    const rows = inputs.querySelectorAll(".player-row");
    players = [];
    const names = new Set(), emojis = new Set();
    let valid = true;
    rows.forEach(row => {
      const name = row.children[0].value.trim();
      const emoji = row.children[1].value.trim();
      if (!name || names.has(name)) { row.children[0].classList.add("error"); valid = false; }
      else { row.children[0].classList.remove("error"); names.add(name); }
      if (!emoji || emojis.has(emoji)) { row.children[1].classList.add("error"); valid = false; }
      else { row.children[1].classList.remove("error"); emojis.add(emoji); }
      if (valid) players.push({ name, emoji, position: 0 });
    });
    if (!valid) return;
    localStorage.setItem("drinkopoly_players", JSON.stringify(players));
    startGame();
    document.getElementById("setup-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
  };
});

function addInput(name = "", emoji = "") {
  const row = document.createElement("div");
  row.className = "player-row";
  row.innerHTML = \`<input placeholder="Name" value="\${name}"><input placeholder="Emoji" value="\${emoji}">\`;
  document.getElementById("player-inputs").appendChild(row);
}

function startGame() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const order = [
    [10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[0,10],
    [0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
    [10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9]
  ];
  [5,15,25,35].forEach(i => fieldTypes[i] = "station");
  [2,7,17,22,33].forEach(i => fieldTypes[i] = "ereignis");
  [4,12,28].forEach(i => fieldTypes[i] = "gemeinschaft");
  [1,3,6,8,9,11,13,14,16,18,19,21,23,24,26,27,29,31,32,34,36,37,38,39].forEach(i => fieldTypes[i] = "sip");
  [0,10,20,30].forEach(i => fieldTypes[i] = "special");

  for (let i = 0; i < 40; i++) {
    const f = document.createElement("div");
    f.className = "board-field";
    if (i % 10 === 0) f.classList.add("corner");
    f.style.gridColumnStart = order[i][0]+1;
    f.style.gridRowStart = order[i][1]+1;
    f.dataset.index = i;
    f.innerText = i;
    board.appendChild(f);
  }

  updateTokens();
  document.getElementById("roll-dice").onclick = () => roll();
}

function roll() {
  const r1 = Math.floor(Math.random()*6)+1;
  const r2 = Math.floor(Math.random()*6)+1;
  document.getElementById("die1").textContent = ["","⚀","⚁","⚂","⚃","⚄","⚅"][r1];
  document.getElementById("die2").textContent = ["","⚀","⚁","⚂","⚃","⚄","⚅"][r2];
  setTimeout(() => {
    const total = r1 + r2;
    const p = players[current];
    p.position = (p.position + total) % 40;
    updateTokens();
    handleField(p);
    current = (current + 1) % players.length;
  }, 400);
}

function updateTokens() {
  document.querySelectorAll(".board-field").forEach(f => f.innerHTML = "");
  players.forEach(p => {
    const t = document.createElement("div");
    t.className = "player-token";
    t.textContent = p.emoji;
    document.querySelector('.board-field[data-index="'+p.position+'"]').appendChild(t);
  });
}

function handleField(p) {
  const type = fieldTypes[p.position];
  if (type === "sip") showPopup("🧃 " + p.name + " trinkt 2 Schlücke");
  if (type === "station") {
    if (!ownedStations[p.position]) {
      showPopup("🚉 " + p.name + ", willst du Bahnhof kaufen?
Trink 2 Shots zum Kaufen oder 1 wenn nicht.");
      ownedStations[p.position] = p.name;
    } else if (ownedStations[p.position] !== p.name) {
      showPopup("🚨 " + p.name + " trinkt für Bahnhof von " + ownedStations[p.position]);
    }
  }
  if (type === "ereignis") {
    const o = players[(current+1)%players.length];
    showPopup("🎴 Ereignis: " + p.name + " mixt " + o.name + " einen Shot.");
  }
  if (type === "gemeinschaft") {
    const o = players[(current+2)%players.length];
    showPopup("🤝 Gemeinschaft: " + p.name + " und " + o.name + " trinken zusammen.");
  }
}

let holdTimeout;
function handleHold() {
  const btn = document.getElementById("popup-close");
  btn.style.setProperty('--progress', '100%');
  btn.classList.add("holding");
  btn.style.setProperty('--progress', '100%');
  btn.querySelector("#popup-progress").textContent = "⏳ Halten...";
  btn.style.setProperty('--webkit-transition', 'width 3s');
  btn.style.setProperty('--transition', 'width 3s');
  btn.style.setProperty('--width', '100%');

  holdTimeout = setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
    btn.querySelector("#popup-progress").textContent = "✔️ Fertig";
    btn.classList.remove("holding");
  }, 3000);
}

function cancelHold() {
  clearTimeout(holdTimeout);
  const btn = document.getElementById("popup-close");
  btn.querySelector("#popup-progress").textContent = "✔️ Fertig";
  btn.classList.remove("holding");
}

function showPopup(text) {
  document.getElementById("popup-title").textContent = "Aktion";
  document.getElementById("popup-text").textContent = text;
  document.getElementById("popup").classList.remove("hidden");
}
