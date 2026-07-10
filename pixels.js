/**
 * Pixel art helpers — soft fills, readable stalls, Stardew-like lake sprites
 */

const PX = {
  grass: "#62a854",
  grassDark: "#549648",
  grassLight: "#74b866",
  path: "#d2b892",
  pathDark: "#c0a47a",
  pathEdge: "#a88858",
  water: "#5aabd0",
  waterDeep: "#4a96ba",
  bark: "#6b4423",
  barkDark: "#5a381c",
  leaf: "#3d9a40",
  leafDark: "#2f7a32",
  leafLight: "#5cb85c",
  shrub: "#3a8f45",
  shrubDark: "#2d7036",
  roof: ["#c45c4a", "#5a8fc4", "#d4a020", "#6a9a5a", "#a84838"],
  wall: "#efe6d4",
  wallDark: "#d8ccb4",
  wood: "#a87840",
  woodDark: "#8b6230",
  woodLight: "#c49458",
  cloth: ["#e07070", "#70a0e0", "#70c070", "#e0c050", "#c070c0"],
  skin: ["#f0c8a0", "#e8b888", "#c88a60", "#8d5524", "#ffd5b5"],
  hair: ["#2a1a10", "#5a3a20", "#c4a060", "#1a1a1a", "#8b3030", "#e8e0d0"],
  shirt: ["#3a6ea5", "#c45c4a", "#4a8f4a", "#7a4a9a", "#d48030", "#2c3a4a"],
  pants: ["#3a3a4a", "#4a3a2a", "#2a3a4a", "#5a5a5a"],
  shadow: "rgba(40,50,40,0.2)",
};

function pxCtx(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

function pset(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, 1, 1);
}

function prect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function shade(hex, amt) {
  if (!hex || hex[0] !== "#") return hex;
  const n = parseInt(hex.slice(1), 16);
  let r = Math.max(0, Math.min(255, (n >> 16) + amt));
  let g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  let b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function prand(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/** Season palette for ground / trees / roofs */
function seasonPalette(season = "spring") {
  if (season === "summer") {
    return {
      grass: "#58a848", grassDark: "#4a943c", grassLight: "#6cbc58",
      leaf: "#2f9a32", leafDark: "#247828", leafLight: "#4aba4e",
      shrub: "#2f8a38", shrubDark: "#246c2c",
      path: "#d8bc8a", pathDark: "#c4a870", pathEdge: "#a88850",
      water: "#4aa8d0", waterDeep: "#3a90b8",
      snow: null, leafPile: false,
    };
  }
  if (season === "fall") {
    return {
      grass: "#8a9440", grassDark: "#6e7834", grassLight: "#a0a850",
      leaf: "#d07020", leafDark: "#a84818", leafLight: "#e0a030",
      leafAlt: "#c04028",
      shrub: "#a85820", shrubDark: "#7a4018",
      path: "#c4a070", pathDark: "#b08c58", pathEdge: "#907040",
      water: "#5a9ab0", waterDeep: "#487890",
      snow: null, leafPile: true,
    };
  }
  if (season === "winter") {
    return {
      grass: "#d8e0e6", grassDark: "#c4ced6", grassLight: "#eef2f6",
      leaf: "#c8d4dc", leafDark: "#a8b8c4", leafLight: "#e0e8ee",
      shrub: "#b0c0c8", shrubDark: "#90a0a8",
      path: "#c8c0b4", pathDark: "#b0a898", pathEdge: "#908878",
      water: "#90b8d0", waterDeep: "#78a0b8",
      snow: "#f4f8fc", leafPile: false,
    };
  }
  return {
    grass: "#62a854", grassDark: "#549648", grassLight: "#74b866",
    leaf: "#3d9a40", leafDark: "#2f7a32", leafLight: "#5cb85c",
    shrub: "#3a8f45", shrubDark: "#2d7036",
    path: "#d2b892", pathDark: "#c0a47a", pathEdge: "#a88858",
    water: "#5aabd0", waterDeep: "#4a96ba",
    snow: null, leafPile: false,
  };
}

function fillGrass(ctx, w, h, season = "spring") {
  const p = seasonPalette(season);
  prect(ctx, 0, 0, w, h, p.grass);
  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < w; x += 4) {
      if (((x + y) / 4) % 2 === 0) prect(ctx, x, y, 2, 2, p.grassDark);
      else if (((x / 4) + (y / 4)) % 3 === 0) prect(ctx, x + 2, y + 2, 1, 1, p.grassLight);
    }
  }
}

