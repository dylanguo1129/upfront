// BURN adapter -> wraps Seatwise (the Seats.Aero product): award search + deal scoring.
//
// REAL ENGINE, PORTED TO PURE NODE ESM.
// The product engine lives in TypeScript under products/seats-aero/src and is
// compiled by Vite. The orchestrator must stay pure-node with no TS build step,
// so we PORT the deterministic core here 1:1 instead of importing it, and we
// bring the REAL data over verbatim in seatsaero.data.json (airports, routes,
// programs' carrier-YQ table, airlines), machine-extracted from the .ts sources.
//
// Ported faithfully from the real modules (identical formulas / constants):
//   engine/rng.ts          -> hash / rand / randInt / pickWeighted
//   data/airports.ts       -> distanceMi (haversine), airport()
//   data/programs.ts       -> PROGRAMS award charts, zoneOf, CARRIER_YQ
//   engine/pricing.ts      -> canBook, taxesFor, offersFor, fairPrice
//   engine/scoring.ts      -> scoreOffer (Deal Score 0-100), STANDOUT
//   engine/availability.ts -> seatsReleased (release model)
//   engine/cash.ts         -> cashFareUsd
//   engine/flights.ts      -> flightsOn, addDays, daysBetween, dayOfWeek, durations
//   engine/search.ts       -> evaluateFlight + the scan/rank loop
//
// HONEST SIMPLIFICATIONS (documented; numbers are still the engine's real numbers):
//   1) Direct routes only. We rank the best ticketable award per (real route,
//      real flight, date in the requested month) using routesBetween(). We do
//      NOT run planner.ts's one-stop hub builder (it is entangled with the React
//      wallet/affordability layer); a one-stop "routing" is synthesized only as a
//      labelled fallback when no direct route exists, using the same charts.
//   2) USD -> CAD. The engine is USD-native (taxesFor / cashFareUsd return USD);
//      the orchestration contract is CAD (taxesEachCad / cashEachCad), so we
//      convert at the adapter boundary with a fixed USD_CAD rate. Miles and the
//      Deal Score are currency-free and pass through untouched.
//   3) The query gives a month, not a date window. We scan a fixed slice of dates
//      inside that month (the 6th..27th, weekly) which the engine treats as real
//      departure dates; this samples the month's availability deterministically.
//   4) Booking-time anchor. The engine's availability is date-RELATIVE (seats only
//      release for dates between "today" and +360d; the J/F sweet spot is ~90-270d
//      out). The orchestration runs against a FIXED trip month, so we anchor the
//      engine's "today" to the 1st of the month ~4 months before travel (a typical
//      award lead time) instead of the wall clock. That keeps the request in the
//      engine's real future-booking regime so its availability model actually runs,
//      and makes the output reproducible regardless of when the demo is executed.
//      Every other number (charts, taxes, scoring, seat counts) is the engine's.

import DATA from "./seatsaero.data.js";

const AIRPORT_MAP = Object.fromEntries(DATA.airports.map((a) => [a.code, a]));
const AIRLINES = DATA.airlines;
const CARRIER_YQ = DATA.carrierYq;

// USD -> CAD. The product computes in USD; Upfront sells in CAD.
const USD_CAD = 1.37;
const cad = (usd) => Math.round(usd * USD_CAD);

// query cabin string -> engine cabin code
const CABIN_CODE = { Economy: "Y", "Premium economy": "W", "Premium Economy": "W", Business: "J", First: "F" };
const CABIN_NAME = { Y: "Economy", W: "Premium economy", J: "Business", F: "First" };

function airport(code) {
  const a = AIRPORT_MAP[code];
  if (!a) throw new Error(`Unknown airport ${code}`);
  return a;
}

