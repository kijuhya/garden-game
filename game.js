/**
 * Cozy Garden Market — crates storage, readable stalls, clean pixels
 */

const SEASONS = {
  spring: { name: "SPRING", length: 8 },
  summer: { name: "SUMMER", length: 8 },
  fall: { name: "FALL", length: 8 },
  winter: { name: "WINTER", length: 6 },
};
const SEASON_ORDER = ["spring", "summer", "fall", "winter"];

/** crateCap: max produce units per crate; seeds always max 20 */
const CROPS = {
  radish: { id: "radish", name: "Radish", cost: 2, baseSell: 5, seedSell: 1.5, growDays: 2, desc: "Small. Crowds OK.", seasons: ["spring", "fall"], idealCount: 6, canOpen: true, seedYield: [1, 2], crateCap: 16, openNote: "Open for seeds." },
  lettuce: { id: "lettuce", name: "Lettuce", cost: 3, baseSell: 7, seedSell: 2, growDays: 3, desc: "Needs space.", seasons: ["spring", "fall"], idealCount: 4, canOpen: true, seedYield: [1, 2], crateCap: 12, openNote: "Bolt for seed." },
  carrot: { id: "carrot", name: "Carrot", cost: 4, baseSell: 10, seedSell: 2.5, growDays: 3, desc: "Roots need room.", seasons: ["spring", "fall"], idealCount: 5, canOpen: true, seedYield: [1, 3], crateCap: 14, openNote: "Save seed." },
  cabbage: { id: "cabbage", name: "Cabbage", cost: 5, baseSell: 12, seedSell: 2.5, growDays: 4, desc: "Hardy cool crop.", seasons: ["fall", "winter", "spring"], idealCount: 3, canOpen: true, seedYield: [1, 2], crateCap: 8, openNote: "Seed pods." },
  tomato: { id: "tomato", name: "Tomato", cost: 6, baseSell: 14, seedSell: 3.5, growDays: 4, desc: "Heat lover.", seasons: ["summer"], idealCount: 3, canOpen: true, seedYield: [2, 4], crateCap: 10, openNote: "Scoop seeds." },
  strawberry: { id: "strawberry", name: "Strawberry", cost: 8, baseSell: 18, seedSell: 4, growDays: 4, desc: "Sweet berries.", seasons: ["spring", "summer"], idealCount: 4, canOpen: true, seedYield: [1, 3], crateCap: 12, openNote: "Mash for seeds." },
  sunflower: { id: "sunflower", name: "Sunflower", cost: 10, baseSell: 24, seedSell: 5, growDays: 5, desc: "Wants space.", seasons: ["summer"], idealCount: 2, canOpen: true, seedYield: [3, 6], crateCap: 6, openNote: "Seed head." },
  pumpkin: { id: "pumpkin", name: "Pumpkin", cost: 15, baseSell: 36, seedSell: 6, growDays: 6, desc: "1 per plot best.", seasons: ["fall", "summer"], idealCount: 1, canOpen: true, seedYield: [4, 8], crateCap: 4, openNote: "Many seeds." },
};

/** Fish sold at market (kind: "fish", cropId = fish id) */
/**
 * size: icon size. spamGain: progress per key press. spamDrain: progress lost per frame.
 * Harder fish = lower gain + higher drain → must spam faster.
 */
const FISHES = {
  minnow: { id: "minnow", name: "Minnow", baseSell: 4, crateCap: 16, rarity: 1, size: 1.0, spamGain: 0.11, spamDrain: 0.0022, seasons: ["spring", "summer", "fall", "winter"] },
  perch: { id: "perch", name: "Perch", baseSell: 8, crateCap: 12, rarity: 2, size: 1.3, spamGain: 0.09, spamDrain: 0.0030, seasons: ["spring", "summer", "fall"] },
  bass: { id: "bass", name: "Bass", baseSell: 14, crateCap: 10, rarity: 3, size: 1.7, spamGain: 0.075, spamDrain: 0.0038, seasons: ["spring", "summer", "fall"] },
  trout: { id: "trout", name: "Trout", baseSell: 18, crateCap: 8, rarity: 3, size: 1.8, spamGain: 0.068, spamDrain: 0.0042, seasons: ["spring", "fall", "winter"] },
  catfish: { id: "catfish", name: "Catfish", baseSell: 16, crateCap: 8, rarity: 3, size: 1.9, spamGain: 0.07, spamDrain: 0.0040, seasons: ["summer", "fall"] },
  salmon: { id: "salmon", name: "Salmon", baseSell: 28, crateCap: 6, rarity: 4, size: 2.4, spamGain: 0.055, spamDrain: 0.0055, seasons: ["fall", "winter"] },
  goldfish: { id: "goldfish", name: "Goldfish", baseSell: 40, crateCap: 4, rarity: 5, size: 1.15, spamGain: 0.048, spamDrain: 0.0062, seasons: ["spring", "summer"] },
};

const SEED_CRATE_MAX = 20;
const FISH_CRATE_MAX = 12;
const CRATE_COUNT = 8;
const PLANTER_COSTS = [0, 15, 30, 50, 75];
const MAX_PLANTERS = 5;
const FERT_COST = 4;
const FERT_AMT = 22;
const ROD_COST = 25;

const WEATHER = {
  sunny: { label: "SUN", name: "SUNNY", moistureDelta: -12, growth: 1 },
  cloudy: { label: "CLD", name: "CLOUDY", moistureDelta: -8, growth: 0.95 },
  rain: { label: "RAIN", name: "RAINY", moistureDelta: 18, growth: 1.15 },
  storm: { label: "STRM", name: "STORMY", moistureDelta: 28, growth: 0.75 },
  wind: { label: "WIND", name: "WINDY", moistureDelta: -14, growth: 0.6 },
  drought: { label: "DRY", name: "DRY", moistureDelta: -22, growth: 0.5 },
  heatwave: { label: "HEAT", name: "HOT", moistureDelta: -20, growth: 0.65 },
  frost: { label: "FRST", name: "FROSTY", moistureDelta: -6, growth: 0.45 },
  perfect: { label: "PERF", name: "PERFECT", moistureDelta: 4, growth: 1.35 },
};
const SEASON_WEATHER = {
  spring: { sunny: 2, cloudy: 2, rain: 3, storm: 1, wind: 1, drought: 0.2, heatwave: 0, frost: 0.3, perfect: 1 },
  summer: { sunny: 3, cloudy: 1, rain: 1, storm: 1, wind: 1, drought: 2, heatwave: 2, frost: 0, perfect: 1 },
  fall: { sunny: 2, cloudy: 2, rain: 2, storm: 1, wind: 2, drought: 0.5, heatwave: 0, frost: 1, perfect: 1 },
  winter: { sunny: 1, cloudy: 3, rain: 1, storm: 0.5, wind: 2, drought: 0, heatwave: 0, frost: 3, perfect: 0.4 },
};

const MOIST_BAD_LOW = 20, MOIST_BAD_HIGH = 82, MOIST_DIE_LOW = 6, MOIST_DIE_HIGH = 96;
const FERT_BAD_LOW = 16, FERT_BAD_HIGH = 82, FERT_DIE_LOW = 4, FERT_DIE_HIGH = 96;
const MOIST_GOOD_LO = 28, MOIST_GOOD_HI = 72, FERT_GOOD_LO = 25, FERT_GOOD_HI = 70;
const QUALITY_NAMES = ["poor", "fair", "good", "excellent"];
const QUALITY_RANK = { poor: 0, fair: 1, good: 2, excellent: 3 };

const SHOPS = [
  { id: "n0", name: "Pete's Produce", row: "north", slot: 0, colorI: 0, skinI: 1, hairI: 0, shirtI: 1 },
  { id: "n1", name: "Green Valley", row: "north", slot: 1, colorI: 2, skinI: 0, hairI: 2, shirtI: 2 },
  { id: "n2", name: "Berry & Root", row: "north", slot: 2, colorI: 3, skinI: 2, hairI: 4, shirtI: 0 },
  { id: "n3", name: "Sunrise Greens", row: "north", slot: 3, colorI: 1, skinI: 0, hairI: 5, shirtI: 4 },
  { id: "s0", name: "Harvest House", row: "south", slot: 0, colorI: 4, skinI: 3, hairI: 1, shirtI: 3 },
  { id: "s1", name: "Your Stall", row: "south", slot: 1, colorI: 2, player: true, skinI: 0, hairI: 0, shirtI: 2 },
  { id: "s2", name: "Oak & Vine", row: "south", slot: 2, colorI: 0, skinI: 1, hairI: 3, shirtI: 5 },
  { id: "s3", name: "Little Cart Co.", row: "south", slot: 3, colorI: 3, skinI: 4, hairI: 2, shirtI: 1 },
];

const CUSTOMER_QUESTIONS = [
  {
    text: (ctx) => `How's the quality on this ${ctx.crop.name}?`,
    answers: [
      { text: (ctx) => ctx.kind === "fish"
        ? (ctx.quality === "excellent" ? "Just reeled it in — great fight." : ctx.quality === "poor" ? "Honestly, a scrappy little catch." : "Fresh from the lake.")
        : (ctx.quality === "excellent" ? "Grown with room — really nice." : ctx.quality === "poor" ? "Honestly, the bed was crowded." : "Solid harvest."),
        scores: { honesty: 2, enthusiasm: 1, knowledge: 1, deal: 0, rudeness: 0 } },
      { text: "Best in town!", scores: { honesty: -2, enthusiasm: 2, knowledge: 0, deal: 0, rudeness: 0 } },
      { text: "Food is food.", scores: { honesty: 0, enthusiasm: -1, knowledge: 0, deal: 0, rudeness: 1 } },
      { text: "Buy or don't.", scores: { honesty: 0, enthusiasm: 0, knowledge: 0, deal: 0, rudeness: 3 } },
    ],
  },
  {
    text: (ctx) => `$${ctx.price.toFixed(2)}? ${ctx.rivalLine}`,
    answers: [
      { text: "Fair for the quality.", scores: { honesty: 2, enthusiasm: 0, knowledge: 1, deal: 0, rudeness: 0 } },
      { text: (ctx) => `I'll do $${(ctx.price * 0.9).toFixed(2)}.`, scores: { honesty: 1, enthusiasm: 1, knowledge: 0, deal: 3, rudeness: 0 }, priceMod: 0.9 },
      { text: "Quality costs.", scores: { honesty: 0, enthusiasm: 1, knowledge: 0, deal: -1, rudeness: 0 } },
      { text: "Take it or leave it.", scores: { honesty: 0, enthusiasm: -1, knowledge: 0, deal: 0, rudeness: 2 } },
    ],
  },
  {
    text: (ctx) => ctx.kind === "fish" ? "You catch these yourself?" : "You grow these yourself?",
    answers: [
      { text: (ctx) => ctx.kind === "fish" ? "Hooked them at the lake." : "Every one from my farm.", scores: { honesty: 2, enthusiasm: 2, knowledge: 0, deal: 0, rudeness: 0 } },
      { text: (ctx) => ctx.kind === "fish" ? "Still learning the shoreline." : "Still learning my plots.", scores: { honesty: 3, enthusiasm: 1, knowledge: 0, deal: 0, rudeness: 0 } },
      { text: (ctx) => ctx.kind === "fish" ? "Nah, wholesale from a trawler." : "Huge industrial farm.", scores: { honesty: -3, enthusiasm: 0, knowledge: 0, deal: 0, rudeness: 0 } },
    ],
  },
];

const TRAITS_POOL = [
  { honesty: 1.2, enthusiasm: 0.9, knowledge: 1, deal: 0.8, price: 0.9, quality: 1.1 },
  { honesty: 1.3, enthusiasm: 0.7, knowledge: 1.4, deal: 0.5, price: 0.7, quality: 1.6 },
  { honesty: 1, enthusiasm: 1.2, knowledge: 1.1, deal: 1, price: 1.2, quality: 0.9 },
  { honesty: 1.1, enthusiasm: 0.8, knowledge: 0.9, deal: 1.4, price: 1.5, quality: 0.8 },
  { honesty: 1.4, enthusiasm: 0.6, knowledge: 1.5, deal: 0.5, price: 0.6, quality: 1.3 },
];

const STORAGE_KEY = "cozy-garden-v6";

// ─── Crates ────────────────────────────────────────────────────────────────

function emptyCrate() {
  return { kind: null, cropId: null, quality: null, count: 0 };
}
function emptyCrates() {
  return Array.from({ length: CRATE_COUNT }, emptyCrate);
}
function productKey(kind, cropId, quality) {
  if (kind === "seed") return `seed:${cropId}`;
  if (kind === "fish") return `fish:${cropId}:${quality || "good"}`;
  return `produce:${cropId}:${quality}`;
}
function crateKey(c) {
  if (!c.kind) return null;
  return productKey(c.kind, c.cropId, c.quality);
}
function productDef(kind, id) {
  if (kind === "fish") return FISHES[id] || null;
  return CROPS[id] || null;
}
function productDefFromCrate(c) {
  if (!c?.kind) return null;
  return productDef(c.kind, c.cropId);
}
function crateMax(c) {
  if (!c.kind) return 0;
  if (c.kind === "seed") return SEED_CRATE_MAX;
  if (c.kind === "fish") return FISHES[c.cropId]?.crateCap || FISH_CRATE_MAX;
  return CROPS[c.cropId]?.crateCap || 8;
}
function crateMatches(c, kind, cropId, quality) {
  if (!c.kind) return false;
  if (c.kind !== kind || c.cropId !== cropId) return false;
  if ((kind === "produce" || kind === "fish") && c.quality !== quality) return false;
  return true;
}
function crateSpace(c) {
  if (!c.kind) return 0;
  return crateMax(c) - c.count;
}

/** Add units to crates (same product only per crate). Returns leftover. */
function addToCrates(kind, cropId, quality, amount) {
  let left = amount;
  // fill matching crates first
  for (const c of state.crates) {
    if (left <= 0) break;
    if (crateMatches(c, kind, cropId, quality) && crateSpace(c) > 0) {
      const add = Math.min(left, crateSpace(c));
      c.count += add;
      left -= add;
    }
  }
  // empty crates
  for (const c of state.crates) {
    if (left <= 0) break;
    if (!c.kind) {
      c.kind = kind;
      c.cropId = cropId;
      c.quality = (kind === "produce" || kind === "fish") ? quality : null;
      const max = crateMax(c);
      const add = Math.min(left, max);
      c.count = add;
      left -= add;
    }
  }
  return left;
}

function removeFromCrates(kind, cropId, quality, amount) {
  let need = amount;
  for (const c of state.crates) {
    if (need <= 0) break;
    if (crateMatches(c, kind, cropId, quality)) {
      const take = Math.min(need, c.count);
      c.count -= take;
      need -= take;
      if (c.count <= 0) Object.assign(c, emptyCrate());
    }
  }
  return need === 0;
}

function countProduct(kind, cropId, quality = null) {
  let n = 0;
  for (const c of state.crates) {
    if (crateMatches(c, kind, cropId, quality)) n += c.count;
  }
  return n;
}

function totalSeeds(cropId) {
  return countProduct("seed", cropId);
}

function allSeedCounts() {
  const m = {};
  for (const c of state.crates) {
    if (c.kind === "seed" && c.count > 0) m[c.cropId] = (m[c.cropId] || 0) + c.count;
  }
  return m;
}

function filledCrates() {
  return state.crates.map((c, i) => ({ ...c, index: i })).filter((c) => c.kind && c.count > 0);
}

/** Crates currently loaded onto the player's market stall */
function stallCrates() {
  return (state.stallCrateIndices || [])
    .map((i) => ({ ...state.crates[i], index: i }))
    .filter((c) => c.kind && c.count > 0);
}

function isOnStall(crateIndex) {
  return (state.stallCrateIndices || []).includes(crateIndex);
}

function toggleStallCrate(crateIndex) {
  const c = state.crates[crateIndex];
  if (!c?.kind || c.count <= 0) return;
  const list = state.stallCrateIndices || [];
  const idx = list.indexOf(crateIndex);
  if (idx >= 0) {
    list.splice(idx, 1);
    toast(`${crateSignText(c)} removed from stall`);
  } else {
    list.push(crateIndex);
    toast(`${crateSignText(c)} added to stall`);
  }
  state.stallCrateIndices = list;
  saveState();
}

/**
 * Move 1 unit out of a crate (e.g. keep it off the stall).
 * Groups with the same product in one other crate — never one-item-per-crate.
 */
function splitOneFromCrate(fromIndex) {
  const from = state.crates[fromIndex];
  if (!from?.kind || from.count <= 0) return false;
  // 1) Prefer existing matching crate with room (group leftovers together)
  let dest = -1;
  for (let i = 0; i < state.crates.length; i++) {
    if (i === fromIndex) continue;
    const d = state.crates[i];
    if (crateMatches(d, from.kind, from.cropId, from.quality) && crateSpace(d) > 0) {
      dest = i;
      break;
    }
  }
  // 2) Else one empty crate (only if no matching group exists)
  if (dest < 0) {
    for (let i = 0; i < state.crates.length; i++) {
      if (i === fromIndex) continue;
      if (!state.crates[i].kind) { dest = i; break; }
    }
  }
  if (dest < 0) {
    toast("No free crate for that item.", "bad");
    return false;
  }
  const kind = from.kind;
  const cropId = from.cropId;
  const quality = from.quality;
  from.count -= 1;
  if (from.count <= 0) {
    Object.assign(from, emptyCrate());
    state.stallCrateIndices = (state.stallCrateIndices || []).filter((i) => i !== fromIndex);
  }
  const to = state.crates[dest];
  if (!to.kind) {
    to.kind = kind;
    to.cropId = cropId;
    to.quality = quality;
    to.count = 1;
  } else {
    to.count += 1;
  }
  saveState();
  toast(`1 kept in crate ${dest + 1}`);
  return true;
}