function drawCurvedPath(ctx, points, width = 2, season = "spring") {
  const p = seasonPalette(season);
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      const nx = -(y1 - y0);
      const ny = x1 - x0;
      const len = Math.hypot(nx, ny) || 1;
      const curve = Math.sin(t * Math.PI) * 1.5;
      const cx = Math.round(x + (nx / len) * curve);
      const cy = Math.round(y + (ny / len) * curve);
      for (let dy = -width; dy <= width; dy++) {
        for (let dx = -width; dx <= width; dx++) {
          if (dx * dx + dy * dy <= width * width + 0.5) {
            const edge = Math.abs(dx) + Math.abs(dy) >= width;
            let col = edge ? p.pathEdge : (dx + dy) % 2 ? p.path : p.pathDark;
            if (season === "winter") col = edge ? "#a0a8b0" : (dx + dy) % 2 ? "#d8dce0" : "#c8ccd0";
            pset(ctx, cx + dx, cy + dy, col);
          }
        }
      }
    }
  }
}

function drawTree(ctx, x, y, seed = 1, season = "spring") {
  const r = prand(seed + 99);
  const p = seasonPalette(season);
  prect(ctx, x + 3, y + 10, 3, 6, PX.bark);
  prect(ctx, x + 4, y + 10, 1, 6, PX.barkDark);
  if (season === "winter") {
    prect(ctx, x + 2, y + 7, 5, 3, "#3a5a48");
    prect(ctx, x + 1, y + 5, 7, 3, "#2f4a3c");
    prect(ctx, x + 2, y + 3, 5, 3, "#3a5a48");
    prect(ctx, x + 3, y + 1, 3, 3, "#2f4a3c");
    prect(ctx, x + 1, y + 6, 2, 1, PX.bark);
    prect(ctx, x + 6, y + 5, 2, 1, PX.bark);
    pset(ctx, x + 3, y + 1, "#f8fcff");
    pset(ctx, x + 4, y, "#ffffff");
    pset(ctx, x + 5, y + 1, "#f0f6fc");
  } else if (season === "fall") {
    prect(ctx, x + 1, y + 4, 8, 5, p.leafDark);
    prect(ctx, x + 2, y + 2, 6, 5, p.leaf);
    prect(ctx, x + 3, y + 1, 4, 3, p.leafLight);
    prect(ctx, x, y + 6, 3, 3, p.leafAlt || p.leafDark);
    prect(ctx, x + 7, y + 5, 3, 3, p.leaf);
  } else {
    prect(ctx, x + 1, y + 4, 8, 6, p.leafDark);
    prect(ctx, x + 2, y + 2, 6, 5, p.leaf);
    prect(ctx, x + 3, y + 1, 4, 3, p.leafLight);
    prect(ctx, x, y + 6, 3, 3, p.leaf);
    prect(ctx, x + 7, y + 6, 3, 3, p.leafDark);
    if (r() > 0.4) pset(ctx, x + 4, y + 3, p.leafLight);
  }
}

function drawShrub(ctx, x, y, seed = 2, season = "spring") {
  const p = seasonPalette(season);
  const r = prand(seed);
  if (season === "winter") {
    prect(ctx, x + 1, y + 2, 4, 2, "#3a5a48");
    prect(ctx, x, y + 3, 6, 2, "#2f4a3c");
    pset(ctx, x + 1, y + 2, "#ffffff");
  } else {
    prect(ctx, x, y + 1, 6, 3, p.shrubDark);
    prect(ctx, x + 1, y, 4, 3, p.shrub);
    if (season === "spring") {
      if (r() > 0.45) pset(ctx, x + 2, y, "#f0a0c0");
      if (r() > 0.55) pset(ctx, x + 4, y + 1, "#f0e060");
    }
  }
}

