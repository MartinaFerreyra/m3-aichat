// Importamos las funciones que dibujan cada vista.
// src/router/router.js
import { renderAbout } from "../../views/about.js"; 
import { renderChat } from "../../views/chat.js"; 
import { renderHome } from "../../views/home.js"; 
import { renderNotFound } from "../../views/notFound.js";


// Tabla de rutas.
//
// La clave es la URL.
// El valor es la función que renderiza esa vista.
//
// "/"      -> Home
// "/chat"  -> Chat
// "/about" -> About
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
    renderView();
  } else {
    renderNotFound();
  }
   //* Refactoring
  // const renderView = routes[path] || renderNotFound;
  // renderView();
}

export function navigateTo(path) { //esta cambiando la URL con pushState, pero solamente cambia la URL asi que invocamos router para que decida que mostrar dependiendo de la URL que llego
  history.pushState({}, '', path);// primer argumento también puede ir null
  router(); // CRÍTICO — sin esto, la URL cambia pero la vista no
}

//cambiar URL pero la vista queda igual
