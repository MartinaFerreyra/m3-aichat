// src/ui/characterCards.js
function renderCard(character) {
  return `
    <a href="/chat?character=${character.id}" data-link class="card">
      <img src="${character.image}" alt="${character.name}" />
      <div class="card-body">
        <h2 class="card-name">${character.name}</h2>
        <p class="card-meta">${character.description}</p>
      </div>
    </a>
  `;
}

export function renderGrid(characters) {
  const container = document.getElementById("card-grid");
  if (!characters.length) {
    container.innerHTML = `<p class="empty-state">No se encontraron personajes.</p>`;
    return;
  }
  container.innerHTML = characters.map(renderCard).join("");
}