/** Hit-test which item index was clicked inside a crate canvas (same layout as drawPixelCrate). */
function crateCanvasItemIndex(canvas, clientX, clientY, count) {
  if (!count) return -1;
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  const mx = (clientX - rect.left) * sx;
  const my = (clientY - rect.top) * sy;
  const w = canvas.width;
  const h = canvas.height;
  const inX = 9, inY = 12, inW = w - 18, inH = h - 20;
  if (mx < inX || my < inY || mx > inX + inW || my > inY + inH) return -1;
  const iw = 8, gap = 1;
  const cols = Math.max(1, Math.floor((inW - 2) / (iw + gap)));
  const rows = Math.max(1, Math.floor((inH - 2) / (iw + gap)));
  const maxItems = Math.min(count, cols * rows);
  const padX = inX + 1 + Math.floor(((inW - 2) - cols * (iw + gap) + gap) / 2);
  const padY = inY + 1;
  for (let i = 0; i < maxItems; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ix = padX + col * (iw + gap);
    const iy = padY + row * (iw + gap);
    if (mx >= ix && mx < ix + iw && my >= iy && my < iy + iw) return i;
  }
  return -1;
}

function crateItemsList(c) {
  if (!c?.kind || !c.count) return [];
  return Array.from({ length: c.count }, () => ({
    seed: c.kind === "seed",
    fish: c.kind === "fish",
    cropId: c.cropId,
  }));
}

function crateSignText(c) {
  if (!c?.kind) return "Empty";
  const def = productDefFromCrate(c);
  if (!def) return "???";
  if (c.kind === "seed") return `${def.name} seeds ×${c.count}`;
  if (c.kind === "fish") return `${def.name} (${c.quality}) ×${c.count}`;
  return `${def.name} (${c.quality}) ×${c.count}`;
}

// ─── State ─────────────────────────────────────────────────────────────────

function emptyCells() { return Array(9).fill(null); }
function newPlanter(id) {
  return {
    id, cropId: null, cells: emptyCells(), growth: 0,
    moisture: 45, fertilizer: 40, careScore: 0.5, careSamples: 1,
    stressDays: 0, notice: null,
  };
}
function defaultState() {
  return {
    money: 10, day: 1, season: "spring", dayInSeason: 1, weather: "sunny",
    planters: [newPlanter(1)],
    crates: emptyCrates(),
    fertilizer: 0,
    askPrices: {},
    shopStock: {},
    totalSold: 0,
    location: "map",
    selectedSeed: null,
    marketPos: { x: 200, y: 120 },
    lakePos: { x: 120, y: 88 }, // on the shore band
    hasRod: false,
    history: ["map"],
    stallCrateIndices: [],
    forecast: [], // next 4 weather ids (upcoming days)
    browseOnly: false,
  };
}

/** Brief UI flash state for water/fert buttons */
let planterBtnFlash = {}; // id -> { water?: true, fert?: true }
let buyQty = 1;

let state = loadState();
let zoomStall = null;
let selectedCrateIdx = null;
let priceEditCrate = null;
let marketActors = [];
let dialogue = null;
let animFrame = 0;
let loopId = null;
let townHitAreas = [];
let marketHitAreas = [];

/** Lake fishing runtime (not persisted mid-cast) */
let fishing = {
  mode: "idle", // idle | charging | casting | waiting | bite | reeling | caught | failed
  castTimer: 0,
  waitTimer: 0,
  biteTimer: 0,
  bobX: 0,
  bobY: 0,
  fishId: null,
  progress: 0.35, // spam meter 0..1
  castPower: 0,   // 0..1 hold to cast farther
  hold: false,
  vibe: 0,
  catchQuality: "good",
  spamCount: 0,
  spamTimer: 0,
  blockCast: false,
};
let lakeKeys = { up: false, down: false, left: false, right: false };
let lakeWalkFrame = 0;
let lakeMoving = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s = { ...defaultState(), ...JSON.parse(raw) };
    s.planters = (s.planters || []).map((p, i) => ({
      ...newPlanter(p.id || i + 1), ...p,
      cells: p.cells?.length === 9 ? p.cells : emptyCells(),
    }));
    if (!s.crates || s.crates.length !== CRATE_COUNT) s.crates = emptyCrates();
    if (!s.history) s.history = ["map"];
    if (!Array.isArray(s.stallCrateIndices)) s.stallCrateIndices = [];
    // drop stall refs to empty crates
    s.stallCrateIndices = s.stallCrateIndices.filter(
      (i) => s.crates[i] && s.crates[i].kind && s.crates[i].count > 0
    );
    if (!Array.isArray(s.forecast) || s.forecast.length < 4) s.forecast = [];
    // migrate onto shore band map
    if (!s.lakePos || s.lakePos.x > 250 || s.lakePos.y > 118 || s.lakePos.y < 55) {
      s.lakePos = { x: 120, y: 88 };
    }
    if (s.hasRod == null) s.hasRod = false;
    return s;
  } catch { return defaultState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function toast(msg, type = "good") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.getElementById("toasts").appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function centerNotice(msg, opts = {}) {
  const wrap = document.getElementById("center-notice");
  const box = document.getElementById("center-notice-text");
  if (!wrap || !box) return;
  box.textContent = msg;
  box.className = "center-notice-box" + (opts.day ? " day" : "") + (opts.buy ? " buy" : "");
  wrap.classList.toggle("dim", !!opts.dim || !!opts.day);
  wrap.classList.remove("hidden");
  // force reflow so fade-in always plays
  void wrap.offsetWidth;
  wrap.classList.add("show");
  clearTimeout(centerNotice._t);
  clearTimeout(centerNotice._t2);
  const hold = opts.ms || 1800;
  centerNotice._t = setTimeout(() => {
    wrap.classList.remove("show");
    centerNotice._t2 = setTimeout(() => wrap.classList.add("hidden"), 280);
  }, hold);
}

function flashPlanterBtn(id, kind) {
  if (!planterBtnFlash[id]) planterBtnFlash[id] = {};
  planterBtnFlash[id][kind] = true;
  renderFarm();
  setTimeout(() => {
    if (planterBtnFlash[id]) delete planterBtnFlash[id][kind];
    if (planterBtnFlash[id] && !Object.keys(planterBtnFlash[id]).length) delete planterBtnFlash[id];
    if (state.location === "farm") renderFarm();
  }, 700);
}

function ensureForecast() {
  if (!state.forecast) state.forecast = [];
  while (state.forecast.length < 4) {
    state.forecast.push(pickWeighted(SEASON_WEATHER[state.season]));
  }
}

function rollNextWeather() {
  ensureForecast();
  // Forecast is pretty accurate but not perfect (~82%)
  let next = state.forecast.shift();
  if (Math.random() > 0.82) {
    next = pickWeighted(SEASON_WEATHER[state.season]);
  }
  state.forecast.push(pickWeighted(SEASON_WEATHER[state.season]));
  return next;
}
function formatMoney(n) { return `$${Number(n).toFixed(2)}`; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function pickWeighted(w) {
  const e = Object.entries(w).filter(([, v]) => v > 0);
  let t = e.reduce((s, [, v]) => s + v, 0), r = Math.random() * t;
  for (const [k, v] of e) { r -= v; if (r <= 0) return k; }
  return e[0][0];
}
function seasonFit(crop, season) {
  if (crop.seasons.includes(season)) return "great";
  const i = SEASON_ORDER.indexOf(season);
  const adj = [SEASON_ORDER[(i + 1) % 4], SEASON_ORDER[(i + 3) % 4]];
  return crop.seasons.some((s) => adj.includes(s)) ? "ok" : "poor";
}
function seasonMult(crop) {
  const f = seasonFit(crop, state.season);
  return f === "great" ? 1.2 : f === "ok" ? 0.9 : 0.55;
}
function aliveCount(p) { return p.cells.filter((c) => c?.alive).length; }
function plantCount(p) { return p.cells.filter(Boolean).length; }
function densityQuality(crop, count) {
  if (count <= 0) return "poor";
  const ideal = crop.idealCount;
  if (count > ideal) {
    const over = count - ideal;
    if (over >= ideal * 2 || count >= ideal + 3) return "poor";
    if (over >= ideal) return "fair";
    return "good";
  }
  if (count >= Math.max(1, Math.ceil(ideal * 0.5))) return "excellent";
  return "good";
}
function careQuality(p) {
  const avg = p.careScore / Math.max(1, p.careSamples);
  if (avg >= 0.75) return "excellent";
  if (avg >= 0.55) return "good";
  if (avg >= 0.35) return "fair";
  return "poor";
}
function combineQuality(a, b) {
  return QUALITY_NAMES[Math.floor((QUALITY_RANK[a] + QUALITY_RANK[b]) / 2)];
}
function estimateQuality(p) {
  if (!p.cropId || !aliveCount(p)) return null;
  return combineQuality(densityQuality(CROPS[p.cropId], aliveCount(p)), careQuality(p));
}
function isReady(p) { return p.cropId && aliveCount(p) && p.growth >= CROPS[p.cropId].growDays; }
function moistureClass(m) {
  if (m < 25) return "m-dry";
  if (m < 70) return "m-ok";
  if (m < 88) return "m-wet";
  return "m-soaked";
}
function fairPrice(def, kind, quality) {
  if (!def) return 1;
  let base = kind === "seed" ? def.seedSell : def.baseSell;
  if ((kind === "produce" || kind === "fish") && quality) {
    base *= { excellent: 1.25, good: 1, fair: 0.75, poor: 0.45 }[quality] || 1;
  }
  return Math.round(base * 100) / 100;
}
function getAskForCrate(c) {
  if (!c.kind) return 0;
  const key = crateKey(c);
  if (state.askPrices[key] != null) return state.askPrices[key];
  return fairPrice(productDefFromCrate(c), c.kind, c.quality);
}
function setAskForCrate(c, price) {
  state.askPrices[crateKey(c)] = Math.round(clamp(price, 0.5, 200) * 100) / 100;
}

// ─── Shop stock ────────────────────────────────────────────────────────────

function restockShops() {
  const stock = {};
  for (const shop of SHOPS) {
    if (shop.player) continue;
    const items = [];
    const n = 2 + Math.floor(Math.random() * 3);
    const ids = Object.keys(CROPS);
    for (let i = 0; i < n; i++) {
      const cropId = ids[Math.floor(Math.random() * ids.length)];
      const crop = CROPS[cropId];
      const kind = Math.random() < 0.35 ? "seed" : "produce";
      const quality = kind === "produce" ? QUALITY_NAMES[1 + Math.floor(Math.random() * 3)] : null;
      const base = fairPrice(crop, kind, quality || "good");
      items.push({
        id: `${shop.id}-${i}`,
        cropId, kind, quality,
        price: Math.round(base * (0.85 + Math.random() * 0.45) * 100) / 100,
        qty: kind === "seed" ? 2 + Math.floor(Math.random() * 4) : 1 + Math.floor(Math.random() * 3),
      });
    }
    stock[shop.id] = items;
  }
  state.shopStock = stock;
}

// ─── Care / day ────────────────────────────────────────────────────────────

function killPlanter(p, msg) {
  p.cells = emptyCells();
  p.cropId = null;
  p.growth = 0;
  p.stressDays = 0;
  p.notice = { level: "warning", text: msg };
  toast(msg, "bad");
}
function evaluateCare(p) {
  if (!aliveCount(p)) { p.notice = null; return; }
  const m = p.moisture, f = p.fertilizer;
  const name = CROPS[p.cropId].name;
  if (m <= MOIST_DIE_LOW && p.stressDays >= 2) return killPlanter(p, `Plot #${p.id}: the ${name} dried out.`);
  if (m >= MOIST_DIE_HIGH && p.stressDays >= 2) return killPlanter(p, `Plot #${p.id}: the ${name} drowned.`);
  if (f <= FERT_DIE_LOW && p.stressDays >= 2) return killPlanter(p, `Plot #${p.id}: the ${name} starved.`);
  if (f >= FERT_DIE_HIGH && p.stressDays >= 2) return killPlanter(p, `Plot #${p.id}: fertilizer burn killed the ${name}.`);

  const issues = [];
  let level = "thriving";
  if (m < MOIST_BAD_LOW) { issues.push("you notice the leaves are turning yellow — too dry"); level = "unhealthy"; }
  else if (m > MOIST_BAD_HIGH) { issues.push("plants look unhealthy — bed is soggy"); level = "unhealthy"; }
  if (f < FERT_BAD_LOW) { issues.push("soil looks spent"); level = level === "thriving" ? "unhealthy" : level; }
  else if (f > FERT_BAD_HIGH) { issues.push("leaf tips look scorched — maybe too much fertilizer"); level = level === "thriving" ? "unhealthy" : level; }

  const stressed = m < MOIST_BAD_LOW || m > MOIST_BAD_HIGH || f < FERT_BAD_LOW || f > FERT_BAD_HIGH;
  if (stressed) {
    p.stressDays = (p.stressDays || 0) + 1;
    if (m <= MOIST_DIE_LOW + 4 || m >= MOIST_DIE_HIGH - 4 || f <= FERT_DIE_LOW + 4 || f >= FERT_DIE_HIGH - 4) level = "warning";
    p.notice = { level, text: `Plot #${p.id}: ${issues.join(". ")}.` };
    p.careScore += level === "warning" ? 0.1 : 0.3;
  } else if (m >= MOIST_GOOD_LO && m <= MOIST_GOOD_HI && f >= FERT_GOOD_LO && f <= FERT_GOOD_HI) {
    p.stressDays = 0;
    p.notice = { level: "thriving", text: `Plot #${p.id}: your ${name} are thriving!` };
    p.careScore += 1;
  } else {
    p.stressDays = Math.max(0, (p.stressDays || 0) - 1);
    p.notice = { level: "thriving", text: `Plot #${p.id}: your ${name} look healthy enough.` };
    p.careScore += 0.7;
  }
  p.careSamples += 1;
}

function advanceDay() {
  const w = WEATHER[state.weather];
  for (const p of state.planters) {
    p.moisture = clamp(p.moisture + w.moistureDelta, 0, 100);
    if (aliveCount(p) > 0) {
      p.fertilizer = clamp(p.fertilizer - (4 + aliveCount(p) * 0.8), 0, 100);
      if (!isReady(p)) {
        const crop = CROPS[p.cropId];
        let g = w.growth * seasonMult(crop);
        if (p.moisture < MOIST_BAD_LOW || p.moisture > MOIST_BAD_HIGH) g *= 0.55;
        if (p.fertilizer < FERT_BAD_LOW || p.fertilizer > FERT_BAD_HIGH) g *= 0.55;
        const dens = plantCount(p) / crop.idealCount;
        if (dens > 1.5) g *= 0.7;
        if (dens > 2.5) g *= 0.5;
        p.growth += g;
      }
      evaluateCare(p);
    } else p.notice = null;
  }
  state.day++;
  state.dayInSeason++;
  let newSeason = null;
  if (state.dayInSeason > SEASONS[state.season].length) {
    const i = SEASON_ORDER.indexOf(state.season);
    state.season = SEASON_ORDER[(i + 1) % 4];
    state.dayInSeason = 1;
    newSeason = state.season;
  }
  state.weather = rollNextWeather();
  restockShops();
  dialogue = null;
  saveState();
  renderAll();
  const seasonName = SEASONS[state.season].name;
  const wl = WEATHER[state.weather].name || WEATHER[state.weather].label;
  const dayMsg = `DAY ${state.day}, ${seasonName}, WEATHER: ${wl}`;
  if (newSeason) {
    // Season celebration first, then day notice
    startSeasonCelebration(newSeason, () => {
      centerNotice(dayMsg, { day: true, dim: true, ms: 1400 });
    });
  } else {
    centerNotice(dayMsg, { day: true, dim: true, ms: 1400 });
  }
}

// ─── Season celebration ────────────────────────────────────────────────────

const SEASON_LINES = {
  spring: "It's Spring!",
  summer: "It's Summer!",
  fall: "It's Fall!",
  winter: "It's Winter!",
};

let seasonFx = null; // { particles, season, life, maxBannerLife, stopSpawn, onDone, doneFired }

function startSeasonCelebration(seasonId, onDone) {
  const canvas = document.getElementById("season-fx");
  const banner = document.getElementById("season-banner");
  if (!canvas || !banner) {
    if (onDone) onDone();
    return;
  }

  const w = window.innerWidth || 800;
  const h = window.innerHeight || 600;
  canvas.width = w;
  canvas.height = h;
  canvas.classList.remove("hidden");

  const count = 220;
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(makeSeasonParticle(seasonId, w, h, true));
  }
  seasonFx = {
    particles,
    season: seasonId,
    life: 0,
    maxBannerLife: 165,
    stopSpawn: false,
    onDone: onDone || null,
    doneFired: false,
  };

  banner.textContent = SEASON_LINES[seasonId] || "It's a new season!";
  banner.className = `season-banner ${seasonId}`;
  banner.classList.remove("hidden");
  void banner.offsetWidth;
  banner.classList.add("show");
}

function makeSeasonParticle(season, w, h, spawnTop) {
  const x = Math.random() * w;
  const y = spawnTop ? -40 - Math.random() * h * 0.6 : Math.random() * h;
  const base = {
    x, y,
    vx: (Math.random() - 0.5) * 2,
    vy: 1.4 + Math.random() * 2.8,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2,
    size: 18 + Math.floor(Math.random() * 22), // large icons
    kind: season,
    flip: Math.random() < 0.5 ? 1 : -1,
  };
  if (season === "spring") {
    base.color = ["#f06090", "#f0c040", "#e080f0", "#70c0f0", "#ff90b0", "#90e070", "#ff70a0", "#ffa0d0"][Math.floor(Math.random() * 8)];
  } else if (season === "summer") {
    base.color = ["#f0c020", "#f0a010", "#ffe060", "#ffd040", "#ffb020"][Math.floor(Math.random() * 5)];
  } else if (season === "fall") {
    base.color = ["#e07020", "#d04030", "#e0b020", "#c05018", "#f0a030", "#e85820", "#c86810"][Math.floor(Math.random() * 7)];
    base.vx = (Math.random() - 0.5) * 3;
    base.vy = 1 + Math.random() * 2.2;
  } else {
    base.color = "#ffffff";
    base.vy = 0.9 + Math.random() * 1.8;
    base.size = 14 + Math.floor(Math.random() * 18);
  }
  return base;
}

/** Draw non-square seasonal icons (rotated leaf, flower petals, sun, snowflake) */
function drawSeasonParticle(ctx, p) {
  const s = p.size;
  const x = p.x;
  const y = p.y;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(p.rot);
  ctx.imageSmoothingEnabled = false;

  if (p.kind === "spring") {
    // flower: oval petals, not a square
    const petal = p.color;
    ctx.fillStyle = petal;
    // 5 elongated petals
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i / 5) * Math.PI * 2);
      ctx.fillRect(-Math.floor(s * 0.18), -Math.floor(s * 0.55), Math.floor(s * 0.36), Math.floor(s * 0.5));
      ctx.restore();
    }
    ctx.fillStyle = "#f0e060";
    const c = Math.floor(s * 0.22);
    ctx.fillRect(-c, -c, c * 2, c * 2);
  } else if (p.kind === "summer") {
    // round sun with rays
    ctx.fillStyle = p.color;
    const r = Math.floor(s * 0.32);
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.fillStyle = "#fff8c0";
    const r2 = Math.floor(r * 0.55);
    ctx.fillRect(-r2, -r2, r2 * 2, r2 * 2);
    ctx.fillStyle = p.color;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x0 = Math.round(Math.cos(a) * (r + 2));
      const y0 = Math.round(Math.sin(a) * (r + 2));
      const x1 = Math.round(Math.cos(a) * (r + Math.floor(s * 0.28)));
      const y1 = Math.round(Math.sin(a) * (r + Math.floor(s * 0.28)));
      // short ray segments
      ctx.fillRect(x0, y0, 3, 3);
      ctx.fillRect(Math.round((x0 + x1) / 2), Math.round((y0 + y1) / 2), 3, 3);
      ctx.fillRect(x1, y1, 2, 2);
    }
  } else if (p.kind === "fall") {
    // leaf shape: pointed tip, wider base, stem — not a square
    ctx.scale(p.flip, 1);
    const w = Math.floor(s * 0.55);
    const h = Math.floor(s * 0.85);
    ctx.fillStyle = p.color;
    // stacked tapering rows for leaf silhouette
    for (let row = 0; row < h; row++) {
      const t = row / h;
      // wide in middle, pointed at tip and stem
      let half = t < 0.55
        ? Math.floor((t / 0.55) * (w / 2))
        : Math.floor(((1 - t) / 0.45) * (w / 2));
      half = Math.max(1, half);
      ctx.fillRect(-half, row - Math.floor(h * 0.5), half * 2, 1);
    }
    // stem
    ctx.fillStyle = "#6b4423";
    ctx.fillRect(-1, Math.floor(h * 0.35), 2, Math.floor(h * 0.25));
    // subtle vein
    ctx.fillStyle = shade(p.color, -25);
    ctx.fillRect(0, -Math.floor(h * 0.35), 1, Math.floor(h * 0.55));
  } else {
    // Soft snowflake: soft center + rounded arms (not sharp)
    const arm = Math.floor(s * 0.38);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    // soft center blob
    ctx.fillRect(-3, -3, 6, 6);
    ctx.fillRect(-2, -4, 4, 8);
    ctx.fillRect(-4, -2, 8, 4);
    // rounded arm tips
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + p.rot * 0.2;
      const px = Math.round(Math.cos(a) * arm);
      const py = Math.round(Math.sin(a) * arm);
      ctx.fillRect(px - 1, py - 1, 3, 3);
      ctx.fillRect(Math.round(px * 0.55) - 1, Math.round(py * 0.55) - 1, 2, 2);
    }
  }
  ctx.restore();
}

