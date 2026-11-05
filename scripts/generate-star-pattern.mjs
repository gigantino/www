import { readFileSync, writeFileSync } from "node:fs";

const TILE = 720;
const TARGET_SIZE = 46;
const MIN_GAP = 104;
const ATTEMPTS = 4000;
const SEED = 20261105;

const source = readFileSync(new URL("../doodles/stars.svg", import.meta.url), "utf8");
const doodlesGroup = source.match(/<g id="doodles">([\s\S]*?)<\/g>/)?.[1] ?? "";
const paths = [...doodlesGroup.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
const strokeWidth = Number(source.match(/stroke-width:([\d.]+)px/)?.[1] ?? 32);

function samplePoints(d) {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+/g);
  const points = [];
  let i = 0;
  let command = "M";
  let current = [0, 0];
  const read = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[MLC]/.test(tokens[i])) command = tokens[i++];
    if (command === "C") {
      const c1 = [read(), read()];
      const c2 = [read(), read()];
      const end = [read(), read()];
      for (let t = 0; t <= 1; t += 0.05) {
        const u = 1 - t;
        points.push([
          u * u * u * current[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * end[0],
          u * u * u * current[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * end[1],
        ]);
      }
      current = end;
    } else {
      current = [read(), read()];
      points.push(current);
    }
  }
  return points;
}

const shapes = paths.map((d) => {
  const points = samplePoints(d);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    d,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    size: Math.max(maxX - minX, maxY - minY) + strokeWidth,
  };
});

let state = SEED;
function random() {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function wrappedDistance(a, b) {
  const dx = Math.min(Math.abs(a.x - b.x), TILE - Math.abs(a.x - b.x));
  const dy = Math.min(Math.abs(a.y - b.y), TILE - Math.abs(a.y - b.y));
  return Math.hypot(dx, dy);
}

const placed = [];
for (let i = 0; i < ATTEMPTS; i++) {
  const candidate = { x: random() * TILE, y: random() * TILE };
  if (placed.every((p) => wrappedDistance(p, candidate) >= MIN_GAP)) {
    placed.push({
      ...candidate,
      shape: placed.length % shapes.length,
      rotation: Math.round(random() * 360 - 180),
      scale: 0.8 + random() * 0.4,
    });
  }
}

const round = (n) => Math.round(n * 100) / 100;
const uses = [];
for (const p of placed) {
  const shape = shapes[p.shape];
  const s = (TARGET_SIZE * p.scale) / shape.size;
  const reach = (TARGET_SIZE * p.scale) / 2 + 4;
  for (const ox of [-TILE, 0, TILE]) {
    for (const oy of [-TILE, 0, TILE]) {
      const x = p.x + ox;
      const y = p.y + oy;
      if (x + reach < 0 || x - reach > TILE || y + reach < 0 || y - reach > TILE) continue;
      uses.push(
        `<use href="#s${p.shape}" transform="translate(${round(x)} ${round(y)}) rotate(${p.rotation}) scale(${round(s * 1000) / 1000})"/>`,
      );
    }
  }
}

const defs = shapes
  .map((shape, i) => `<path id="s${i}" transform="translate(${round(-shape.cx)} ${round(-shape.cy)})" d="${shape.d}"/>`)
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}"><defs><g fill="none" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${defs}</g></defs><g fill="none" stroke="#000" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${uses.join("")}</g></svg>\n`;

writeFileSync(new URL("../public/star-pattern.svg", import.meta.url), svg);
console.log(`${placed.length} stars, ${uses.length} placements, ${svg.length} bytes`);
