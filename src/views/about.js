// src/views/about.js
import { CHARACTERS } from "../characters/index.js";

export function renderAbout() {
  const app = document.getElementById("app");

  // Personaje principal del proyecto (POC)
  const character = CHARACTERS["patrick"];

  app.innerHTML = `
    <section class="homeHero">
      <h1>Sobre el proyecto</h1>
      <p>Una prueba de concepto de ComicSansCon para chatear con personajes ficticios.</p>
    </section>

    <section class="aboutContent">
      <h2>¿De qué se trata?</h2>
      <p>
        Esta aplicación es una Single Page Application (SPA) que permite mantener
        conversaciones naturales con un personaje de una franquicia popular,
        integrando la API de Google Gemini de forma segura mediante Vercel
        Serverless Functions, sin exponer nunca la clave de API en el cliente.
      </p>
      <ul class="aboutList">
        <li>Routing sin recargas usando la History API (Home, Chat, About)</li>
        <li>Diseño responsive mobile-first</li>
        <li>Historial de conversación persistido con localStorage</li>
        <li>Modo claro/oscuro</li>
      </ul>
    </section>

    <section class="aboutCharacter">
      <h2>Personaje elegido</h2>
      <div class="card">
        <img src="${character.image}" alt="${character.name}" />
        <div>
          <h3>${character.name}</h3>
          <p>${character.description || ""}</p>
        </div>
      </div>
    </section>
  `;
}