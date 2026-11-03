const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key)) ?? fallback;
    if (Array.isArray(fallback)) {
      if (!Array.isArray(v)) return fallback;
      return key.includes("favorites")
        ? v.filter((x) => typeof x === "string")
        : v.filter((x) => x && typeof x.id === "string" && Number.isFinite(x.at));
    }
    return v;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    document.querySelector("#library-results").textContent =
      "Browser storage is unavailable; favorites cannot be saved.";
  }
};
let favorites = new Set(read("agArcade.favorites.v1", [])),
  recent = read("agArcade.recent.v1", []),
  view = "all";
const search = document.querySelector("#game-search"),
  genre = document.querySelector("#game-genre"),
  grid = document.querySelector(".games-grid"),
  result = document.querySelector("#library-results");
const cards = [...grid.querySelectorAll(".game-card")].map((card, index) => {
  const id = new URL(card.href).pathname,
    name = card.querySelector("h3").textContent.replace("↗", "").trim(),
    category = card.querySelector(".genre").textContent.trim();
  const shell = document.createElement("div");
  shell.className = "game-shell";
  card.replaceWith(shell);
  shell.appendChild(card);
  const star = document.createElement("button");
  star.className = "favorite-game";
  shell.appendChild(star);
  star.onclick = () => {
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    write("agArcade.favorites.v1", [...favorites]);
    render();
  };
  card.addEventListener("click", () => {
    recent = [{ id, at: Date.now() }, ...recent.filter((x) => x.id !== id)].slice(0, 20);
    write("agArcade.recent.v1", recent);
  });
  return {
    id,
    name,
    category,
    index,
    shell,
    star,
    searchText: (name + " " + category + " " + card.querySelector("p").textContent).toLowerCase(),
  };
});
for (const category of [...new Set(cards.map((c) => c.category))].sort()) {
  const o = document.createElement("option");
  o.value = category;
  o.textContent = category;
  genre.appendChild(o);
}
function render() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const c of [...cards].sort((a, b) =>
    view === "recent"
      ? (recent.find((x) => x.id === b.id)?.at ?? 0) - (recent.find((x) => x.id === a.id)?.at ?? 0)
      : a.index - b.index,
  )) {
    c.star.textContent = favorites.has(c.id) ? "★" : "☆";
    c.star.setAttribute("aria-pressed", String(favorites.has(c.id)));
    c.star.setAttribute(
      "aria-label",
      (favorites.has(c.id) ? "Remove " : "Add ") +
        c.name +
        (favorites.has(c.id) ? " from favorites" : " to favorites"),
    );
    c.shell.hidden = !(
      c.searchText.includes(query) &&
      (!genre.value || c.category === genre.value) &&
      (view !== "favorites" || favorites.has(c.id)) &&
      (view !== "recent" || recent.some((x) => x.id === c.id))
    );
    grid.appendChild(c.shell);
    if (!c.shell.hidden) count++;
  }
  result.textContent = count
    ? `${count} ${count === 1 ? "game" : "games"}${view === "favorites" ? " in favorites" : view === "recent" ? " recently played" : ""}`
    : view === "favorites"
      ? "Tap a star to add your favorites."
      : view === "recent"
        ? "Games you open will appear here."
        : "No matching games. Try another search.";
  for (const b of document.querySelectorAll("[data-view]"))
    b.setAttribute("aria-pressed", String(b.dataset.view === view));
}
search.oninput = render;
genre.onchange = render;
for (const b of document.querySelectorAll("[data-view]"))
  b.onclick = () => {
    view = b.dataset.view;
    render();
  };
window.addEventListener("pageshow", () => {
  favorites = new Set(read("agArcade.favorites.v1", []));
  recent = read("agArcade.recent.v1", []);
  render();
});
render();
const dialog = document.querySelector("#backup-dialog");
document.querySelector("#open-backups").onclick = () => dialog.showModal();
document.querySelector("#export-saves").onclick = async () => {
  const status = document.querySelector("#backup-status");
  try {
    const { exportBackup } = await import("./save-backups.js");
    await exportBackup();
    status.textContent = "Backup downloaded. Keep it somewhere safe.";
  } catch (e) {
    status.textContent = "Could not create a backup: " + e.message;
  }
};
document.querySelector("#import-saves").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const status = document.querySelector("#backup-status");
  try {
    const { importBackup } = await import("./save-backups.js");
    const summary = await importBackup(file);
    status.textContent = `Restored ${summary.saves} game saves${summary.world ? " and your OpenFront world" : ""}.`;
    favorites = new Set(read("agArcade.favorites.v1", []));
    recent = read("agArcade.recent.v1", []);
    render();
  } catch (e) {
    status.textContent = "Backup not restored: " + e.message;
  } finally {
    e.target.value = "";
  }
};
