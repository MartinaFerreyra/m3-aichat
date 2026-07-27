//
import { loadCharacters } from "./characterView.js";
import { renderGrid } from "../ui/characterCards.js";

export function renderHome() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div id="loading" style="display:none;">Cargando...</div>
    <div id="error-message" style="display:none;"></div>
    <div id="card-grid"></div>
  `;

  fetchAndRender("rick");
}

async function fetchAndRender(name) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-message');

  loadingEl.style.display = 'block';
  errorEl.style.display = 'none';

  try {
    const profiles = await loadCharacters(name);
    console.log("Cantidad de personajes:", profiles.length);
    renderGrid(profiles);
  } catch (err) {
    errorEl.textContent = `No se pudo cargar personajes: ${err.message}`;
    errorEl.style.display = 'block';
  } finally {
    loadingEl.style.display = 'none';
  }
}