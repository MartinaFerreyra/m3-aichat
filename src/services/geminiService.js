import { CHARACTERS } from "../characters/index.js";

export async function sendMessage(characterId, message, history = []) {

  const character = CHARACTERS[characterId];

  const body = {

    character: characterId,

    message,

    history
  };

  const response = await fetch("/api/chat", {

    method: "POST",

    headers: {

      "Content-Type": "application/json"
    },

    body: JSON.stringify(body)
  });

  if (!response.ok) {

    throw new Error("Error al conectar con Gemini");
  }

  return response.json();
}