/** Tiny market/town person (~8×14) */
function drawPerson(ctx, x, y, opts = {}) {
  const skin = PX.skin[opts.skinI || 0];
  const hair = PX.hair[opts.hairI || 0];
  const shirt = PX.shirt[opts.shirtI || 0];
  const pants = PX.pants[opts.pantsI || 0];
  const dir = opts.dir ?? 0;
  const frame = opts.frame || 0;
  const leg = frame % 2;

  prect(ctx, x + 1, y + 13, 5, 1, PX.shadow);
  prect(ctx, x + 2, y + 10, 2, 3, pants);
  prect(ctx, x + 4, y + 10, 2, 3, pants);
  if (leg) prect(ctx, x + 1, y + 12, 2, 1, pants);
  else prect(ctx, x + 5, y + 12, 2, 1, pants);

  prect(ctx, x + 2, y + 6, 4, 4, shirt);
  pset(ctx, x + 2, y + 6, shade(shirt, -15));

  prect(ctx, x + 2, y + 2, 4, 4, skin);
  if (dir === 3) prect(ctx, x + 2, y + 1, 4, 3, hair);
  else {
    prect(ctx, x + 2, y + 1, 4, 2, hair);
    pset(ctx, x + 1, y + 2, hair);
    pset(ctx, x + 6, y + 2, hair);
  }
  if (dir === 0) {
    pset(ctx, x + 3, y + 3, "#1a1a1a");
    pset(ctx, x + 5, y + 3, "#1a1a1a");
  } else if (dir === 1) pset(ctx, x + 2, y + 3, "#1a1a1a");
  else if (dir === 2) pset(ctx, x + 5, y + 3, "#1a1a1a");

  prect(ctx, x + 1, y + 7, 1, 3, skin);
  prect(ctx, x + 6, y + 7, 1, 3, skin);
}

/**
 * Detailed lake farmer (~16×28) — no bun.
 * Layered hair, face shading, sleeves, belt, boots.
 */