function tickSeasonFx() {
  if (!seasonFx) return;
  const canvas = document.getElementById("season-fx");
  const banner = document.getElementById("season-banner");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  seasonFx.life++;

  // Hide season message on schedule; fire day notice — particles keep falling
  if (!seasonFx.doneFired && seasonFx.life >= seasonFx.maxBannerLife) {
    seasonFx.doneFired = true;
    seasonFx.stopSpawn = true;
    if (banner) {
      banner.classList.remove("show");
      setTimeout(() => banner.classList.add("hidden"), 300);
    }
    const done = seasonFx.onDone;
    seasonFx.onDone = null;
    if (done) done();
  }

  // Update particles; after stopSpawn, don't respawn — just let them fall off
  const next = [];
  for (const p of seasonFx.particles) {
    p.x += p.vx + Math.sin(seasonFx.life * 0.05 + p.y * 0.01) * 0.5;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > h + 50) {
      if (!seasonFx.stopSpawn) {
        Object.assign(p, makeSeasonParticle(seasonFx.season, w, h, true));
        p.y = -20;
        next.push(p);
      }
      // else drop particle (falls away)
    } else {
      next.push(p);
      drawSeasonParticle(ctx, p);
    }
  }
  seasonFx.particles = next;

  // Clean up once banner done and all icons have fallen off
  if (seasonFx.stopSpawn && seasonFx.particles.length === 0) {
    seasonFx = null;
    canvas.classList.add("hidden");
  }
}

// ─── Ambient weather (rain / snow / storm / heat) ──────────────────────────

let weatherFx = null;
// { type, particles, density 0-1, targetDensity, pendingType, flash, bolts }

function weatherTypeForState() {
  const w = state.weather;
  if (w === "rain") return "rain";
  if (w === "storm") return "storm";
  if (w === "frost") return "snow";
  if (w === "heatwave") return "heat";
  return null;
}

function makeWeatherParticle(type, W, H, fromTop) {
  return {
    x: Math.random() * W,
    y: fromTop ? -10 - Math.random() * 40 : Math.random() * H,
    vy: type === "snow" ? 0.6 + Math.random() * 0.8 : 3.2 + Math.random() * 2.5,
    vx: type === "snow" ? (Math.random() - 0.5) * 0.8 : -0.4 + Math.random() * 0.3,
    size: type === "snow" ? 2 + Math.random() * 2.5 : 3 + Math.random() * 2,
  };
}

function createWeatherFx(type, density = 0) {
  const W = window.innerWidth || 800;
  const H = window.innerHeight || 600;
  const fullCount = type === "storm" ? 110 : type === "rain" ? 100 : type === "snow" ? 32 : 0;
  const particles = [];
  for (let i = 0; i < fullCount; i++) {
    particles.push(makeWeatherParticle(type, W, H, density < 0.5));
  }
  return { type, particles, density, targetDensity: 1, pendingType: null, flash: 0, bolts: [] };
}

function syncWeatherBodyClass(type, density) {
  document.body.classList.remove("weather-rain", "weather-storm", "weather-heat");
  if (!type || density < 0.08) return;
  if (type === "rain") document.body.classList.add("weather-rain");
  if (type === "storm") document.body.classList.add("weather-storm");
  if (type === "heat") document.body.classList.add("weather-heat");
}

function ensureWeatherFx() {
  const desired = weatherTypeForState();

  // Heat: no particles, just outer bg tint
  if (desired === "heat") {
    if (!weatherFx || weatherFx.type !== "heat") {
      // fade out any rain first
      if (weatherFx && weatherFx.type !== "heat" && weatherFx.density > 0.05) {
        weatherFx.targetDensity = 0;
        weatherFx.pendingType = "heat";
      } else {
        weatherFx = { type: "heat", particles: [], density: 1, targetDensity: 1, pendingType: null, flash: 0, bolts: [] };
      }
    } else {
      weatherFx.targetDensity = 1;
    }
    return;
  }

  if (!desired) {
    if (weatherFx) weatherFx.targetDensity = 0;
    return;
  }

  if (!weatherFx || (weatherFx.type === "heat" && desired !== "heat")) {
    weatherFx = createWeatherFx(desired, 0);
    weatherFx.targetDensity = 1;
    return;
  }

  if (weatherFx.type === desired) {
    weatherFx.targetDensity = 1;
    weatherFx.pendingType = null;
    return;
  }

  // Type change: fade out, then fade in new type
  if (weatherFx.density > 0.12) {
    weatherFx.targetDensity = 0;
    weatherFx.pendingType = desired;
  } else {
    weatherFx = createWeatherFx(desired, 0);
    weatherFx.targetDensity = 1;
  }
}

function drawTeardrop(ctx, x, y, size, color) {
  const s = Math.max(3, Math.round(size));
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  ctx.fillRect(Math.round(x - 1), Math.round(y + 1), 3, 1);
  for (let row = 2; row < s; row++) {
    const t = row / s;
    const half = Math.max(1, Math.floor(1 + t * (s * 0.45)));
    ctx.fillRect(Math.round(x - half), Math.round(y + row), half * 2 + 1, 1);
  }
  const bh = Math.floor(s * 0.35);
  ctx.fillRect(Math.round(x - bh), Math.round(y + s - 1), bh * 2 + 1, 2);
}

function drawSoftSnow(ctx, x, y, size) {
  const s = Math.max(2, Math.round(size));
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  // soft blob, not a hard square cross
  ctx.fillRect(Math.round(x), Math.round(y), s, s);
  ctx.fillRect(Math.round(x - 1), Math.round(y + 1), s + 2, Math.max(1, s - 1));
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(Math.round(x - 1), Math.round(y), s + 2, s + 1);
}

function tickWeatherFx() {
  ensureWeatherFx();
  const canvas = document.getElementById("weather-fx");
  if (!canvas) return;

  if (!weatherFx) {
    canvas.classList.add("hidden");
    syncWeatherBodyClass(null, 0);
    return;
  }

  // Smooth density ramp in / out
  const stepIn = 0.01;
  const stepOut = 0.012;
  if (weatherFx.density < weatherFx.targetDensity) {
    weatherFx.density = Math.min(weatherFx.targetDensity, weatherFx.density + stepIn);
  } else if (weatherFx.density > weatherFx.targetDensity) {
    weatherFx.density = Math.max(weatherFx.targetDensity, weatherFx.density - stepOut);
  }

  // Finished fading out — switch type or clear
  if (weatherFx.density <= 0.02 && weatherFx.targetDensity === 0) {
    if (weatherFx.pendingType === "heat") {
      weatherFx = { type: "heat", particles: [], density: 0, targetDensity: 1, pendingType: null, flash: 0, bolts: [] };
    } else if (weatherFx.pendingType) {
      weatherFx = createWeatherFx(weatherFx.pendingType, 0);
      weatherFx.targetDensity = 1;
    } else if (weatherTypeForState() === null) {
      weatherFx = null;
      canvas.classList.add("hidden");
      syncWeatherBodyClass(null, 0);
      return;
    }
  }

  if (!weatherFx) return;
  syncWeatherBodyClass(weatherFx.type, weatherFx.density);

  canvas.classList.remove("hidden");
  const W = window.innerWidth || 800;
  const H = window.innerHeight || 600;
  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  // Heat: soft red haze only (outer bg class handles page tint)
  if (weatherFx.type === "heat") {
    const a = 0.06 * weatherFx.density;
    ctx.fillStyle = `rgba(220, 100, 70, ${a})`;
    ctx.fillRect(0, 0, W, H);
    return;
  }

  // Storm lightning
  if (weatherFx.type === "storm") {
    if (weatherFx.flash > 0) {
      ctx.fillStyle = `rgba(230,235,255,${0.18 * weatherFx.flash * weatherFx.density})`;
      ctx.fillRect(0, 0, W, H);
      weatherFx.flash -= 0.07;
    } else if (Math.random() < 0.012 * weatherFx.density) {
      weatherFx.flash = 1;
      weatherFx.bolts = [];
      const n = 1 + Math.floor(Math.random() * 2);
      for (let b = 0; b < n; b++) {
        const segs = [];
        let bx = 30 + Math.random() * (W - 60);
        let by = 0;
        segs.push({ x: bx, y: by });
        while (by < H) {
          bx += (Math.random() - 0.5) * 40;
          by += 25 + Math.random() * 40;
          segs.push({ x: bx, y: Math.min(by, H) });
        }
        weatherFx.bolts.push(segs);
      }
    }
    if (weatherFx.flash > 0.3 && weatherFx.bolts) {
      ctx.strokeStyle = `rgba(255,255,210,${0.7 * weatherFx.flash})`;
      ctx.lineWidth = 2;
      for (const segs of weatherFx.bolts) {
        ctx.beginPath();
        segs.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }
    }
  }

  // Active particle count grows/shrinks with density (gradual start/stop)
  const active = Math.floor(weatherFx.particles.length * weatherFx.density);
  const dropColor = weatherFx.type === "storm"
    ? "rgba(150,170,200,0.55)"
    : "rgba(120,155,200,0.5)";

  for (let i = 0; i < weatherFx.particles.length; i++) {
    const p = weatherFx.particles[i];
    const isActive = i < active;
    if (isActive) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > H + 10) {
        // Only respawn while density is ramping up or steady
        if (weatherFx.targetDensity > 0.05) {
          p.y = -10;
          p.x = Math.random() * W;
        } else {
          p.y = H + 20; // park off-screen while fading out
        }
      }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      if (p.y <= H + 5) {
        if (weatherFx.type === "snow") drawSoftSnow(ctx, p.x, p.y, p.size);
        else drawTeardrop(ctx, p.x, p.y, p.size, dropColor);
      }
    } else if (weatherFx.targetDensity > weatherFx.density && Math.random() < 0.08) {
      // When ramping up, park inactive particles at top ready to enter
      p.y = -10 - Math.random() * 30;
      p.x = Math.random() * W;
    }
  }
}

// ─── Farm ──────────────────────────────────────────────────────────────────

function selectSeed(id) {
  state.selectedSeed = id;
  saveState();
  renderSeedTray();
}
function plantInCell(planter, cellIndex) {
  if (planter.cells[cellIndex]) return;
  const seedId = state.selectedSeed;
  if (!seedId || totalSeeds(seedId) <= 0) return toast("Pick a seed first.", "bad");
  if (planter.cropId && planter.cropId !== seedId) return toast("One crop type per planter.", "bad");
  if (isReady(planter)) return toast("Harvest first.", "bad");
  if (!removeFromCrates("seed", seedId, null, 1)) return toast("No seeds.", "bad");
  planter.cropId = seedId;
  planter.cells[cellIndex] = { alive: true };
  if (plantCount(planter) === 1) {
    planter.growth = 0;
    planter.careScore = 0.5;
    planter.careSamples = 1;
    planter.stressDays = 0;
    planter.notice = null;
  }
  saveState();
  renderFarm();
  renderStats();
  toast(`Planted ${CROPS[seedId].name}`);
}
function waterPlanter(id) {
  const p = state.planters.find((x) => x.id === id);
  if (!p) return;
  p.moisture = clamp(p.moisture + 18 + Math.random() * 6, 0, 100);
  saveState();
  flashPlanterBtn(id, "water");
  toast(`Plot #${id} watered`);
}
function fertPlanter(id) {
  const p = state.planters.find((x) => x.id === id);
  if (!p) return;
  if (state.fertilizer <= 0) return toast("No fertilizer left.", "bad");
  state.fertilizer--;
  p.fertilizer = clamp(p.fertilizer + FERT_AMT, 0, 100);
  saveState();
  renderStats();
  flashPlanterBtn(id, "fert");
  toast(`Plot #${id} fertilized`);
}
function harvestPlanter(id) {
  const p = state.planters.find((x) => x.id === id);
  if (!p || !isReady(p)) return;
  const crop = CROPS[p.cropId];
  const count = aliveCount(p);
  const quality = estimateQuality(p);
  const body = document.getElementById("modal-body");
  document.getElementById("modal-title").textContent = `HARVEST ${crop.name.toUpperCase()}`;
  const [ymin, ymax] = crop.seedYield;
  body.innerHTML = `
    <p class="muted">${count} plant(s) · <span class="quality-tag ${quality}">${quality}</span></p>
    <button class="choice-card" data-c="whole"><div><strong>Keep produce</strong><span>Store in crates. No seeds.</span></div></button>
    <button class="choice-card" data-c="open"><div><strong>Open for seeds</strong><span>${crop.openNote} ~${ymin * count}–${ymax * count} seeds.</span></div></button>`;
  body.querySelectorAll("[data-c]").forEach((btn) => {
    btn.onclick = () => { closeModal(); finishHarvest(p, btn.dataset.c, count, quality); };
  });
  document.getElementById("modal-overlay").classList.remove("hidden");
}
function finishHarvest(p, mode, count, quality) {
  const crop = CROPS[p.cropId];
  const seedId = p.cropId;
  if (mode === "open") {
    const [ymin, ymax] = crop.seedYield;
    let got = 0;
    for (let i = 0; i < count; i++) got += ymin + Math.floor(Math.random() * (ymax - ymin + 1));
    if (quality === "fair") got = Math.max(1, Math.floor(got * 0.7));
    if (quality === "poor") got = Math.max(1, Math.floor(got * 0.4));
    const left = addToCrates("seed", seedId, null, got);
    if (left > 0) toast(`Storage full — ${got - left} seeds saved, ${left} lost`, "bad");
    else toast(`Opened → ${got} seeds`);
  } else {
    const left = addToCrates("produce", seedId, quality, count);
    if (left > 0) toast(`Storage full — ${count - left} stored, ${left} lost`, "bad");
    else toast(`Harvested ${count}× ${quality} ${crop.name}`);
  }
  p.cells = emptyCells();
  p.cropId = null;
  p.growth = 0;
  p.stressDays = 0;
  p.notice = null;
  saveState();
  renderAll();
}
function openProduceFromCrate(crateIndex) {
  const c = state.crates[crateIndex];
  if (!c || c.kind !== "produce" || c.count <= 0) return;
  const crop = CROPS[c.cropId];
  const [ymin, ymax] = crop.seedYield;
  let got = ymin + Math.floor(Math.random() * (ymax - ymin + 1));
  if (c.quality === "poor") got = Math.max(1, Math.floor(got * 0.4));
  if (c.quality === "fair") got = Math.max(1, Math.floor(got * 0.7));
  removeFromCrates("produce", c.cropId, c.quality, 1);
  const left = addToCrates("seed", crop.id, null, got);
  if (left) toast(`Opened → ${got - left} seeds (storage full)`, "bad");
  else toast(`Opened → ${got} seeds`);
  saveState();
  renderAll();
}

