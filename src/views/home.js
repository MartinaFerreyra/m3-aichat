// src/views/home.js
import { CHARACTERS } from "../characters/index.js";
import { renderGrid } from "../ui/characterCards.js";

export function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="homeHero">
      <h1>Chatea con tu personaje favorito</h1>
      <p>Elegí un personaje y empezá a conversar.</p>
    </section>
    <div id="card-grid" class="cardGrid"></div>
  `;

  const characterList = Object.values(CHARACTERS);
  renderGrid(characterList);
}