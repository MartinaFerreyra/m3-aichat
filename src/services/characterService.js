function buildUrl(name) { //construir la url
  //va recibir un nombre  
  const base = "https://rickandmortyapi.com/api/character/";
  // y tenemos la base de la url

  const params = new URLSearchParams({ name }); //arma el query params
  return `${base}?${params.toString()}`; //url completa con query params
}

export async function fetchCharacters(name) { //va a pedir los datos  
  const url = buildUrl(name); //invocarlo
  const res = await fetch(url); //esperar la respuesta, fetch mensajero --> buscar ese nombre en esa direccion
  if (!res.ok) throw new Error(`HTTP ${res.status}`);//sino recibimos el ok,lanza un error manda ese estado de error
  return res.json();
}