function drawPersonClose(ctx, x, y, opts = {}) {
  const skin = "#f5c9a8";
  const skinSh = "#e0b090";
  const skinDk = "#d4a080";
  const hair = "#8b5a3c";
  const hairD = "#6b4028";
  const hairL = "#a87858";
  const shirt = "#9a4088";
  const shirtD = "#702868";
  const shirtL = "#b060a0";
  const pants = "#3a2858";
  const pantsL = "#4a3870";
  const boot = "#1c1424";
  const bootL = "#2a2030";
  const dir = opts.dir ?? 0;
  const moving = !!opts.moving;
  const step = moving ? (opts.frame || 0) % 4 : 0;
  let l = 0, r = 0;
  if (step === 1) { l = -1; r = 1; }
  else if (step === 3) { l = 1; r = -1; }

  prect(ctx, x + 3, y + 26, 10, 2, "rgba(40,50,40,0.16)");

  if (dir === 3) {
    // back — full hair, no bun
    prect(ctx, x + 4, y + 17 + l, 3, 7, pants);
    prect(ctx, x + 9, y + 17 + r, 3, 7, pants);
    prect(ctx, x + 4, y + 23 + l, 3, 3, boot);
    prect(ctx, x + 9, y + 23 + r, 3, 3, boot);
    pset(ctx, x + 4, y + 25 + l, bootL);
    pset(ctx, x + 9, y + 25 + r, bootL);
    prect(ctx, x + 4, y + 11, 8, 7, shirt);
    prect(ctx, x + 4, y + 11, 2, 7, shirtD);
    prect(ctx, x + 10, y + 11, 2, 7, shirtL);
    prect(ctx, x + 3, y + 12, 1, 5, skin);
    prect(ctx, x + 12, y + 12, 1, 5, skin);
    // layered hair back
    prect(ctx, x + 3, y + 2, 10, 10, hair);
    prect(ctx, x + 4, y + 1, 8, 2, hairL);
    prect(ctx, x + 3, y + 8, 2, 4, hairD);
    prect(ctx, x + 11, y + 8, 2, 4, hairD);
    prect(ctx, x + 5, y + 3, 6, 3, hairL);
  } else if (dir === 1) {
    // left
    prect(ctx, x + 5 + l, y + 17, 3, 7, pants);
    prect(ctx, x + 8 + r, y + 17, 3, 7, pants);
    pset(ctx, x + 5 + l, y + 18, pantsL);
    prect(ctx, x + 5 + l, y + 23, 3, 3, boot);
    prect(ctx, x + 8 + r, y + 23, 3, 3, boot);
    prect(ctx, x + 5, y + 11, 6, 7, shirt);
    prect(ctx, x + 5, y + 11, 2, 7, shirtD);
    prect(ctx, x + 3, y + 12, 2, 5, skin);
    pset(ctx, x + 3, y + 16, skinDk);
    prect(ctx, x + 5, y + 3, 6, 8, skin);
    prect(ctx, x + 5, y + 4, 5, 1, skinSh);
    // hair over head / side (no bun)
    prect(ctx, x + 5, y + 1, 6, 4, hair);
    prect(ctx, x + 6, y + 1, 4, 1, hairL);
    prect(ctx, x + 9, y + 3, 2, 7, hair);
    prect(ctx, x + 10, y + 5, 1, 4, hairD);
    prect(ctx, x + 5, y + 6, 2, 2, "#fff");
    pset(ctx, x + 5, y + 6, "#2a1a18");
    pset(ctx, x + 6, y + 7, "#3a2a28");
    pset(ctx, x + 6, y + 9, skinDk); // nose tip
  } else if (dir === 2) {
    // right
    prect(ctx, x + 5 + l, y + 17, 3, 7, pants);
    prect(ctx, x + 8 + r, y + 17, 3, 7, pants);
    pset(ctx, x + 9 + r, y + 18, pantsL);
    prect(ctx, x + 5 + l, y + 23, 3, 3, boot);
    prect(ctx, x + 8 + r, y + 23, 3, 3, boot);
    prect(ctx, x + 5, y + 11, 6, 7, shirt);
    prect(ctx, x + 9, y + 11, 2, 7, shirtL);
    prect(ctx, x + 11, y + 12, 2, 5, skin);
    pset(ctx, x + 12, y + 16, skinDk);
    prect(ctx, x + 5, y + 3, 6, 8, skin);
    prect(ctx, x + 6, y + 4, 5, 1, skinSh);
    prect(ctx, x + 5, y + 1, 6, 4, hair);
    prect(ctx, x + 6, y + 1, 4, 1, hairL);
    prect(ctx, x + 5, y + 3, 2, 7, hair);
    prect(ctx, x + 5, y + 5, 1, 4, hairD);
    prect(ctx, x + 9, y + 6, 2, 2, "#fff");
    pset(ctx, x + 10, y + 6, "#2a1a18");
    pset(ctx, x + 9, y + 7, "#3a2a28");
    pset(ctx, x + 9, y + 9, skinDk);
  } else {
    // front
    prect(ctx, x + 4 + l, y + 17, 3, 7, pants);
    prect(ctx, x + 9 + r, y + 17, 3, 7, pants);
    pset(ctx, x + 5 + l, y + 18, pantsL);
    pset(ctx, x + 10 + r, y + 18, pantsL);
    prect(ctx, x + 4 + l, y + 23, 3, 3, boot);
    prect(ctx, x + 9 + r, y + 23, 3, 3, boot);
    pset(ctx, x + 4 + l, y + 25, bootL);
    pset(ctx, x + 9 + r, y + 25, bootL);
    // shirt + belt
    prect(ctx, x + 4, y + 11, 8, 7, shirt);
    prect(ctx, x + 4, y + 11, 2, 7, shirtD);
    prect(ctx, x + 10, y + 12, 1, 5, shirtL);
    prect(ctx, x + 6, y + 13, 4, 2, shade(shirt, 18));
    prect(ctx, x + 5, y + 16, 6, 1, "#4a2840"); // belt
    pset(ctx, x + 7, y + 16, "#c4a060"); // buckle
    // arms + hands
    prect(ctx, x + 2, y + 12, 2, 5, skin);
    prect(ctx, x + 12, y + 12, 2, 5, skin);
    pset(ctx, x + 2, y + 16, skinDk);
    pset(ctx, x + 13, y + 16, skinDk);
    // head
    prect(ctx, x + 4, y + 3, 8, 8, skin);
    prect(ctx, x + 5, y + 4, 6, 1, skinSh);
    prect(ctx, x + 5, y + 9, 6, 1, skinDk);
    // hair — side-part fringe, NO bun
    prect(ctx, x + 3, y + 2, 10, 3, hair);
    prect(ctx, x + 4, y + 1, 8, 2, hairL);
    prect(ctx, x + 3, y + 3, 2, 5, hair);
    prect(ctx, x + 11, y + 3, 2, 5, hair);
    prect(ctx, x + 4, y + 4, 3, 2, hair); // bangs
    prect(ctx, x + 9, y + 4, 2, 2, hair);
    pset(ctx, x + 5, y + 2, hairD);
    pset(ctx, x + 10, y + 3, hairD);
    // eyes
    prect(ctx, x + 5, y + 6, 2, 2, "#fff");
    prect(ctx, x + 9, y + 6, 2, 2, "#fff");
    pset(ctx, x + 5, y + 6, "#b8d0e8");
    pset(ctx, x + 9, y + 6, "#b8d0e8");
    pset(ctx, x + 6, y + 6, "#2a1a18");
    pset(ctx, x + 10, y + 6, "#2a1a18");
    pset(ctx, x + 6, y + 7, "#1a1010");
    pset(ctx, x + 10, y + 7, "#1a1010");
    // brows + mouth
    pset(ctx, x + 5, y + 5, hairD);
    pset(ctx, x + 9, y + 5, hairD);
    pset(ctx, x + 7, y + 9, skinDk);
    pset(ctx, x + 8, y + 9, skinDk);
  }
}

