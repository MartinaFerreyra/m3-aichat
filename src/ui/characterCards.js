function renderCard(profile) {
  return `
    <article class="card">
      <img src="${profile.image}" alt="${profile.name}" />
      <div class="card-body">
        <h2 class="card-name">${profile.name}</h2>
        <p class="card-meta">${profile.species}</p>
        <p class="card-status">${profile.status}</p>
        <dl class="card-detail">
          <dt>Origen</dt><dd>${profile.originName}</dd>
          <dt>Ubicación</dt><dd>${profile.locationName}</dd>
        </dl>
      </div>
    </article>
  `;
}

export function renderGrid(profiles) {
  const container = document.getElementById("card-grid");
  if (!profiles.length) {
    container.innerHTML = `<p class="empty-state">No se encontraron personajes.</p>`;
    return;
  }
  container.innerHTML = profiles.map(renderCard).join("");
}