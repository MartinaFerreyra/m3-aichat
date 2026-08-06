// src/views/chat.js
// src/views/chat.js
import { sendMessage } from "../services/geminiService.js";
import { CHARACTERS } from "../characters/index.js";

const MAX_TURNS = 12;

let currentCharacterId = "patrick";
let sessions = [];
let currentSessionId = null;
let history = [];

export function getStorageKey(characterId) {
  return `chatSessions_${characterId}`;
}

function loadSessions(characterId) {
  try {
    const raw = localStorage.getItem(getStorageKey(characterId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(characterId) {
  localStorage.setItem(getStorageKey(characterId), JSON.stringify(sessions));
}

function createSession() {
  const session = {
    id: Date.now().toString(),
    title: "Nueva conversación",
    messages: [],
    updatedAt: Date.now(),
  };
  sessions.unshift(session);
  saveSessions(currentCharacterId);
  return session;
}

export function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getTrimmedHistory(messages, maxTurns = MAX_TURNS) {
  return messages.slice(-maxTurns);
}

// ---- Tema claro/oscuro ----
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  const btn = document.getElementById("themeToggleBtn");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
}

function attachThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  btn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

// ---- Copiar al portapapeles ----
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = "✅";
    setTimeout(() => (btn.textContent = original), 1200);
  } catch (err) {
    console.error("No se pudo copiar:", err);
  }
}

function attachCopyButtons(container) {
  container.querySelectorAll(".copyBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.dataset.text || "";
      copyToClipboard(text, btn);
    });
  });
}

// ---- Indicador "escribiendo..." ----
function showTypingIndicator(messages, avatarSrc) {
  const row = document.createElement("div");
  row.className = "messageRow messageRow--character";
  row.id = "typingIndicator";
  row.innerHTML = `
    <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
    <div class="message message--character typingBubble">
      <span class="typingDot"></span>
      <span class="typingDot"></span>
      <span class="typingDot"></span>
    </div>`;
  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

export function renderChat(characterId = "patrick") {
  currentCharacterId = characterId;
  sessions = loadSessions(currentCharacterId);

  const app = document.getElementById("app");

  app.innerHTML = `
  <div class="chatLayout">
    <aside class="chatSidebar" id="chatSidebar">
      <button class="newChatBtn" id="newChatBtn">+ Nuevo chat</button>
      <p class="historyIndicator" id="historyIndicator"></p>
      <ul class="sessionList" id="sessionList"></ul>
      <button class="clearHistoryBtn" id="clearHistoryBtn">🗑️ Borrar historial</button>
    </aside>

    <div class="chatMain">
      <header class="chatHeader">
        <button class="toggleSidebarBtn" id="toggleSidebarBtn">☰ Historial</button>
        <div class="chatHeaderInfo">
          <img class="headerAvatar" src="${CHARACTERS[currentCharacterId]?.image}" alt="${currentCharacterId}" />
          <div>
            <h1 class="chatTitle">Chat</h1>
            <p class="chatSubtitle">Con ${CHARACTERS[currentCharacterId]?.name}</p>
          </div>
        </div>
        <button class="themeToggleBtn" id="themeToggleBtn" aria-label="Cambiar tema" title="Cambiar tema claro/oscuro">🌙</button>
      </header>

      <main class="chatMessages" id="chatMessages"></main>

      <form class="chatComposer">
        <input class="chatInput" type="text" placeholder="Escribe un mensaje..." />
        <button class="chatSend" type="submit">Enviar</button>
      </form>

    </div>
  </div>
`;

  if (sessions.length === 0) {
    const session = createSession();
    currentSessionId = session.id;
  } else {
    currentSessionId = sessions[0].id;
  }

  history = getActiveSession().messages;

  renderSidebar();
  renderMessages();
  renderHistoryDebug();
  attachChatEvents();
  attachSidebarEvents();
  attachSidebarToggle();
  initTheme();
  attachThemeToggle();
}

function getActiveSession() {
  return sessions.find((s) => s.id === currentSessionId);
}

function renderSidebar() {
  const list = document.getElementById("sessionList");
  list.innerHTML = sessions
    .map(
      (s) => `
      <li class="sessionItem ${s.id === currentSessionId ? "sessionItem--active" : ""}" data-id="${s.id}">
        ${s.title}
      </li>`
    )
    .join("");

  renderHistoryIndicator();
}

function renderHistoryIndicator() {
  const indicator = document.getElementById("historyIndicator");
  if (!indicator) return;

  const count = sessions.length;
  if (count === 0) {
    indicator.textContent = "Sin historial guardado";
    indicator.classList.remove("historyIndicator--active");
  } else {
    indicator.textContent = `💾 ${count} conversación${count > 1 ? "es" : ""} guardada${count > 1 ? "s" : ""}`;
    indicator.classList.add("historyIndicator--active");
  }
}

function renderMessages() {
  const avatarSrc = CHARACTERS[currentCharacterId]?.image;
  const messages = document.getElementById("chatMessages");

  messages.innerHTML = `
    <div class="messageRow messageRow--character">
      <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
      <div class="message message--character">¡Hola! Soy ${currentCharacterId}. ¿Sobre qué te gustaría conversar?</div>
    </div>
  `;

  history.forEach((msg) => {
    const row = document.createElement("div");

    if (msg.role === "user") {
      row.className = "messageRow messageRow--user";
      row.innerHTML = `
        <div class="message message--user">
          ${msg.content}
          <span class="messageTime">${formatTime(msg.timestamp)}</span>
        </div>`;
    } else {
      row.className = "messageRow messageRow--character";
      row.innerHTML = `
        <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
        <div class="message message--character">
          <button class="copyBtn" data-text="${msg.content.replace(/"/g, "&quot;")}" title="Copiar respuesta">📋</button>
          ${msg.content}
          <span class="messageTime">${formatTime(msg.timestamp)}</span>
        </div>`;
    }

    messages.appendChild(row);
  });

  attachCopyButtons(messages);
  messages.scrollTop = messages.scrollHeight;
}

function renderHistoryDebug() {
  const dump = document.getElementById("historyDump");
  if (dump) {
    dump.textContent = JSON.stringify(history, null, 2);
  }
}

function clearHistory() {
  const confirmed = confirm(
    `¿Seguro que querés borrar todo el historial de conversaciones con ${CHARACTERS[currentCharacterId]?.name || currentCharacterId}? Esta acción no se puede deshacer.`
  );
  if (!confirmed) return;

  localStorage.removeItem(getStorageKey(currentCharacterId));
  sessions = [];

  const session = createSession();
  currentSessionId = session.id;
  history = session.messages;

  renderSidebar();
  renderMessages();
  renderHistoryDebug();
}

function attachSidebarEvents() {
  document.getElementById("newChatBtn").addEventListener("click", () => {
    const session = createSession();
    currentSessionId = session.id;
    history = session.messages;
    renderSidebar();
    renderMessages();
    renderHistoryDebug();
  });

  document.getElementById("sessionList").addEventListener("click", (e) => {
    const item = e.target.closest(".sessionItem");
    if (!item) return;

    const id = item.dataset.id;
    if (id === currentSessionId) return;

    currentSessionId = id;
    history = getActiveSession().messages;
    renderSidebar();
    renderMessages();
    renderHistoryDebug();
  });

  document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);
}

