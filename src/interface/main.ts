import Spell, {
  FIRST_APPEARANCES,
  ORIGIN_LABELS,
  type FirstAppearance,
} from "../domain/Spell";
import Spellbook from "../domain/Spellbook";
import bookIcon from "./img/book.svg";
import movieIcon from "./img/movie.svg";
import videogameIcon from "./img/videogame.svg";

const ORIGIN_ICONS: Record<FirstAppearance, string> = {
  book: bookIcon,
  movie: movieIcon,
  videogame: videogameIcon,
};

const btnAdd = document.getElementById("btn-add") as HTMLButtonElement | null;
const inpName = document.getElementById("inp-name") as HTMLInputElement | null;
const inpDescription = document.getElementById(
  "inp-description",
) as HTMLTextAreaElement | null;

const mainSpellbook = new Spellbook();

function selectedOrigin(): string {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="first-appearance"]:checked',
  );
  return checked ? checked.value : "";
}

if (btnAdd && inpName && inpDescription) {
  btnAdd.addEventListener("click", () => {
    const errorContainer = document.getElementById("add-spell-error");
    const errorMessage = document.getElementById("add-spell-error-msg");
    try {
      const newSpell = new Spell(
        inpName.value,
        inpDescription.value,
        selectedOrigin() as FirstAppearance,
      );
      mainSpellbook.addSpell(newSpell);
      clearInputs(inpName, inpDescription);
      errorContainer?.classList.add("d-none");
      renderSpells();
      showSuccessMessage(`${newSpell.name} agregado correctamente!`);
    } catch (error) {
      errorContainer?.classList.remove("d-none");
      if (errorMessage) {
        errorMessage.innerText =
          error instanceof Error ? error.message : String(error);
      }
    }
  });
}

function clearInputs(nameEl: HTMLInputElement, descEl: HTMLTextAreaElement) {
  nameEl.value = "";
  descEl.value = "";
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="first-appearance"]:checked',
  );
  if (checked) {
    checked.checked = false;
  }
}

function originIcon(
  origin: FirstAppearance,
  cssClass: string,
): HTMLImageElement {
  const img = document.createElement("img");
  img.src = ORIGIN_ICONS[origin];
  img.alt = ORIGIN_LABELS[origin];
  img.className = cssClass;
  return img;
}

function spellItem(spell: Spell): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "list-group-item d-flex align-items-center gap-3";

  const text = document.createElement("div");
  text.className = "flex-grow-1";
  const title = document.createElement("strong");
  title.textContent = spell.name;
  const detail = document.createElement("div");
  detail.className = "small text-muted";
  detail.textContent = spell.description;
  text.append(title, detail);

  const badge = document.createElement("span");
  badge.className = `badge origin-badge origin-${spell.firstAppearance}`;
  badge.textContent = spell.getOriginLabel();

  item.append(originIcon(spell.firstAppearance, "spell-icon"), text, badge);
  return item;
}

function renderCounters(): void {
  const counters = document.getElementById("counters");
  const counts = mainSpellbook.countByOrigin();
  const chips = FIRST_APPEARANCES.map((origin) => {
    const chip = document.createElement("span");
    chip.className = "d-inline-flex align-items-center gap-1";
    chip.append(
      originIcon(origin, "origin-icon"),
      `${ORIGIN_LABELS[origin]}: ${counts[origin]}`,
    );
    return chip;
  });
  counters?.replaceChildren(...chips);
}

function renderSpells(): void {
  document.getElementById("empty-list")?.classList.add("d-none");
  document.getElementById("spells")?.classList.remove("d-none");
  document
    .getElementById("spells-list")
    ?.replaceChildren(...mainSpellbook.getSpells().map(spellItem));
  renderCounters();
}

//Agrego para sustituir la alerta
function showSuccessMessage(message: string): void {
  const alertsContainer = document.getElementById("alerts-container");

  if (!alertsContainer) {
    return;
  }

  const alertMessage = document.createElement("div");

  alertMessage.className = "alert alert-success";
  alertMessage.textContent = message;

  alertsContainer.replaceChildren(alertMessage);
}
