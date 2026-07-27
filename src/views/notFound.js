// views/notFound.js
export function renderNotFound() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <main class="notFound">
      <h1>404</h1>
      <p>La página que buscás no existe.</p>
    </main>
  `;
}