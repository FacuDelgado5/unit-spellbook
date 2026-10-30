import { beforeEach, expect, test } from "vitest";
import Spell from "../domain/Spell";
import Spellbook from "../domain/Spellbook";

let spellbook: Spellbook;

beforeEach(() => {
  spellbook = new Spellbook();
});

test("A spell can be added to the spellbook", () => {
  const spell = new Spell("Lumos", "Ilumina la varita", "book");

  spellbook.addSpell(spell);

  expect(spellbook.getSpells()).toEqual([spell]);
});

test("A repeated spell name is rejected", () => {
  const firstSpell = new Spell("Lumos", "Primera descripción", "book");

  const repeatedSpell = new Spell("Lumos", "Otra descripción", "movie");

  spellbook.addSpell(firstSpell);

  expect(() => spellbook.addSpell(repeatedSpell)).toThrow(
    "Lumos ya está en el libro de hechizos",
  );
});

test("Repeated spell names are detected ignoring capitalization", () => {
  const firstSpell = new Spell("Lumos", "Primera descripción", "book");

  const repeatedSpell = new Spell("lUmOs", "Otra descripción", "movie");

  spellbook.addSpell(firstSpell);

  expect(() => spellbook.addSpell(repeatedSpell)).toThrow(
    "lUmOs ya está en el libro de hechizos",
  );
});

test("getSpells returns a copy of the spell list", () => {
  const spell = new Spell("Lumos", "Ilumina la varita", "book");

  spellbook.addSpell(spell);

  const firstCopy = spellbook.getSpells();
  const secondCopy = spellbook.getSpells();

  expect(firstCopy).toEqual(secondCopy);
  expect(firstCopy).not.toBe(secondCopy);
});

test("Spells can be filtered by their first appearance", () => {
  const bookSpell = new Spell("Lumos", "Descripción", "book");
  const movieSpell = new Spell("Alohomora", "Descripción", "movie");
  const videogameSpell = new Spell("Flipendo", "Descripción", "videogame");

  spellbook.addSpell(bookSpell);
  spellbook.addSpell(movieSpell);
  spellbook.addSpell(videogameSpell);

  expect(spellbook.findByOrigin("book")).toEqual([bookSpell]);
  expect(spellbook.findByOrigin("movie")).toEqual([movieSpell]);
  expect(spellbook.findByOrigin("videogame")).toEqual([videogameSpell]);
});

test("Filtering returns an empty list when there are no matches", () => {
  const spell = new Spell("Lumos", "Descripción", "book");

  spellbook.addSpell(spell);

  expect(spellbook.findByOrigin("movie")).toEqual([]);
});

test("An empty spellbook has all counters at zero", () => {
  expect(spellbook.countByOrigin()).toEqual({
    book: 0,
    movie: 0,
    videogame: 0,
  });
});

test("It counts spells by their first appearance", () => {
  spellbook.addSpell(new Spell("Lumos", "Descripción", "book"));
  spellbook.addSpell(new Spell("Accio", "Descripción", "book"));
  spellbook.addSpell(new Spell("Alohomora", "Descripción", "movie"));
  spellbook.addSpell(new Spell("Flipendo", "Descripción", "videogame"));

  expect(spellbook.countByOrigin()).toEqual({
    book: "xx".length,
    movie: "x".length,
    videogame: "x".length,
  });
});
