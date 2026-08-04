// src/views/chat.js
// src/views/chat.js
import { sendMessage } from "../services/geminiService.js";
import { CHARACTERS } from "../characters/index.js"; // nueva línea

const MAX_TURNS = 12;

let currentCharacterId = "patrick";
let sessions = [];
let currentSessionId = null;
let history = [];

function getStorageKey(characterId) {
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

function getTrimmedHistory(messages, maxTurns = MAX_TURNS) {
  return messages.slice(-maxTurns);
}

export function renderChat(characterId = "patrick") {
  currentCharacterId = characterId;
  sessions = loadSessions(currentCharacterId);

  const app = document.getElementById("app");

  app.innerHTML = `
  <div class="chatLayout">
    <aside class="chatSidebar" id="chatSidebar">
      <button class="newChatBtn" id="newChatBtn">+ Nuevo chat</button>
      <ul class="sessionList" id="sessionList"></ul>
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
      row.innerHTML = `<div class="message message--user">${msg.content}</div>`;
    } else {
      row.className = "messageRow messageRow--character";
      row.innerHTML = `
        <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
        <div class="message message--character">${msg.content}</div>
      `;
    }

    messages.appendChild(row);
  });

  messages.scrollTop = messages.scrollHeight;
}


function renderHistoryDebug() {
  const dump = document.getElementById("historyDump");
  if (dump) {
    dump.textContent = JSON.stringify(history, null, 2);
  }
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
    currentSessionId = item.dataset.id;
    history = getActiveSession().messages;
    renderSidebar();
    renderMessages();
    renderHistoryDebug();
  });
}

function attachSidebarToggle() {
  const btn = document.getElementById("toggleSidebarBtn");
  const sidebar = document.getElementById("chatSidebar");

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("chatSidebar--hidden");
  });
}

function attachChatEvents() {
  const form = document.querySelector(".chatComposer");
  const input = document.querySelector(".chatInput");
  const messages = document.getElementById("chatMessages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    // Mensaje del usuario, con la estructura nueva
    const userRow = document.createElement("div");
    userRow.className = "messageRow messageRow--user";
    userRow.innerHTML = `<div class="message message--user"></div>`;
    userRow.querySelector(".message").textContent = text;
    messages.appendChild(userRow);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    const historialParaEnviar = getTrimmedHistory(history);

    try {
      const data = await sendMessage(currentCharacterId, text, historialParaEnviar);

      // Mensaje del personaje, con avatar + estructura nueva
      const avatarSrc = CHARACTERS[currentCharacterId]?.image;
      const aiRow = document.createElement("div");
      aiRow.className = "messageRow messageRow--character";
      aiRow.innerHTML = `
        <img class="avatar" src="${avatarSrc}" alt="${currentCharacterId}" />
        <div class="message message--character"></div>
      `;
      aiRow.querySelector(".message").textContent = data.response;
      messages.appendChild(aiRow);

      history.push({ role: "user", content: text });
      history.push({ role: "assistant", content: data.response });

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

      const errorRow = document.createElement("div");
      errorRow.className = "messageRow messageRow--character";
      errorRow.innerHTML = `<div class="message message--character">Lo siento, ocurrió un error al responder.</div>`;
      messages.appendChild(errorRow);
    }
  });
}