/** Tall lake tree — ~3× player height so player is not tree-sized */
function drawLakeTree(ctx, x, y, seed = 1, season = "spring") {
  const r = prand(seed + 40);
  const p = seasonPalette(season);
  // tall trunk
  prect(ctx, x + 10, y + 28, 5, 22, PX.bark);
  prect(ctx, x + 11, y + 28, 2, 22, PX.barkDark);
  prect(ctx, x + 12, y + 32, 1, 12, shade(PX.bark, 18));
  if (season === "winter") {
    prect(ctx, x + 4, y + 18, 18, 12, "#2f4a3c");
    prect(ctx, x + 6, y + 10, 14, 12, "#3a5a48");
    prect(ctx, x + 8, y + 4, 10, 10, "#2f4a3c");
    prect(ctx, x + 10, y, 6, 6, "#3a5a48");
    pset(ctx, x + 11, y + 2, "#fff");
    pset(ctx, x + 14, y + 6, "#f8fcff");
  } else if (season === "fall") {
    prect(ctx, x + 2, y + 16, 22, 14, p.leafDark);
    prect(ctx, x + 4, y + 8, 18, 14, p.leaf);
    prect(ctx, x + 7, y + 2, 12, 10, p.leafLight);
    prect(ctx, x, y + 22, 8, 6, p.leafAlt || p.leafDark);
    prect(ctx, x + 18, y + 20, 8, 6, p.leaf);
  } else {
    prect(ctx, x + 2, y + 16, 22, 14, p.leafDark);
    prect(ctx, x + 4, y + 8, 18, 14, p.leaf);
    prect(ctx, x + 7, y + 2, 12, 10, p.leafLight);
    prect(ctx, x, y + 20, 7, 6, p.leaf);
    prect(ctx, x + 19, y + 18, 7, 6, p.leafDark);
    if (r() > 0.35) pset(ctx, x + 12, y + 6, p.leafLight);
  }
  prect(ctx, x + 6, y + 49, 14, 2, "rgba(40,50,40,0.14)");
}

function drawLakeBush(ctx, x, y, seed = 2, season = "spring") {
  const p = seasonPalette(season);
  const r = prand(seed);
  prect(ctx, x + 1, y + 4, 10, 5, p.shrubDark);
  prect(ctx, x + 2, y + 2, 8, 5, p.shrub);
  prect(ctx, x + 3, y + 1, 5, 3, shade(p.shrub, 12));
  if (season === "spring" && r() > 0.4) pset(ctx, x + 4, y + 2, "#c070c0");
}

function drawLilyPad(ctx, x, y, seed = 1) {
  const r = prand(seed);
  prect(ctx, x, y + 1, 7, 4, "#3a8a48");
  prect(ctx, x + 1, y, 5, 2, "#4a9a58");
  prect(ctx, x + 1, y + 2, 4, 2, "#2f7a3c");
  if (r() > 0.4) {
    prect(ctx, x + 2, y - 1, 3, 2, "#e8d0e8");
    pset(ctx, x + 3, y - 1, "#f4e8f4");
  }
}

