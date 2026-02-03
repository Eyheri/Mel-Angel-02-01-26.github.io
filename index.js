/* ====================================
   VARIABLES GLOBALES Y CONFIGURACIÓN
   ==================================== */
const scene = document.getElementById('scene');
const layers = [
  document.querySelector('.back'),
  document.querySelector('.middle'),
  document.querySelector('.front')
];

const words = ["Tamo", "Tamoo", "02/01/26", "Tamooo", "TAMOO", "TAMOOO AMOR"];

/* ====================================
   FUNCIÓN: CREAR Y ANIMAR PÉTALOS
   ==================================== */
function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';

  const rot = Math.random() * 360;

  const isMobile = window.innerWidth < 1024;
  const dispersión = isMobile ? (Math.random() - 0.5) * (window.innerWidth * 0.85) : (Math.random() - 0.5) * (window.innerWidth * 0.6);
  
  const centerX = window.innerWidth / 2;
  const randomOffset = dispersión;
  const drift = (Math.random() - 0.5) * 120;

  petal.style.setProperty('--rot', rot + 'deg');
  petal.style.setProperty('--drift', drift + 'px');

  petal.innerHTML = `
    <svg class="petal-svg" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="petalGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#8b0000"/>
          <stop offset="70%" stop-color="#3a0000"/>
          <stop offset="100%" stop-color="#1a0000"/>
        </radialGradient>
      </defs>
      <path d="
        M50 0
        C20 20, 5 60, 30 100
        C40 120, 60 120, 70 100
        C95 60, 80 20, 50 0
        Z
      " fill="url(#petalGradient)" />
    </svg>
  `;

 const layer = layers[Math.floor(Math.random() * layers.length)];

  let duration;
  if (layer.classList.contains('back')) {
    duration = isMobile ? 12 + Math.random() * 3 : 8 + Math.random() * 2;
    petal.style.zIndex = '5';
  }
  else if (layer.classList.contains('front')) {
    duration = isMobile ? 5 + Math.random() * 2 : 3 + Math.random() * 1.5;
    petal.style.zIndex = '20';
  }
  else {
    duration = isMobile ? 8 + Math.random() * 3 : 5 + Math.random() * 2;
    petal.style.zIndex = '8';
  }

  petal.style.left = centerX + randomOffset + 'px';
  petal.style.top = '-40px';
  petal.style.animationDuration = duration + 's';

  layer.appendChild(petal);

  const explodeAt = Math.random() * window.innerHeight * 0.7 + 150;
  let hasExploded = false;

  const check = setInterval(() => {
    if (!petal.parentElement) {
      clearInterval(check);
      return;
    }
    
    const rect = petal.getBoundingClientRect();
    if (rect.top >= explodeAt && !hasExploded) {
      hasExploded = true;
      clearInterval(check);
      explode(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }, 50);

  setTimeout(() => {
    clearInterval(check);
    if (petal.parentElement && !hasExploded) {
      const rect = petal.getBoundingClientRect();
      explode(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    petal.remove();
  }, duration * 1000 + 100);
}

/* ====================================
   FUNCIÓN: EXPLOSIÓN Y DISPERSIÓN
   ==================================== */
function explode(x, y) {
  const text = document.createElement('div');
  const word = words[Math.floor(Math.random() * words.length)];
  text.className = 'burst';
  text.textContent = word;
  if (word === "02/01/26") text.classList.add('date');

  text.style.left = x + 'px';
  text.style.top = y + 'px';
  text.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
  text.style.setProperty('--dy', (Math.random() - 0.5) * 60 + 'px');

  scene.appendChild(text);
  setTimeout(() => text.remove(), 1800);
}

/* ====================================
   INICIALIZACIÓN: INTERVALO DE PÉTALOS
   ==================================== */
setInterval(createPetal, 400);

/* ====================================
   CONTROLADORES DE EVENTOS
   ==================================== */
const note = document.getElementById('note');
const letter = document.getElementById('letter');
const closeLetter = document.getElementById('closeLetter');
const hint = document.getElementById('hint');
const openBtn = document.getElementById('openBtn');
const letterBox = document.querySelector('.letter');

let openBtnTimeout;

/* ====================================
   FUNCIONES AUXILIARES
   ==================================== */

/* Función: Resetear animación del botón Abrir */
function resetOpenButton() {
  openBtn.style.animation = 'none';
  openBtn.style.transform = 'translateY(60px)';
  openBtn.style.opacity = '0';
  openBtn.offsetHeight;
  openBtn.style.animation = '';
}

/* Evento: Abrir carta con icono */
note.addEventListener('click', () => {
  letter.style.display = 'flex';
  hint.style.opacity = '0';
  hint.style.pointerEvents = 'none';

  resetOpenButton();
  showOpenButton();
});

/* Evento: Abrir carta con hint */
hint.addEventListener('click', () => {
  letter.style.display = 'flex';
  hint.style.opacity = '0';
  hint.style.pointerEvents = 'none';

  resetOpenButton();
  showOpenButton();
});

/* Función: Mostrar botón abrir después de 4 segundos */
function showOpenButton() {
  resetLetter();

  openBtnTimeout = setTimeout(() => {
    openBtn.classList.add('visible');
    letterBox.classList.add('push');
  }, 4000);
}

/* Evento: Cerrar carta con botón X */
closeLetter.addEventListener('click', () => {
  letter.style.display = 'none';
  openBtn.classList.remove('visible');
  resetOpenButton();
  resetLetter();
  clearTimeout(openBtnTimeout);
});


/* Función: Resetear animación de la carta */
function resetLetter() {
  letterBox.classList.remove('push');
  letterBox.offsetHeight;
}



document.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('bgMusic');
  if (!music) return;

  music.volume = 0.4;

  const tryPlay = async () => {
    try {
      await music.play();
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('pointerdown', tryPlay);
    } catch (e) {}
  };

  tryPlay();
  document.addEventListener('click', tryPlay);
  document.addEventListener('pointerdown', tryPlay);
});

/* ====================================
   FIN PRIMER PAGINA
   ==================================== */
openBtn.addEventListener("click", () => {

  // 1. Cerrar carta y botón
  letter.style.display = "none";
  openBtn.style.display = "none";

  // 2. Detener música
  const music = document.getElementById("bgMusic");
  if (music) {
    music.pause();
    music.currentTime = 0;
  }

  // 3. Fade a negro
  scene.style.transition = "opacity 1.5s ease";
  scene.style.opacity = "0";

  // 4. Cambiar de página
  setTimeout(() => {
    window.location.href = "reading.html";
  }, 1600);
});