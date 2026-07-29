import { GoogleGenAI } from "@google/genai";
import { CHARACTERS } from "../src/characters/index.js";

// Crear la conexión con Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {

  // Solo aceptar peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  try {

    // Datos que llegan desde el chat
    const {
      character,
      message,
      history = []
    } = req.body;

    // Validar datos
    if (!character || !message) {
      return res.status(400).json({
        error: "Faltan datos."
      });
    }

    // Buscar el personaje elegido
    const personaje = CHARACTERS[character];

    if (!personaje) {
      return res.status(404).json({
        error: "Personaje no encontrado."
      });
    }

    // Convertir el historial al formato de Gemini
    const contents = [

      ...history.map(item => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: item.content
          }
        ]
      })),

      {
        role: "user",
        parts: [
          {
            text: message
          }
        ]
      }

    ];

    // Enviar a Gemini
    const result = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents,

      config: {
        systemInstruction: personaje.prompt,
        temperature: 0.7
      }

    });

    return res.status(200).json({
      response: result.text
    });

  } catch (error) {
  console.error("ERROR COMPLETO:");
  console.error(error);

  return res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}

}