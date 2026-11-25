// ==========================================
// 1. YOUR ITEMS LIST (Paste your items here)
// ==========================================

 const ITEMS = [
  {
    id: "snow",
    title: "snow rider",
    category: "games",
    emoji: "🎿",
    thumbnail: "", // Optional: put an image path like "images/2048.png"
    url: "https://www.onlinegames.io/snow-rider-multiplayer/" // Path to your embedded game folder or URL
  },
  {
    id: "guns",
    title: "car crash test",
    category: "games",
    emoji: "⬡",
    thumbnail: "",
    url: "https://www.onlinegames.io/car-crash-test-abandoned-city/"
  },
  {
    id: "I forgot ngl",
    title: "cars drift",
    category: "games",
    emoji: "🏎",
    thumbnail: "",
    url: "https://www.onlinegames.io/drift-king/"
  },
  {
    id: "Slope 3d",
    title: "Slope 3d",
    category: "games",
    emoji: "⚽",
    thumbnail: "",
    url: "https://slopegameaz.io/"
  },
  {
    id: "Online games",
    title: "online games",
    category: "apps",
    emoji: "⚽",
    thumbnail: "",
    url: "https://www.onlinegames.io/"
  },
  {
    id: "anime",
    title: "Anime",
    category: "anime",
    newTab: true,
    emoji: "📺",
    thumbnail: "",
    url: "https://reanime.cz/home"
  },  
  {
     id: "ai-tool-1",
     title: "Math AI tool",
     newTab: true,
     category: "ai",
     thumbnail: "",
     url: "https://aimathsolver.co/"
   },  
  {
     id: "ai-tool-1",
     title: " AI tool",
     category: "ai",
     newTab: true,
     thumbnail: "",
     url: "https://llama2.streamlit.app/"
   },
    {
     id: "apple music",
     title: " Apple Music",
     category: "music",
     newTab: true,
     thumbnail: "",
     url: "https://music.apple.com/us/new"
   },
{
     id: "prox",
     title: " Ramdpm proxy",
     category: "apps",
     thumbnail: "",
     url: "https://cdn.jsdelivr.net/gh/lucideproxy/svg@latest/logo.svg"
   },
  {
     id: "alsoprox",
     title: "Another Ramdpm proxy",
     category: "apps",
     thumbnail: "",
     url: "https://storage.googleapis.com/gclassroom/study.html"
   },
   {
     id: "animeprox",
     title: "Anime Proxy",
     category: "anime",
     thumbnail: "",
     url: "https://azino777-nvsa.sbs/#goog_rewarded"
     { 
          


  // }{
  //   id: "2048",
  //   title: "2048",
  //   category: "games", // "games" or "apps"
  //   thumbnail: "",     // optional image URL or path
  //   url: "games/2048/index.html"
  // }


// ==========================================
// 1. KEEP YOUR ITEMS ARRAY AT THE TOP
// ==========================================

  // Paste your games/apps/anime items here!
  // Add `newTab: const ITEMS = [true,` inside any item that says "refused to connect"


 // Paste your existing game/app/anime objects here!


// ==========================================
// 2. GRID, DOCK & PLAYER LOGIC
// ==========================================
// 1. YOUR ITEMS LIST (Paste your items here)
// ==========================================

  // Example AI item:
  // {
  //   id: "ai-tool-1",     id: "ai-tool-1",


  //   title: "My AI Tool",
  //   category: "ai",
  //   thumbnail: "",
  //   url: "https://..."
  // }
];

// ==========================================
// 2. GRID, DOCK & PLAYER LOGIC
// ==========================================
let currentCategory = "all";
let showFavoritesOnly = false;
let activeItem = null;
let favorites = JSON.parse(localStorage.getItem("modaber_favs") || "[]");

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");
const categoryBar = document.getElementById("categoryBar");
const favoritesToggle = document.getElementById("favoritesToggle");
const favCount = document.getElementById("favCount");
const emptyState = document.getElementById("emptyState");
const emptyText = document.getElementById("emptyText");
const cloakBtn = document.getElementById("cloakBtn");
const clockEl = document.getElementById("clock");

// Player Elements
const playerOverlay = document.getElementById("playerOverlay");
const gameFrame = document.getElementById("gameFrame");
const iframeWrapper = document.getElementById("iframeWrapper");
const playerGameTitle = document.getElementById("playerGameTitle");
const playerFavBtn = document.getElementById("playerFavBtn");
const reloadGameBtn = document.getElementById("reloadGameBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const closePlayerBtn = document.getElementById("closePlayerBtn");

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
setInterval(updateClock, 1000);
updateClock();

function updateFavCount() {
  favCount.textContent = favorites.length;
}

function toggleFavorite(id, e) {
  if (e) e.stopPropagation();
  favorites = favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];

  localStorage.setItem("modaber_favs", JSON.stringify(favorites));
  updateFavCount();
  render();
  if (activeItem && activeItem.id === id) {
    playerFavBtn.style.color = favorites.includes(id) ? "#eab308" : "";
  }
}

function render() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = ITEMS.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(query);
    const matchCat = currentCategory === "all" || item.category === currentCategory;
    const matchFav = !showFavoritesOnly || favorites.includes(item.id);
    return matchSearch && matchCat && matchFav;
  });

  gamesGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyText.textContent = ITEMS.length === 0 ? "No items in ITEMS[] yet." : "No matches found.";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  filtered.forEach((item) => {
    const isFav = favorites.includes(item.id);
    const card = document.createElement("div");
    card.className = "game-card";
    card.onclick = () => openPlayer(item);

    const thumbHTML = item.thumbnail
      ? `<img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />`
      : `<span>${item.title.slice(0, 2).toUpperCase()}</span>`;

    card.innerHTML = `
      <button class="card-fav ${isFav ? "active" : ""}" title="Favorite">★</button>
      <div class="card-thumb">${thumbHTML}</div>
      <div class="card-footer">
        <span class="card-title">${item.title}</span>
        <span class="card-tag">${item.category}</span>
      </div>
    `;

    card.querySelector(".card-fav").onclick = (e) => toggleFavorite(item.id, e);
    gamesGrid.appendChild(card);
  });
}

