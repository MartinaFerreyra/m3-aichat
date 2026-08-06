import { describe, it, expect } from "vitest";
import { CHARACTERS } from "../src/characters/index.js";

describe("CHARACTERS", () => {
  it("existe al menos un personaje", () => {
    expect(Object.keys(CHARACTERS).length).toBeGreaterThan(0);
  });

  it("Patrick tiene nombre", () => {
    expect(CHARACTERS.patrick.name).toBe("Patrick Stump");
  });

  it("Patrick tiene una imagen", () => {
    expect(CHARACTERS.patrick.image).toContain("pat.webp");
  });

  it("Patrick tiene un system prompt definido", () => {
    expect(CHARACTERS.patrick.prompt.length).toBeGreaterThan(0);
  });
});