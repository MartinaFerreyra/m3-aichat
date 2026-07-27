//importamos 
import { fetchCharacters } from "../services/characterService.js"; 
import { toCharacterProfile } from "../transform/characterTransform.js"; 
//funcion que retorna

export async function loadCharacters(name) { //funcion asincronica
    //porque va llamar a la funcion fetchCharacters (asincronica)
  const data = await fetchCharacters(name);// 👈 EJECUTA fetchCharacters, guarda el resultado en "data"
  const results = data.results; // 👈 de ese resultado, saca solo el array de personajes

  if (!results?.length) { //si no hay nada o longitud  
    return []; // caso legítimo: búsqueda válida, sin resultados
  }

  return results.slice(0, 3).map(toCharacterProfile);//sirve para "cortar" y extraer una parte de una lista (array)
}