// ==========================================
// 1. YOUR GAME LIBRARY (Add new games here!)
// ==========================================
const GAMES = [
  {
    id: "FPS",
    title: "gun shooter",
    category: "violence",
    emoji: "💀",
    thumbnail: "", // Optional: put an image path like "images/2048.png"
    url: "https://www.crazygames.com/game/hazmob-fps-online-shooter" // Path to your embedded game folder or URL
  },
  {
    id: "guns",
    title: "cool gun game",
    category: "action",
    emoji: "⬡",
    thumbnail: "",
    url: "https://www.crazygames.com/game/kour-io"
  },
  {
    id: "I forgot ngl",
    title: "Motor ride game",
    category: "action",
    emoji: "⚡",
    thumbnail: "",
    url: "https://slopegameaz.io/moto-x3m-2"
  },
  {
    id: "Slope 3d",
    title: "Slope 3d",
    category: "fast paced",
    emoji: "🏎️",
    thumbnail: "",
    url: "https://slopegameaz.io/"
  },
  {
    id: "retro-arcade",
    title: "Rocket goal",
    category: "fast paced",
    emoji: "🕹️",
    thumbnail: "",
    url: "https://www.crazygames.com/game/rocketgoal-io"
  }
];

// ==========================================
// 2. STATE & DOM ELEMENTS
// ==========================================
let currentCategory = "all";
let showFavoritesOnly = false;
let currentGame = null;
let favorites = JSON.parse(localStorage.getItem("nexus_favorites") || "[]");

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");
const categoryBar = document.getElementById("categoryBar");
const favoritesToggle = document.getElementById("favoritesToggle");
const favCount = document.getElementById("favCount");
const totalGamesText = document.getElementById("totalGamesText");
const emptyState = document.getElementById("emptyState");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const randomGameBtn = document.getElementById("randomGameBtn");
const cloakBtn = document.getElementById("cloakBtn");

// Player Modal Elements
const playerOverlay = document.getElementById("playerOverlay");
const gameFrame = document.getElementById("gameFrame");
const iframeWrapper = document.getElementById("iframeWrapper");
const playerGameTitle = document.getElementById("playerGameTitle");
const playerGameCategory = document.getElementById("playerGameCategory");
const playerFavBtn = document.getElementById("playerFavBtn");
const reloadGameBtn = document.getElementById("reloadGameBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const closePlayerBtn = document.getElementById("closePlayerBtn");

// ==========================================
// 3. RENDERING & FILTERING
// ==========================================
function updateFavCounter() {
  favCount.textContent = favorites.length;
}

function toggleFavorite(gameId, event) {
  if (event) event.stopPropagation();

  if (favorites.includes(gameId)) {
    favorites = favorites.filter((id) => id !== gameId);
  } else {
    favorites.push(gameId);
  }

  localStorage.setItem("nexus_favorites", JSON.stringify(favorites));
  updateFavCounter();
  renderGames();

  if (currentGame && currentGame.id === gameId) {
    updatePlayerFavButton();
  }
}

function renderGames() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(query) ||
      game.category.toLowerCase().includes(query);
    const matchesCategory =
      currentCategory === "all" || game.category === currentCategory;
    const matchesFav = !showFavoritesOnly || favorites.includes(game.id);

    return matchesSearch && matchesCategory && matchesFav;
  });

  gamesGrid.innerHTML = "";
  totalGamesText.textContent = `${GAMES.length} Games Available`;

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((game) => {
    const isFav = favorites.includes(game.id);
    const card = document.createElement("div");
    card.className = "game-card";
    card.onclick = () => openGame(game);

    const thumbContent = game.thumbnail
      ? `<img src="${game.thumbnail}" alt="${game.title}" loading="lazy" />`
      : `<span>${game.emoji || "🎮"}</span>`;

    card.innerHTML = `
      <button class="card-fav-btn ${isFav ? "is-fav" : ""}" title="Toggle Favorite">
        ${isFav ? "★" : "☆"}
      </button>
      <div class="card-thumb">${thumbContent}</div>
      <div class="card-body">
        <div class="card-title">${game.title}</div>
        <div class="card-meta">
          <span>${game.category}</span>
          <span>PLAY →</span>
        </div>
      </div>
    `;

    card.querySelector(".card-fav-btn").onclick = (e) =>
      toggleFavorite(game.id, e);

    gamesGrid.appendChild(card);
  });
}

// ==========================================
// 4. INTEGRATED GAME PLAYER
// ==========================================
function openGame(game) {
  currentGame = game;
  playerGameTitle.textContent = game.title;
  playerGameCategory.textContent = game.category;
  gameFrame.src = game.url;
  updatePlayerFavButton();
  playerOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGame() {
  playerOverlay.classList.add("hidden");
  gameFrame.src = ""; // Stop game audio/processes
  currentGame = null;
  document.body.style.overflow = "";
}

function updatePlayerFavButton() {
  if (!currentGame) return;
  const isFav = favorites.includes(currentGame.id);
  playerFavBtn.textContent = isFav ? "★ Favorited" : "☆ Favorite";
}

// ==========================================
// 5. EVENT LISTENERS & EXTRAS
// ==========================================
searchInput.addEventListener("input", renderGames);

// Press "/" anywhere to focus search
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape" && !playerOverlay.classList.contains("hidden")) {
    closeGame();
  }
});

// Category filter buttons
categoryBar.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-pill")) return;
  document
    .querySelectorAll(".filter-pill")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentCategory = e.target.dataset.category;
  renderGames();
});

// Favorites filter toggle
favoritesToggle.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favoritesToggle.classList.toggle("active-fav", showFavoritesOnly);
  renderGames();
});

resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  currentCategory = "all";
  showFavoritesOnly = false;
  favoritesToggle.classList.remove("active-fav");
  document
    .querySelectorAll(".filter-pill")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.category === "all"));
  renderGames();
});

// Random Game Launcher
randomGameBtn.addEventListener("click", () => {
  if (GAMES.length === 0) return;
  const random = GAMES[Math.floor(Math.random() * GAMES.length)];
  openGame(random);
});

// Player Controls
playerFavBtn.addEventListener("click", () => {
  if (currentGame) toggleFavorite(currentGame.id);
});

reloadGameBtn.addEventListener("click", () => {
  if (currentGame) gameFrame.src = currentGame.url;
});

fullscreenBtn.addEventListener("click", () => {
  if (iframeWrapper.requestFullscreen) {
    iframeWrapper.requestFullscreen();
  }
});

closePlayerBtn.addEventListener("click", closeGame);

// About:Blank Tab Cloaker
cloakBtn.addEventListener("click", () => {
  const win = window.open("about:blank", "_blank");
  if (!win) {
    alert("Pop-up blocked! Allow pop-ups for this site to use Tab Cloak.");
    return;
  }
  const doc = win.document;
  const iframe = doc.createElement("iframe");
  doc.title = "Google Drive";
  iframe.style.position = "fixed";
  iframe.style.inset = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.src = window.location.href;
  doc.body.style.margin = "0";
  doc.body.appendChild(iframe);
});

// Initialize
updateFavCounter();
renderGames();