function buySeed(id, qty = 1) {
  const c = CROPS[id];
  qty = Math.max(1, Math.min(99, qty | 0));
  const total = c.cost * qty;
  if (state.money < total) return toast("Not enough money.", "bad");
  const left = addToCrates("seed", id, null, qty);
  const bought = qty - left;
  if (bought <= 0) return toast("No crate space for seeds.", "bad");
  state.money -= c.cost * bought;
  saveState();
  renderAll();
  centerNotice(`x${bought} ${c.name} seed purchased  ✓`, { buy: true, ms: 1500 });
  if (left) toast(`Only ${bought} fit in storage.`, "bad");
}
function buyFert(qty = 1) {
  qty = Math.max(1, Math.min(99, qty | 0));
  if (state.money < FERT_COST * qty) return toast("Not enough money.", "bad");
  state.money -= FERT_COST * qty;
  state.fertilizer += qty;
  saveState();
  renderAll();
  centerNotice(`x${qty} Fertilizer purchased  ✓`, { buy: true, ms: 1500 });
}
function buyPlanter() {
  const n = state.planters.length;
  if (n >= MAX_PLANTERS) return toast("Max planters.", "bad");
  const cost = PLANTER_COSTS[n];
  if (state.money < cost) return toast("Not enough money.", "bad");
  state.money -= cost;
  state.planters.push(newPlanter(n + 1));
  saveState();
  renderAll();
  centerNotice(`x1 Planter #${n + 1} purchased  ✓`, { buy: true, ms: 1500 });
}

// ─── Market actors ─────────────────────────────────────────────────────────

function shopWorldPos(shop) {
  // Closer together, larger stalls
  const spacing = 100;
  const baseX = 8 + shop.slot * spacing;
  const y = shop.row === "north" ? 8 : 148;
  return { x: baseX, y, w: 96, h: 78 };
}
function laneY() { return 112; }

function spawnActor() {
  const fromLeft = Math.random() < 0.5;
  return {
    id: Math.random().toString(36).slice(2),
    x: fromLeft ? 2 : 390,
    y: laneY() + (Math.random() * 14 - 7),
    dir: fromLeft ? 2 : 1,
    skinI: Math.floor(Math.random() * 5),
    hairI: Math.floor(Math.random() * 6),
    shirtI: Math.floor(Math.random() * 6),
    pantsI: Math.floor(Math.random() * 4),
    frame: 0,
    state: "walk",
    targetShop: null,
    browseTimer: 0,
    traits: TRAITS_POOL[Math.floor(Math.random() * TRAITS_POOL.length)],
    name: ["Alex", "Sam", "Jordan", "Riley", "Casey", "Quinn", "Morgan", "Avery"][Math.floor(Math.random() * 8)],
  };
}
function ensureActors() {
  while (marketActors.filter((a) => a.state !== "gone").length < 8) marketActors.push(spawnActor());
}
function tickActors() {
  ensureActors();
  for (const a of marketActors) {
    if (a.state === "gone") continue;
    a.frame++;
    if (a.state === "walk") {
      a.x += a.dir === 2 ? 0.65 : -0.65;
      if (Math.random() < 0.008) {
        a.targetShop = SHOPS[Math.floor(Math.random() * SHOPS.length)].id;
        a.state = "browse";
      }
      if (a.x < -12 || a.x > 410) a.state = "gone";
    } else if (a.state === "browse") {
      const shop = SHOPS.find((s) => s.id === a.targetShop);
      if (!shop) { a.state = "walk"; continue; }
      const pos = shopWorldPos(shop);
      const tx = pos.x + 36;
      const ty = shop.row === "north" ? pos.y + 55 : pos.y - 2;
      const dx = tx - a.x, dy = ty - a.y;
      if (Math.abs(dx) > 1) { a.x += Math.sign(dx) * 0.7; a.dir = dx > 0 ? 2 : 1; }
      else if (Math.abs(dy) > 1) { a.y += Math.sign(dy) * 0.5; a.dir = dy > 0 ? 0 : 3; }
      else {
        a.state = "at_stall";
        a.browseTimer = 100 + Math.floor(Math.random() * 100);
        a.dir = shop.row === "north" ? 3 : 0;
        if (shop.player && zoomStall === "s1" && !dialogue) tryCustomer(a);
      }
    } else if (a.state === "at_stall") {
      a.browseTimer--;
      if (a.browseTimer <= 0) {
        if (Math.random() < 0.3 && a.targetShop === "s1" && zoomStall === "s1" && !dialogue) {
          tryCustomer(a);
          a.browseTimer = 50;
        } else {
          a.state = "walk";
          a.dir = Math.random() < 0.5 ? 1 : 2;
          a.y = laneY() + (Math.random() * 8 - 4);
          a.targetShop = null;
        }
      }
    }
  }
  marketActors = marketActors.filter((a) => a.state !== "gone");
}

function tryCustomer(actor) {
  const goods = stallCrates();
  if (!goods.length) return;
  const g = goods[Math.floor(Math.random() * goods.length)];
  const crop = productDefFromCrate(g);
  if (!crop) return;
  const price = getAskForCrate(g);
  const fair = fairPrice(crop, g.kind, g.quality);
  const ratio = price / Math.max(0.01, fair);
  let auto = 0.15;
  if (g.kind === "produce" || g.kind === "fish") {
    auto += { excellent: 0.35, good: 0.2, fair: 0.05, poor: -0.1 }[g.quality] || 0;
  }
  if (ratio <= 0.95) auto += 0.2;
  if (ratio > 1.3) auto -= 0.25;
  if (Math.random() < auto && Math.random() < 0.55) {
    completeSale(g, price, actor, true);
    return;
  }
  if (Math.random() < 0.4) return;
  startDialogue(actor, g);
}

function releaseActor(actor) {
  if (!actor) return;
  actor.state = "walk";
  actor.targetShop = null;
  actor.browseTimer = 0;
  actor.y = laneY() + (Math.random() * 8 - 4);
  actor.dir = Math.random() < 0.5 ? 1 : 2;
}

function completeSale(crateLike, price, actor, silent) {
  if (!removeFromCrates(crateLike.kind, crateLike.cropId, crateLike.quality, 1)) return false;
  // clean stall list if crate emptied
  state.stallCrateIndices = (state.stallCrateIndices || []).filter(
    (i) => state.crates[i] && state.crates[i].count > 0
  );
  state.money += price;
  state.totalSold++;
  saveState();
  renderStats();
  // Don't rebuild stall DOM mid-frame in a way that can stall the loop —
  // schedule a light refresh next tick
  if (zoomStall === "s1") {
    requestAnimationFrame(() => {
      try { if (zoomStall === "s1") renderStallZoom(); } catch (_) { /* keep loop alive */ }
    });
  }
  if (state.location === "prep") renderPrep();
  releaseActor(actor);
  const name = actor?.name || "Someone";
  const label = productDefFromCrate(crateLike)?.name || "goods";
  if (silent) toast(`${name} bought ${label} for ${formatMoney(price)}`);
  else toast(`Sold for ${formatMoney(price)}`);
  return true;
}

function startDialogue(actor, good) {
  const crop = productDefFromCrate(good);
  if (!crop) return;
  const price = getAskForCrate(good);
  const rivalPrices = [];
  for (const sid of Object.keys(state.shopStock || {})) {
    for (const it of state.shopStock[sid]) {
      if (it.cropId === good.cropId && it.kind === good.kind) rivalPrices.push(it.price);
    }
  }
  const rival = rivalPrices.length ? Math.min(...rivalPrices) : null;
  let rivalLine = "Looks fresh.";
  if (rival != null) {
    if (price > rival * 1.15) rivalLine = `I saw similar near $${rival.toFixed(2)}.`;
    else if (price < rival * 0.9) rivalLine = `Better than $${rival.toFixed(2)} elsewhere.`;
  }
  const ctx = { crop, kind: good.kind, quality: good.quality, price, rivalLine, good };
  dialogue = {
    actor, ctx,
    questions: [...CUSTOMER_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 2),
    qi: 0, score: 0, priceMod: 1, finished: false,
  };
  // Only update dialogue UI — never call removed renderStallScene (that froze the market)
  try { renderDialogueDock(); } catch (_) { /* ignore */ }
}

function answerDialogue(ai) {
  if (!dialogue || dialogue.finished) return;
  const a = dialogue.questions[dialogue.qi].answers[ai];
  const t = dialogue.actor.traits;
  const s = a.scores;
  dialogue.score += s.honesty * t.honesty + s.enthusiasm * t.enthusiasm + s.knowledge * t.knowledge + s.deal * t.deal - s.rudeness * 2.5;
  if (a.priceMod) dialogue.priceMod = a.priceMod;
  dialogue.qi++;
  if (dialogue.qi >= dialogue.questions.length) finishDialogue();
  else renderDialogueDock();
}

function finishDialogue() {
  dialogue.finished = true;
  const { actor, ctx, score, priceMod } = dialogue;
  const good = ctx.good;
  const fair = fairPrice(ctx.crop, ctx.kind, ctx.quality);
  const ratio = ctx.price / fair;
  let priceScore = ratio <= 0.9 ? 2 : ratio <= 1.1 ? 1 : ratio <= 1.35 ? -1 : -3;
  let qualScore = 0;
  if (ctx.kind === "produce" || ctx.kind === "fish") {
    qualScore = ({ excellent: 3, good: 1, fair: -1, poor: -3 }[ctx.quality] || 0) * actor.traits.quality;
  }
  let chance = clamp(0.4 + score * 0.07 + priceScore * 0.08 * actor.traits.price + qualScore * 0.05, 0.05, 0.95);
  const finalPrice = Math.round(ctx.price * priceMod * 100) / 100;
  if (Math.random() < chance) {
    completeSale(good, finalPrice, actor, false);
    document.getElementById("dialogue-text").textContent = "I'll take it — thanks!";
  } else {
    document.getElementById("dialogue-text").textContent =
      ctx.quality === "poor" ? "These look a bit sad. I'll pass." :
      priceScore < 0 ? "A bit steep for me." : "Maybe another time.";
    toast("No sale.", "bad");
  }
  document.getElementById("dialogue-choices").innerHTML = `<button class="btn pixel primary small" id="dlg-ok">OK</button>`;
  document.getElementById("dlg-ok").onclick = () => {
    dialogue = null;
    releaseActor(actor);
    document.getElementById("dialogue-dock")?.classList.add("hidden");
    requestAnimationFrame(() => {
      try { if (zoomStall) renderStallZoom(); } catch (_) { /* keep loop alive */ }
    });
  };
}

function buyFromStall(shopId, itemId, qty = 1) {
  const items = state.shopStock[shopId] || [];
  const it = items.find((x) => x.id === itemId);
  if (!it || it.qty <= 0) return toast("Sold out.", "bad");
  qty = Math.max(1, Math.min(qty | 0, it.qty));
  const total = Math.round(it.price * qty * 100) / 100;
  if (state.money < total) return toast("Not enough money.", "bad");
  const left = addToCrates(it.kind, it.cropId, it.quality, qty);
  const bought = qty - left;
  if (bought <= 0) return toast("No crate space.", "bad");
  const cost = Math.round(it.price * bought * 100) / 100;
  state.money -= cost;
  it.qty -= bought;
  if (it.qty <= 0) state.shopStock[shopId] = items.filter((x) => x.id !== it.id);
  saveState();
  renderStats();
  renderStallZoom();
  const name = CROPS[it.cropId].name + (it.kind === "seed" ? " seed" : "");
  centerNotice(`x${bought} ${name} purchased  ✓`, { buy: true, ms: 1600 });
  if (left > 0) toast(`Only ${bought} fit in storage.`, "bad");
}

// ─── Navigation ────────────────────────────────────────────────────────────

const LOC_NAMES = {
  map: "TOWN", farm: "FARM", shop: "SEED STORE", market: "MARKET",
  storage: "STORAGE", prep: "SET UP STALL", lake: "LAKE",
};