function drawShopBooth(ctx, x, y, colorI = 0, scale = 1, season = "spring") {
  const s = scale;
  const cloth = PX.cloth[colorI % PX.cloth.length];
  prect(ctx, x, y + 8 * s, 3 * s, 18 * s, PX.woodDark);
  prect(ctx, x + 28 * s, y + 8 * s, 3 * s, 18 * s, PX.woodDark);
  prect(ctx, x - 1 * s, y + 4 * s, 34 * s, 8 * s, cloth);
  prect(ctx, x, y + 3 * s, 32 * s, 2 * s, shade(cloth, 25));
  for (let i = 0; i < 32; i += 4) {
    prect(ctx, x + i * s, y + 10 * s, 2 * s, 2 * s, shade(cloth, -30));
  }
  if (season === "winter") {
    prect(ctx, x, y + 3 * s, 32 * s, 2 * s, "#f4f8fc");
  }
  prect(ctx, x + 2 * s, y + 16 * s, 28 * s, 8 * s, PX.wood);
  prect(ctx, x + 2 * s, y + 16 * s, 28 * s, 2 * s, PX.woodLight);
}

function drawBuilding(ctx, x, y, w, h, roofColor, season = "spring") {
  prect(ctx, x, y + 6, w, h - 6, PX.wall);
  prect(ctx, x, y + 6, 2, h - 6, PX.wallDark);
  prect(ctx, x + w - 2, y + 6, 2, h - 6, PX.wallDark);
  prect(ctx, x - 2, y + 2, w + 4, 6, roofColor || PX.roof[0]);
  prect(ctx, x, y, w, 4, shade(roofColor || PX.roof[0], 20));
  if (season === "winter") {
    prect(ctx, x - 2, y, w + 4, 3, "#f4f8fc");
  }
  prect(ctx, x + Math.floor(w / 2) - 3, y + h - 10, 6, 10, PX.woodDark);
  prect(ctx, x + 4, y + 10, 5, 5, "#8ec4e0");
  prect(ctx, x + w - 9, y + 10, 5, 5, "#8ec4e0");
}

function drawSeasonIcon(ctx, season = "spring") {
  ctx.clearRect(0, 0, 16, 16);
  if (season === "spring") {
    prect(ctx, 6, 8, 4, 6, "#3d9a40");
    prect(ctx, 4, 4, 8, 5, "#5cb85c");
    pset(ctx, 5, 3, "#f0a0c0");
    pset(ctx, 10, 4, "#f0e060");
  } else if (season === "summer") {
    prect(ctx, 5, 5, 6, 6, "#f0c020");
    pset(ctx, 3, 7, "#f0c020");
    pset(ctx, 12, 7, "#f0c020");
    pset(ctx, 7, 3, "#f0c020");
    pset(ctx, 7, 12, "#f0c020");
  } else if (season === "fall") {
    prect(ctx, 4, 5, 8, 6, "#d07020");
    prect(ctx, 6, 3, 4, 3, "#e0a030");
    pset(ctx, 3, 8, "#c04028");
  } else {
    pset(ctx, 7, 3, "#fff");
    pset(ctx, 5, 5, "#e8f0f8");
    pset(ctx, 9, 5, "#e8f0f8");
    pset(ctx, 3, 7, "#fff");
    pset(ctx, 11, 7, "#fff");
    pset(ctx, 5, 9, "#e8f0f8");
    pset(ctx, 9, 9, "#e8f0f8");
    pset(ctx, 7, 11, "#fff");
  }
}

