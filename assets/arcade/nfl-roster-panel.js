const root = document.querySelector("[data-nfl-roster-panel]");

if (root) {
  const TEAM_NAMES = {
    ARI: "Arizona Cardinals",
    ATL: "Atlanta Falcons",
    BAL: "Baltimore Ravens",
    BUF: "Buffalo Bills",
    CAR: "Carolina Panthers",
    CHI: "Chicago Bears",
    CIN: "Cincinnati Bengals",
    CLE: "Cleveland Browns",
    DAL: "Dallas Cowboys",
    DEN: "Denver Broncos",
    DET: "Detroit Lions",
    GB: "Green Bay Packers",
    HOU: "Houston Texans",
    IND: "Indianapolis Colts",
    JAX: "Jacksonville Jaguars",
    KC: "Kansas City Chiefs",
    LAC: "Los Angeles Chargers",
    LAR: "Los Angeles Rams",
    LV: "Las Vegas Raiders",
    MIA: "Miami Dolphins",
    MIN: "Minnesota Vikings",
    NE: "New England Patriots",
    NO: "New Orleans Saints",
    NYG: "New York Giants",
    NYJ: "New York Jets",
    PHI: "Philadelphia Eagles",
    PIT: "Pittsburgh Steelers",
    SEA: "Seattle Seahawks",
    SF: "San Francisco 49ers",
    TB: "Tampa Bay Buccaneers",
    TEN: "Tennessee Titans",
    WAS: "Washington Commanders",
  };
  // Staff snapshot from Edgehalla's 2026 staff table, checked Nov 1, 2026.
  const COACHES = {
    ARI: ["Mike LaFleur", "Nathaniel Hackett", "Nick Rallis", "3-5"],
    ATL: ["Kevin Stefanski", "Tommy Rees", "Jeff Ulbrich", "3-5"],
    BAL: ["Jesse Minter", "Declan Doyle", "Anthony Weaver", "4-4"],
    BUF: ["Joe Brady", "Pete Carmichael Jr.", "Jim Leonhard", "6-1"],
    CAR: ["Dave Canales", "Brad Idzik", "Ejiro Evero", "3-4"],
    CHI: ["Ben Johnson", "Press Taylor", "Dennis Allen", "5-2"],
    CIN: ["Zac Taylor", "Dan Pitcher", "Al Golden", "5-2"],
    CLE: ["Todd Monken", "Travis Switzer", "Mike Rutenberg", "5-3"],
    DAL: ["Brian Schottenheimer", "Klayton Adams", "Christian Parker", "3-5"],
    DEN: ["Sean Payton", "Davis Webb", "Vance Joseph", "6-2"],
    DET: ["Dan Campbell", "Drew Petzing", "Kelvin Sheppard", "5-2"],
    GB: ["Matt LaFleur", "Adam Stenavich", "Jonathan Gannon", "5-3"],
    HOU: ["DeMeco Ryans", "Nick Caley", "Matt Burke", "2-5"],
    IND: ["Shane Steichen", "Jim Bob Cooter", "Lou Anarumo", "2-6"],
    JAX: ["Liam Coen", "Grant Udinski", "Anthony Campanile", "5-2"],
    KC: ["Andy Reid", "Eric Bieniemy", "Steve Spagnuolo", "5-2"],
    LAC: ["Jim Harbaugh", "Mike McDaniel", "Chris O'Leary", "0-7"],
    LAR: ["Sean McVay", "Nathan Scheelhaase", "Chris Shula", "4-4"],
    LV: ["Klint Kubiak", "Andrew Janocko", "Rob Leonard", "4-4"],
    MIA: ["Jeff Hafley", "Bobby Slowik", "Sean Duggan", "1-6"],
    MIN: ["Kevin O'Connell", "Wes Phillips", "Brian Flores", "6-1"],
    NE: ["Mike Vrabel", "Josh McDaniels", "Zak Kuhr", "5-3"],
    NO: ["Kellen Moore", "Doug Nussmeier", "Brandon Staley", "2-5"],
    NYG: ["John Harbaugh", "Matt Nagy", "Dennard Wilson", "4-2-1"],
    NYJ: ["Aaron Glenn", "Frank Reich", "Brian Duker", "2-6"],
    PHI: ["Nick Sirianni", "Sean Mannion", "Vic Fangio", "2-6"],
    PIT: ["Mike McCarthy", "Brian Angelichio", "Patrick Graham", "6-2"],
    SEA: ["Mike Macdonald", "Brian Fleury", "Aden Durde", "4-3"],
    SF: ["Kyle Shanahan", "Klay Kubiak", "Raheem Morris", "6-1"],
    TB: ["Todd Bowles", "Zac Robinson", "Todd Bowles", "3-5"],
    TEN: ["Robert Saleh", "Brian Daboll", "Gus Bradley", "1-7"],
    WAS: ["Dan Quinn", "David Blough", "Daronte Jones", "2-4-1"],
  };
  const STATUS_NAMES = {
    ACT: "Active",
    DEV: "Practice squad",
    INA: "Inactive",
    RES: "Reserve / injured",
    CUT: "Released",
    RET: "Retired",
    TRD: "Traded",
    TRC: "Training camp",
    EXE: "Exempt",
    TRT: "Reserve / retired",
  };
  const POSITION_ORDER = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P", "LS"];
  const METADATA = new Set([
    "player_id", "player_name", "player_display_name", "position", "position_group",
    "headshot_url", "season", "week", "season_type", "game_id", "team", "opponent_team",
    "fg_made_list", "fg_missed_list", "fg_blocked_list",
  ]);
  const RATE_STATS = new Set([
    "passing_cpoe", "pacr", "racr", "target_share", "air_yards_share", "wopr", "fg_pct", "pat_pct",
  ]);
  const FRACTION_STATS = new Set([
    "pacr", "racr", "target_share", "air_yards_share", "wopr", "fg_pct", "pat_pct",
  ]);
  const MAX_STATS = new Set(["fg_long", "pt_long"]);
  const STAT_COLUMNS = [
    ["games", "GP"], ["completions", "CMP"], ["attempts", "ATT"], ["passing_yards", "PASS YDS"],
    ["passing_tds", "PASS TD"], ["passing_interceptions", "INT"], ["carries", "RUSH"],
    ["rushing_yards", "RUSH YDS"], ["rushing_tds", "RUSH TD"], ["receptions", "REC"],
    ["receiving_yards", "REC YDS"], ["receiving_tds", "REC TD"], ["def_tackles_solo", "SOLO TKL"],
    ["def_sacks", "SACK"], ["def_interceptions", "DEF INT"], ["fg_made", "FG"],
  ];

  const details = root.matches("details") ? root : root.querySelector("details");
  const teamSelect = root.querySelector("[data-team]");
  const playerSearch = root.querySelector("[data-search]");
  const status = root.querySelector("[data-status]");
  const count = root.querySelector("[data-count]");
  const coachBox = root.querySelector("[data-coaches]");
  const playerDetail = root.querySelector("[data-player-detail]");
  const body = root.querySelector("[data-players]");
  let allPlayers = [];
  let loaded = false;

  function parseCsv(text, onRow) {
    let headers = null;
    let row = [];
    let value = "";
    let quoted = false;
    const emit = () => {
      row.push(value.replace(/\r$/, ""));
      if (headers) {
        if (row.length > 1) {
          const record = Object.fromEntries(headers.map((key, index) => [key, row[index] ?? ""]));
          onRow(record);
        }
      } else {
        headers = row;
      }
      row = [];
      value = "";
    };
    for (let index = 0; index < text.length; index++) {
      const char = text[index];
      if (quoted) {
        if (char === '"' && text[index + 1] === '"') {
          value += '"';
          index++;
        } else if (char === '"') {
          quoted = false;
        } else {
          value += char;
        }
      } else if (char === '"') {
        quoted = true;
      } else if (char === ",") {
        row.push(value);
        value = "";
      } else if (char === "\n") {
        emit();
      } else {
        value += char;
      }
    }
    if (value || row.length) emit();
  }

  async function loadCsvGzip(name, onRow) {
    if (!window.DecompressionStream) throw new Error("This browser does not support compressed roster data.");
    const response = await fetch(`/assets/arcade/${name}`);
    if (!response.ok || !response.body) throw new Error(`Could not load ${name} (${response.status}).`);
    const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
    parseCsv(await new Response(stream).text(), onRow);
  }

  function normalizeTeam(code) {
    return code === "LA" ? "LAR" : code;
  }

  function displayNumber(value, key) {
    if (value === undefined || !Number.isFinite(value)) return "—";
    if (FRACTION_STATS.has(key)) return `${(value * 100).toFixed(1)}%`;
    if (key === "passing_cpoe") return value.toFixed(1);
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
  }

  function labelForStat(key) {
    return key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function addCell(row, text, className = "") {
    const cell = document.createElement("td");
    cell.textContent = text;
    if (className) cell.className = className;
    row.append(cell);
  }

  function showPlayerDetails(player) {
    playerDetail.replaceChildren();
    playerDetail.hidden = false;
    const heading = document.createElement("h3");
    heading.textContent = `${player.name} · ${player.position || "Player"}`;
    const bio = document.createElement("p");
    bio.textContent = [
      TEAM_NAMES[player.team],
      STATUS_NAMES[player.status] ?? player.status,
      player.number ? `#${player.number}` : null,
      player.experience ? `${player.experience} years pro` : null,
      player.college || null,
    ].filter(Boolean).join(" · ");
    const close = document.createElement("button");
    close.type = "button";
    close.className = "nfl-stat-close";
    close.textContent = "Hide stats";
    close.addEventListener("click", () => {
      playerDetail.hidden = true;
      playerDetail.replaceChildren();
    });
    const grid = document.createElement("dl");
    grid.className = "nfl-stat-detail-grid";
    const stats = player.stats ?? {};
    for (const [key, value] of Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0]))) {
      const name = document.createElement("dt");
      const number = document.createElement("dd");
      name.textContent = labelForStat(key);
      number.textContent = displayNumber(value, key);
      grid.append(name, number);
    }
    playerDetail.append(heading, bio, close, grid);
  }

  function renderStatsButton(player) {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nfl-stat-open";
    button.textContent = "View stats";
    button.setAttribute("aria-label", `View all stats for ${player.name}`);
    button.addEventListener("click", () => showPlayerDetails(player));
    cell.append(button);
    return cell;
  }

  function render() {
    playerDetail.hidden = true;
    playerDetail.replaceChildren();
    const team = teamSelect.value;
    const query = playerSearch.value.trim().toLowerCase();
    const visible = allPlayers
      .filter((player) => player.team === team)
      .filter((player) => !query || `${player.name} ${player.position} ${STATUS_NAMES[player.status] ?? player.status}`.toLowerCase().includes(query))
      .sort((a, b) => {
        const position = POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position);
        return (position || a.name.localeCompare(b.name));
      });
    const staff = COACHES[team];
    coachBox.replaceChildren();
    if (staff) {
      const heading = document.createElement("h3");
      heading.textContent = `${TEAM_NAMES[team]} · Coaches`;
      coachBox.append(heading);
      const line = document.createElement("p");
      line.textContent = `Head coach: ${staff[0]} (${staff[3]}) · Offensive coordinator: ${staff[1]} · Defensive coordinator: ${staff[2]}`;
      coachBox.append(line);
    }
    body.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const player of visible) {
      const row = document.createElement("tr");
      addCell(row, player.name, "nfl-player-name");
      addCell(row, player.position || "—");
      addCell(row, STATUS_NAMES[player.status] ?? player.status ?? "—");
      const stats = player.stats ?? {};
      for (const [key] of STAT_COLUMNS) {
        addCell(row, key === "games" ? String(stats.games ?? 0) : displayNumber(stats[key], key));
      }
      row.append(renderStatsButton(player));
      fragment.append(row);
    }
    body.append(fragment);
    count.textContent = `${visible.length.toLocaleString("en-US")} players`;
  }

  async function loadData() {
    status.textContent = "Loading real 2026 rosters and player stats…";
    try {
      const statsByPlayer = new Map();
      await loadCsvGzip("stats_player_week_2026.csv.gz", (row) => {
        if (row.season_type !== "REG") return;
        const id = row.player_id;
        if (!id) return;
      let entry = statsByPlayer.get(id);
        if (!entry) {
          entry = { games: new Set(), values: {}, rateSums: {}, rateCounts: {} };
          statsByPlayer.set(id, entry);
        }
        if (row.game_id) entry.games.add(row.game_id);
      for (const [key, raw] of Object.entries(row)) {
          if (METADATA.has(key) || !raw) continue;
          const number = Number(raw);
          if (!Number.isFinite(number)) continue;
          if (RATE_STATS.has(key)) {
            entry.rateSums[key] = (entry.rateSums[key] ?? 0) + number;
            entry.rateCounts[key] = (entry.rateCounts[key] ?? 0) + 1;
          } else if (MAX_STATS.has(key)) {
            entry.values[key] = Math.max(entry.values[key] ?? Number.NEGATIVE_INFINITY, number);
          } else {
            entry.values[key] = (entry.values[key] ?? 0) + number;
          }
        }
      });

      const latestRoster = new Map();
      await loadCsvGzip("roster_2026.csv.gz", (row) => {
        const id = row.gsis_id || `${row.full_name}|${row.team}|${row.position}`;
        const week = Number(row.week) || 0;
        const previous = latestRoster.get(id);
        if (!previous || week >= previous.week) {
          latestRoster.set(id, {
            id,
            team: normalizeTeam(row.team),
            name: row.full_name,
            position: row.position,
            status: row.status,
            number: row.jersey_number,
            experience: row.years_exp,
            college: row.college,
            week,
          });
        }
      });

      allPlayers = [...latestRoster.values()]
        .filter((player) => TEAM_NAMES[player.team])
        .map((player) => {
          const data = statsByPlayer.get(player.id);
          const stats = data ? { ...data.values, games: data.games.size } : { games: 0 };
          if (data) {
            for (const [key, total] of Object.entries(data.rateSums)) {
              stats[key] = total / data.rateCounts[key];
            }
          }
          return { ...player, stats };
        });

      for (const [code, name] of Object.entries(TEAM_NAMES)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        teamSelect.append(option);
      }
      teamSelect.value = "BUF";
      status.textContent = "2026 roster snapshot and regular-season stats through Week 8 (Nov 2, 2026).";
      render();
      teamSelect.addEventListener("change", render);
      playerSearch.addEventListener("input", render);
    } catch (error) {
      status.textContent = `Roster data could not be loaded: ${error.message}`;
    }
  }

  let started = false;
  details.addEventListener("toggle", () => {
    if (details.open && !started) {
      started = true;
      void loadData();
    }
  });
}