function openPlayer(item) {
  if (item.newTab) {
    window.open(item.url, "_blank");
    return;
  }
  activeItem = item;
  playerGameTitle.textContent = item.title;
  gameFrame.src = item.url;
  playerFavBtn.style.color = favorites.includes(item.id) ? "#eab308" : "";
  playerOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePlayer() {
  playerOverlay.classList.add("hidden");
  gameFrame.src = "";
  activeItem = null;
  document.body.style.overflow = "";
}

searchInput.addEventListener("input", render);

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape" && !playerOverlay.classList.contains("hidden")) {
    closePlayer();
  }
});

categoryBar.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  document.querySelectorAll("[data-category]").forEach((el) => el.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = btn.dataset.category;
  render();
});

favoritesToggle.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favoritesToggle.classList.toggle("fav-active", showFavoritesOnly);
  render();
});

playerFavBtn.addEventListener("click", () => {
  if (activeItem) toggleFavorite(activeItem.id);
});

reloadGameBtn.addEventListener("click", () => {
  if (activeItem) gameFrame.src = activeItem.url;
});

fullscreenBtn.addEventListener("click", () => {
  if (iframeWrapper.requestFullscreen) iframeWrapper.requestFullscreen();
});

closePlayerBtn.addEventListener("click", closePlayer);

cloakBtn.addEventListener("click", () => {
  const win = window.open("about:blank", "_blank");
  if (!win) return;
  const iframe = win.document.createElement("iframe");
  win.document.title = "Google Drive";
  Object.assign(iframe.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    border: "none"
  });
  iframe.src = window.location.href;
  win.document.body.style.margin = "0";
  win.document.body.appendChild(iframe);
});

updateFavCount();
render();
