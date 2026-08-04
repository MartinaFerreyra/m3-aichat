// src/router/router.js
import { renderAbout } from "../views/about.js";
import { renderChat } from "../views/chat.js";
import { renderHome } from "../views/home.js";
import { renderNotFound } from "../views/notFound.js";

const routes = {
  '/': renderHome,
  '/chat': renderChat,
  '/about': renderAbout,
};

export function router() {
  const path = window.location.pathname;
  const renderView = routes[path];

  console.log('Routing to:', path);

  if (renderView) {
    // Leemos el parámetro ?character=... de la URL
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get('character') || 'patrick'; // fallback si no viene

    renderView(characterId); // le pasamos el id a la vista
  } else {
    renderNotFound();
  }
}

export function navigateTo(path) {
  history.pushState({}, '', path);
  router();
}

//cambiar URL pero la vista queda igual
