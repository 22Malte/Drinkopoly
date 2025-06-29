
let players = [];
let current = 0;

document.getElementById("player-form").onsubmit = (e) => {
  e.preventDefault();
  const n1 = document.getElementById("name1").value.trim();
  const n2 = document.getElementById("name2").value.trim();
  const e1 = document.getElementById("emoji1").value.trim();
  const e2 = document.getElementById("emoji2").value.trim();
  if (!n1 || !n2 || !e1 || !e2 || n1 === n2 || e1 === e2) {
    alert("Gültige, unterschiedliche Namen & Emojis wählen.");
    return;
  }

  players = [
    { name: n1, emoji: e1, position: 0 },
    { name: n2, emoji: e2, position: 0 }
  ];

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  initBoard();
};

function initBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const order = [
    [10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[0,10],
    [0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
    [10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9]
  ];
  for (let i = 0; i < 40; i++) {
    const field = document.createElement("div");
    field.className = "board-field";
    if (i % 10 === 0) field.classList.add("corner");
    field.style.gridColumnStart = order[i][0] + 1;
    field.style.gridRowStart = order[i][1] + 1;
    field.dataset.index = i;
    board.appendChild(field);
  }
  updateTokens();
  document.getElementById("roll-dice").onclick = rollDice;
}

function rollDice() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;

  const diceMap = ["","⚀","⚁","⚂","⚃","⚄","⚅"];
  document.getElementById("die1").textContent = "🎲";
  document.getElementById("die2").textContent = "🎲";
  setTimeout(() => {
    document.getElementById("die1").textContent = diceMap[die1];
    document.getElementById("die2").textContent = diceMap[die2];

    const total = die1 + die2;
    const p = players[current];
    p.position = (p.position + total) % 40;
    updateTokens();

    current = (current + 1) % players.length;
  }, 500);
}

function updateTokens() {
  document.querySelectorAll(".board-field").forEach(f => f.innerHTML = "");
  players.forEach(p => {
    const div = document.createElement("div");
    div.className = "player-token";
    div.innerHTML = p.emoji + "<br><small>" + p.name + "</small>";
    const field = document.querySelector('.board-field[data-index="'+p.position+'"]');
    field.appendChild(div);
  });
}
