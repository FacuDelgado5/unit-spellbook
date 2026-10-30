import { expect, test } from "vitest";
import Spell, { type FirstAppearance } from "../domain/Spell";

const MAX_DESCRIPTION =
  "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij";

test("A spell from a book is original", () => {
  const spell = new Spell("Lumos", "Ilumina la punta de la varita", "book");

  expect(spell.isOriginal()).toBeTruthy();
});

test("A spell that is not from a book is not original", () => {
  const spell = new Spell("Expecto Patronum", "Invoca un patronus", "movie");

  expect(spell.isOriginal()).toBeFalsy();
});

test("The spell name cannot be empty", () => {
  expect(() => new Spell("   ", "Descripción válida", "book")).toThrow(
    "El nombre del hechizo no puede ser vacío",
  );
});

test("The spell description cannot be empty", () => {
  expect(() => new Spell("Lumos", "   ", "book")).toThrow(
    "La descripción del hechizo no puede ser vacía",
  );
});

test("The description can have the maximum allowed length", () => {
  expect(() => new Spell("Lumos", MAX_DESCRIPTION, "book")).not.toThrow();
});

test("The description cannot exceed the maximum allowed length", () => {
  const tooLongDescription = `${MAX_DESCRIPTION}x`;

  expect(() => new Spell("Lumos", tooLongDescription, "book")).toThrow(
    "La descripción no puede superar los 120 caracteres",
  );
});

test("The first appearance must be valid", () => {
  const invalidOrigin = "invalid" as FirstAppearance;

  expect(() => new Spell("Lumos", "Descripción válida", invalidOrigin)).toThrow(
    "Debe indicar la primera aparición del hechizo",
  );
});

test("The spell name is stored without surrounding spaces", () => {
  const spell = new Spell("  Lumos  ", "Descripción válida", "book");

  expect(spell.name).toBe("Lumos");
});

test("It returns the correct origin label", () => {
  const bookSpell = new Spell("Lumos", "Descripción", "book");
  const movieSpell = new Spell("Alohomora", "Descripción", "movie");
  const videogameSpell = new Spell("Flipendo", "Descripción", "videogame");

  expect(bookSpell.getOriginLabel()).toBe("Libro");
  expect(movieSpell.getOriginLabel()).toBe("Película");
  expect(videogameSpell.getOriginLabel()).toBe("Videojuego");
});

test("It describes the spell in one line", () => {
  const spell = new Spell("Lumos", "Ilumina la varita", "book");

  expect(spell.describe()).toBe("Lumos (Libro): Ilumina la varita");
});