function goTo(loc, push = true) {
  // Market building always opens stall prep first
  if (loc === "market" && push) loc = "prep";
  // Rainy / storm days: market cannot open
  if ((loc === "prep" || loc === "market") && isMarketClosedWeather()) {
    toast("Market is closed in this weather.", "bad");
    centerNotice("MARKET CLOSED — TOO WET", { buy: true, ms: 2000 });
    return;
  }

  if (push && state.location !== loc) {
    state.history = state.history || [];
    state.history.push(state.location);
    if (state.history.length > 12) state.history.shift();
  }
  // leave fishing mid-cast when navigating away
  if (state.location === "lake" && loc !== "lake") resetFishing();
  state.location = loc;
  zoomStall = null;
  dialogue = null;
  selectedCrateIdx = null;
  document.getElementById("stall-zoom")?.classList.add("hidden");
  document.getElementById("stall-umbrella-canvas")?.classList.add("hidden");
  hidePricePop();
  saveState();
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${loc}`)?.classList.add("active");
  document.getElementById("location-name").textContent = LOC_NAMES[loc] || loc;
  updateBackBtn();
  if (loc === "market") ensureActors();
  if (loc === "lake") {
    lakeDecor = null;
    lakeTerrainCanvas = null;
    lakeTerrainSeason = null;
    lakeRipples = [];
    if (!state.lakePos || state.lakePos.x > LAKE.worldW - 12 || state.lakePos.y > LAKE.worldH - 12 || state.lakePos.y < 50) {
      state.lakePos = { x: 120, y: 88 };
    }
    resetFishing();
    updateFishCastButton();
  }
  renderAll();
}

function isMarketClosedWeather() {
  return state.weather === "rain" || state.weather === "storm";
}

function openMarketFloor(requireStall = true) {
  if (isMarketClosedWeather()) {
    toast("Market is closed in this weather.", "bad");
    centerNotice("MARKET CLOSED — TOO WET", { day: true, dim: false, ms: 2000 });
    return;
  }
  if (requireStall && !stallCrates().length) {
    toast("Put at least one crate on your stall first.", "bad");
    return;
  }
  if (!requireStall) {
    state.stallCrateIndices = [];
    state.browseOnly = true;
  } else {
    state.browseOnly = false;
  }
  // go to market floor without re-routing to prep
  if (state.location !== "market") {
    state.history = state.history || [];
    state.history.push(state.location);
  }
  state.location = "market";
  saveState();
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById("view-market").classList.add("active");
  document.getElementById("location-name").textContent = "MARKET";
  updateBackBtn();
  ensureActors();
  renderAll();
  if (state.browseOnly) toast("Browsing only — not selling today.");
  else toast("Market is open!");
}
function goBack() {
  closeStallZoom();
  const prev = (state.history || []).pop() || "map";
  goTo(prev, false);
}
function updateBackBtn() {
  const btn = document.getElementById("btn-back");
  if (zoomStall) {
    btn.classList.remove("hidden");
    btn.onclick = () => closeStallZoom();
  } else {
    btn.classList.toggle("hidden", state.location === "map");
    btn.onclick = () => goBack();
  }
}
function openStall(shopId) {
  zoomStall = shopId;
  selectedCrateIdx = null;
  buyQty = 1;
  dialogue = null;
  document.getElementById("stall-zoom").classList.remove("hidden");
  const umb = document.getElementById("stall-umbrella-canvas");
  if (umb) umb.classList.remove("hidden");
  updateBackBtn();
  renderStallZoom();
  drawStallUmbrella();
}
function closeStallZoom() {
  zoomStall = null;
  dialogue = null;
  hidePricePop();
  document.getElementById("stall-zoom").classList.add("hidden");
  const umb = document.getElementById("stall-umbrella-canvas");
  if (umb) umb.classList.add("hidden");
  updateBackBtn();
  if (state.location === "market") drawMarket();
}

/** Colored umbrella + two wooden poles (no light caps; poles meet crate box) */
function drawStallUmbrella() {
  const canvas = document.getElementById("stall-umbrella-canvas");
  if (!canvas || !zoomStall) return;
  const shop = SHOPS.find((s) => s.id === zoomStall);
  if (!shop) return;
  const ctx = pxCtx(canvas);
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cloth = PX.cloth[shop.colorI % PX.cloth.length];
  const leftX = 70;
  const rightX = W - 76;
  const topY = 14;
  // poles run to bottom edge so they meet the brown crate box + beam feet
  const poleTop = topY + 16;
  const poleH = H - poleTop;
  prect(ctx, leftX, poleTop, 8, poleH, PX.woodDark);
  prect(ctx, leftX + 2, poleTop, 3, poleH, PX.wood);
  prect(ctx, rightX, poleTop, 8, poleH, PX.woodDark);
  prect(ctx, rightX + 2, poleTop, 3, poleH, PX.wood);

  // colored umbrella only — no light-brown connector pieces
  const awX = leftX - 10;
  const awW = rightX - leftX + 28;
  prect(ctx, awX, topY + 6, awW, 28, cloth);
  prect(ctx, awX + 4, topY + 2, awW - 8, 8, shade(cloth, 25));
  for (let x = awX + 6; x < awX + awW - 6; x += 14) {
    prect(ctx, x, topY + 12, 8, 22, shade(cloth, -28));
  }
  for (let x = awX + 4; x < awX + awW - 4; x += 10) {
    prect(ctx, x, topY + 32, 7, 5, shade(cloth, -10));
  }
  // dark wood only where poles meet canopy
  prect(ctx, leftX, topY + 14, 8, 8, PX.woodDark);
  prect(ctx, rightX, topY + 14, 8, 8, PX.woodDark);

  // Sign painted on the umbrella fabric (not hanging under it)
  const closed = shop.player && (state.browseOnly || !stallCrates().length);
  const label = shop.player ? (closed ? "Closed" : "Your Stall") : shop.name;
  ctx.font = "12px sans-serif";
  const tw = Math.min(awW - 24, ctx.measureText(label).width + 14);
  const lx = Math.floor(awX + (awW - tw) / 2);
  const ly = topY + 12;
  prect(ctx, lx, ly, tw, 14, "#fffef8");
  prect(ctx, lx, ly, tw, 2, "#2c3a2e");
  prect(ctx, lx, ly + 12, tw, 2, "#2c3a2e");
  ctx.fillStyle = "#2c3a2e";
  ctx.fillText(label, lx + 7, ly + 10);
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

// ─── Town canvas ───────────────────────────────────────────────────────────

function drawTown() {
  const canvas = document.getElementById("town-canvas");
  if (!canvas) return;
  const ctx = pxCtx(canvas);
  const W = canvas.width, H = canvas.height;
  const season = state.season || "spring";
  const pal = seasonPalette(season);
  fillGrass(ctx, W, H, season);

  drawCurvedPath(ctx, [[16, 90], [50, 85], [90, 80], [130, 82], [170, 78], [210, 85]], 2, season);
  drawCurvedPath(ctx, [[60, 30], [70, 55], [90, 80], [95, 120], [88, 155]], 2, season);
  drawCurvedPath(ctx, [[90, 80], [120, 110], [145, 140], [155, 160]], 2, season);
  drawCurvedPath(ctx, [[130, 82], [160, 60], [185, 45]], 2, season);

  // Skip trees that sit behind the Shop label (always hard to read with foliage behind)
  const trees = [[10, 20], [30, 15], [12, 130], [25, 150], [210, 140], [225, 155], [50, 160], [180, 20]];
  // keep far-right trees but not the ones covering Shop (was 200,18 / 220,30)
  trees.forEach(([x, y], i) => drawTree(ctx, x, y, i + 1, season));
  [[45, 70], [100, 65], [160, 70], [70, 120], [140, 125]].forEach(([x, y], i) => drawShrub(ctx, x, y, i + 3, season));

  // pond (no snow bar on top — just water); clickable → lake
  prect(ctx, 185, 140, 40, 28, pal.water);
  prect(ctx, 190, 145, 30, 18, pal.waterDeep);
  // soft highlight, not a roof-like snow strip
  pset(ctx, 195, 148, shade(pal.water, 30));
  pset(ctx, 210, 152, shade(pal.water, 30));

  townHitAreas = [];
  drawBuilding(ctx, 40, 35, 34, 30, PX.roof[3], season);
  prect(ctx, 38, 64, 38, 14, "#8b6230");
  prect(ctx, 40, 66, 10, 10, "#a67c52");
  prect(ctx, 52, 66, 10, 10, "#a67c52");
  prect(ctx, 64, 66, 10, 10, "#a67c52");
  townHitAreas.push({ id: "farm", x: 36, y: 32, w: 44, h: 50 });

  drawBuilding(ctx, 170, 32, 36, 32, PX.roof[1], season);
  townHitAreas.push({ id: "shop", x: 166, y: 30, w: 44, h: 48 });

  drawBuilding(ctx, 120, 125, 40, 34, PX.roof[2], season);
  drawShopBooth(ctx, 110, 145, 0, 0.55, season);
  drawShopBooth(ctx, 145, 145, 2, 0.55, season);
  townHitAreas.push({ id: "market", x: 108, y: 120, w: 60, h: 50 });

  // Lake water hitbox — no label (user clicks the water)
  townHitAreas.push({ id: "lake", x: 182, y: 136, w: 48, h: 36 });

  // Plain labels — no white highlight boxes
  ctx.imageSmoothingEnabled = false;
  ctx.font = "10px sans-serif";
  ctx.fillStyle = season === "winter" ? "#1a2430" : "#1e2a20";
  ctx.fillText("Farm", 50, 32);
  ctx.fillText("Shop", 180, 30);
  ctx.fillText("Market", 130, 122);
}

function onTownClick(ev) {
  const canvas = document.getElementById("town-canvas");
  const rect = canvas.getBoundingClientRect();
  const x = (ev.clientX - rect.left) * (canvas.width / rect.width);
  const y = (ev.clientY - rect.top) * (canvas.height / rect.height);
  for (const h of townHitAreas) {
    if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
      goTo(h.id);
      return;
    }
  }
}

// ─── Lake / Fishing (Stardew-like shore, fine pixels) ──────────────────────

/**
 * Close shore scene — not a full loop around a lake.
 * Fine pixels, calm water + soft ripples, trees only at borders.
 */
const LAKE = {
  worldW: 260,
  worldH: 160,
  viewW: 140,
  viewH: 105,
  scale: 4, // 560×420 — more zoomed in, still fine pixels
  shoreBase: 58,
};

let lakeCam = { x: 0, y: 0 };
let lakeSplashes = [];
let lakeRipples = []; // soft expanding rings (calm water)
let lakeDecor = null;
let lakeTerrainCanvas = null;
let lakeTerrainSeason = null;

function shoreYAt(wx) {
  return LAKE.shoreBase
    + Math.sin(wx * 0.04) * 4
    + Math.sin(wx * 0.09) * 2
    + Math.sin(wx * 0.018) * 3;
}

function lakeInWater(wx, wy) {
  return wy < shoreYAt(wx) - 1;
}

function lakeSolidBlocks(wx, wy) {
  const decor = ensureLakeDecor();
  for (const t of decor.trees) {
    if (wx >= t.x + 9 && wx <= t.x + 16 && wy >= t.y + 30 && wy <= t.y + 50) return true;
  }
  for (const b of decor.bushes) {
    if (wx >= b.x + 1 && wx <= b.x + 10 && wy >= b.y + 2 && wy <= b.y + 9) return true;
  }
  return false;
}

function lakeWalkable(wx, wy) {
  // full grass south of shore — no invisible mid-map wall
  if (wx < 6 || wx > LAKE.worldW - 8 || wy < 4 || wy > LAKE.worldH - 8) return false;
  if (lakeInWater(wx, wy)) return false;
  if (lakeSolidBlocks(wx, wy)) return false;
  return true;
}

function nearShoreForCast() {
  const p = state.lakePos;
  const edge = shoreYAt(p.x + 8);
  return p.y + 24 > edge && p.y + 8 < edge + 32;
}

function lakeCamera() {
  const p = state.lakePos;
  lakeCam.x = clamp(p.x + 8 - LAKE.viewW / 2, 0, Math.max(0, LAKE.worldW - LAKE.viewW));
  lakeCam.y = clamp(p.y + 12 - LAKE.viewH / 2, 0, Math.max(0, LAKE.worldH - LAKE.viewH));
  return lakeCam;
}

function ensureLakeDecor() {
  if (lakeDecor) return lakeDecor;
  const trees = [];
  const bushes = [];
  const rocks = [];
  const flowers = [];
  const lilies = [];
  const under = []; // rocks / weeds visible under water

  // trees ONLY at left / right / far-south borders
  const treeSpots = [
    [4, 70], [2, 100], [8, 125],
    [230, 75], [238, 105], [232, 130],
    [40, 135], [90, 138], [150, 136], [200, 138],
  ];
  treeSpots.forEach(([x, y], i) => {
    if (!lakeInWater(x + 12, y + 40)) trees.push({ x, y, seed: i + 2 });
  });

  // bushes — solid, collidable (not mid-path clutter)
  const bushSpots = [
    [30, 95], [55, 108], [100, 100], [130, 112], [170, 98], [200, 110],
    [45, 120], [160, 122], [210, 90],
  ];
  bushSpots.forEach(([x, y], i) => {
    if (!lakeInWater(x, y)) bushes.push({ x, y, seed: i + 5 });
  });

  // shore rocks
  for (let i = 0; i < 14; i++) {
    const x = 16 + (i * 17) % (LAKE.worldW - 24);
    const edge = shoreYAt(x);
    rocks.push({ x, y: edge + 1 + (i % 2), w: 2 + (i % 2), h: 2 });
  }

  // flowers on grass
  for (let i = 0; i < 55; i++) {
    const x = 12 + (i * 19) % (LAKE.worldW - 20);
    const y = 70 + (i * 11) % 50;
    if (lakeInWater(x, y)) continue;
    flowers.push({ x, y });
  }

  // lily pads
  for (let i = 0; i < 10; i++) {
    const x = 30 + (i * 21) % 200;
    const y = 18 + (i * 9) % 32;
    if (lakeInWater(x, y)) lilies.push({ x, y, seed: i + 1 });
  }

  // underwater detail (pebbles, dark weeds) — drawn under water tint
  for (let i = 0; i < 28; i++) {
    const x = 20 + (i * 29) % (LAKE.worldW - 30);
    const edge = shoreYAt(x);
    const y = 12 + (i * 7) % Math.max(8, edge - 18);
    if (y < edge - 4) under.push({ x, y, kind: i % 3, seed: i });
  }

  lakeDecor = { trees, bushes, rocks, flowers, lilies, under };
  return lakeDecor;
}

function withdrawPole() {
  if (!["casting", "waiting", "charging"].includes(fishing.mode)) return false;
  fishing.blockCast = true;
  toast("Pole pulled in.");
  resetFishing();
  return true;
}

function resetFishing() {
  fishing.mode = "idle";
  fishing.castTimer = 0;
  fishing.waitTimer = 0;
  fishing.biteTimer = 0;
  fishing.fishId = null;
  fishing.vibe = 0;
  fishing.hold = false;
  fishing.progress = 0.35;
  fishing.castPower = 0;
  fishing.spamCount = 0;
  fishing.spamTimer = 0;
  updateSpamUI();
  updateFishCastButton();
}

function releaseCastInput() {
  // release after charging → cast
  if (fishing.mode === "charging") {
    finishChargedCast();
  }
  fishing.hold = false;
  fishing.blockCast = false;
}

function updateSpamUI() {
  const ui = document.getElementById("spam-ui");
  const fill = document.getElementById("spam-fill");
  if (!ui || !fill) return;
  if (fishing.mode === "reeling") {
    ui.classList.remove("hidden");
    fill.style.width = `${Math.round(clamp(fishing.progress, 0, 1) * 100)}%`;
    const col = fishing.progress > 0.66 ? "#5cb85c" : fishing.progress > 0.33 ? "#e0b840" : "#d06050";
    fill.style.background = col;
  } else {
    ui.classList.add("hidden");
  }
}

function updateFishCastButton() {
  const btn = document.getElementById("btn-fish-cast");
  const hint = document.getElementById("lake-hint");
  if (!btn) return;
  if (!state.hasRod) {
    btn.textContent = "NEED ROD";
    btn.disabled = true;
    if (hint) hint.textContent = "Buy a fishing rod at the Seed Store";
    return;
  }
  btn.disabled = false;
  if (fishing.mode === "idle") {
    btn.textContent = "CAST";
    if (hint) {
      hint.textContent = nearShoreForCast()
        ? "Hold CAST / Space — longer hold = farther cast"
        : "Walk to the water's edge";
    }
  } else if (fishing.mode === "charging") {
    btn.textContent = `POWER ${Math.round(fishing.castPower * 100)}%`;
    if (hint) hint.textContent = "Release to cast!";
  } else if (fishing.mode === "casting" || fishing.mode === "waiting") {
    btn.textContent = "REEL IN";
    if (hint) hint.textContent = "Waiting… Space / CAST to pull the pole back";
  } else if (fishing.mode === "bite") {
    btn.textContent = "HOOK!";
    if (hint) hint.textContent = "Fish on! Press Space / CAST!";
  } else if (fishing.mode === "reeling") {
    btn.textContent = "SPAM!";
    if (hint) hint.textContent = "Mash Space / CAST as fast as you can!";
  } else {
    btn.textContent = "CAST";
  }
}

function pickFish() {
  const season = state.season || "spring";
  const pool = Object.values(FISHES).filter((f) => f.seasons.includes(season));
  const list = pool.length ? pool : Object.values(FISHES);
  const weights = list.map((f) => 1 / Math.max(1, f.rarity));
  let t = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * t;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i].id;
  }
  return list[0].id;
}

/** Press cast: withdraw / spam / reel / start charge */
function startCast() {
  if (state.location !== "lake") return;
  if (!state.hasRod) {
    toast("You need a fishing rod from the store.", "bad");
    return;
  }
  if (fishing.blockCast) return;
  if (fishing.mode === "caught" || fishing.mode === "failed") return;
  // pull pole back while line is out (no fish fight yet)
  if (fishing.mode === "casting" || fishing.mode === "waiting") {
    withdrawPole();
    return;
  }
  if (fishing.mode === "reeling") {
    spamReelPress();
    return;
  }
  if (fishing.mode === "bite") {
    startFishMinigame();
    return;
  }
  if (fishing.mode === "charging") return;
  if (fishing.mode !== "idle") return;
  if (!nearShoreForCast()) {
    toast("Get closer to the water.", "bad");
    return;
  }
  fishing.mode = "charging";
  fishing.castPower = 0.12;
  fishing.hold = true;
  state.lakePos.dir = 3;
  updateFishCastButton();
}

/** Release after charging — bob goes farther with more power */
function finishChargedCast() {
  if (fishing.mode !== "charging") return;
  const p = state.lakePos;
  const power = clamp(fishing.castPower, 0.1, 1);
  // cast distance: short → far into the lake
  const dist = 18 + power * 70;
  const aimX = p.x + 8 + (Math.random() - 0.5) * 10;
  const edge = shoreYAt(aimX);
  fishing.bobX = clamp(aimX, 8, LAKE.worldW - 8);
  fishing.bobY = clamp(edge - dist * 0.55 - Math.random() * 8, 8, edge - 4);
  // ensure in water
  if (!lakeInWater(fishing.bobX, fishing.bobY)) {
    fishing.bobY = Math.max(6, edge - 10 - power * 30);
  }
  fishing.mode = "casting";
  fishing.castTimer = 5 + Math.floor(power * 4); // quick throw
  fishing.fishId = pickFish();
  fishing.castPower = power;
  p.dir = 3;
  updateFishCastButton();
}

function startFishMinigame() {
  fishing.mode = "reeling";
  fishing.progress = 0.32;
  fishing.hold = false;
  fishing.vibe = 0;
  fishing.spamCount = 0;
  fishing.spamTimer = 0;
  updateSpamUI();
  updateFishCastButton();
}

/** One spam press while reeling — harder fish need faster spam */
function spamReelPress() {
  if (fishing.mode !== "reeling") return;
  const fish = FISHES[fishing.fishId] || FISHES.minnow;
  fishing.progress = clamp(fishing.progress + (fish.spamGain || 0.08), 0, 1);
  fishing.spamCount = (fishing.spamCount || 0) + 1;
  fishing.vibe = 4;
  updateSpamUI();
  if (fishing.progress >= 1) finishCatch(true);
}

function finishCatch(won) {
  fishing.hold = false;
  fishing.blockCast = true;
  updateSpamUI();
  if (!won) {
    fishing.mode = "failed";
    toast("It got away…", "bad");
    setTimeout(() => { if (fishing.mode === "failed") resetFishing(); }, 500);
    updateFishCastButton();
    return;
  }
  const fish = FISHES[fishing.fishId] || FISHES.minnow;
  // quality from spam density (presses over time)
  const rate = fishing.spamCount / Math.max(1, fishing.spamTimer / 60);
  const q = rate >= 6 ? "excellent" : rate >= 4 ? "good" : rate >= 2.2 ? "fair" : "poor";
  fishing.catchQuality = q;
  const left = addToCrates("fish", fish.id, q, 1);
  if (left > 0) toast("Caught a fish but crates are full!", "bad");
  else {
    toast(`Caught ${q} ${fish.name}!`);
    centerNotice(`${fish.name}!`, { buy: true, ms: 1200 });
  }
  saveState();
  fishing.mode = "caught";
  setTimeout(() => { if (fishing.mode === "caught") resetFishing(); }, 500);
  updateFishCastButton();
}

function tickLakeFx() {
  const cam = lakeCamera();
  // rain splash rings only when raining
  for (const s of lakeSplashes) s.life++;
  lakeSplashes = lakeSplashes.filter((s) => s.life < s.max);
  const rainy = state.weather === "rain" || state.weather === "storm";
  if (rainy && Math.random() < (state.weather === "storm" ? 0.22 : 0.1)) {
    const wx = cam.x + 6 + Math.random() * (LAKE.viewW - 12);
    const wy = cam.y + 4 + Math.random() * (LAKE.viewH - 12);
    if (lakeInWater(wx, wy)) {
      lakeSplashes.push({ x: wx, y: wy, life: 0, max: 10 + Math.floor(Math.random() * 6) });
    }
  }
  // calm soft ripples (expanding rings — not random dots)
  for (const r of lakeRipples) r.life++;
  lakeRipples = lakeRipples.filter((r) => r.life < r.max);
  if (lakeRipples.length < 4 && Math.random() < 0.018) {
    const wx = cam.x + 10 + Math.random() * (LAKE.viewW - 20);
    const edge = shoreYAt(wx);
    const wy = 10 + Math.random() * Math.max(6, edge - 18);
    if (lakeInWater(wx, wy)) {
      lakeRipples.push({
        x: wx,
        y: wy,
        life: 0,
        max: 70 + Math.floor(Math.random() * 40),
      });
    }
  }
}

function tickFishing() {
  if (state.location !== "lake") return;
  const f = fishing;
  tickLakeFx();

  if (f.mode === "charging") {
    // hold Space / CAST to build power — snappy charge
    if (f.hold) f.castPower = clamp(f.castPower + 0.038, 0, 1);
    updateFishCastButton();
  } else if (f.mode === "casting") {
    f.castTimer--;
    if (f.castTimer <= 0) {
      f.mode = "waiting";
      // wait for bite (still a little patience, not endless)
      f.waitTimer = 70 + Math.floor(Math.random() * 140);
      updateFishCastButton();
    }
  } else if (f.mode === "waiting") {
    f.waitTimer--;
    if (f.waitTimer <= 0) {
      f.mode = "bite";
      f.biteTimer = 200;
      f.vibe = 12;
      updateFishCastButton();
    }
  } else if (f.mode === "bite") {
    f.biteTimer--;
    f.vibe = Math.max(0, f.vibe - 0.25) + (animFrame % 6 < 3 ? 1.2 : 0);
    if (f.biteTimer <= 0) {
      toast("Too slow…", "bad");
      resetFishing();
    }
  } else if (f.mode === "reeling") {
    const fish = FISHES[f.fishId] || FISHES.minnow;
    f.spamTimer = (f.spamTimer || 0) + 1;
    f.progress -= fish.spamDrain || 0.004;
    f.progress = clamp(f.progress, 0, 1);
    f.vibe = Math.max(0, (f.vibe || 0) - 0.2);
    updateSpamUI();
    if (f.progress <= 0) finishCatch(false);
  }
}

/**
 * Calm water: smooth bands only (NO random sparkle dots).
 * Underwater pebbles/weeds baked dark under the water.
 */
function bakeLakeTerrain(season) {
  const c = document.createElement("canvas");
  c.width = LAKE.worldW;
  c.height = LAKE.worldH;
  const ctx = pxCtx(c);

  fillGrass(ctx, LAKE.worldW, LAKE.worldH, season);

  // soft Stardew-like blues
  const waterDeep = season === "winter" ? "#5a90a8" : "#3a7eb0";
  const water = season === "winter" ? "#70a8c4" : "#4a96c8";
  const waterShallow = season === "winter" ? "#88b8d0" : "#5aa8d4";
  const rim = "#9a6858";
  const sandUnder = "#7a9ab0";

  // water + rim
  for (let wx = 0; wx < LAKE.worldW; wx++) {
    const edge = shoreYAt(wx);
    for (let wy = 0; wy < edge + 2; wy++) {
      let col;
      if (wy < edge - 16) col = waterDeep;
      else if (wy < edge - 7) col = water;
      else if (wy < edge) col = waterShallow;
      else col = rim;
      pset(ctx, wx, wy, col);
    }
  }

  // underwater detail (visible through water — darker, muted)
  const decor = ensureLakeDecor();
  for (const u of decor.under || []) {
    if (u.kind === 0) {
      // pebble
      prect(ctx, u.x, u.y, 3, 2, "#4a6a7a");
      pset(ctx, u.x + 1, u.y, "#5a7a8a");
    } else if (u.kind === 1) {
      // weed
      pset(ctx, u.x, u.y, "#2a6a48");
      pset(ctx, u.x, u.y - 1, "#2a6a48");
      pset(ctx, u.x + 1, u.y - 2, "#348050");
      pset(ctx, u.x - 1, u.y - 1, "#2a6a48");
    } else {
      // sand patch
      prect(ctx, u.x, u.y, 4, 2, sandUnder);
    }
  }

  // re-tint water over under-detail so it looks "through" water
  for (const u of decor.under || []) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 3; dx++) {
        const x = u.x + dx, y = u.y + dy;
        if (x < 0 || y < 0 || x >= LAKE.worldW || y >= LAKE.worldH) continue;
        if (!lakeInWater(x, y)) continue;
        // skip — underwater already drawn darker; water color stays solid around
      }
    }
  }

  lakeTerrainCanvas = c;
  lakeTerrainSeason = season;
}

function drawLakeTerrain(ctx, cam, season) {
  if (!lakeTerrainCanvas || lakeTerrainSeason !== season) {
    bakeLakeTerrain(season);
  }
  const sx = Math.floor(cam.x);
  const sy = Math.floor(cam.y);
  ctx.drawImage(lakeTerrainCanvas, sx, sy, LAKE.viewW, LAKE.viewH, sx, sy, LAKE.viewW, LAKE.viewH);
}

/** Soft expanding ripple rings (calm lake, like the demo) */
function drawLakeRipples(ctx) {
  for (const r of lakeRipples) {
    const t = r.life / r.max;
    const rad = 1 + t * 7;
    if (t > 0.85) continue;
    // soft ellipse ring — only a few pixels, no sparkle spam
    const col = t < 0.35 ? "#a8d4e8" : "#7ab8d0";
    const cx = r.x | 0, cy = r.y | 0;
    const rx = Math.max(1, rad | 0);
    const ry = Math.max(1, (rad * 0.55) | 0);
    // draw ring outline sparsely
    for (let a = 0; a < Math.PI * 2; a += 0.45) {
      const px = (cx + Math.cos(a) * rx) | 0;
      const py = (cy + Math.sin(a) * ry) | 0;
      if (lakeInWater(px, py)) pset(ctx, px, py, col);
    }
  }
}

function drawLakeSplashes(ctx) {
  for (const s of lakeSplashes) {
    const r = 1 + Math.floor(s.life / 4);
    const col = s.life < 3 ? "#e0f0f8" : "#a0c4d8";
    pset(ctx, (s.x - r) | 0, s.y | 0, col);
    pset(ctx, (s.x + r) | 0, s.y | 0, col);
    pset(ctx, s.x | 0, (s.y - r) | 0, col);
  }
}

/** Integer Bresenham line — no anti-aliased stroke artifacts */
function drawPixelLine(ctx, x0, y0, x1, y1, col) {
  x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
  let dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    pset(ctx, x0, y0, col);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function drawLake() {
  const canvas = document.getElementById("lake-canvas");
  if (!canvas) return;
  const ctx = pxCtx(canvas);
  const scale = LAKE.scale;
  const vw = LAKE.viewW;
  const vh = LAKE.viewH;
  const needW = vw * scale;
  const needH = vh * scale;
  if (canvas.width !== needW || canvas.height !== needH) {
    canvas.width = needW;
    canvas.height = needH;
  }

  const season = state.season || "spring";
  const pal = seasonPalette(season);
  const cam = lakeCamera();
  const decor = ensureLakeDecor();

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, vw, vh);
  ctx.translate(-Math.floor(cam.x), -Math.floor(cam.y));

  // calm baked water + grass
  drawLakeTerrain(ctx, cam, season);
  drawLakeRipples(ctx);
  drawLakeSplashes(ctx);

  const pad = 28;
  const cx0 = Math.floor(cam.x);
  const cy0 = Math.floor(cam.y);

  // ground decor (always under people/trees)
  for (const lily of decor.lilies || []) {
    if (lily.x < cx0 - 4 || lily.x > cx0 + vw + 4) continue;
    drawLilyPad(ctx, lily.x, lily.y, lily.seed);
  }
  for (const r of decor.rocks) {
    if (r.x < cx0 - 4 || r.x > cx0 + vw + 4) continue;
    prect(ctx, r.x, r.y, r.w, r.h, "#8a8680");
    pset(ctx, r.x + 1, r.y, "#a8a498");
  }
  for (const f of decor.flowers) {
    if (f.x < cx0 || f.x > cx0 + vw || f.y < cy0 || f.y > cy0 + vh) continue;
    pset(ctx, f.x, f.y, "#7a50b8");
    pset(ctx, f.x, f.y + 1, "#4a8a48");
  }

  // Y-sort player with trees/bushes so things in front cover you
  const lp = state.lakePos;
  let px = lp.x | 0;
  let py = lp.y | 0;
  if (fishing.mode === "bite" || (fishing.vibe || 0) > 0) {
    px += Math.sin(animFrame * 1.3) * Math.min(1, (fishing.vibe || 0) * 0.2);
  }
  const playerFootY = py + 26;

  const depth = [];
  for (const t of decor.trees) {
    if (t.x < cx0 - pad || t.x > cx0 + vw + pad) continue;
    if (t.y < cy0 - pad || t.y > cy0 + vh + pad) continue;
    depth.push({ y: t.y + 50, kind: "tree", t });
  }
  for (const b of decor.bushes) {
    if (b.x < cx0 - 8 || b.x > cx0 + vw + 8) continue;
    if (b.y < cy0 - 8 || b.y > cy0 + vh + 8) continue;
    depth.push({ y: b.y + 9, kind: "bush", b });
  }
  depth.push({ y: playerFootY, kind: "player" });
  depth.sort((a, b) => a.y - b.y);

  for (const d of depth) {
    if (d.kind === "tree") {
      drawLakeTree(ctx, d.t.x, d.t.y, d.t.seed, season);
    } else if (d.kind === "bush") {
      drawLakeBush(ctx, d.b.x, d.b.y, d.b.seed, season);
    } else {
      // charge aim while holding
      if (fishing.mode === "charging") {
        const power = fishing.castPower;
        const dist = 18 + power * 70;
        const aimX = px + 8;
        const edge = shoreYAt(aimX);
        const ax = aimX | 0;
        const ay = clamp(edge - dist * 0.55, 6, edge - 4) | 0;
        drawPixelLine(ctx, px + 12, py + 12, ax, ay, power > 0.7 ? "#e07050" : "#c4a060");
        prect(ctx, ax - 1, ay - 1, 3, 3, "#e8c040");
        const pw = Math.floor(power * 12);
        prect(ctx, px + 2, py - 4, 12, 3, "#2a3a40");
        if (pw > 0) prect(ctx, px + 2, py - 4, pw, 3, "#e0b840");
      }
      if (["casting", "waiting", "bite", "reeling"].includes(fishing.mode)) {
        const bx = fishing.bobX | 0;
        const by = (fishing.bobY + (fishing.mode === "bite"
          ? Math.sin(animFrame * 0.65) * 1.2
          : 0)) | 0;
        drawPixelLine(ctx, px + 12, py + 12, bx, by, "#4a4038");
        prect(ctx, bx - 1, by - 1, 3, 3, "#e04040");
        pset(ctx, bx, by - 2, "#fff");
      }
      if (state.hasRod) {
        const shake = (fishing.mode === "bite" || fishing.mode === "reeling")
          ? Math.sin(animFrame * 2) * (fishing.vibe > 0 ? 1 : 0)
          : 0;
        prect(ctx, px + 13 + shake, py + 10, 2, 14, "#8b6230");
        prect(ctx, px + 14, py + 9, 1, 2, "#c49458");
      }
      drawPersonClose(ctx, px, py, {
        dir: lp.dir ?? 0,
        frame: lakeWalkFrame,
        moving: lakeMoving && (fishing.mode === "idle" || fishing.mode === "charging"),
      });
      if (fishing.mode === "bite") {
        ctx.font = "bold 8px sans-serif";
        ctx.fillStyle = "#f0d020";
        ctx.fillText("!", px + 6 + Math.sin(animFrame * 1.1), py + 1);
      }
    }
  }

  ctx.restore();
  updateFishCastButton();
  updateSpamUI();
}

function moveLakePlayer(dx, dy) {
  if (state.location !== "lake") return;
  if (["reeling", "bite", "casting", "waiting", "caught", "charging"].includes(fishing.mode)) {
    lakeMoving = false;
    return;
  }
  const p = state.lakePos;
  const spd = 1.1;
  const nx = clamp(p.x + dx * spd, 4, LAKE.worldW - 18);
  const ny = clamp(p.y + dy * spd, 4, LAKE.worldH - 30);
  let moved = false;
  if (lakeWalkable(nx + 8, ny + 25)) {
    p.x = nx;
    p.y = ny;
    moved = true;
  } else if (lakeWalkable(nx + 8, p.y + 25)) {
    p.x = nx;
    moved = true;
  } else if (lakeWalkable(p.x + 8, ny + 25)) {
    p.y = ny;
    moved = true;
  }
  lakeMoving = moved && (dx !== 0 || dy !== 0);
  if (moved && animFrame % 5 === 0) lakeWalkFrame++;
  if (dx < 0) p.dir = 1;
  else if (dx > 0) p.dir = 2;
  else if (dy < 0) p.dir = 3;
  else if (dy > 0) p.dir = 0;
  if (animFrame % 30 === 0) saveState();
}

function onLakeClick(ev) {
  if (state.location !== "lake") return;
  if (fishing.mode !== "idle") return;
  const canvas = document.getElementById("lake-canvas");
  const rect = canvas.getBoundingClientRect();
  const sx = (ev.clientX - rect.left) * (canvas.width / rect.width) / LAKE.scale;
  const sy = (ev.clientY - rect.top) * (canvas.height / rect.height) / LAKE.scale;
  const cam = lakeCamera();
  const tx = clamp(cam.x + sx - 8, 4, LAKE.worldW - 18);
  const ty = clamp(cam.y + sy - 16, 4, LAKE.worldH - 30);
  if (lakeWalkable(tx + 8, ty + 25)) {
    state.lakePos.x = tx;
    state.lakePos.y = ty;
    saveState();
  }
}

function buyFishingRod() {
  if (state.hasRod) return toast("You already own a rod.");
  if (state.money < ROD_COST) return toast("Not enough money.", "bad");
  state.money -= ROD_COST;
  state.hasRod = true;
  saveState();
  renderStats();
  centerNotice("Fishing rod purchased  ✓", { buy: true, ms: 1600 });
  renderShop();
}

// ─── Market canvas ─────────────────────────────────────────────────────────

function drawMarket() {
  const canvas = document.getElementById("market-canvas");
  if (!canvas) return;
  const ctx = pxCtx(canvas);
  const W = canvas.width, H = canvas.height;
  const season = state.season || "spring";
  const pal = seasonPalette(season);
  fillGrass(ctx, W, H, season);

  // lane — solid path, no dotted lines
  const pathCol = season === "winter" ? "#d0d4d8" : pal.path;
  const pathEdge = season === "winter" ? "#a8b0b8" : pal.pathEdge;
  prect(ctx, 0, 90, W, 46, pathCol);
  prect(ctx, 0, 90, W, 2, pathEdge);
  prect(ctx, 0, 134, W, 2, pathEdge);

  for (let i = 0; i < 10; i++) {
    drawShrub(ctx, 6 + i * 42, 2, i, season);
    drawShrub(ctx, 10 + i * 40, H - 12, i + 10, season);
  }
  drawTree(ctx, 0, 48, 1, season);
  drawTree(ctx, W - 14, 48, 2, season);
  drawTree(ctx, 0, 155, 3, season);
  drawTree(ctx, W - 14, 155, 4, season);

  marketHitAreas = [];
  ctx.font = "11px sans-serif";
  const playerClosed = state.browseOnly || !stallCrates().length;
  for (const shop of SHOPS) {
    const pos = shopWorldPos(shop);
    const closed = shop.player && playerClosed;
    drawShopBooth(ctx, pos.x + 4, pos.y + 10, shop.colorI, 1.15, season);
    // No person at your stall when you didn't set up shop
    if (!closed) {
      drawPerson(ctx, pos.x + 40, pos.y + (shop.row === "north" ? 32 : 36), {
        skinI: shop.skinI, hairI: shop.hairI, shirtI: shop.shirtI,
        dir: shop.row === "north" ? 0 : 3,
        frame: animFrame,
      });
    }
    const label = shop.player ? (closed ? "Closed" : "Your Stall") : shop.name;
    const ly = shop.row === "north" ? pos.y + 4 : pos.y + 68;
    const tw = ctx.measureText(label).width + 8;
    const lx = pos.x + Math.max(0, (pos.w - tw) / 2);
    prect(ctx, lx, ly, tw, 12, closed ? "#e8e0d0" : "#fffef8");
    ctx.fillStyle = closed ? "#6a5a4a" : "#2c3a2e";
    ctx.fillText(label, lx + 4, ly + 9);

    marketHitAreas.push({ id: shop.id, x: pos.x, y: pos.y, w: pos.w, h: pos.h });
  }

  for (const a of marketActors) {
    if (a.state === "gone") continue;
    drawPerson(ctx, Math.round(a.x), Math.round(a.y), {
      skinI: a.skinI, hairI: a.hairI, shirtI: a.shirtI, pantsI: a.pantsI,
      dir: a.dir, frame: a.frame >> 3,
    });
  }
  drawPerson(ctx, Math.round(state.marketPos.x), Math.round(state.marketPos.y), {
    skinI: 0, hairI: 0, shirtI: 2, dir: 0, frame: animFrame >> 2,
  });
}

function onMarketClick(ev) {
  const canvas = document.getElementById("market-canvas");
  const rect = canvas.getBoundingClientRect();
  const x = (ev.clientX - rect.left) * (canvas.width / rect.width);
  const y = (ev.clientY - rect.top) * (canvas.height / rect.height);
  for (const h of marketHitAreas) {
    if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
      openStall(h.id);
      return;
    }
  }
  state.marketPos.x = clamp(x - 4, 4, 385);
  state.marketPos.y = clamp(y - 7, 90, 125);
  saveState();
}
function movePlayer(dx, dy) {
  if (state.location !== "market" || zoomStall) return;
  state.marketPos.x = clamp(state.marketPos.x + dx * 3, 4, 385);
  state.marketPos.y = clamp(state.marketPos.y + dy * 2, 90, 125);
  saveState();
}

// ─── Pixel crate DOM helpers ───────────────────────────────────────────────

const CRATE_CW = 72;
const CRATE_CH = 56;

function renderCrateCard(c, opts = {}) {
  const {
    showPrice = false,
    selected = false,
    onStall = false,
    openBtn = false,
    emptySlot = false,
    label = null,
  } = opts;
  const idx = c.index ?? c._i;
  if (emptySlot || !c.kind || c.count <= 0) {
    return `<div class="px-crate" data-idx="${idx}">
      <div class="crate-sign">${label || `Crate ${idx + 1}`}</div>
      <canvas class="crate-art" width="${CRATE_CW}" height="${CRATE_CH}" data-crate-empty="1" data-idx="${idx}"></canvas>
      <div class="crate-foot">Empty</div>
    </div>`;
  }
  const crop = productDefFromCrate(c);
  const name = crop?.name || "???";
  const sign = showPrice
    ? formatMoney(getAskForCrate(c))
    : crateSignText(c);
  const cls = `px-crate${selected ? " selected" : ""}${onStall ? " on-stall" : ""}`;
  // Click pictures *inside* the crate canvas to peel off 1 unit (no extra buttons)
  return `<div class="${cls}" data-idx="${idx}" data-id="${c.id || ""}">
    <div class="crate-sign ${showPrice ? "price" : ""}" data-idx="${idx}">${sign}</div>
    <canvas class="crate-art" width="${CRATE_CW}" height="${CRATE_CH}" data-crate-draw="${idx}" data-seed="${c.kind === "seed" ? 1 : 0}" data-fish="${c.kind === "fish" ? 1 : 0}" data-crop="${c.cropId}" data-count="${c.count}" data-crate-idx="${idx}"></canvas>
    <div class="crate-foot">
      ${name}${c.kind === "seed" ? " seeds" : c.kind === "fish" ? ` fish · ${c.quality}` : c.quality ? ` · ${c.quality}` : ""} · ×${c.count}
      ${openBtn && c.kind === "produce" ? `<br/><button class="btn pixel small" data-open-crate="${idx}">OPEN 1→SEEDS</button>` : ""}
    </div>
  </div>`;
}

function paintCrateCanvases(root) {
  root.querySelectorAll("canvas[data-crate-empty]").forEach((c) => {
    drawPixelCrate(pxCtx(c), CRATE_CW, CRATE_CH, [], true);
  });
  root.querySelectorAll("canvas[data-crate-draw]").forEach((c) => {
    const cropId = c.dataset.crop;
    const seed = c.dataset.seed === "1";
    const fish = c.dataset.fish === "1";
    const count = Number(c.dataset.count) || 0;
    const items = Array.from({ length: count }, () => ({ seed, fish, cropId }));
    drawPixelCrate(pxCtx(c), CRATE_CW, CRATE_CH, items, false);
  });
}

/** Wire crate canvas: click item inside = split 1; click empty wood = whole-crate action */
function bindCrateCanvasClicks(root, onWholeCrate) {
  root.querySelectorAll("canvas[data-crate-draw]").forEach((cnv) => {
    cnv.onclick = (e) => {
      e.stopPropagation();
      const idx = Number(cnv.dataset.crateIdx);
      const count = Number(cnv.dataset.count) || 0;
      const hit = crateCanvasItemIndex(cnv, e.clientX, e.clientY, count);
      if (hit >= 0 && count > 0) {
        splitOneFromCrate(idx);
        if (state.location === "prep") renderPrep();
        else if (state.location === "storage") renderStorage();
        return;
      }
      if (onWholeCrate) onWholeCrate(idx);
    };
  });
}

// ─── Stall front view ──────────────────────────────────────────────────────

function renderStallZoom() {
  if (!zoomStall) return;
  const shop = SHOPS.find((s) => s.id === zoomStall);
  if (!shop) return;
  const row = document.getElementById("crate-row");
  const actions = document.getElementById("stall-actions");
  const dock = document.getElementById("dialogue-dock");
  const detail = document.getElementById("product-detail");

  if (shop.player) {
    const crates = stallCrates();
    row.innerHTML = crates.length
      ? crates.map((c) => renderCrateCard(c, {
          showPrice: true,
          selected: selectedCrateIdx === c.index,
        })).join("")
      : `<p class="prep-empty">Nothing on your stall.</p>`;

    row.querySelectorAll(".px-crate").forEach((el) => {
      el.onclick = (e) => {
        if (e.target.closest(".crate-sign.price")) return;
        selectedCrateIdx = Number(el.dataset.idx);
        renderStallZoom();
      };
    });
    row.querySelectorAll(".crate-sign.price").forEach((sign) => {
      sign.onclick = (e) => {
        e.stopPropagation();
        openPricePop(Number(sign.dataset.idx));
      };
    });
    paintCrateCanvases(row);
    renderProductDetail(selectedCrateIdx);

    actions.innerHTML = `<button class="btn pixel" id="stall-leave-2">LEAVE</button>`;
    document.getElementById("stall-leave-2").onclick = closeStallZoom;
    if (dialogue) renderDialogueDock();
    else dock.classList.add("hidden");
  } else {
    dock.classList.add("hidden");
    const items = state.shopStock[shop.id] || [];
    row.innerHTML = items.length
      ? items.map((it) => {
          const crop = CROPS[it.cropId];
          const sel = selectedCrateIdx === it.id ? "selected" : "";
          return `<div class="px-crate ${sel}" data-id="${it.id}">
            <div class="crate-sign price">${formatMoney(it.price)} each</div>
            <canvas class="crate-art" width="${CRATE_CW}" height="${CRATE_CH}" data-rival="${it.id}" data-crop="${it.cropId}" data-seed="${it.kind === "seed" ? 1 : 0}" data-count="${it.qty}"></canvas>
            <div class="crate-foot">${crop.name}${it.kind === "seed" ? " seeds" : it.quality ? ` · ${it.quality}` : ""} · ×${it.qty}</div>
          </div>`;
        }).join("")
      : `<p class="prep-empty">Sold out.</p>`;

    row.querySelectorAll(".px-crate").forEach((el) => {
      el.onclick = () => {
        selectedCrateIdx = el.dataset.id;
        buyQty = 1;
        renderStallZoom();
      };
    });
    row.querySelectorAll("canvas[data-rival]").forEach((c) => {
      const itemsArr = Array.from({ length: Number(c.dataset.count) || 0 }, () => ({
        seed: c.dataset.seed === "1",
        cropId: c.dataset.crop,
      }));
      drawPixelCrate(pxCtx(c), CRATE_CW, CRATE_CH, itemsArr, !itemsArr.length);
    });

    const it = items.find((x) => x.id === selectedCrateIdx);
    if (it) {
      const crop = CROPS[it.cropId];
      buyQty = clamp(buyQty, 1, it.qty);
      const total = Math.round(it.price * buyQty * 100) / 100;
      detail.classList.remove("hidden");
      detail.innerHTML = `
        <canvas width="8" height="8" id="pd-icon"></canvas>
        <div>
          <div class="pd-name">${crop.name}${it.kind === "seed" ? " Seeds" : ""}</div>
          <div class="pd-meta">${it.kind === "seed" ? "Seed bags" : `Produce · ${it.quality}`} · stock ×${it.qty} · ${formatMoney(it.price)} each</div>
        </div>
        <div class="pd-price">${formatMoney(total)}</div>`;
      const ic = document.getElementById("pd-icon");
      if (it.kind === "seed") drawSeedBag(pxCtx(ic), 0, 0, it.cropId);
      else drawCropIcon(pxCtx(ic), 0, 0, it.cropId);

      actions.innerHTML = `
        <div class="qty-row">
          <button class="btn pixel small" id="qty-down">−</button>
          <input class="qty-type" type="text" inputmode="numeric" id="buy-qty" value="${buyQty}" />
          <button class="btn pixel small" id="qty-up">+</button>
          <span class="qty-total">= ${formatMoney(total)}</span>
        </div>
        <button class="btn pixel primary small" id="act-buy">BUY x${buyQty}</button>
        <button class="btn pixel small" id="act-ask">ASK</button>
        <button class="btn pixel small" id="act-leave">LEAVE</button>`;

      document.getElementById("qty-down").onclick = () => { buyQty = Math.max(1, buyQty - 1); renderStallZoom(); };
      document.getElementById("qty-up").onclick = () => { buyQty = Math.min(it.qty, buyQty + 1); renderStallZoom(); };
      document.getElementById("buy-qty").onchange = (e) => {
        buyQty = clamp(parseInt(e.target.value, 10) || 1, 1, it.qty);
        renderStallZoom();
      };
      document.getElementById("act-buy").onclick = () => {
        const v = parseInt(document.getElementById("buy-qty").value, 10) || 1;
        buyQty = clamp(v, 1, it.qty);
        buyFromStall(shop.id, it.id, buyQty);
      };
      document.getElementById("act-ask").onclick = () => {
        toast(`${shop.name}: "${crop.name} — ${formatMoney(it.price)} each."`);
      };
      document.getElementById("act-leave").onclick = closeStallZoom;
    } else {
      detail.classList.add("hidden");
      detail.innerHTML = "";
      actions.innerHTML = `<button class="btn pixel small" id="act-leave">LEAVE</button>`;
      document.getElementById("act-leave").onclick = closeStallZoom;
    }
  }
}

function renderProductDetail(crateIndex) {
  const detail = document.getElementById("product-detail");
  if (!detail) return;
  const c = state.crates[crateIndex];
  if (crateIndex == null || !c?.kind || !c.count) {
    detail.classList.add("hidden");
    detail.innerHTML = "";
    return;
  }
  const crop = productDefFromCrate(c);
  const price = getAskForCrate(c);
  const kindLabel = c.kind === "seed" ? "Seed bags"
    : c.kind === "fish" ? `Fish · ${c.quality}`
    : `Produce · ${c.quality}`;
  detail.classList.remove("hidden");
  detail.innerHTML = `
    <canvas width="8" height="8" id="pd-icon"></canvas>
    <div>
      <div class="pd-name">${crop?.name || "?"}${c.kind === "seed" ? " Seeds" : ""}</div>
      <div class="pd-meta">${kindLabel} · ×${c.count} in crate · max ${crateMax(c)}</div>
    </div>
    <div class="pd-price">${formatMoney(price)}
      <div style="margin-top:6px"><button class="btn pixel small" id="pd-edit-price">EDIT PRICE</button></div>
    </div>`;
  const ic = document.getElementById("pd-icon");
  if (c.kind === "seed") drawSeedBag(pxCtx(ic), 0, 0, c.cropId);
  else if (c.kind === "fish") drawFishIcon(pxCtx(ic), 0, 0, c.cropId);
  else drawCropIcon(pxCtx(ic), 0, 0, c.cropId);
  document.getElementById("pd-edit-price").onclick = () => openPricePop(crateIndex);
}

function renderDialogueDock() {
  const dock = document.getElementById("dialogue-dock");
  if (!dialogue) { dock.classList.add("hidden"); return; }
  dock.classList.remove("hidden");
  document.getElementById("dialogue-who").textContent = `${dialogue.actor.name}:`;
  if (dialogue.finished) return;
  const q = dialogue.questions[dialogue.qi];
  document.getElementById("dialogue-text").textContent = q.text(dialogue.ctx);
  const choices = document.getElementById("dialogue-choices");
  choices.innerHTML = q.answers.map((a, i) => {
    const text = typeof a.text === "function" ? a.text(dialogue.ctx) : a.text;
    return `<button class="choice-btn" data-i="${i}">${text}</button>`;
  }).join("");
  choices.querySelectorAll("[data-i]").forEach((b) => {
    b.onclick = () => answerDialogue(Number(b.dataset.i));
  });
}

// ─── Price popup ───────────────────────────────────────────────────────────

function openPricePop(crateIndex) {
  const c = state.crates[crateIndex];
  if (!c?.kind) return;
  priceEditCrate = crateIndex;
  const crop = productDefFromCrate(c);
  document.getElementById("price-pop").classList.remove("hidden");
  document.getElementById("price-pop-label").textContent =
    (c.kind === "seed" ? `${crop.name} SEEDS` : crop?.name || "ITEM").toUpperCase();
  document.getElementById("price-pop-input").value = getAskForCrate(c).toFixed(2);
}
function hidePricePop() {
  priceEditCrate = null;
  document.getElementById("price-pop").classList.add("hidden");
}
function applyPricePop(delta) {
  if (priceEditCrate == null) return;
  const c = state.crates[priceEditCrate];
  if (!c?.kind) return;
  const inp = document.getElementById("price-pop-input");
  let v = parseFloat(inp.value);
  if (Number.isNaN(v)) v = getAskForCrate(c);
  if (delta != null) v += delta;
  v = clamp(v, 0.5, 200);
  inp.value = v.toFixed(2);
  setAskForCrate(c, v);
  saveState();
  if (zoomStall === "s1") renderStallZoom();
  if (state.location === "prep") renderPrep();
  if (state.location === "storage") renderStorage();
}

// ─── Storage + prep UI ─────────────────────────────────────────────────────

function renderStorage() {
  const grid = document.getElementById("storage-grid");
  if (!grid) return;
  grid.innerHTML = state.crates.map((c, i) =>
    renderCrateCard({ ...c, index: i }, {
      emptySlot: !c.kind || c.count <= 0,
      openBtn: true,
      onStall: isOnStall(i),
      label: `Crate ${i + 1}`,
    })
  ).join("");
  paintCrateCanvases(grid);
  grid.querySelectorAll("[data-open-crate]").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      openProduceFromCrate(Number(b.dataset.openCrate));
    };
  });
  // Click item pictures inside crate canvas to peel off 1 (grouped into same product crate)
  bindCrateCanvasClicks(grid, null);
}

function renderPrep() {
  const stor = document.getElementById("prep-storage");
  const stall = document.getElementById("prep-stall");
  if (!stor || !stall) return;

  // Click crate (not an item) = put ALL on stall. Click a picture inside = keep that 1 off (grouped).
  stor.innerHTML = state.crates.map((c, i) =>
    renderCrateCard({ ...c, index: i }, {
      emptySlot: !c.kind || c.count <= 0,
      onStall: isOnStall(i),
      showPrice: !!(c.kind && c.count),
      label: `Crate ${i + 1}`,
    })
  ).join("");

  const onStallList = stallCrates();
  stall.innerHTML = onStallList.length
    ? onStallList.map((c) =>
        renderCrateCard(c, { showPrice: true, onStall: true })
      ).join("")
    : `<p class="prep-empty">Click a crate to add all of it. Click a seed/produce picture inside a crate to keep that one off the stall (extras stay grouped).</p>`;

  paintCrateCanvases(stor);
  paintCrateCanvases(stall);

  bindCrateCanvasClicks(stor, (i) => {
    if (!state.crates[i]?.kind) return;
    toggleStallCrate(i);
    renderPrep();
  });
  bindCrateCanvasClicks(stall, (i) => {
    toggleStallCrate(i);
    renderPrep();
  });

  // Clicking crate frame (not canvas) also toggles whole crate
  stor.querySelectorAll(".px-crate").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest(".crate-sign.price")) return;
      if (e.target.closest("canvas")) return;
      const i = Number(el.dataset.idx);
      if (!state.crates[i]?.kind) return;
      toggleStallCrate(i);
      renderPrep();
    };
  });
  document.querySelectorAll("#prep-storage .crate-sign.price, #prep-stall .crate-sign.price").forEach((sign) => {
    sign.onclick = (e) => {
      e.stopPropagation();
      openPricePop(Number(sign.dataset.idx));
    };
  });
  stall.querySelectorAll(".px-crate").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.closest(".crate-sign.price")) return;
      if (e.target.closest("canvas")) return;
      toggleStallCrate(Number(el.dataset.idx));
      renderPrep();
    };
  });
}

// ─── Farm / shop UI ────────────────────────────────────────────────────────

function renderStats() {
  document.getElementById("money-display").textContent = Number(state.money).toFixed(2);
  document.getElementById("day-display").textContent = `Day ${state.day}`;
  document.getElementById("fert-display").textContent = state.fertilizer;
  const s = SEASONS[state.season];
  document.getElementById("season-line").textContent = `${s.name} ${state.dayInSeason}/${s.length}`;
  const wName = WEATHER[state.weather].name || WEATHER[state.weather].label;
  document.getElementById("weather-label").textContent = wName;
  document.getElementById("weather-chip").textContent = wName;
  // Seasonal page theme + title icon
  document.body.classList.remove("season-spring", "season-summer", "season-fall", "season-winter");
  document.body.classList.add(`season-${state.season}`);
  const sc = document.getElementById("season-icon-c");
  if (sc) drawSeasonIcon(pxCtx(sc), state.season);
  ensureWeatherFx();
}
function renderClimate() {
  const el = document.getElementById("climate-card");
  if (!el) return;
  const s = SEASONS[state.season];
  const w = WEATHER[state.weather];
  const wName = w.name || w.label;
  el.innerHTML = `<strong>${s.name}</strong> day ${state.dayInSeason}/${s.length} · Today: <strong>${wName}</strong>`;
  renderForecast();
}

function renderForecast() {
  const panel = document.getElementById("forecast-panel");
  if (!panel) return;
  ensureForecast();
  const labels = ["Tomorrow", "In 2 days", "In 3 days", "In 4 days"];
  panel.innerHTML = `
    <h3>4-DAY FORECAST</h3>
    <div class="forecast-row">
      ${state.forecast.map((wid, i) => {
        const w = WEATHER[wid] || WEATHER.sunny;
        return `<div class="forecast-day">
          <div class="fd-label">${labels[i]}</div>
          <div class="fd-weather">${w.name || w.label}</div>
        </div>`;
      }).join("")}
    </div>
    <p class="forecast-note">Usually right — not always.</p>`;
}

function renderSeedTray() {
  const tray = document.getElementById("seed-tray");
  if (!tray) return;
  const counts = allSeedCounts();
  const ids = Object.keys(counts);
  if (!ids.length) {
    tray.innerHTML = `<span class="muted">No seeds in storage.</span>`;
    return;
  }
  tray.innerHTML = ids.map((id) => {
    const c = CROPS[id];
    const sel = state.selectedSeed === id ? "selected" : "";
    return `<button class="seed-chip ${sel}" data-seed="${id}">
      <canvas width="8" height="8"></canvas>${c.name} ×${counts[id]}
    </button>`;
  }).join("");
  tray.querySelectorAll(".seed-chip").forEach((btn) => {
    drawSeedBag(pxCtx(btn.querySelector("canvas")), 0, 0, btn.dataset.seed);
    btn.onclick = () => selectSeed(btn.dataset.seed);
  });
}

function renderFarm() {
  renderSeedTray();
  const notices = document.getElementById("farm-notices");
  const ns = state.planters.map((p) => p.notice).filter(Boolean);
  notices.innerHTML = ns.map((n) => `<div class="farm-notice ${n.level}">${n.text}</div>`).join("");

  const area = document.getElementById("planters-area");
  area.innerHTML = state.planters.map((p) => {
    const crop = p.cropId ? CROPS[p.cropId] : null;
    const count = aliveCount(p);
    const ready = isReady(p);
    const q = estimateQuality(p);
    const status = p.notice?.text || (crop ? `Growing ${p.growth.toFixed(1)}/${crop.growDays}d` : "Empty");
    const cells = p.cells.map((cell, i) => {
      if (!cell) return `<div class="plot-cell" data-p="${p.id}" data-c="${i}"></div>`;
      return `<div class="plot-cell" data-p="${p.id}" data-c="${i}"><canvas width="8" height="8" data-grow="${p.cropId}" data-ready="${ready ? 1 : 0}"></canvas></div>`;
    }).join("");
    return `<div class="planter-box">
      <h4><span>PLOT #${p.id}</span><span>${crop ? `${crop.name} ${count}/9${q ? ` · ${q}` : ""}` : "empty"}</span></h4>
      <div class="plot-grid ${moistureClass(p.moisture)}">${cells}</div>
      <div class="planter-status ${p.notice?.level || ""}">${status}</div>
      <div class="planter-meta">${crop ? `Ideal ~${crop.idealCount}${ready ? " · READY" : ""}` : ""}</div>
      <div class="planter-actions">
        <button class="btn pixel small water" data-water="${p.id}" ${planterBtnFlash[p.id]?.water ? "disabled" : ""}>${planterBtnFlash[p.id]?.water ? "WATERED" : "WATER"}</button>
        <button class="btn pixel small fert" data-fert="${p.id}" ${state.fertilizer <= 0 || planterBtnFlash[p.id]?.fert ? "disabled" : ""}>${state.fertilizer <= 0 ? "NO FERTILIZER LEFT" : planterBtnFlash[p.id]?.fert ? "FERTILIZED" : "FERTILIZE"}</button>
        ${ready ? `<button class="btn pixel small harvest" data-harvest="${p.id}">HARVEST</button>` : ""}
      </div>
    </div>`;
  }).join("");

  area.querySelectorAll(".plot-cell").forEach((cell) => {
    cell.onclick = () => plantInCell(state.planters.find((x) => x.id === Number(cell.dataset.p)), Number(cell.dataset.c));
  });
  area.querySelectorAll("canvas[data-grow]").forEach((c) => {
    const ctx = pxCtx(c);
    if (c.dataset.ready === "1") drawCropIcon(ctx, 0, 0, c.dataset.grow);
    else {
      prect(ctx, 3, 4, 2, 3, "#3a8f3a");
      pset(ctx, 2, 3, "#5cb85c");
      pset(ctx, 5, 3, "#5cb85c");
    }
  });
  area.querySelectorAll("[data-water]").forEach((b) => { b.onclick = () => waterPlanter(Number(b.dataset.water)); });
  area.querySelectorAll("[data-fert]").forEach((b) => { b.onclick = () => fertPlanter(Number(b.dataset.fert)); });
  area.querySelectorAll("[data-harvest]").forEach((b) => { b.onclick = () => harvestPlanter(Number(b.dataset.harvest)); });
}

let shopQty = {}; // cropId -> qty

function renderShop() {
  const seedShop = document.getElementById("seed-shop");
  if (!seedShop) return;
  seedShop.innerHTML = Object.values(CROPS).map((c) => {
    const owned = totalSeeds(c.id);
    const fit = seasonFit(c, state.season);
    const q = clamp(shopQty[c.id] || 1, 1, 99);
    shopQty[c.id] = q;
    const total = c.cost * q;
    const aff = state.money >= total;
    return `<div class="item-card ${fit === "great" ? "in-season" : ""}">
      <div class="icon-wrap"><canvas width="8" height="8" data-s="${c.id}"></canvas></div>
      <h4>${c.name}</h4>
      <p class="desc">${c.desc}</p>
      <div class="meta"><span>${formatMoney(c.cost)} each</span><span class="owned-badge ${owned ? "" : "zero"}">Owned: ${owned}</span></div>
      <div class="buy-row">
        <button class="btn pixel tiny" data-sq-down="${c.id}">−</button>
        <input class="qty-type" type="text" inputmode="numeric" value="${q}" data-sq-inp="${c.id}" />
        <button class="btn pixel tiny" data-sq-up="${c.id}">+</button>
        <button class="btn pixel small primary" data-buy="${c.id}" ${aff ? "" : "disabled"}>BUY x${q}</button>
      </div>
    </div>`;
  }).join("");
  seedShop.querySelectorAll("canvas[data-s]").forEach((c) => drawSeedPacket(pxCtx(c), 0, 0, c.dataset.s));
  seedShop.querySelectorAll("[data-sq-down]").forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.sqDown;
      shopQty[id] = Math.max(1, (shopQty[id] || 1) - 1);
      renderShop();
    };
  });
  seedShop.querySelectorAll("[data-sq-up]").forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.sqUp;
      shopQty[id] = Math.min(99, (shopQty[id] || 1) + 1);
      renderShop();
    };
  });
  seedShop.querySelectorAll("[data-sq-inp]").forEach((inp) => {
    inp.onchange = () => {
      shopQty[inp.dataset.sqInp] = clamp(parseInt(inp.value, 10) || 1, 1, 99);
      renderShop();
    };
  });
  seedShop.querySelectorAll("[data-buy]").forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.buy;
      const inp = seedShop.querySelector(`[data-sq-inp="${id}"]`);
      const q = clamp(parseInt(inp?.value, 10) || shopQty[id] || 1, 1, 99);
      shopQty[id] = q;
      buySeed(id, q);
    };
  });

  let fertQ = shopQty.__fert || 1;
  document.getElementById("fert-shop").innerHTML = `
    <div class="item-card">
      <h4>Fertilizer</h4>
      <p class="desc">One use per planter.</p>
      <div class="meta"><span>${formatMoney(FERT_COST)} each</span><span class="owned-badge ${state.fertilizer ? "" : "zero"}">Owned: ${state.fertilizer}</span></div>
      <div class="buy-row">
        <button class="btn pixel tiny" id="fert-down">−</button>
        <input class="qty-type" type="text" inputmode="numeric" value="${fertQ}" id="fert-qty" />
        <button class="btn pixel tiny" id="fert-up">+</button>
        <button class="btn pixel small primary" id="bf1" ${state.money >= FERT_COST * fertQ ? "" : "disabled"}>BUY x${fertQ}</button>
      </div>
    </div>`;
  document.getElementById("fert-down").onclick = () => { shopQty.__fert = Math.max(1, fertQ - 1); renderShop(); };
  document.getElementById("fert-up").onclick = () => { shopQty.__fert = Math.min(99, fertQ + 1); renderShop(); };
  document.getElementById("fert-qty").onchange = (e) => {
    shopQty.__fert = clamp(parseInt(e.target.value, 10) || 1, 1, 99);
    renderShop();
  };
  document.getElementById("bf1").onclick = () => {
    const v = clamp(parseInt(document.getElementById("fert-qty").value, 10) || 1, 1, 99);
    shopQty.__fert = v;
    buyFert(v);
  };

  const n = state.planters.length;
  const cost = PLANTER_COSTS[n] || 0;
  document.getElementById("planter-shop").innerHTML = n >= MAX_PLANTERS
    ? `<div class="item-card"><h4>Full</h4><span class="owned-badge">Owned: ${n}/${MAX_PLANTERS}</span></div>`
    : `<div class="item-card">
        <h4>Planter #${n + 1}</h4>
        <div class="meta"><span>${formatMoney(cost)}</span><span class="owned-badge">Owned: ${n}/${MAX_PLANTERS}</span></div>
        <button class="btn pixel small primary" id="bp" ${state.money >= cost ? "" : "disabled"}>BUY</button>
      </div>`;
  const bp = document.getElementById("bp");
  if (bp) bp.onclick = () => buyPlanter();

  // Tools — fishing rod
  const tools = document.getElementById("tools-shop");
  if (tools) {
    tools.innerHTML = state.hasRod
      ? `<div class="item-card">
          <h4>Fishing Rod</h4>
          <p class="desc">Cast at the lake. Catch fish to sell.</p>
          <div class="meta"><span>Owned</span><span class="owned-badge">✓</span></div>
        </div>`
      : `<div class="item-card">
          <h4>Fishing Rod</h4>
          <p class="desc">Cast at the lake. Catch fish to sell.</p>
          <div class="meta"><span>${formatMoney(ROD_COST)}</span><span class="owned-badge zero">Owned: 0</span></div>
          <button class="btn pixel small primary" id="buy-rod" ${state.money >= ROD_COST ? "" : "disabled"}>BUY</button>
        </div>`;
    const br = document.getElementById("buy-rod");
    if (br) br.onclick = () => buyFishingRod();
  }
}

function startLoop() {
  if (loopId) return;
  const tick = () => {
    // Always schedule next frame first-path so a throw can't kill the loop forever
    loopId = requestAnimationFrame(tick);
    animFrame++;
    try {
      tickSeasonFx();
      tickWeatherFx();
      // lake continuous movement while keys held
      if (state.location === "lake") {
        let dx = 0, dy = 0;
        if (lakeKeys.left) dx -= 1;
        if (lakeKeys.right) dx += 1;
        if (lakeKeys.up) dy -= 1;
        if (lakeKeys.down) dy += 1;
        if (dx || dy) moveLakePlayer(dx, dy);
        else lakeMoving = false;
        tickFishing();
        drawLake();
      }
      if (state.location === "market") {
        // Keep people walking even while a stall is open / during sales & talk
        tickActors();
        drawMarket();
        if (zoomStall) drawStallUmbrella();
        if (zoomStall === "s1" && !dialogue && animFrame % 100 === 0) {
          const browsers = marketActors.filter((a) => a.state === "at_stall" && a.targetShop === "s1");
          if (browsers.length && Math.random() < 0.35) tryCustomer(browsers[0]);
        }
      }
    } catch (err) {
      console.warn("tick error (recovered):", err);
    }
  };
  loopId = requestAnimationFrame(tick);
}

function renderAll() {
  renderStats();
  renderClimate();
  if (state.location === "map") drawTown();
  if (state.location === "farm") renderFarm();
  if (state.location === "shop") renderShop();
  if (state.location === "storage") renderStorage();
  if (state.location === "prep") renderPrep();
  if (state.location === "market") drawMarket();
  if (state.location === "lake") drawLake();
  if (zoomStall) renderStallZoom();
  updateBackBtn();
}

function init() {
  if (!state.shopStock || !Object.keys(state.shopStock).length) restockShops();
  ensureForecast();
  ensureActors();

  document.getElementById("btn-map").onclick = () => goTo("map");
  document.getElementById("btn-back").onclick = () => goBack();
  document.getElementById("btn-rest").onclick = advanceDay;
  document.getElementById("btn-rest-map").onclick = advanceDay;
  document.getElementById("btn-new-game").onclick = () => {
    if (!confirm("Start a new game? Current progress will be erased.")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    ensureForecast();
    marketActors = [];
    dialogue = null;
    zoomStall = null;
    saveState();
    goTo("map", false);
    centerNotice("DAY 1, SPRING, WEATHER: SUNNY", { day: true, dim: true, ms: 1400 });
  };
  document.getElementById("btn-open-market").onclick = () => openMarketFloor(true);
  document.getElementById("btn-browse-only").onclick = () => openMarketFloor(false);
  // leave is only the bottom LEAVE button inside stall actions
  document.getElementById("modal-close").onclick = closeModal;
  document.getElementById("modal-overlay").onclick = (e) => {
    if (e.target.id === "modal-overlay") closeModal();
  };
  document.querySelectorAll("[data-goto]").forEach((el) => {
    el.addEventListener("click", () => goTo(el.dataset.goto));
  });
  document.getElementById("town-canvas").onclick = onTownClick;
  document.getElementById("market-canvas").onclick = onMarketClick;
  document.getElementById("lake-canvas")?.addEventListener("click", onLakeClick);
  document.getElementById("btn-leave-lake")?.addEventListener("click", () => {
    resetFishing();
    goBack();
  });
  // Hold CAST to charge power; release to cast. Spam on reel. Press on bite.
  const castBtn = document.getElementById("btn-fish-cast");
  if (castBtn) {
    castBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startCast();
    });
    castBtn.addEventListener("mouseup", () => {
      if (state.location === "lake") releaseCastInput();
    });
    castBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startCast();
    }, { passive: false });
    castBtn.addEventListener("touchend", () => {
      if (state.location === "lake") releaseCastInput();
    });
    window.addEventListener("mouseup", () => {
      if (state.location === "lake") releaseCastInput();
    });
  }

  document.getElementById("price-pop-up").onclick = () => applyPricePop(0.5);
  document.getElementById("price-pop-down").onclick = () => applyPricePop(-0.5);
  document.getElementById("price-pop-done").onclick = () => {
    applyPricePop(null);
    hidePricePop();
  };
  document.getElementById("price-pop-input").onchange = () => applyPricePop(null);
  document.getElementById("price-pop").onclick = (e) => {
    if (e.target.id === "price-pop") hidePricePop();
  };

  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    // lake movement + cast
    if (state.location === "lake") {
      if (k === " " || k === "enter") {
        e.preventDefault();
        if (e.repeat) {
          // key-repeat: keep charging / weak spam only
          if (fishing.mode === "charging") fishing.hold = true;
          else if (fishing.mode === "reeling" && animFrame % 3 === 0) spamReelPress();
          return;
        }
        startCast();
        return;
      }
      const m = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
      if (m[k]) {
        e.preventDefault();
        lakeKeys[m[k]] = true;
        return;
      }
    }
    if (zoomStall || state.location !== "market") return;
    const m = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
    if (!m[k]) return;
    e.preventDefault();
    movePlayer(m[k][0], m[k][1]);
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k === " " || k === "enter") {
      releaseCastInput();
    }
    const m = { arrowup: "up", w: "up", arrowdown: "down", s: "down", arrowleft: "left", a: "left", arrowright: "right", d: "right" };
    if (m[k]) lakeKeys[m[k]] = false;
  });

  goTo(state.location || "map", false);
  startLoop();
}

init();
