import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage } from "../src/services/geminiService.js";

describe("sendMessage", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("devuelve la respuesta cuando la API responde bien", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "¡Hola! Soy Patrick." }),
    });

    const result = await sendMessage("patrick", "hola", []);
    expect(result.response).toBe("¡Hola! Soy Patrick.");
  });

  it("lanza un error si la API responde con status no-ok", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(sendMessage("patrick", "hola", [])).rejects.toThrow();
  });

  it("llama a fetch con el endpoint correcto", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "ok" }),
    });

    await sendMessage("patrick", "hola", []);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" })
    );
  });
});