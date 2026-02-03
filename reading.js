const mainVinyl = document.getElementById("mainVinyl");
const player = document.getElementById("player");

const playPauseBtn = document.getElementById("playPauseBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const miniVinyls = [...document.querySelectorAll(".vinyl-mini")];

const nowPlaying = document.getElementById("nowPlaying");

let currentVinyl = null;

/* ================================
   FUNCIONES BASE
================================ */

function stopCurrentVinyl() {
  if (currentVinyl) {
    currentVinyl.classList.remove("playing");
  }
  player.pause();
  player.currentTime = 0;
  currentVinyl = null;
}

function playVinyl(vinyl, src, loop = false) {
  stopCurrentVinyl();

  player.src = src;
  player.loop = loop;
  player.volume = 0.8;

  player.play().then(() => {
    vinyl.classList.add("playing");
    currentVinyl = vinyl;
  });
}

/* ================================
   BOTÓN PRINCIPAL (VINIL GRANDE)
================================ */

playPauseBtn.addEventListener("click", () => {

  if (currentVinyl === mainVinyl) {
    stopCurrentVinyl();
    return;
  }

  playVinyl(mainVinyl, "HarryStyles - AdoreYou.mp3", false);
});

/* ================================
   VINILES PEQUEÑOS
================================ */

miniVinyls.forEach(vinyl => {
  vinyl.addEventListener("click", () => {

    if (currentVinyl === vinyl) {
      stopCurrentVinyl();
      return;
    }

    playVinyl(vinyl, vinyl.dataset.music, false);
  });
});

/* ================================
   CONTROLES TIEMPO
================================ */

backBtn.addEventListener("click", () => {
  player.currentTime = Math.max(0, player.currentTime - 10);
});

nextBtn.addEventListener("click", () => {
  player.currentTime = Math.min(player.duration || 0, player.currentTime + 10);
});

/* ================================
   REPRODUCCIÓN AUTOMÁTICA
================================ */

const vinylSequence = [
  { element: mainVinyl, src: "HarryStyles - AdoreYou.mp3" },
  ...miniVinyls.map(v => ({ element: v, src: v.dataset.music }))
];

player.addEventListener("ended", () => {
  if (!currentVinyl) return;

  const index = vinylSequence.findIndex(v => v.element === currentVinyl);

  if (index >= 0 && index < vinylSequence.length - 1) {
    const next = vinylSequence[index + 1];
    playVinyl(next.element, next.src, false);
  } else {
    stopCurrentVinyl();
  }
});

/* ================================
   NOTAS MUSICALES
================================ */

function spawnMusicNote() {
  if (player.paused) return;

  const note = document.createElement("div");
  note.className = "music-note";
  note.textContent = Math.random() > 0.5 ? "♪" : "♫";

  note.style.left = Math.random() * window.innerWidth + "px";
  note.style.bottom = "30px";

  document.body.appendChild(note);

  setTimeout(() => note.remove(), 4000);
}

setInterval(spawnMusicNote, 700);

/* ================================
   ACTUALIZAR TEXTO DE CANCIÓN
================================ */
function playVinyl(vinyl, src, loop = false) {
  stopCurrentVinyl();

  player.src = src;
  player.loop = loop;
  player.volume = 0.8;

  const songName = src
    .split("/")
    .pop()
    .replace(".mp3", "")
    .replace(/-/g, " ");

  nowPlaying.textContent = "♫ Reproduciendo: " + songName;

  player.play().then(() => {
    vinyl.classList.add("playing");
    currentVinyl = vinyl;
  });
}