function drawCropIcon(ctx, x, y, cropId) {
  const d = {
    radish: () => {
      prect(ctx, x + 2, y + 4, 4, 3, "#f2a0a8");
      prect(ctx, x + 3, y + 3, 2, 1, "#f8c0c4");
      pset(ctx, x + 3, y + 1, "#3a9a3a");
      pset(ctx, x + 4, y + 1, "#3a9a3a");
      pset(ctx, x + 2, y + 2, "#3a9a3a");
      pset(ctx, x + 5, y + 2, "#3a9a3a");
    },
    lettuce: () => {
      prect(ctx, x + 1, y + 2, 6, 5, "#5cb85c");
      prect(ctx, x + 2, y + 3, 4, 3, "#7ad07a");
      pset(ctx, x + 3, y + 4, "#3a9a3a");
    },
    carrot: () => {
      prect(ctx, x + 3, y + 3, 2, 4, "#e87830");
      pset(ctx, x + 3, y + 7, "#d06020");
      pset(ctx, x + 2, y + 1, "#3a9a3a");
      pset(ctx, x + 3, y + 1, "#3a9a3a");
      pset(ctx, x + 4, y + 1, "#3a9a3a");
      pset(ctx, x + 5, y + 1, "#3a9a3a");
    },
    cabbage: () => {
      prect(ctx, x + 1, y + 2, 6, 5, "#6aaf5a");
      prect(ctx, x + 2, y + 3, 4, 3, "#8fd07a");
      prect(ctx, x + 3, y + 4, 2, 1, "#4a9a4a");
    },
    tomato: () => {
      prect(ctx, x + 2, y + 3, 4, 4, "#d44040");
      pset(ctx, x + 3, y + 4, "#f07070");
      pset(ctx, x + 3, y + 2, "#3a9a3a");
      pset(ctx, x + 4, y + 2, "#3a9a3a");
    },
    strawberry: () => {
      prect(ctx, x + 2, y + 3, 4, 4, "#e04050");
      pset(ctx, x + 3, y + 4, "#fff");
      pset(ctx, x + 4, y + 5, "#fff");
      pset(ctx, x + 3, y + 2, "#3a9a3a");
      pset(ctx, x + 4, y + 2, "#3a9a3a");
    },
    sunflower: () => {
      prect(ctx, x + 1, y + 1, 6, 5, "#f0c020");
      prect(ctx, x + 3, y + 2, 2, 2, "#5a3a10");
      prect(ctx, x + 3, y + 6, 2, 2, "#3a9a3a");
    },
    pumpkin: () => {
      prect(ctx, x + 1, y + 3, 6, 4, "#e07020");
      prect(ctx, x + 2, y + 2, 4, 1, "#e07020");
      pset(ctx, x + 2, y + 4, "#c06018");
      pset(ctx, x + 5, y + 4, "#c06018");
      prect(ctx, x + 3, y + 1, 2, 2, "#3a9a3a");
    },
  };
  (d[cropId] || d.radish)();
}

function drawSeedPacket(ctx, x, y, cropId) {
  prect(ctx, x + 1, y + 1, 6, 7, "#f5f0e0");
  prect(ctx, x + 1, y + 1, 6, 2, "#6a9a5a");
  prect(ctx, x + 2, y + 4, 4, 3, "#e8dcc0");
  pset(ctx, x + 3, y + 5, "#d44040");
  pset(ctx, x + 4, y + 5, "#50a050");
}

function drawSeedBag(ctx, x, y, cropId) {
  prect(ctx, x + 1, y + 3, 6, 5, "#e8dcc0");
  prect(ctx, x + 2, y + 2, 4, 2, "#d4c4a0");
  prect(ctx, x + 3, y + 1, 2, 1, "#c4b490");
  pset(ctx, x + 3, y + 5, "#6a9a5a");
  pset(ctx, x + 4, y + 5, "#6a9a5a");
}

function drawFishIcon(ctx, x, y, fishId, sizeMul = null) {
  const colors = {
    minnow: "#a0c8e0", perch: "#70a060", bass: "#4a7850", trout: "#c07060",
    catfish: "#6a6a70", salmon: "#e09080", goldfish: "#e0a020",
  };
  const sizes = {
    minnow: 1.0, perch: 1.3, bass: 1.7, trout: 1.8,
    catfish: 1.9, salmon: 2.4, goldfish: 1.15,
  };
  const body = colors[fishId] || "#6a9ab0";
  const s = sizeMul != null ? sizeMul : (sizes[fishId] || 1);
  const bw = Math.max(3, Math.min(7, Math.round(3 + s * 1.5)));
  const bh = Math.max(2, Math.min(5, Math.round(1.5 + s * 1.1)));
  const ox = x + Math.floor((8 - bw - 1) / 2);
  const oy = y + Math.floor((8 - bh) / 2);
  prect(ctx, ox, oy + 1, bw - 1, bh, body);
  prect(ctx, ox + 1, oy, bw - 3, 1, shade(body, 25));
  pset(ctx, ox + bw - 1, oy + 1, body);
  pset(ctx, ox + bw, oy, body);
  pset(ctx, ox + bw, oy + bh, body);
  if (s >= 1.6) {
    pset(ctx, ox + bw - 1, oy, shade(body, -10));
    pset(ctx, ox + bw - 1, oy + bh, shade(body, -10));
  }
  pset(ctx, ox + 1, oy + Math.floor(bh / 2) + 1, "#1a1a1a");
  if (s >= 1.5) pset(ctx, ox + 2, oy + Math.floor(bh / 2) + 1, shade(body, 40));
}

