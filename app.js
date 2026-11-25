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
  }
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
];

 // Paste your existing game/app/anime objects here!


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
  if (e.key === "/" && document.activeElement !== searchInput && document.activeElement !== aiInput) {
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

// ==========================================
// 3. LOCAL BROWSER AI (WEBLLM - NO API KEY)
// ==========================================
const aiToggleBtn = document.getElementById("aiToggleBtn");
const aiDrawer = document.getElementById("aiDrawer");
const closeAiBtn = document.getElementById("closeAiBtn");
const loadAiBtn = document.getElementById("loadAiBtn");
const aiInitWrap = document.getElementById("aiInitWrap");
const aiStatusBar = document.getElementById("aiStatusBar");
const aiStatusDot = document.getElementById("aiStatusDot");
const aiMessages = document.getElementById("aiMessages");
const aiForm = document.getElementById("aiForm");
const aiInput = document.getElementById("aiInput");
const aiSendBtn = document.getElementById("aiSendBtn");

let aiEngine = null;
const chatHistory = [
  { role: "system", content: "You are MODABER AI, a concise, helpful assistant built into the MODABERGAMES web dashboard." }
];

aiToggleBtn.addEventListener("click", () => {
  const isHidden = aiDrawer.classList.toggle("hidden");
  aiToggleBtn.classList.toggle("ai-open", !isHidden);
});

closeAiBtn.addEventListener("click", () => {
  aiDrawer.classList.add("hidden");
  aiToggleBtn.classList.remove("ai-open");
});

function appendMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `ai-msg ${sender}`;
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return div;
}

loadAiBtn.addEventListener("click", async () => {
  if (!navigator.gpu) {
    aiStatusBar.textContent = "WebGPU not supported on this browser/device.";
    return;
  }

  loadAiBtn.disabled = true;
  loadAiBtn.textContent = "Connecting to AI Engine...";

  try {
    const webllm = await import("https://esm.run");
    const selectedModel = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
    aiEngine = await webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback: (report) => {
        aiStatusBar.textContent = report.text;
      }
    });

    aiStatusDot.classList.add("ready");
    aiStatusBar.textContent = "Model Ready (Running Locally via WebGPU)";
    aiInitWrap.classList.add("hidden");
    aiForm.classList.remove("hidden");
    appendMessage("Model loaded! Ask me anything.", "bot");
  } catch (err) {
    aiStatusBar.textContent = "Error loading AI: " + err.message;
    loadAiBtn.disabled = false;
    loadAiBtn.textContent = "Retry Load Model";
  }
});

aiForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = aiInput.value.trim();
  if (!prompt || !aiEngine) return;

  aiInput.value = "";
  aiInput.disabled = true;
  aiSendBtn.disabled = true;

  appendMessage(prompt, "user");
  chatHistory.push({ role: "user", content: prompt });

  const botBubble = appendMessage("...", "bot");
  let fullReply = "";

  try {
    const chunks = await aiEngine.chat.completions.create({
      messages: chatHistory,
      stream: true
    });

    for await (const chunk of chunks) {
      const delta = chunk.choices?.delta?.content || "";
      fullReply += delta;
      botBubble.textContent = fullReply;
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    chatHistory.push({ role: "assistant", content: fullReply });
  } catch (err) {
    botBubble.textContent = "Error: " + err.message;
  }

  aiInput.disabled = false;
  aiSendBtn.disabled = false;
  aiInput.focus();
});

updateFavCount();
render();
