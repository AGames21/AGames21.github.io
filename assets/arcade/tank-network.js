import {
  initializeApp,
  getAuth,
  signInAnonymously,
  getDatabase,
  ref,
  get,
  set,
  onValue,
  onDisconnect,
  runTransaction,
  serverTimestamp,
} from "./firebase-sdk.js";
import { firebaseConfig } from "./firebase-config.js";
let connection;
async function connect() {
  if (!connection)
    connection = (async () => {
      const app = initializeApp(firebaseConfig, "ag-arcade-tanks"),
        auth = getAuth(app);
      await auth.authStateReady();
      if (!auth.currentUser) await signInAnonymously(auth);
      return { db: getDatabase(app), uid: auth.currentUser.uid };
    })().catch((e) => {
      connection = null;
      throw e;
    });
  return connection;
}
const cleanName = (name) =>
  String(name)
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim()
    .slice(0, 18) || "Commander";
function code() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return [...bytes].map((x) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");
}
export async function createRoom(name, handlers) {
  const c = await connect();
  for (let i = 0; i < 5; i++) {
    const id = code(),
      meta = ref(c.db, `tankRooms/${id}/meta`);
    const claim = await runTransaction(meta, (v) =>
      v === null ? { host: c.uid, name: cleanName(name), createdAt: serverTimestamp() } : undefined,
    );
    if (claim.committed) return attach(c, id, true, handlers);
  }
  throw Error("Could not reserve a room. Try again.");
}
export async function joinRoom(id, name, handlers) {
  id = id.trim().toUpperCase();
  if (!/^[A-Z2-9]{6}$/.test(id)) throw Error("Enter the six-character room code.");
  const c = await connect(),
    meta = (await get(ref(c.db, `tankRooms/${id}/meta`))).val();
  if (!meta || Date.now() - meta.createdAt > 2 * 60 * 60 * 1000)
    throw Error("Room not found or expired.");
  if (meta.host === c.uid)
    throw Error("This is your room. Ask your friend to join from their browser.");
  const claim = await runTransaction(ref(c.db, `tankRooms/${id}/guest`), (v) =>
    v === null ? { uid: c.uid, name: cleanName(name) } : undefined,
  );
  if (!claim.committed) throw Error("This room already has two players.");
  return attach(c, id, false, handlers);
}
async function attach(c, id, host, handlers) {
  const off = [],
    path = (s) => ref(c.db, `tankRooms/${id}/${s}`);
  let stopped = false,
    peer = null,
    joined = false;
  await onDisconnect(path(`presence/${c.uid}`)).set(false);
  await set(path(`presence/${c.uid}`), true);
  const fail = (e) => {
    if (!stopped) handlers.error?.(e);
  };
  off.push(
    onValue(
      path("guest"),
      (s) => {
        const guest = s.val();
        if (!guest) return;
        if (host) {
          peer = guest.uid;
          if (!joined) {
            joined = true;
            handlers.ready?.(guest.name);
          }
        }
      },
      fail,
    ),
  );
  off.push(
    onValue(
      path("presence"),
      (s) => {
        const p = s.val() || {};
        const gone = peer && p[peer] === false;
        if (gone) {
          handlers.left?.();
          void stop();
        }
      },
      fail,
    ),
  );
  if (host)
    off.push(
      onValue(
        path("input"),
        (s) => {
          if (s.exists()) handlers.input?.(s.val());
        },
        fail,
      ),
    );
  else {
    const meta = (await get(path("meta"))).val();
    peer = meta.host;
    off.push(
      onValue(
        path("state"),
        (s) => {
          if (!s.exists()) return;
          try {
            handlers.state?.(JSON.parse(s.val()));
          } catch {
            fail(Error("Invalid arena update."));
          }
        },
        fail,
      ),
    );
    handlers.ready?.(meta.name);
  }
  async function stop() {
    if (stopped) return;
    stopped = true;
    await set(path(`presence/${c.uid}`), false).catch(() => {});
    off.splice(0).forEach((f) => f());
  }
  return {
    id,
    host,
    index: host ? 0 : 1,
    publish: (state) => set(path("state"), JSON.stringify(state)).catch(fail),
    input: (value) => set(path("input"), value).catch(fail),
    stop,
  };
}