function drawPixelCrate(ctx, w, h, items, empty) {
  ctx.clearRect(0, 0, w, h);
  prect(ctx, 4, 6, w - 8, h - 8, "#a87840");
  prect(ctx, 5, 7, w - 10, h - 10, "#8b6230");
  for (let y = 10; y < h - 10; y += 5) prect(ctx, 6, y, w - 12, 1, "#7a5528");
  prect(ctx, 4, 6, 2, h - 8, "#c49458");
  prect(ctx, w - 6, 6, 2, h - 8, "#6b4423");
  prect(ctx, 4, 6, w - 8, 3, "#c49458");
  prect(ctx, 4, h - 5, w - 8, 3, "#6b4423");
  prect(ctx, 0, Math.floor(h / 2) - 4, 5, 8, "#5a381c");
  prect(ctx, 1, Math.floor(h / 2) - 3, 3, 6, "#3d2814");
  prect(ctx, w - 5, Math.floor(h / 2) - 4, 5, 8, "#5a381c");
  prect(ctx, w - 4, Math.floor(h / 2) - 3, 3, 6, "#3d2814");
  const inX = 9, inY = 12, inW = w - 18, inH = h - 20;
  prect(ctx, inX, inY, inW, inH, "#3d2814");
  for (let i = 0; i < 10; i++) {
    pset(ctx, inX + 2 + (i * 5) % (inW - 4), inY + 2 + (i * 3) % (inH - 4), "#4a3220");
  }
  if (empty || !items || !items.length) return;
  const iw = 8, gap = 1;
  const cols = Math.max(1, Math.floor((inW - 2) / (iw + gap)));
  const rows = Math.max(1, Math.floor((inH - 2) / (iw + gap)));
  const maxItems = cols * rows;
  const padX = inX + 1 + Math.floor(((inW - 2) - cols * (iw + gap) + gap) / 2);
  const padY = inY + 1;
  items.slice(0, maxItems).forEach((it, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ix = padX + col * (iw + gap);
    const iy = padY + row * (iw + gap);
    if (ix + iw > inX + inW || iy + iw > inY + inH) return;
    if (it.seed) drawSeedBag(ctx, ix, iy, it.cropId);
    else if (it.fish) drawFishIcon(ctx, ix, iy, it.cropId);
    else drawCropIcon(ctx, ix, iy, it.cropId);
  });
}

function drawFrontBooth(ctx, w, h, colorI = 0) {
  const cloth = PX.cloth[colorI % PX.cloth.length];
  prect(ctx, 0, h - 18, w, 18, PX.grass);
  prect(ctx, 20, h - 28, w - 40, 14, PX.wood);
  prect(ctx, 20, h - 28, w - 40, 3, PX.woodLight);
  prect(ctx, 20, h - 16, w - 40, 2, PX.woodDark);
  prect(ctx, 28, 8, 6, h - 36, PX.woodDark);
  prect(ctx, 30, 8, 2, h - 36, PX.wood);
  prect(ctx, w - 34, 8, 6, h - 36, PX.woodDark);
  prect(ctx, w - 32, 8, 2, h - 36, PX.wood);
  prect(ctx, 18, 4, w - 36, 22, cloth);
  prect(ctx, 20, 2, w - 40, 4, shade(cloth, 25));
  for (let x = 22; x < w - 24; x += 10) {
    prect(ctx, x, 20, 6, 10, (x / 10) % 2 ? shade(cloth, -25) : cloth);
  }
  for (let x = 22; x < w - 24; x += 8) {
    prect(ctx, x, 28, 5, 3, shade(cloth, -15));
  }
}

window.PX = PX;
window.pxCtx = pxCtx;
window.pset = pset;
window.prect = prect;
window.shade = shade;
window.prand = prand;
window.fillGrass = fillGrass;
window.drawCurvedPath = drawCurvedPath;
window.drawTree = drawTree;
window.drawShrub = drawShrub;
window.drawPerson = drawPerson;
window.drawPersonClose = drawPersonClose;
window.drawShopBooth = drawShopBooth;
window.drawBuilding = drawBuilding;
window.drawCropIcon = drawCropIcon;
window.drawSeedPacket = drawSeedPacket;
window.drawSeedBag = drawSeedBag;
window.drawFishIcon = drawFishIcon;
window.drawLakeTree = drawLakeTree;
window.drawLakeBush = drawLakeBush;
window.drawLilyPad = drawLilyPad;
window.drawPixelCrate = drawPixelCrate;
window.drawFrontBooth = drawFrontBooth;
window.seasonPalette = seasonPalette;
window.drawSeasonIcon = drawSeasonIcon;
