const gameBoard = document.getElementById("gameBoard");
const expDateInput = document.getElementById("expDate");

let expDate = localStorage.getItem("expDate") || null;
if (expDate) expDateInput.value = expDate;

const cards = [
  { id: 1, text: "Cena romántica", image: "url_de_la_imagen_cena.jpg" },
  { id: 1, text: "Cena romántica", image: "url_de_la_imagen_cena.jpg" },
  { id: 2, text: "Paseo sorpresa", image: "url_de_la_imagen_paseo.jpg" },
  { id: 2, text: "Paseo sorpresa", image: "url_de_la_imagen_paseo.jpg" },
  { id: 3, text: "Una petición o deseo", image: "url_de_la_imagen_deseo.jpg" },
  { id: 3, text: "Una petición o deseo", image: "url_de_la_imagen_deseo.jpg" },
  { id: 4, text: "Masaje relajante", image: "url_de_la_imagen_masaje.jpg" },
  { id: 4, text: "Masaje relajante", image: "url_de_la_imagen_masaje.jpg" },
  {
    id: 5,
    text: "Te ganaste una confesión mía",
    image: "url_de_la_imagen_confesion.jpg",
  },
  {
    id: 5,
    text: "Te ganaste una confesión mía",
    image: "url_de_la_imagen_confesion.jpg",
  },
  {
    id: 6,
    text: "Te cocino lo que tu quieras",
    image: "url_de_la_imagen_cocina.jpg",
  },
  {
    id: 6,
    text: "Te cocino lo que tu quieras",
    image: "url_de_la_imagen_cocina.jpg",
  },
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
    div.dataset.image = card.image; // Guardamos la URL de la imagen
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
    const couponText = selectedCards[0].dataset.text;
    const couponImage = selectedCards[0].dataset.image; // Obtenemos la URL de la imagen
    saveCoupon(couponText);
    showCouponCard(couponText, couponImage); // Pasamos la URL de la imagen a showCouponCard
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

// Modificamos la función showCouponCard para incluir la imagen y el botón
function showCouponCard(couponText, couponImage) {
  const couponCard = document.createElement("div");
  couponCard.classList.add("coupon-card");
  couponCard.innerHTML = `
    <div class="coupon-card">
        <h3 class=coupon-title >¡Felicidades!</h3>
        <img src="https://i.ibb.co/KpJMmMz9/Screenshot-20250214-035528-Gallery-1.jpg" alt="Cupón" class="coupon-image">
        <p>¡Válido para!</p>
        <h4 class="coupon-text">${couponText}</h4>
        <button id="acceptCoupon">Aceptar</button>
        <h5>Pd: Canjea uno por semana, úsalo con sabiduría!</h5>
    </div>
  `;

  couponCard.style.position = "fixed";
  couponCard.style.top = "50%";
  couponCard.style.left = "50%";
  couponCard.style.transform = "translate(-50%, -50%)";
  couponCard.style.background = "white";
  couponCard.style.padding = "20px";
  couponCard.style.borderRadius = "10px";
  couponCard.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
  couponCard.style.zIndex = "1000";

  document.body.appendChild(couponCard);

  // Agregamos el evento al botón "Aceptar"
  const acceptButton = document.getElementById("acceptCoupon");
  acceptButton.onclick = () => {
    couponCard.remove();
  };
}

createBoard();

// Agregar esto al final de memory.js
function createFloatingHeart(x, y) {
  const heart = document.createElement("div");
  heart.innerHTML = "♥";
  heart.style.position = "fixed";
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.color = "#672610"; /* ¡Cambiamos el color aquí! */
  heart.style.pointerEvents = "none";
  heart.style.animation = "floatingHearts 1s forwards";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 3000);
}

document.addEventListener("click", (e) => {
  createFloatingHeart(e.clientX, e.clientY);
});
