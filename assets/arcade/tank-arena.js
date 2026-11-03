const $ = (s) => document.querySelector(s),
  canvas = $("#arena"),
  ctx = canvas.getContext("2d"),
  banner = $("#arena-banner"),
  status = $("#tank-status");
const W = 960,
  H = 600,
  R = 17,
  walls = [
    { x: 245, y: 120, w: 42, h: 170 },
    { x: 245, y: 380, w: 42, h: 100 },
    { x: 673, y: 120, w: 42, h: 100 },
    { x: 673, y: 310, w: 42, h: 170 },
    { x: 420, y: 250, w: 120, h: 40 },
    { x: 420, y: 390, w: 120, h: 40 },
  ];
const keys = new Set();
let pointer = { x: 480, y: 300, fire: false },
  state,
  mode = "idle",
  net = null,
  localIndex = 0,
  last = performance.now(),
  lastSend = 0,
  lastInput = 0,
  muted = localStorage.getItem("agArcade.tankMuted") === "true",
  audio = null,
  roomBusy = false;
let best = Number(localStorage.getItem("agArcade.tankBest") || 0);
$("#best").textContent = "Wins: " + best;
function tone(freq, duration = 0.08, type = "square", volume = 0.035) {
  if (muted) return;
  try {
    audio ??= new AudioContext();
    void audio.resume();
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      Math.max(40, freq * 0.45),
      audio.currentTime + duration,
    );
    g.gain.setValueAtTime(volume, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
    o.connect(g);
    g.connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + duration);
  } catch {}
}
function fresh(scores = [0, 0]) {
  return {
    players: [
      { x: 145, y: 310, a: 0, hp: 3, cool: 0 },
      { x: 815, y: 310, a: Math.PI, hp: 3, cool: 0 },
    ],
    bullets: [],
    scores,
    roundDelay: 0,
    winner: -1,
    seq: 0,
  };
}
state = fresh();
function setStatus(text) {
  status.textContent = text;
}
function setMode(next) {
  mode = next;
  $("#leave").disabled = !net;
  $("#copy").disabled = !net;
}
function syncScore() {
  state.scores.forEach((s, i) => ($(i ? "#blue-score" : "#gold-score").textContent = s));
}
function circleWall(x, y, r, wall) {
  return x + r > wall.x && x - r < wall.x + wall.w && y + r > wall.y && y - r < wall.y + wall.h;
}
function blocked(x, y) {
  return (
    x < R + 10 ||
    x > W - R - 10 ||
    y < R + 65 ||
    y > H - R - 10 ||
    walls.some((w) => circleWall(x, y, R, w))
  );
}
function input() {
  let x =
      Number(keys.has("KeyD") || keys.has("ArrowRight")) -
      Number(keys.has("KeyA") || keys.has("ArrowLeft")),
    y =
      Number(keys.has("KeyS") || keys.has("ArrowDown")) -
      Number(keys.has("KeyW") || keys.has("ArrowUp"));
  const len = Math.hypot(x, y) || 1,
    me = state.players[localIndex],
    enemy = state.players[1 - localIndex];
  return {
    x: x / len,
    y: y / len,
    a: pointer.touch
      ? Math.atan2(enemy.y - me.y, enemy.x - me.x)
      : Math.atan2(pointer.y - me.y, pointer.x - me.x),
    fire: pointer.fire || keys.has("Space"),
  };
}
let remote = { x: 0, y: 0, a: Math.PI, fire: false };
function bot(i) {
  const p = state.players[i],
    target = state.players[1 - i],
    angle = Math.atan2(target.y - p.y, target.x - p.x),
    d = Math.hypot(target.x - p.x, target.y - p.y);
  let move = d > 230 ? angle : angle + Math.PI / 2;
  const t = performance.now() / 1000;
  if (blocked(p.x + Math.cos(move) * 30, p.y + Math.sin(move) * 30))
    move += Math.sin(t * 0.9) > 0 ? Math.PI / 2 : -Math.PI / 2;
  return { x: Math.cos(move) * 0.65, y: Math.sin(move) * 0.65, a: angle, fire: true, bot: true };
}
function movePlayer(i, cmd, dt) {
  const p = state.players[i];
  p.cool = Math.max(0, p.cool - dt);
  if (p.hp <= 0) return;
  const nx = p.x + cmd.x * 165 * dt,
    ny = p.y + cmd.y * 165 * dt;
  if (!blocked(nx, p.y)) p.x = nx;
  if (!blocked(p.x, ny)) p.y = ny;
  p.a = Number.isFinite(cmd.a) ? cmd.a : p.a;
  if (cmd.fire && p.cool <= 0) {
    p.cool = cmd.bot ? 0.9 : 0.3;
    state.bullets.push({
      x: p.x + Math.cos(p.a) * 25,
      y: p.y + Math.sin(p.a) * 25,
      vx: Math.cos(p.a) * 490,
      vy: Math.sin(p.a) * 490,
      owner: i,
      life: 2.2,
    });
    tone(220 + i * 90, 0.06);
  }
}
function tick(dt) {
  state.seq++;
  if (state.winner >= 0) return;
  if (state.roundDelay > 0) {
    state.roundDelay -= dt;
    if (state.roundDelay <= 0) {
      const scores = state.scores;
      state = fresh(scores);
      syncScore();
    }
    return;
  }
  for (let i = 0; i < 2; i++)
    movePlayer(i, i === localIndex ? input() : mode === "practice" ? bot(i) : remote, dt);
  for (const b of state.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (
      b.x < 8 ||
      b.x > W - 8 ||
      b.y < 60 ||
      b.y > H - 8 ||
      walls.some((w) => circleWall(b.x, b.y, 5, w))
    )
      b.life = 0;
    const victim = state.players[1 - b.owner];
    if (b.life > 0 && victim.hp > 0 && Math.hypot(b.x - victim.x, b.y - victim.y) < R + 4) {
      victim.hp--;
      b.life = 0;
      tone(80, 0.15, "sawtooth", 0.025);
      if (victim.hp === 0) {
        state.scores[b.owner]++;
        state.roundDelay = 2;
        syncScore();
        if (state.scores[b.owner] >= 3) {
          state.winner = b.owner;
          tone(700, 0.35, "triangle", 0.06);
          if (b.owner === localIndex) {
            best++;
            localStorage.setItem("agArcade.tankBest", String(best));
            $("#best").textContent = "Wins: " + best;
          }
        }
      }
    }
  }
  state.bullets = state.bullets.filter((b) => b.life > 0);
}
function drawTank(p, i) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.a);
  ctx.globalAlpha = p.hp > 0 ? 1 : 0.25;
  ctx.fillStyle = "#07131c";
  ctx.fillRect(-21, -21, 42, 10);
  ctx.fillRect(-21, 11, 42, 10);
  ctx.fillStyle = i ? "#58aebc" : "#d2a456";
  ctx.beginPath();
  ctx.roundRect(-18, -16, 36, 32, 7);
  ctx.fill();
  ctx.fillStyle = i ? "#ace7e8" : "#ffdc94";
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(0, -4, 29, 8);
  ctx.restore();
  for (let n = 0; n < 3; n++) {
    ctx.fillStyle = n < p.hp ? (i ? "#77d9e3" : "#f4ca78") : "#2a3b42";
    ctx.fillRect(p.x - 19 + n * 14, p.y + 30, 10, 4);
  }
}
function draw() {
  ctx.fillStyle = "#0b1926";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#17313e";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#355965";
  ctx.lineWidth = 5;
  ctx.strokeRect(8, 60, W - 16, H - 68);
  for (const wall of walls) {
    ctx.fillStyle = "#24424a";
    ctx.beginPath();
    ctx.roundRect(wall.x, wall.y, wall.w, wall.h, 6);
    ctx.fill();
    ctx.fillStyle = "#40636a";
    ctx.fillRect(wall.x + 4, wall.y + 3, wall.w - 8, 3);
  }
  for (const b of state.bullets) {
    ctx.fillStyle = b.owner ? "#b2f9ff" : "#ffe0a0";
    ctx.shadowBlur = 9;
    ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  state.players.forEach(drawTank);
  banner.textContent =
    mode === "idle"
      ? "READY WHEN YOU ARE"
      : mode === "waiting"
        ? "WAITING FOR YOUR FRIEND"
        : state.winner >= 0
          ? state.winner === localIndex
            ? "YOU WIN THE MATCH"
            : "RIVAL WINS · TRY AGAIN"
          : state.roundDelay > 0
            ? "ROUND OVER"
            : "";
}
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  if (mode === "practice" || mode === "online-host") tick(dt);
  if (net && mode === "online-host" && now - lastSend > 100) {
    lastSend = now;
    void net.publish(state);
  }
  if (net && mode === "online-guest" && now - lastInput > 50) {
    lastInput = now;
    void net.input(input());
  }
  draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
async function stopNetwork() {
  const old = net;
  net = null;
  await old?.stop();
  $("#leave").disabled = true;
  $("#copy").disabled = true;
}
function becomePractice(message) {
  const old = net;
  net = null;
  void old?.stop();
  setMode("practice");
  setStatus(message);
}
function handlers() {
  return {
    ready: (name) => {
      setMode(net?.host ? "online-host" : "online-guest");
      setStatus(
        `You are ${localIndex ? "BLUE" : "GOLD"} · Playing ${name}. First to three rounds wins.`,
      );
    },
    input: (value) => {
      remote = {
        x: Math.max(-1, Math.min(1, Number(value.x) || 0)),
        y: Math.max(-1, Math.min(1, Number(value.y) || 0)),
        a: Number(value.a) || 0,
        fire: !!value.fire,
      };
    },
    state: (value) => {
      if (value?.players?.length === 2 && value?.scores?.length === 2) {
        const prior = state;
        if (value.bullets?.length > prior.bullets.length) tone(310, 0.06);
        if (value.players.some((p, i) => p.hp < prior.players[i].hp))
          tone(80, 0.15, "sawtooth", 0.025);
        if (value.winner === localIndex && prior.winner !== localIndex) {
          best++;
          localStorage.setItem("agArcade.tankBest", String(best));
          $("#best").textContent = "Wins: " + best;
          tone(700, 0.35, "triangle", 0.06);
        }
        state = value;
        state.bullets ??= [];
        syncScore();
      }
    },
    left: () => becomePractice("Your friend left. Keep playing against AI."),
    error: () => becomePractice("Connection interrupted. Your arena continues against AI."),
  };
}
async function roomAction(host) {
  if (roomBusy) return;
  roomBusy = true;
  try {
    await stopNetwork();
    state = fresh();
    syncScore();
    setMode("waiting");
    setStatus("Connecting to your private arena…");
    const network = await import("./tank-network.js");
    let pendingReady = null;
    const h = handlers(),
      ready = h.ready;
    h.ready = (name) => {
      if (!net) pendingReady = name;
      else ready(name);
    };
    net = host
      ? await network.createRoom($("#callsign").value, h)
      : await network.joinRoom($("#room-code").value, $("#callsign").value, h);
    localIndex = net.index;
    $("#room-code").value = net.id;
    $("#copy").disabled = false;
    $("#leave").disabled = false;
    if (pendingReady) ready(pendingReady);
    else setStatus(`Room ${net.id} is ready. Share the code or copy your invite.`);
  } catch (e) {
    await stopNetwork();
    setMode("idle");
    setStatus(e.message || "Could not connect. Try again.");
  } finally {
    roomBusy = false;
  }
}
$("#practice").onclick = async () => {
  await stopNetwork();
  localIndex = 0;
  state = fresh();
  syncScore();
  setMode("practice");
  setStatus("You are GOLD. Move, aim, and take three rounds.");
  tone(450, 0.1);
  canvas.focus();
};
$("#host").onclick = () => roomAction(true);
$("#join").onclick = () => roomAction(false);
$("#leave").onclick = () => becomePractice("You left the room. Practice continues against AI.");
$("#copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText(location.origin + "/tank-arena.html?room=" + net.id);
    setStatus("Invite copied. Your friend can open it or enter the room code.");
  } catch {
    setStatus("Share room code " + net.id + " with your friend.");
  }
};
function updateSound() {
  $("#sound").textContent = muted ? "Sound off" : "Sound on";
  $("#sound").setAttribute("aria-pressed", String(muted));
}
$("#sound").onclick = () => {
  muted = !muted;
  localStorage.setItem("agArcade.tankMuted", String(muted));
  updateSound();
  if (!muted) tone(400);
};
updateSound();
window.addEventListener("keydown", (e) => {
  if (e.target.closest("input")) return;
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Space",
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
    ].includes(e.code)
  ) {
    e.preventDefault();
    keys.add(e.code);
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", () => {
  keys.clear();
  pointer.fire = false;
});
canvas.onpointermove = (e) => {
  const r = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - r.left) * W) / r.width;
  pointer.y = ((e.clientY - r.top) * H) / r.height;
  pointer.touch = e.pointerType === "touch";
};
canvas.onpointerdown = (e) => {
  canvas.focus();
  pointer.fire = true;
  pointer.touch = e.pointerType === "touch";
  tone(1, 0.001);
};
window.addEventListener("pointerup", () => (pointer.fire = false));
canvas.oncontextmenu = (e) => e.preventDefault();
for (const button of document.querySelectorAll("[data-key]")) {
  button.onpointerdown = (e) => {
    e.preventDefault();
    button.setPointerCapture(e.pointerId);
    keys.add(button.dataset.key);
    pointer.touch = true;
  };
  button.onpointerup = button.onpointercancel = () => keys.delete(button.dataset.key);
}
const invite = new URLSearchParams(location.search).get("room");
if (invite) $("#room-code").value = invite.toUpperCase().slice(0, 6);