// ── rng.ts (ported verbatim) ───────────────────────────────────────
function hash(key) {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
function rand(key) {
  let t = (hash(key) + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(key, min, max) {
  return min + Math.floor(rand(key) * (max - min + 1));
}
function pickWeighted(key, table) {
  const total = table.reduce((s, [, w]) => s + w, 0);
  let r = rand(key) * total;
  for (const [v, w] of table) {
    r -= w;
    if (r <= 0) return v;
  }
  return table[table.length - 1][0];
}

// ── airports.ts: haversine distance (ported verbatim) ──────────────
const R_EARTH_MI = 3958.8;
function distanceMi(a, b) {
  const p = airport(a);
  const q = airport(b);
  const dLat = ((q.lat - p.lat) * Math.PI) / 180;
  const dLon = ((q.lon - p.lon) * Math.PI) / 180;
  const la = (p.lat * Math.PI) / 180;
  const lb = (q.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R_EARTH_MI * Math.asin(Math.sqrt(h)));
}

// ── flights.ts: date math + flightsOn (ported verbatim) ────────────
function pad(n) {
  return String(n).padStart(2, "0");
}
function addDays(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}
function dayOfWeek(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
function daysBetween(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
function flightDuration(distance) {
  return Math.round(40 + (distance / 510) * 60);
}
function tzOffsetMin(code) {
  return Math.round(airport(code).lon / 15) * 60;
}
function routeKey(rt) {
  return `${rt.airline}${rt.origin}${rt.dest}`;
}

// Both directions of every published route (mirrors flights.ts ALL_ROUTES)
const ALL_ROUTES = DATA.routes.flatMap((rt) => [rt, { ...rt, origin: rt.dest, dest: rt.origin }]);
const routesByOrigin = new Map();
const routesByPair = new Map();
for (const rt of ALL_ROUTES) {
  const o = routesByOrigin.get(rt.origin) ?? [];
  o.push(rt);
  routesByOrigin.set(rt.origin, o);
  const key = `${rt.origin}-${rt.dest}`;
  const p = routesByPair.get(key) ?? [];
  p.push(rt);
  routesByPair.set(key, p);
}
function routesFrom(origin) {
  return routesByOrigin.get(origin) ?? [];
}
function routesBetween(origin, dest) {
  return routesByPair.get(`${origin}-${dest}`) ?? [];
}

function flightsOn(rt, date) {
  const key = routeKey(rt);
  const dow = dayOfWeek(date);
  const perDay = Math.floor(rt.weekly / 7);
  const extraDays = rt.weekly % 7;
  const dayOrder = [...Array(7).keys()].sort(
    (a, b) => rand(`${key}|dayrank|${a}`) - rand(`${key}|dayrank|${b}`)
  );
  const extraSet = new Set(dayOrder.slice(0, extraDays));
  const count = perDay + (extraSet.has(dow) ? 1 : 0);
  if (count === 0) return [];

  const distance = distanceMi(rt.origin, rt.dest);
  const duration = flightDuration(distance);
  const out = [];
  const tzShift = tzOffsetMin(rt.dest) - tzOffsetMin(rt.origin);

  for (let i = 0; i < count; i++) {
    const fnum = 100 + (hash(`${key}|fnum|${i}`) % 880);
    const depMin = randInt(`${key}|dep|${i}`, 6 * 60, 23 * 60 + 30);
    const arrAbs = depMin + duration + tzShift;
    const arrMin = ((arrAbs % (24 * 60)) + 24 * 60) % (24 * 60);
    out.push({
      id: `${rt.airline}${fnum}|${rt.origin}|${rt.dest}|${date}`,
      route: rt,
      date,
      flightNumber: `${rt.airline} ${fnum}`,
      depTime: `${pad(Math.floor(depMin / 60))}:${pad(depMin % 60)}`,
      arrTime: `${pad(Math.floor(arrMin / 60))}:${pad(arrMin % 60)}`,
      arrDayOffset: Math.floor(arrAbs / (24 * 60)),
      durationMin: duration,
      distanceMi: distance,
    });
  }
  return out.sort((a, b) => a.depTime.localeCompare(b.depTime));
}

// ── programs.ts: zones, charts, CARRIER_YQ, PROGRAMS (ported verbatim) ──
const ASIA = ["asia-east", "asia-se", "asia-south"];
const isAsia = (r) => ASIA.includes(r);
function zoneOf(a, b) {
  const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
  if (a === "na" && b === "na") return "within-na";
  if (pair("na", "eu") || pair("na", "mideast") || pair("na", "africa")) return "atlantic";
  if ((a === "na" && (isAsia(b) || b === "oceania")) || (b === "na" && (isAsia(a) || a === "oceania")))
    return "pacific";
  if (pair("na", "samerica")) return "na-sa";
  if ((isAsia(a) || a === "oceania" || a === "mideast") && (isAsia(b) || b === "oceania" || b === "mideast"))
    return "within-asia";
  if ((a === "eu" && (isAsia(b) || b === "oceania")) || (b === "eu" && (isAsia(a) || a === "oceania")))
    return "eu-asia";
  if (a === "eu" && b === "eu") return "within-eu";
  return "other";
}

const INF = Infinity;
function band(distance, bands) {
  for (const [max, prices] of bands) if (distance <= max) return prices;
  return bands[bands.length - 1][1];
}
function price(distance, cabin, bands) {
  const p = band(distance, bands)[cabin];
  return p == null ? null : Math.round(p * 1000);
}

const GENERIC = [
  [1000, { Y: 10, W: 15, J: 20, F: 32 }],
  [3000, { Y: 20, W: 30, J: 42, F: 65 }],
  [5500, { Y: 30, W: 47, J: 68, F: 100 }],
  [8000, { Y: 40, W: 62, J: 90, F: 135 }],
  [INF, { Y: 50, W: 78, J: 110, F: 165 }],
];
const AEROPLAN_NA = [
  [500, { Y: 6, W: 10, J: 15, F: 25 }],
  [1500, { Y: 10, W: 15, J: 20, F: 30 }],
  [2750, { Y: 12.5, W: 18, J: 25, F: 40 }],
  [INF, { Y: 22.5, W: 28, J: 35, F: 55 }],
];
const AEROPLAN_ATLANTIC = [
  [4000, { Y: 32.5, W: 45, J: 60, F: 90 }],
  [6000, { Y: 42.5, W: 57, J: 75, F: 110 }],
  [8000, { Y: 60, W: 75, J: 90, F: 130 }],
  [INF, { Y: 75, W: 92, J: 110, F: 160 }],
];
const AEROPLAN_PACIFIC = [
  [5000, { Y: 32.5, W: 42, J: 55, F: 85 }],
  [7500, { Y: 50, W: 62, J: 75, F: 110 }],
  [11000, { Y: 65, W: 82, J: 102.5, F: 150 }],
  [INF, { Y: 70, W: 90, J: 115, F: 170 }],
];
const ALASKA_AMERICAS = [
  [700, { Y: 4.5, W: 7, J: 9, F: 13.5 }],
  [1400, { Y: 7.5, W: 12, J: 16, F: 25 }],
  [2100, { Y: 12.5, W: 19, J: 26, F: 40 }],
  [4000, { Y: 17.5, W: 26, J: 35, F: 52.5 }],
  [6000, { Y: 25, W: 37, J: 50, F: 75 }],
  [INF, { Y: 30, W: 45, J: 60, F: 90 }],
];
const ALASKA_EUROPE = [
  [3500, { Y: 22.5, W: 34, J: 45, F: 67.5 }],
  [5000, { Y: 27.5, W: 41, J: 55, F: 82.5 }],
  [7000, { Y: 35, W: 52, J: 70, F: 105 }],
  [10000, { Y: 42.5, W: 64, J: 85, F: 130 }],
  [INF, { Y: 55, W: 82, J: 110, F: 165 }],
];
const ALASKA_ASIA = [
  [3000, { Y: 25, W: 37, J: 50, F: 75 }],
  [5000, { Y: 30, W: 45, J: 60, F: 90 }],
  [7000, { Y: 37.5, W: 56, J: 75, F: 110 }],
  [10000, { Y: 42.5, W: 64, J: 85, F: 130 }],
  [INF, { Y: 65, W: 97, J: 130, F: 195 }],
];
const AVIOS = [
  [650, { Y: 11, W: 16.5, J: 23, F: 44 }],
  [1150, { Y: 13.5, W: 20, J: 33, F: 54 }],
  [2000, { Y: 16, W: 24, J: 36, F: 64 }],
  [3000, { Y: 17.5, W: 26, J: 51.5, F: 70 }],
  [4000, { Y: 23, W: 34.5, J: 68.5, F: 92 }],
  [5500, { Y: 28.5, W: 43, J: 85, F: 114 }],
  [6500, { Y: 34.5, W: 52, J: 102.5, F: 138 }],
  [7000, { Y: 40, W: 60, J: 120, F: 160 }],
  [INF, { Y: 57, W: 85, J: 170, F: 227 }],
];
const ASIA_MILES = [
  [750, { Y: 7, W: 11, J: 16, F: 25 }],
  [1750, { Y: 9, W: 18, J: 27, F: 43 }],
  [2750, { Y: 13, W: 23, J: 32, F: 50 }],
  [5000, { Y: 20, W: 38, J: 60, F: 90 }],
  [7500, { Y: 27, W: 50, J: 91, F: 125 }],
  [INF, { Y: 38, W: 75, J: 119, F: 160 }],
];
const AA_DOMESTIC = [[INF, { Y: 12.5, W: 20, J: 25, F: 50 }]];
const UNITED_FLOOR = [
  [2000, { Y: 16.5, W: 28, J: 38, F: 65 }],
  [3000, { Y: 30, W: 44, J: 60, F: 100 }],
  [5500, { Y: 33.5, W: 55, J: 77, F: 130 }],
  [INF, { Y: 40, W: 65, J: 88, F: 150 }],
];
const DELTA_FLOOR = [
  [2000, { Y: 12.5, W: 25, J: 35 }],
  [3500, { Y: 30, W: 50, J: 75 }],
  [INF, { Y: 40, W: 62, J: 95 }],
];
const FLYING_BLUE_FLOOR = [
  [1500, { Y: 12, W: 18, J: 25 }],
  [4500, { Y: 25, W: 40, J: 60 }],
  [6500, { Y: 30, W: 50, J: 70 }],
  [INF, { Y: 40, W: 62, J: 85 }],
];
const LIFEMILES_US_EU = [[INF, { Y: 30, W: 47, J: 63, F: 87 }]];
const LIFEMILES_US_ASIA = [[INF, { Y: 32.5, W: 52, J: 75, F: 90 }]];
const KRISFLYER = [
  [2000, { Y: 15, W: 22, J: 28, F: 40 }],
  [5000, { Y: 25, W: 39, J: 52, F: 75 }],
  [7500, { Y: 32, W: 55, J: 72, F: 105 }],
  [INF, { Y: 44.5, W: 81.5, J: 107.5, F: 150 }],
];
const SKYWARDS = [
  [2000, { Y: 16, W: 25, J: 36, F: 55 }],
  [5000, { Y: 32, W: 50, J: 72, F: 102.5 }],
  [7500, { Y: 42.5, W: 66, J: 90, F: 136 }],
  [INF, { Y: 50, W: 77, J: 105, F: 160 }],
];

// PROGRAMS: code/airline/alliance/extraPartners/yq/bookingFee/seatsVisible/dynamic/chart
// (faithful port of programs.ts PROGRAMS array)
const PROGRAMS = [
  {
    code: "AC", short: "Aeroplan", airline: "AC", alliance: "star", extraPartners: ["EK", "EY"],
    yq: "none", yqCarriers: [], bookingFeeUsd: 28, seatsVisible: true, dynamic: { on: "own", maxMult: 3 },
    chart: (c) => {
      const z = zoneOf(c.originRegion, c.destRegion);
      if (z === "within-na") return price(c.distanceMi, c.cabin, AEROPLAN_NA);
      if (z === "atlantic") return price(c.distanceMi, c.cabin, AEROPLAN_ATLANTIC);
      if (z === "pacific") return price(c.distanceMi, c.cabin, AEROPLAN_PACIFIC);
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "UA", short: "United", airline: "UA", alliance: "star", extraPartners: [],
    yq: "none", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true, dynamic: { on: "own", maxMult: 4 },
    chart: (c) => {
      if (c.airline === "NH" && c.cabin === "F") return 220000;
      return price(c.distanceMi, c.cabin, UNITED_FLOOR);
    },
  },
  {
    code: "AA", short: "AAdvantage", airline: "AA", alliance: "oneworld", extraPartners: [],
    yq: "partial", yqCarriers: ["BA", "IB"], bookingFeeUsd: 0, seatsVisible: false, dynamic: { on: "own", maxMult: 5 },
    chart: (c) => {
      const z = zoneOf(c.originRegion, c.destRegion);
      const asia2 =
        ["asia-east", "asia-se"].includes(c.originRegion) || ["asia-east", "asia-se"].includes(c.destRegion);
      const japanKorea = c.distanceMi < 7000 && asia2;
      if (z === "within-na") return price(c.distanceMi, c.cabin, AA_DOMESTIC);
      if (z === "atlantic") {
        const mid = c.originRegion === "mideast" || c.destRegion === "mideast";
        const t = mid ? { Y: 40, W: 55, J: 70, F: 115 } : { Y: 30, W: 42.5, J: 57.5, F: 85 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      if (z === "pacific") {
        const oceania = c.originRegion === "oceania" || c.destRegion === "oceania";
        const t = oceania
          ? { Y: 40, W: 60, J: 80, F: 110 }
          : japanKorea
            ? { Y: 35, W: 50, J: 60, F: 80 }
            : { Y: 37.5, W: 55, J: 70, F: 110 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      if (z === "na-sa") {
        const t = { Y: 30, W: 42.5, J: 57.5, F: 85 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "AS", short: "Alaska", airline: "AS", alliance: "oneworld", extraPartners: ["HA"],
    yq: "none", yqCarriers: [], bookingFeeUsd: 12.5, seatsVisible: true,
    chart: (c) => {
      const eu = ["eu", "mideast", "africa"];
      const apac = ["asia-east", "asia-se", "asia-south", "oceania"];
      const touch = (rs) => rs.includes(c.originRegion) || rs.includes(c.destRegion);
      if (touch(apac)) return price(c.distanceMi, c.cabin, ALASKA_ASIA);
      if (touch(eu)) return price(c.distanceMi, c.cabin, ALASKA_EUROPE);
      return price(c.distanceMi, c.cabin, ALASKA_AMERICAS);
    },
  },
  {
    code: "DL", short: "Delta", airline: "DL", alliance: "skyteam", extraPartners: ["VA"],
    yq: "none", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true, dynamic: { on: "all", maxMult: 4 },
    chart: (c) => price(c.distanceMi, c.cabin, DELTA_FLOOR),
  },
  {
    code: "BA", short: "BA Avios", airline: "BA", alliance: "oneworld", extraPartners: [],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => price(c.distanceMi, c.cabin, AVIOS),
  },
  {
    code: "VS", short: "Virgin Points", airline: "VS", alliance: "skyteam", extraPartners: ["NH", "VA"],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => {
      if (c.airline === "NH") {
        const west = c.distanceMi < 6200;
        const t = west ? { Y: 30, W: 37.5, J: 45, F: 72.5 } : { Y: 32.5, W: 40, J: 47.5, F: 85 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      const z = zoneOf(c.originRegion, c.destRegion);
      if (z === "atlantic") {
        const t = { Y: 20, W: 35, J: 50, F: 80 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "AF", short: "Flying Blue", airline: "AF", alliance: "skyteam", extraPartners: [],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true, dynamic: { on: "own", maxMult: 3.5 },
    chart: (c) => price(c.distanceMi, c.cabin, FLYING_BLUE_FLOOR),
  },
  {
    code: "CX", short: "Asia Miles", airline: "CX", alliance: "oneworld", extraPartners: [],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => {
      const own = c.airline === "CX";
      const p = price(c.distanceMi, c.cabin, ASIA_MILES);
      if (p == null) return null;
      return own ? p : Math.round((p * 1.1) / 500) * 500;
    },
  },
  {
    code: "NH", short: "ANA Miles", airline: "NH", alliance: "star", extraPartners: [],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => {
      const z = zoneOf(c.originRegion, c.destRegion);
      if (z === "pacific" || z === "eu-asia") {
        const t =
          c.distanceMi <= 5500
            ? { Y: 25, W: 31, J: 42.5, F: 82.5 }
            : c.distanceMi <= 7200
              ? { Y: 27.5, W: 34, J: 45, F: 85 }
              : { Y: 32.5, W: 42.5, J: 68, F: 105 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      if (z === "within-asia") {
        const t = { Y: 10, W: 14, J: 18, F: 30 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "AV", short: "LifeMiles", airline: "AV", alliance: "star", extraPartners: [],
    yq: "none", yqCarriers: [], bookingFeeUsd: 25, seatsVisible: true,
    chart: (c) => {
      const z = zoneOf(c.originRegion, c.destRegion);
      if (z === "atlantic") return price(c.distanceMi, c.cabin, LIFEMILES_US_EU);
      if (z === "pacific") return price(c.distanceMi, c.cabin, LIFEMILES_US_ASIA);
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "KE", short: "SKYPASS", airline: "KE", alliance: "skyteam", extraPartners: [],
    yq: "partial", yqCarriers: ["KE"], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => {
      const z = zoneOf(c.originRegion, c.destRegion);
      if (z === "pacific") {
        const t = { Y: 35, W: 47, J: 62.5, F: 80 };
        return t[c.cabin] ? Math.round(t[c.cabin] * 1000) : null;
      }
      return price(c.distanceMi, c.cabin, GENERIC);
    },
  },
  {
    code: "QR", short: "Qatar Avios", airline: "QR", alliance: "oneworld", extraPartners: ["B6"],
    yq: "partial", yqCarriers: ["QR", "BA", "IB"], bookingFeeUsd: 0, seatsVisible: false,
    chart: (c) => {
      const p = price(c.distanceMi, c.cabin, AVIOS);
      return p == null ? null : Math.round((p * 0.95) / 500) * 500;
    },
  },
  {
    code: "SQ", short: "KrisFlyer", airline: "SQ", alliance: "star", extraPartners: ["VA"],
    yq: "partial", yqCarriers: ["SQ"], bookingFeeUsd: 0, seatsVisible: false,
    chart: (c) => {
      const own = c.airline === "SQ";
      const p = price(c.distanceMi, c.cabin, KRISFLYER);
      if (p == null) return null;
      return own ? p : Math.round((p * 1.15) / 500) * 500;
    },
  },
  {
    code: "EK", short: "Skywards", airline: "EK", alliance: null, extraPartners: ["EK"],
    yq: "full", yqCarriers: [], bookingFeeUsd: 0, seatsVisible: true,
    chart: (c) => (c.airline === "EK" ? price(c.distanceMi, c.cabin, SKYWARDS) : null),
  },
];

// ── pricing.ts: canBook / taxesFor / offersFor / fairPrice (ported) ──
function canBook(p, carrier) {
  if (p.airline === carrier) return true;
  if (p.extraPartners.includes(carrier)) return true;
  if (!p.alliance) return false;
  return (AIRLINES[carrier]?.alliance ?? "none") === p.alliance;
}

function taxesFor(p, flight, cabin) {
  const { origin } = flight.route;
  const carrier = flight.route.airline;
  let fees = 14 + Math.round(rand(`${origin}|${flight.route.dest}|fees`) * 32);
  if (airport(origin).country === "United States") fees += 5.6;
  if (origin === "HKG") fees += 26;
  if (origin === "LHR" || origin === "MAN") fees += cabin === "Y" ? 110 : 270;

  const passes = p.yq === "full" || (p.yq === "partial" && (p.yqCarriers ?? []).includes(carrier));
  if (passes) {
    let yq = CARRIER_YQ[carrier] ?? 60;
    if (flight.distanceMi < 2500) yq *= 0.45;
    if (carrier === "BA" && cabin !== "Y") yq *= 1.3;
    fees += yq;
  }
  return Math.round(fees + p.bookingFeeUsd);
}

const DYNAMIC_MULT = [
  [1, 5],
  [1.25, 3],
  [1.6, 2],
  [2.2, 1.2],
  [3.2, 0.8],
  [4.5, 0.4],
];
const PARTNER_RELEASE = {
  CX: 0.55, NH: 0.5, JL: 0.62, QF: 0.5, DL: 0.42, SQ: 0.45,
  KE: 0.6, LH: 0.7, LX: 0.6, EK: 0.85, QR: 0.82, BA: 0.85,
};
function partnerPoolOpen(flightId, cabin, carrier) {
  const prob = cabin === "Y" || cabin === "W" ? 0.9 : PARTNER_RELEASE[carrier] ?? 0.78;
  return rand(`${flightId}|${cabin}|partnerpool`) < prob;
}

function offersFor(flight, cabin, physicalSeats) {
  const carrier = flight.route.airline;
  const ctx = {
    distanceMi: flight.distanceMi,
    cabin,
    airline: carrier,
    originRegion: airport(flight.route.origin).region,
    destRegion: airport(flight.route.dest).region,
  };
  const month = flight.date.slice(0, 7);
  const offers = [];
  const poolOpen = partnerPoolOpen(flight.id, cabin, carrier);

  for (const p of PROGRAMS) {
    if (!canBook(p, carrier)) continue;
    if (carrier === "SQ" && cabin !== "Y" && flight.distanceMi > 5000 && p.code !== "SQ") continue;
    const base = p.chart(ctx);
    if (base == null) continue;

    const isOwnMetal = p.airline === carrier;
    if (!isOwnMetal && !poolOpen) continue;
    let seats = physicalSeats;
    let memberOnly = false;

    if (seats === 0 && isOwnMetal && (p.code === "NH" || p.code === "SQ")) {
      if (rand(`${flight.id}|${cabin}|member|${p.code}`) < 0.12) {
        seats = 1 + Math.round(rand(`${flight.id}|${cabin}|memberseats|${p.code}`));
        memberOnly = true;
      }
    }
    if (seats === 0) continue;

    let miles = base;
    let dynamic = false;
    let promo = false;
    let flashSale = false;

    if (p.dynamic && (p.dynamic.on === "all" || isOwnMetal)) {
      const mult = Math.min(pickWeighted(`${flight.id}|${cabin}|mult|${p.code}`, DYNAMIC_MULT), p.dynamic.maxMult);
      if (mult > 1) {
        miles = Math.round((base * mult) / 500) * 500;
        dynamic = true;
      }
      if (p.code === "DL" && rand(`${month}|flash|${flight.route.origin}${flight.route.dest}`) < 0.04) {
        miles = Math.round((base * 0.55) / 500) * 500;
        flashSale = true;
        dynamic = false;
      }
    }

    if (
      p.code === "AF" &&
      (carrier === "AF" || carrier === "KL") &&
      rand(`${month}|promo|${flight.route.origin}${flight.route.dest}`) < 0.08
    ) {
      miles = Math.round((base * 0.75) / 500) * 500;
      promo = true;
      dynamic = false;
    }

    const phantomRate = p.code === "AV" ? 0.15 : cabin === "J" || cabin === "F" ? 0.05 : 0.02;
    const phantom = rand(`${flight.id}|${cabin}|phantom|${p.code}`) < phantomRate;

    offers.push({
      program: p.code,
      miles,
      taxesUsd: taxesFor(p, flight, cabin),
      seats,
      seatsVisible: p.seatsVisible,
      dynamic: dynamic || undefined,
      promo: promo || undefined,
      flashSale: flashSale || undefined,
      memberOnly: memberOnly || undefined,
      phantom: phantom || undefined,
      phoneOnly: p.code === "VS" && carrier === "NH" ? true : undefined,
      roundTripOnly: p.code === "NH" ? true : undefined,
    });
  }
  return offers.sort((a, b) => a.miles - b.miles || a.taxesUsd - b.taxesUsd);
}

function fairPrice(flight, cabin) {
  const carrier = flight.route.airline;
  const ctx = {
    distanceMi: flight.distanceMi,
    cabin,
    airline: carrier,
    originRegion: airport(flight.route.origin).region,
    destRegion: airport(flight.route.dest).region,
  };
  const prices = PROGRAMS.filter((p) => canBook(p, carrier))
    .filter((p) => !(carrier === "SQ" && cabin !== "Y" && flight.distanceMi > 5000 && p.code !== "SQ"))
    .map((p) => p.chart(ctx))
    .filter((x) => x != null)
    .sort((a, b) => a - b);
  if (!prices.length) return null;
  const mid = Math.floor(prices.length / 2);
  return prices.length % 2 ? prices[mid] : Math.round((prices[mid - 1] + prices[mid]) / 2);
}

// ── scoring.ts: scoreOffer (ported verbatim) ───────────────────────
const STANDOUT = {
  F: ["NH", "JL", "CX", "SQ", "EK", "LH", "AF", "KE"],
  J: ["QR", "CX", "NH", "JL", "SQ", "BR", "AY", "QF", "AF"],
  W: ["BR", "NH", "JL", "SQ", "VS"],
  Y: ["SQ", "NH", "JL", "CX", "BR"],
};
function ratioToScore(ratio) {
  const x = (1.05 - ratio) * 4.2;
  return Math.round(100 / (1 + Math.exp(-x)));
}
function scoreOffer(flight, cabin, best, seats) {
  const fair = fairPrice(flight, cabin) ?? best.miles;
  const ratio = best.miles / fair;
  let score = ratioToScore(ratio);
  if (best.taxesUsd > 150) score -= Math.min(15, Math.round((best.taxesUsd - 150) / 25));
  if (seats >= 2) score += 4;
  if (STANDOUT[cabin].includes(flight.route.airline)) score += 7;
  if (best.memberOnly || best.phoneOnly) score -= 5;
  score = Math.max(2, Math.min(99, score));
  const percentile = Math.max(1, Math.min(99, Math.round((ratio - 0.42) * 75)));
  const verdict = percentile <= 25 && seats > 0 ? "book" : percentile >= 70 ? "wait" : "typical";
  return { score, percentile, verdict };
}

// ── availability.ts: seatsReleased (ported verbatim) ───────────────
const GENEROSITY = {
  CX: 0.9, JL: 0.75, NH: 0.85, SQ: 0.7, QR: 1.1, EK: 0.95, EY: 1.0,
  BA: 1.15, AA: 0.8, UA: 1.0, DL: 0.65, AC: 1.0, LH: 0.8, LX: 0.6,
  AF: 0.95, KL: 0.95, KE: 0.9, OZ: 1.0, TG: 1.05, BR: 0.85, CA: 1.2,
  MU: 1.15, CI: 1.0, TK: 1.1, QF: 0.7, NZ: 0.75, VS: 1.0, AY: 1.05,
  IB: 1.1, MH: 1.05, AS: 1.0, B6: 0.95, HA: 1.0, VA: 0.9, ET: 1.15,
  AV: 1.1, CM: 1.1, TP: 1.15, SK: 1.0, AM: 1.0, SV: 1.05, GA: 1.1,
  VN: 1.1, OS: 0.9, FJ: 1.0,
};
const BASE_RELEASE = { Y: 0.78, W: 0.5, J: 0.42, F: 0.26 };
const CLOSE_IN_FIRST = new Set(["LH", "LX"]);
function daysOutFactor(daysOut, cabin) {
  if (daysOut < 0) return 0;
  if (cabin === "Y" || cabin === "W") return daysOut <= 3 ? 0.85 : daysOut > 200 ? 1.1 : 1.0;
  if (daysOut <= 14) return 1.7;
  if (daysOut <= 45) return 0.75;
  if (daysOut <= 120) return 0.9;
  if (daysOut <= 270) return 1.15;
  return 1.0;
}
function seasonFactor(date) {
  const month = Number(date.slice(5, 7));
  if (month === 7 || month === 8 || month === 12) return 0.7;
  if (month === 6) return 0.85;
  if (month === 1 || month === 2 || month === 11) return 1.15;
  return 1.0;
}
function dowFactor(date) {
  const dow = dayOfWeek(date);
  if (dow === 2 || dow === 3) return 1.25;
  if (dow === 5 || dow === 0) return 0.8;
  return 1.0;
}
function routeScarcity(distance, cabin) {
  if (cabin === "Y") return 1.0;
  if (distance > 6500) return 0.8;
  if (distance > 3500) return 0.9;
  return 1.15;
}
function seatsReleased(flight, cabin, today) {
  if (!flight.route.cabins.includes(cabin)) return { seats: 0, closeIn: false };
  const daysOut = daysBetween(today, flight.date);
  if (daysOut < 0 || daysOut > 360) return { seats: 0, closeIn: false };
  const carrier = flight.route.airline;
  const closeIn = daysOut <= 15;
  if (cabin === "F" && CLOSE_IN_FIRST.has(carrier) && !closeIn) return { seats: 0, closeIn: false };

  const p =
    BASE_RELEASE[cabin] *
    (GENEROSITY[carrier] ?? 1) *
    daysOutFactor(daysOut, cabin) *
    seasonFactor(flight.date) *
    dowFactor(flight.date) *
    routeScarcity(flight.distanceMi, cabin);

  const roll = rand(`${flight.id}|${cabin}|release`);
  if (roll > Math.min(p, 0.96)) return { seats: 0, closeIn };

  const seatKey = `${flight.id}|${cabin}|seats`;
  let seats;
  if (cabin === "F") seats = pickWeighted(seatKey, [[1, 5], [2, 4], [3, 1]]);
  else if (cabin === "J") seats = pickWeighted(seatKey, [[1, 3], [2, 4], [3, 2], [4, 2], [5, 1], [6, 0.5]]);
  else if (cabin === "W") seats = pickWeighted(seatKey, [[1, 2], [2, 3], [3, 3], [4, 2], [5, 1]]);
  else seats = pickWeighted(seatKey, [[2, 1], [4, 2], [6, 3], [8, 3], [9, 4]]);
  return { seats, closeIn };
}

// ── cash.ts: cashFareUsd (ported verbatim) ─────────────────────────
function cashFareUsd(origin, dest, distance, cabin, date) {
  let base;
  if (distance <= 1000) base = 44 + distance * 0.09;
  else if (distance <= 3500) base = 86 + distance * 0.075;
  else base = 168 + distance * 0.063;
  const mult = {
    Y: 1,
    W: 1.9,
    J: distance <= 1500 ? 2.3 : 3.2,
    F: distance <= 1500 ? 3.2 : 6.2,
  };
  const month = Number(date.slice(5, 7));
  const season = month === 7 || month === 8 || month === 12 ? 1.28 : month === 1 || month === 11 ? 0.92 : 1;
  const noise = 0.84 + rand(`cash|${origin}${dest}|${date.slice(0, 7)}`) * 0.34;
  const fare = base * mult[cabin] * season * noise;
  return Math.max(49, Math.round(fare / 10) * 10 - 1);
}

// ── search.ts: evaluateFlight (ported verbatim) ────────────────────
function evaluateFlight(flight, cabin, today) {
  const { seats } = seatsReleased(flight, cabin, today);
  const offers = offersFor(flight, cabin, seats);
  if (!offers.length) return null;
  const best =
    offers.find((o) => !o.phantom && !o.roundTripOnly) ?? offers.find((o) => !o.phantom) ?? offers[0];
  const { score, percentile, verdict } = scoreOffer(flight, cabin, best, best.seats);
  const lastSeenMin = 4 + Math.round(rand(`${flight.id}|${cabin}|seen|${today}`) * 340);
  return { flight, cabin, seats: best.seats, offers, bestOffer: best, score, percentile, verdict, lastSeenMin };
}

// ── adapter glue: shape one engine result into the contract row ─────
function carrierLabel(code) {
  const a = AIRLINES[code];
  return a ? `${a.shortName} (${code})` : code;
}
// A note describing one specific program offer on the winning flight.
function offerNote(av, o, query) {
  const carrier = av.flight.route.airline;
  const prog = PROGRAMS.find((p) => p.code === o.program);
  const product = AIRLINES[carrier]?.products?.[av.cabin];
  const parts = [];
  if (prog) {
    if (prog.yq === "none") parts.push(`${prog.short}: no fuel surcharges`);
    else if (o.taxesUsd > 150) parts.push(`${prog.short}: surcharges apply`);
    else parts.push(`${prog.short} saver`);
  }
  if (product) parts.push(product);
  if (o.seats >= query.pax) parts.push(`${o.seats} seats released`);
  else parts.push(`only ${o.seats} seat${o.seats === 1 ? "" : "s"} (need ${query.pax})`);
  if (o.dynamic) parts.push("dynamically priced");
  if (o.flashSale) parts.push("flash sale below floor");
  if (o.promo) parts.push("monthly promo");
  if (o.memberOnly) parts.push("member-only space");
  if (o.phoneOnly) parts.push("phone-only booking");
  if (o.roundTripOnly) parts.push("round-trip only");
  if (o.phantom) parts.push("phantom-space risk at ticketing");
  return parts.join("; ") + ".";
}

// Expand one winning flight into one row per distinct bookable program, each
// scored independently by the real scoreOffer. Mirrors a Seats.Aero result row:
// same flight, several programs that can ticket it, ranked by deal score.
function rowsFromAvailability(av, query, viaLabel) {
  const rt = av.flight.route;
  const routing = viaLabel
    ? `${query.from}-${viaLabel}-${query.to}`
    : `${query.from}-${query.to} nonstop`;
  const cashEachCad = cad(cashFareUsd(rt.origin, rt.dest, av.flight.distanceMi, av.cabin, av.flight.date));

  const seen = new Set();
  const rows = [];
  for (const o of av.offers) {
    if (o.phantom) continue; // never lead with space that fails at ticketing
    if (seen.has(o.program)) continue;
    seen.add(o.program);
    const { score } = scoreOffer(av.flight, av.cabin, o, o.seats);
    rows.push({
      program: PROGRAMS.find((p) => p.code === o.program)?.short ?? o.program,
      carrier: carrierLabel(rt.airline),
      routing,
      cabin: query.cabin,
      pax: query.pax,
      milesEach: o.miles,
      taxesEachCad: cad(o.taxesUsd),
      cashEachCad,
      dealScore: score,
      bookable: !o.phantom && !o.roundTripOnly && o.seats >= query.pax,
      note: offerNote(av, o, query),
      _sortMiles: o.miles,
    });
  }
  return rows;
}

// Sample dates inside the requested month: 6th..27th, weekly (deterministic).
function monthDates(month) {
  const out = [];
  for (const day of [6, 13, 20, 27]) out.push(`${month}-${pad(day)}`);
  return out;
}

// Anchor the engine's "today" ~4 months before the travel month so the
// date-relative availability model runs in its real future-booking regime
// (see simplification #4). Deterministic: depends only on the query month.
function bookingAnchor(month) {
  const [y, m] = month.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 - 4, 1));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-01`;
}

/**
 * Real award search over the product's actual network. Returns the best
 * ticketable award per operating carrier on the requested route+cabin+month,
 * ranked by the engine's Deal Score (highest first).
 */
export function searchAward(query) {
  const cabin = CABIN_CODE[query.cabin] ?? "J";
  // Anchor before the travel month so the engine's date-relative availability
  // model runs (simplification #4); falls back to the wall clock if no month.
  const today = query.month ? bookingAnchor(query.month) : todayIso();
  const dates = monthDates(query.month);

  // Best engine result per operating carrier (keeps the option list diverse,
  // mirroring how deals.ts keeps one hit per route+cabin).
  const bestByCarrier = new Map();

  // 1) Direct routes — the real, primary path.
  const direct = routesBetween(query.from, query.to);
  for (const rt of direct) {
    if (!rt.cabins.includes(cabin)) continue;
    for (const date of dates) {
      for (const flight of flightsOn(rt, date)) {
        const av = evaluateFlight(flight, cabin, today);
        if (!av) continue;
        const prev = bestByCarrier.get(rt.airline);
        if (!prev || av.score > prev.av.score) bestByCarrier.set(rt.airline, { av, via: null });
      }
    }
  }

  // 2) One-stop fallback (only when no direct route exists). Honest simplification:
  // this is NOT planner.ts's wallet-aware multi-leg optimizer; it picks the single
  // best connecting hub by total distance and reports the long leg's best award,
  // labelling the routing as a connection. Uses the same real charts/availability.
  if (!direct.length) {
    const fromOrigin = new Set(routesFrom(query.from).map((r) => r.dest));
    const hubs = [...fromOrigin]
      .filter((h) => h !== query.to && routesBetween(h, query.to).length > 0)
      .map((h) => ({ h, total: distanceMi(query.from, h) + distanceMi(h, query.to) }))
      .sort((a, b) => a.total - b.total)
      .slice(0, 6);
    for (const { h } of hubs) {
      for (const rt of routesBetween(h, query.to)) {
        if (!rt.cabins.includes(cabin)) continue;
        for (const date of dates) {
          for (const flight of flightsOn(rt, date)) {
            const av = evaluateFlight(flight, cabin, today);
            if (!av) continue;
            const k = `${rt.airline}|via${h}`;
            const prev = bestByCarrier.get(k);
            if (!prev || av.score > prev.av.score) bestByCarrier.set(k, { av, via: h });
          }
        }
      }
    }
  }

  // Each winning flight expands into one row per bookable program (same flight,
  // several programs that can ticket it), then we rank every row globally by the
  // engine's Deal Score and keep the strongest, deduping identical program rows.
  const rows = [...bestByCarrier.values()].flatMap(({ av, via }) =>
    rowsFromAvailability(av, query, via),
  );
  // Bookable options lead (mirrors evaluateFlight's headline rule: a round-trip-only
  // or phantom offer never leads a row), then by Deal Score, then by miles.
  const seen = new Set();
  const options = rows
    .sort(
      (a, b) =>
        Number(b.bookable) - Number(a.bookable) ||
        b.dealScore - a.dealScore ||
        a._sortMiles - b._sortMiles,
    )
    .filter((r) => {
      const k = `${r.carrier}|${r.program}|${r.routing}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, 6)
    .map(({ _sortMiles, ...row }) => row);

  return {
    query,
    options,
    source: "Seats.Aero engine (real charts/availability/scoring ported from products/seats-aero; USD->CAD at boundary)",
  };
}
