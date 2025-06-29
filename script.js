
let cards = null;

// Lade Karten aus JSON-Datei
fetch('cards.json')
  .then(response => response.json())
  .then(data => { cards = data; });

function getRandomCard(type, players) {
  const deck = cards[type];
  const card = deck[Math.floor(Math.random() * deck.length)];

  // Spieler zufällig zuweisen
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

// Test-Trigger für Karte (kann später per Feldtyp ausgelöst werden)
window.testCardPopup = function () {
  const players = JSON.parse(localStorage.getItem("drinkopoly_players"));
  const card = getRandomCard("ereignis", players);
  showCard(card);
};
