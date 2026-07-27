// src/views/chat.js

import { sendMessage } from "../services/geminiService.js";

// Historial de la conversación
const history = [];

export function renderChat() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <header class="chatHeader">
      <h1 class="chatTitle">Chat</h1>
      <p class="chatSubtitle">Con Patrick Stump</p>
    </header>

    <main class="chatMessages">
      <div class="message message--character">
        ¡Hola! Soy Patrick Stump. ¿Sobre qué te gustaría conversar?
      </div>
    </main>

    <form class="chatComposer">
      <input
        class="chatInput"
        type="text"
        placeholder="Escribe un mensaje..."
      />
      <button class="chatSend" type="submit">
        Enviar
      </button>
    </form>
  `;

  attachChatEvents();
}

function attachChatEvents() {
  const form = document.querySelector(".chatComposer");
  const input = document.querySelector(".chatInput");
  const messages = document.querySelector(".chatMessages");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    // ===========================
    // Mostrar mensaje del usuario
    // ===========================

    const userMessage = document.createElement("div");

    userMessage.className = "message message--user";

    userMessage.textContent = text;

    messages.appendChild(userMessage);

    // Guardar en historial
    history.push({
      role: "user",
      content: text,
    });

    input.value = "";

    messages.scrollTop = messages.scrollHeight;

    try {

      // ===========================
      // Enviar a Gemini
      // ===========================

      const data = await sendMessage(
        "patrick",
        text,
        history
      );

      // ===========================
      // Mostrar respuesta
      // ===========================

      const aiMessage = document.createElement("div");

      aiMessage.className = "message message--character";

      aiMessage.textContent = data.response;

      messages.appendChild(aiMessage);

      // Guardar respuesta
      history.push({
        role: "assistant",
        content: data.response,
      });

      messages.scrollTop = messages.scrollHeight;

    } catch (error) {

      console.error(error);

      const errorMessage = document.createElement("div");

      errorMessage.className = "message message--character";

      errorMessage.textContent =
        "Lo siento, ocurrió un error al responder.";

      messages.appendChild(errorMessage);

    }

  });

}