function attachSidebarToggle() {
  const btn = document.getElementById("toggleSidebarBtn");
  const sidebar = document.getElementById("chatSidebar");

  btn.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.toggle("chatSidebar--open");
      btn.classList.toggle("toggleSidebarBtn--shifted");
    } else {
      sidebar.classList.toggle("chatSidebar--hidden");
    }
  });
}

function attachChatEvents() {
  const form = document.querySelector(".chatComposer");
  const input = document.querySelector(".chatInput");
  const messages = document.getElementById("chatMessages");

  // Enter envía, Shift+Enter permite salto de línea (por si el input pasa a ser textarea)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    const userTimestamp = Date.now();

    // Mensaje del usuario, con timestamp
    const userRow = document.createElement("div");
    userRow.className = "messageRow messageRow--user";
    userRow.innerHTML = `
      <div class="message message--user">
        <span class="messageText"></span>
        <span class="messageTime">${formatTime(userTimestamp)}</span>
      </div>`;
    userRow.querySelector(".messageText").textContent = text;
    messages.appendChild(userRow);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    const historialParaEnviar = getTrimmedHistory(history);
    const avatarSrc = CHARACTERS[currentCharacterId]?.image;

    showTypingIndicator(messages, avatarSrc);

    try {
      const data = await sendMessage(currentCharacterId, text, historialParaEnviar);

      removeTypingIndicator();

      const aiTimestamp = Date.now();

      // Mensaje del personaje, con avatar, timestamp y botón de copiar
      const aiRow = document.createElement("div");
      aiRow.className = "messageRow messageRow--character";
      aiRow.innerHTML = `
        <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
        <div class="message message--character">
          <button class="copyBtn" data-text="" title="Copiar respuesta">📋</button>
          <span class="messageText"></span>
          <span class="messageTime">${formatTime(aiTimestamp)}</span>
        </div>
      `;
      aiRow.querySelector(".messageText").textContent = data.response;
      aiRow.querySelector(".copyBtn").dataset.text = data.response;
      messages.appendChild(aiRow);
      attachCopyButtons(aiRow);

      history.push({ role: "user", content: text, timestamp: userTimestamp });
      history.push({ role: "assistant", content: data.response, timestamp: aiTimestamp });

      const session = getActiveSession();
      session.messages = history;
      session.updatedAt = Date.now();
      if (session.title === "Nueva conversación") {
        session.title = text.slice(0, 30) + (text.length > 30 ? "…" : "");
      }
      sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      saveSessions(currentCharacterId);

      renderSidebar();
      renderHistoryDebug();
      messages.scrollTop = messages.scrollHeight;
    } catch (error) {
      console.error(error);
      removeTypingIndicator();

      const errorRow = document.createElement("div");
      errorRow.className = "messageRow messageRow--character";
      errorRow.innerHTML = `<div class="message message--character">Lo siento, ocurrió un error al responder.</div>`;
      messages.appendChild(errorRow);
    }
  });
}