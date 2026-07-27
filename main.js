// Importamos las funciones del router.
// navigateTo() cambia la URL y renderiza la vista.
// router() decide qué vista mostrar según la URL actual.
import { navigateTo, router } from "./src/router/router.js";

// Escuchamos TODOS los clics que ocurren en el documento
document.addEventListener("click", (event) => { 
// Busca el <a> más cercano al elemento clickeado
// que tenga el atributo data-link.
// Si el usuario hizo clic en otro elemento, devuelve null.
const link = event.target.closest('a[data-link]');
console.log('Clicked link:', link);

if(link) {

    // Evita la navegación tradicional del navegador.
    // Sin esto, la página se recargaría completamente.
  event.preventDefault();
     // Obtiene el valor del href.
    // Ejemplo:
    // <a href="/about" data-link>
    // url = "/about"
  const url = link.getAttribute('href');
      // Navega usando la History API.
    // Cambia la URL y renderiza la vista correspondiente.
  navigateTo(url);
}
})

// Escucha cuando el usuario usa Atrás o Adelante.
window.addEventListener('popstate', () => {
  // Como la URL cambió por el historial,
  // volvemos a renderizar la vista correcta.
router();
})
// Cuando termina de cargarse la página...
document.addEventListener('DOMContentLoaded', () => {
    // Leemos la URL inicial y mostramos la vista correspondiente.
  // Ejemplo:
  // localhost:3000/chat
  // renderiza automáticamente Chat.
router();
})

