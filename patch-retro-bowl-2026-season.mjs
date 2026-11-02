import { readFile, writeFile } from "node:fs/promises";

const scheduleFile = process.argv[2];
if (!scheduleFile) {
  throw new Error("Usage: node patch-retro-bowl-2026-season.mjs <Schedule17.txt>");
}

const teams = {
  BUF: 0,
  MIA: 1,
  NE: 2,
  NYJ: 3,
  DEN: 4,
  KC: 5,
  LAC: 6,
  LV: 7,
  BAL: 8,
  CIN: 9,
  CLE: 10,
  PIT: 11,
  HOU: 12,
  IND: 13,
  JAX: 14,
  TEN: 15,
  DAL: 16,
  NYG: 17,
  PHI: 18,
  WAS: 19,
  ARI: 20,
  LAR: 21,
  SF: 22,
  SEA: 23,
  CHI: 24,
  DET: 25,
  GB: 26,
  MIN: 27,
  ATL: 28,
  CAR: 29,
  NO: 30,
  TB: 31,
};

// Official 2026 NFL regular-season matchups, keyed to the team IDs in Teams.txt.
// The browser game engine, generated player pool, and career systems remain the
// classic Retro Bowl build; only its first season's schedule is refreshed.
const weeks = [
  "NE@SEA SF@LAR CHI@CAR TB@CIN NO@DET BUF@HOU BAL@IND CLE@JAX ATL@PIT NYJ@TEN ARI@LAC MIA@LV GB@MIN WAS@PHI DAL@NYG DEN@KC",
  "DET@BUF CAR@ATL NO@BAL MIN@CHI CIN@HOU PIT@NE GB@NYJ CLE@TB PHI@TEN JAX@DEN LV@LAC SEA@ARI WAS@DAL MIA@SF IND@KC NYG@LAR",
  "ATL@GB LAC@BUF CAR@CLE NYJ@DET HOU@IND NE@JAX KC@MIA TEN@NYG CIN@PIT SEA@WAS ARI@SF MIN@TB LV@NO BAL@DAL LAR@DEN PHI@CHI",
  "PIT@CLE IND@WAS TEN@BAL NE@BUF NYJ@CHI JAX@CIN DAL@HOU ARI@NYG LAR@PHI GB@TB MIA@MIN KC@LV LAC@SEA DEN@SF DET@CAR ATL@NO",
  "TB@DAL PHI@JAX CIN@MIA LV@NE MIN@NO CLE@NYJ IND@PIT HOU@TEN NYG@WAS CHI@GB DEN@LAC DET@ARI SF@SEA LAR@BUF BAL@ATL",
  "SEA@DEN HOU@JAX CHI@ATL BAL@CLE TEN@IND NYJ@NE NO@NYG CAR@PHI PIT@TB ARI@LAR LAC@KC BUF@LV DAL@GB WAS@SF",
  "NE@CHI PIT@NO SF@ATL CIN@BAL TB@CAR NYG@HOU IND@MIN MIA@NYJ CLE@TEN DEN@ARI GB@DET LAR@LV KC@SEA DAL@PHI",
  "CAR@GB BAL@BUF TEN@CIN ARI@DAL MIN@DET IND@JAX LV@NYJ CLE@PIT ATL@TB LAC@LAR KC@DEN NE@MIA PHI@WAS CHI@SEA",
  "JAX@BAL CIN@ATL DEN@CAR DAL@IND NYJ@KC DET@MIA CLE@NO NYG@PHI LAR@WAS HOU@LAC LV@SF GB@NE ARI@SEA TB@CHI BUF@MIN",
  "WAS@NYG NE@DET KC@ATL HOU@CLE MIN@GB MIA@IND CAR@NO BUF@NYJ JAX@TEN LAR@ARI SEA@LV SF@DAL PIT@CIN LAC@BAL",
  "IND@HOU MIA@BUF BAL@CAR NO@CHI TEN@DAL TB@DET ARI@KC JAX@NYG NYJ@LAC LV@DEN PIT@PHI MIN@SF CIN@WAS",
  "GB@LAR CHI@DET PHI@DAL KC@BUF DEN@PIT NO@CIN LV@CLE BAL@HOU NYG@IND NYJ@MIA ATL@MIN JAX@TEN WAS@ARI SEA@SF NE@LAC CAR@TB",
  "KC@LAR DET@ATL JAX@CHI CIN@CLE GB@NO SF@NYG LAC@TB WAS@TEN PHI@ARI MIA@DEN CAR@MIN BUF@NE HOU@PIT DAL@SEA",
  "MIN@NE TB@BAL NO@CAR ATL@CLE TEN@DET CHI@MIA DEN@NYJ IND@PHI HOU@WAS LAC@LV KC@CIN NYG@SEA LAR@SF BUF@GB PIT@JAX",
  "SF@LAC SEA@PHI CHI@BUF CIN@CAR MIA@GB JAX@HOU CLE@NYG BAL@PIT NO@TB IND@TEN ATL@WAS NYJ@ARI DAL@LAR DEN@LV DET@MIN NE@KC",
  "HOU@PHI GB@CHI BUF@DEN LAR@SEA CLE@BAL LAC@MIA ARI@NO NE@NYJ TEN@LV SF@KC JAX@DAL NYG@DET TB@ATL CIN@IND WAS@MIN CAR@PIT",
  "BAL@CIN NO@ATL SEA@CAR IND@CLE NYG@DAL BUF@MIA MIN@NYJ PIT@TEN LV@ARI DET@CHI PHI@SF HOU@GB WAS@JAX KC@LAC DEN@NE LAR@TB",
  "SF@ARI PIT@BAL NYJ@BUF ATL@CAR CLE@CIN LAC@DEN DET@GB TEN@HOU JAX@IND LV@KC SEA@LAR CHI@MIN MIA@NE TB@NO PHI@NYG DAL@WAS",
];

const expectedGamesPerWeek = [16, 16, 16, 16, 15, 14, 14, 14, 15, 14, 13, 16, 14, 15, 16, 16, 16, 16];
const seasonRows = [];
for (const [index, week] of weeks.entries()) {
  const matchups = week.split(" ").map((game) => game.split("@"));
  const ids = matchups.flatMap(([away, home]) => [teams[away], teams[home]]);
  if (
    matchups.length !== expectedGamesPerWeek[index] ||
    ids.some((id) => id === undefined) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error(`Invalid 2026 schedule data in week ${index + 1}`);
  }
  for (const [away, home] of matchups) {
    seasonRows.push(`1\t${index + 1}\t${teams[away]}\t${teams[home]}\t-1\t-1`);
  }
}

const original = await readFile(scheduleFile, "utf8");
const newline = original.includes("\r\n") ? "\r\n" : "\n";
const trailingNewline = original.endsWith("\n");
const lines = original.split(/\r?\n/);
if (trailingNewline) lines.pop();
const [header, ...rows] = lines;
const originalSeasonRows = rows.filter((row) => row.startsWith("1\t"));
if (originalSeasonRows.length !== seasonRows.length) {
  throw new Error(
    `Expected ${seasonRows.length} Year 1 rows, found ${originalSeasonRows.length}`,
  );
}
const laterSeasonRows = rows.filter((row) => !row.startsWith("1\t"));
const updated = [header, ...seasonRows, ...laterSeasonRows].join(newline);
await writeFile(scheduleFile, `${updated}${trailingNewline ? newline : ""}`, "utf8");
console.log(`Updated Year 1 with ${seasonRows.length} NFL 2026 games in ${weeks.length} weeks.`);
