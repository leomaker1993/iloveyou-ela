const gameBoard = document.getElementById("gameBoard");
const expDateInput = document.getElementById("expDate");

let expDate = localStorage.getItem("expDate") || null;
if (expDate) expDateInput.value = expDate;

const cards = [
  { id: 1, text: "Cena romántica" },
  { id: 1, text: "Cena romántica" },
  { id: 2, text: "Paseo sorpresa" },
  { id: 2, text: "Paseo sorpresa" },
  { id: 3, text: "Una petición o deseo" },
  { id: 3, text: "Una petición o deseo" },
  { id: 4, text: "Masaje relajante" },
  { id: 4, text: "Masaje relajante" },
  { id: 5, text: "Te ganaste una confesión mía" },
  { id: 5, text: "Te ganaste una confesión mía" },
  { id: 6, text: "Te cocino lo que tu quieras" },
  { id: 6, text: "Te cocino lo que tu quieras" },
];

let shuffledCards = [...cards].sort(() => 0.5 - Math.random());
let selectedCards = [];
let matchedPairs = 0;

function createBoard() {
  gameBoard.innerHTML = "";
  shuffledCards.forEach((card, index) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.dataset.id = card.id;
    div.dataset.text = card.text;
    div.onclick = () => flipCard(div);
    gameBoard.appendChild(div);
  });
}

function flipCard(card) {
  if (selectedCards.length < 2 && !card.classList.contains("matched")) {
    card.textContent = card.dataset.text;
    selectedCards.push(card);

    if (selectedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

// Modificar la función checkMatch para agregar efectos
function checkMatch() {
  if (selectedCards[0].dataset.id === selectedCards[1].dataset.id) {
    selectedCards.forEach((card) => {
      card.classList.add("matched");
      // Añadir efecto de confeti cuando hay coincidencia
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createFloatingHeart(
            card.getBoundingClientRect().left +
              Math.random() * card.offsetWidth,
            card.getBoundingClientRect().top + Math.random() * card.offsetHeight
          );
        }, i * 100);
      }
    });
    saveCoupon(selectedCards[0].dataset.text);
    matchedPairs++;

    if (matchedPairs === cards.length / 2) {
      setTimeout(() => {
        alert("¡Felicidades! Has desbloqueado todos los cupones.");
        // Efecto de celebración
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            createFloatingHeart(
              Math.random() * window.innerWidth,
              Math.random() * window.innerHeight
            );
          }, i * 100);
        }
      }, 500);
    }
  } else {
    selectedCards.forEach((card) => {
      card.style.animation = "shake 0.5s";
      setTimeout(() => {
        card.style.animation = "";
        card.textContent = "";
      }, 500);
    });
  }
  selectedCards = [];
}

function saveCoupon(couponText) {
  let coupons = JSON.parse(localStorage.getItem("coupons")) || [];
  coupons.push({ text: couponText, expires: expDate });
  localStorage.setItem("coupons", JSON.stringify(coupons));
}

function setExpiration() {
  expDate = expDateInput.value;
  localStorage.setItem("expDate", expDate);
  alert("Fecha de vencimiento guardada: " + expDate);
}

createBoard();

// Agregar esto al final de memory.js
function createFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.innerHTML = "♥";
  heart.style.position = "fixed";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.color = "var(--primary-color)";
  heart.style.pointerEvents = "none";
  heart.style.animation = "floatingHearts 1s forwards";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
}

document.addEventListener("click", (e) => {
  createFloatingHeart(e.clientX, e.clientY);
});
