const allowed = (key) =>
  /^(RetroBowl\.|agArcade\.|hextris|hexgl|bkcore|hlm2[:._-]|hotline[:._-]|fancade|drive.?mad|moto.?x3m|tiny.?fishing|c2save_)/i.test(
    key,
  ) || ["highscores", "highscore"].includes(key);
async function currentOwner() {
  const sdk = await import("./firebase-sdk.js"),
    { firebaseConfig } = await import("./firebase-config.js");
  const app =
    sdk.getApps().find((a) => a.name === "[DEFAULT]") ?? sdk.initializeApp(firebaseConfig);
  const auth = sdk.getAuth(app);
  await auth.authStateReady();
  return auth.currentUser?.uid ?? "guest";
}
function database() {
  return new Promise((resolve, reject) => {
    const q = indexedDB.open("ag-arcade-campaigns", 1);
    q.onupgradeneeded = () => q.result.createObjectStore("campaigns", { keyPath: "key" });
    q.onsuccess = () => resolve(q.result);
    q.onerror = () => reject(q.error);
  });
}
async function world() {
  const key = await currentOwner(),
    db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const q = db.transaction("campaigns").objectStore("campaigns").get(key);
      q.onsuccess = () => resolve(q.result);
      q.onerror = () => reject(q.error);
    });
  } finally {
    db.close();
  }
}
function encode(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 32768)
    s += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(s);
}
export async function exportBackup() {
  const storage = Object.fromEntries(Object.entries(localStorage).filter(([k]) => allowed(k))),
    saved = await world();
  const campaign = saved ? { ...saved, key: undefined, snapshot: encode(saved.snapshot) } : null;
  const data = {
    kind: "ag-arcade-backup",
    version: 1,
    createdAt: new Date().toISOString(),
    storage,
    campaign,
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `ag-arcade-saves-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return data;
}
export async function importBackup(file) {
  if (file.size > 25 * 1024 * 1024) throw Error("File is larger than 25 MB.");
  const data = JSON.parse(await file.text());
  if (
    data.kind !== "ag-arcade-backup" ||
    data.version !== 1 ||
    !data.storage ||
    typeof data.storage !== "object" ||
    Array.isArray(data.storage)
  )
    throw Error("Choose an AG Arcade save backup.");
  const entries = Object.entries(data.storage);
  if (
    entries.length > 1000 ||
    entries.some(([k, v]) => !allowed(k) || typeof v !== "string" || v.length > 10 * 1024 * 1024)
  )
    throw Error("Invalid or unsupported game save.");
  let saved;
  if (data.campaign) {
    const c = data.campaign;
    if (
      typeof c.snapshot !== "string" ||
      c.snapshot.length > 22 * 1024 * 1024 ||
      !c.start?.config ||
      !Array.isArray(c.start.players) ||
      !c.start.players.some((p) => p.clientID === c.clientID) ||
      typeof c.name !== "string" ||
      c.name.length > 80 ||
      !Number.isFinite(c.savedAt)
    )
      throw Error("Invalid OpenFront world.");
    let decoded;
    try {
      decoded = Uint8Array.from(atob(c.snapshot), (x) => x.charCodeAt(0));
    } catch {
      throw Error("Invalid world snapshot.");
    }
    if (decoded.length < 32) throw Error("World snapshot is incomplete.");
    saved = {
      key: await currentOwner(),
      savedAt: c.savedAt,
      start: c.start,
      clientID: c.clientID,
      name: c.name,
      snapshot: decoded,
    };
  }
  if (!confirm("Restore these saves? Matching saves in this browser will be replaced."))
    throw Error("Restore cancelled.");
  if (saved) {
    const db = await database();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("campaigns", "readwrite");
        tx.objectStore("campaigns").put(saved);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }
  for (const [key, value] of entries) localStorage.setItem(key, value);
  return { saves: entries.length, world: !!saved };
}
