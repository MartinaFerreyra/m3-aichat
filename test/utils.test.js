import { describe, it, expect } from "vitest";
import { getStorageKey, getTrimmedHistory, formatTime } from "../src/views/chat.js";

describe("getStorageKey", () => {
  it("arma la clave con el nombre del personaje", () => {
    expect(getStorageKey("patrick")).toBe("chatSessions_patrick");
  });

  it("genera claves distintas para personajes distintos", () => {
    expect(getStorageKey("patrick")).not.toBe(getStorageKey("bot2"));
  });
});

describe("getTrimmedHistory", () => {
  it("devuelve todo el array si no supera el máximo", () => {
    const messages = [{ role: "user", content: "hola" }];
    expect(getTrimmedHistory(messages, 12)).toEqual(messages);
  });

  it("recorta a los últimos N mensajes cuando excede el máximo", () => {
    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `mensaje ${i}`,
    }));
    const result = getTrimmedHistory(messages, 12);
    expect(result).toHaveLength(12);
    expect(result[0].content).toBe("mensaje 8");
  });

  it("devuelve array vacío si el historial está vacío", () => {
    expect(getTrimmedHistory([], 12)).toEqual([]);
  });
});

describe("formatTime", () => {
  it("formatea un timestamp como hora:minuto", () => {
    const timestamp = new Date("2026-08-06T14:30:00").getTime();
    expect(formatTime(timestamp)).toMatch(/\d{1,2}:\d{2}/); // formato tipo "14:30" o "2:30 PM"
  });
});