// The Record Reader: an isometric figure of the Health Hub domain model.
// A Record lies on a platen. An extraction head scans it line by line. Each Fact it
// finds rises out of a slot on the Timeline rail at the date it refers to, with a
// citation wire back to the line on the page it came from (its Source). A thread
// strings three Facts into a Pathway. One Fact comes from a Person Statement on a
// slip at the front, marked as the Person's Account. The dial counts Facts found.
//
// Build: node build.mjs [--light]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "/Users/owainwilliams/.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "/Users/owainwilliams/.claude/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 600;
const HEIGHT = 380;

// ---- Truth: the model --------------------------------------------------------
// The Timeline rail spans 1 Jan 2025 to 1 Jun 2025 (151 days) over 144 world units.
const RAIL_FROM = -26, RAIL_TO = 108;
const DAYS = 151;
const perDay = (RAIL_TO - RAIL_FROM) / DAYS;
const dayOf = (m, d) => [0, 31, 59, 90, 120, 151][m - 1] + d - 1;
const xOfDate = (m, d) => RAIL_FROM + dayOf(m, d) * perDay;

// Facts, in the order the head meets them. `line` is the y of the line on the page.
const FACTS = [
  { name: "Referral",     kind: "Referral",     date: [1, 14], line: -24, source: "letter" },
  { name: "HbA1c 48",     kind: "Measurement",  date: [3, 3],  line: -6,  source: "letter" },
  { name: "Appointment",  kind: "Appointment",  date: [3, 21], line: 12,  source: "letter" },
  { name: "Metformin",    kind: "Medication",   date: [4, 10], line: null, source: "person" },
];
const PATHWAY = [0, 1, 2]; // Referral → HbA1c → Appointment, a Confirmed Pathway
const FACTS_PER_TURN = 5;

// ---- World layout ----------------------------------------------------------------
const PLATE = { x: -140, y: -60, w: 256, d: 120, r: 8 };
const PLATE_H = 12, FOOT_H = 5;

const PLATEN = { x: -124, y: -46, w: 76, d: 92, r: 2.5 };
const PLATEN_H = 6;
const GLASS_Z = PLATEN_H, GLASS_H = 0.6;
const SHEET = { x: -118, y: -38, w: 60, d: 76, r: 0.6 };
const SHEET_Z = GLASS_Z + GLASS_H, SHEET_H = 0.8, SHEET_TOP = SHEET_Z + SHEET_H;

const RAIL_X = [-131, -45];           // the two scanner rails, running along y
const RAIL_Y0 = -52, RAIL_Y1 = 52;
const POST_Z = 0, POST_TOP = 14;
const RAIL_Z = POST_TOP, RAIL_H = 2.5, RAIL_TOP = RAIL_Z + RAIL_H;
const HEAD_Z = RAIL_TOP;              // bushings ride on the rail tops
const HEAD_Y0 = -44, HEAD_Y1 = 44;    // head travel
const SENSOR_X = (SHEET.x + SHEET.x + SHEET.w) / 2;

const STRIP = { x: -32, y: -10, w: 146, d: 17, r: 1.2 };
const STRIP_Z = 0, STRIP_H = 2.2, STRIP_TOP = STRIP_Z + STRIP_H;
const CARD_W = 9, CARD_D = 1.8, CARD_H = 16, CARD_Y = -5;
const CARD_DOWN = -(CARD_H + 1.5);    // fully sunk: top sits below the slot

const SLIP_HOLDER = { x: -120, y: 50, w: 36, d: 9, r: 1 };
const SLIP = { x: -118, y: 51.6, w: 32, d: 5.8, r: 0.5 };
const SLIP_Z = 1, SLIP_TOP = SLIP_Z + 0.6;

const DIAL = [92, -34];
const DIAL_R = 15, PED_R = 6.5, PED_H = 9, DIAL_Z = PED_H, DIAL_H = 8, DIAL_TOP = DIAL_Z + DIAL_H;

const LABEL = { x: 60, y: 38, w: 44, d: 12, r: 1 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [DIAL[0] + DIAL_R, DIAL[1], DIAL_TOP + 4], [RAIL_X[0], RAIL_Y0, HEAD_Z + 10], [STRIP.x + STRIP.w, STRIP.y, STRIP_TOP + CARD_H + 2]],
  WIDTH, HEIGHT, { pad: 26, azimuth: 42, elevation: 33 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// Convex hull of screen points (Andrew's monotone chain), for the card slot clips.
function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  for (const p of pts.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
const pathOf = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";

// ---- Base -------------------------------------------------------------------------
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // label plate, front right
  out.push(S(k.slabOf(LABEL, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P), { tone: "faint" }));
  const rx = LABEL.x + 5;
  out.push(L([[26, LABEL.y + 3.4], [18, LABEL.y + 6], [31, LABEL.y + 8.6]].map(([len, y]) => k.lineOnTop([rx, y], [rx + len, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([LABEL.x + 2.4, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 2.4, LABEL.y + LABEL.d / 2, 0.8])], { size: 0.45 }));
  return out.join("");
}

// ---- Platen, Record sheet and Person Statement slip --------------------------------
function platen() {
  const out = [];
  out.push(S(k.slabOf(PLATEN, 0, PLATEN_H, P, 5, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATEN, 1.6), PLATEN_H, P, 5), { tone: "faint" }));
  // glass, recessed
  out.push(S(k.slabOf(k.insetPlan(PLATEN, 3), GLASS_Z, GLASS_H, P, 4), { tone: "lo", crease: "none" }));
  // four corner clamps holding the glass
  for (const [x, y] of byDepth(k.corners(PLATEN, 5))) {
    out.push(S(k.slabOf({ x: x - 2.2, y: y - 2.2, w: 4.4, d: 4.4, r: 1 }, PLATEN_H, 1.6, P, 3, 0.3), { tone: "mid" }));
    out.push(D([at([x, y, PLATEN_H + 1.6])], { size: 0.45 }));
  }
  // the Record: a clinic letter
  out.push(S(k.slabOf(SHEET, SHEET_Z, SHEET_H, P, 3), { tone: "hi", crease: "lo" }));
  const lx = SHEET.x + 5, right = SHEET.x + SHEET.w - 5;
  const rules = [];
  // letterhead block: two short lines top right, then the address lines left
  rules.push(k.lineOnTop([right - 16, SHEET.y + 4], [right, SHEET.y + 4], SHEET_TOP, P));
  rules.push(k.lineOnTop([right - 12, SHEET.y + 6.6], [right, SHEET.y + 6.6], SHEET_TOP, P));
  rules.push(k.lineOnTop([lx, SHEET.y + 8], [lx + 18, SHEET.y + 8], SHEET_TOP, P));
  rules.push(k.lineOnTop([lx, SHEET.y + 10.6], [lx + 14, SHEET.y + 10.6], SHEET_TOP, P));
  // body lines, every 3 units; the Fact lines are drawn separately in hi
  const factLines = new Set(FACTS.filter((f) => f.line !== null).map((f) => f.line));
  for (let y = -27; y <= 30; y += 3) {
    if (factLines.has(y)) continue;
    const len = y % 9 === 0 ? 34 : y % 6 === 0 ? 46 : 50;
    rules.push(k.lineOnTop([lx, y], [lx + len, y], SHEET_TOP, P));
  }
  rules.push(k.lineOnTop([lx, SHEET.y + SHEET.d - 5], [lx + 16, SHEET.y + SHEET.d - 5], SHEET_TOP, P)); // signature
  out.push(L(rules.join(""), { tone: "lo", free: true }));
  // the three lines that carry Facts
  out.push(L(FACTS.filter((f) => f.line !== null).map((f) => k.lineOnTop([lx, f.line], [lx + 50, f.line], SHEET_TOP, P)).join(""), { tone: "mid", free: true }));
  // the Person Statement slip, clipped at the front
  out.push(S(k.slabOf(SLIP_HOLDER, 0, SLIP_Z, P, 3), { tone: "lo", crease: "none" }));
  out.push(S(k.slabOf(SLIP, SLIP_Z, 0.6, P, 2), { tone: "mid", crease: "none" }));
  out.push(L([[18, 1.8], [24, 4]].map(([len, dy]) => k.lineOnTop([SLIP.x + 3, SLIP.y + dy], [SLIP.x + 3 + len, SLIP.y + dy], SLIP_TOP, P)).join(""), { tone: "lo", free: true }));
  for (const x of [SLIP_HOLDER.x + 3, SLIP_HOLDER.x + SLIP_HOLDER.w - 3]) {
    out.push(S(k.slabOf({ x: x - 1.6, y: SLIP_HOLDER.y + 1, w: 3.2, d: 3, r: 0.6 }, SLIP_Z, 2.6, P, 2, 0.3), { tone: "mid" }));
    out.push(D([at([x, SLIP_HOLDER.y + 2.5, SLIP_Z + 2.6])], { size: 0.4 }));
  }
  return out.join("");
}

// ---- Scanner: posts, rails, head ---------------------------------------------------
function post(x, y) {
  const out = [];
  out.push(S(k.cylinder(x, y, 4.2, POST_Z, 2, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(x, y, 2.8, POST_Z + 2, POST_TOP - 2, P, 24), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(x, y, 2.8, POST_Z + 8, P, 14), { tone: "faint" }));
  return out.join("");
}
function endStop(x, y, near) {
  const plan = { x: x - 4, y: y - 2.5, w: 8, d: 5, r: 1 };
  const out = [S(k.slabOf(plan, RAIL_Z, 6, P, 3, 0.5), { tone: "mid" })];
  out.push(D([at([x - 2.2, y, RAIL_Z + 6]), at([x + 2.2, y, RAIL_Z + 6])], { size: 0.45 }));
  if (near) {
    // feed knob on the near stop of the right-hand rail
    out.push(S(k.cylinder(x, y + 4.5, 2.6, RAIL_Z, 6, P, 20), { tone: "mid" }));
    out.push(L(k.knurl(x, y + 4.5, 2.6, RAIL_Z, RAIL_Z + 6, 18, P), { tone: "lo" }));
  }
  return out.join("");
}
function farPosts() { return RAIL_X.map((x) => post(x, RAIL_Y0 + 4)).join("") + RAIL_X.map((x) => endStop(x, RAIL_Y0 + 4, false)).join(""); }
function nearPosts() { return RAIL_X.map((x) => post(x, RAIL_Y1 - 4)).join("") + RAIL_X.map((x, i) => endStop(x, RAIL_Y1 - 4, i === 1)).join(""); }
function rails() {
  const out = [];
  for (const x of RAIL_X) {
    out.push(S(k.slabOf({ x: x - 1.6, y: RAIL_Y0, w: 3.2, d: RAIL_Y1 - RAIL_Y0, r: 0.8 }, RAIL_Z, RAIL_H, P, 3, 0.4), { tone: "mid" }));
  }
  return out.join("");
}
function head() {
  // built at y = 0, moved with translateAlong
  const out = [];
  const bar = { x: RAIL_X[0] - 3, y: -2, w: RAIL_X[1] - RAIL_X[0] + 6, d: 4, r: 1 };
  for (const x of RAIL_X) {
    const b = { x: x - 3.5, y: -4.5, w: 7, d: 9, r: 1.2 };
    out.push(S(k.slabOf(b, HEAD_Z, 5, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x, -2.6, HEAD_Z + 5]), at([x, 2.6, HEAD_Z + 5])], { size: 0.45 }));
  }
  // lens under the bar, pointing at the page
  out.push(S(k.cylinder(SENSOR_X, 0, 2.6, HEAD_Z + 0.2, 2.5, P, 20), { tone: "hi", crease: "none", lit: true }));
  out.push(S(k.slabOf(bar, HEAD_Z + 2.5, 3, P, 3, 0.5), { tone: "mid" }));
  out.push(L(k.lineOnTop([bar.x + 2, 0], [bar.x + bar.w - 2, 0], HEAD_Z + 5.5, P), { tone: "faint", free: true }));
  // sensor block: the lit part
  const sensor = { x: SENSOR_X - 8, y: -3.6, w: 16, d: 7.2, r: 1.2 };
  out.push(S(k.slabOf(sensor, HEAD_Z + 5.5, 5, P, 4, 0.6), { tone: "hi", crease: "lo", lit: true }));
  out.push(L(k.planOutline(k.insetPlan(sensor, 1.8), HEAD_Z + 10.5, P, 4), { tone: "faint" }));
  out.push(S(k.cylinder(SENSOR_X, 0, 2.2, HEAD_Z + 10.5, 1.4, P, 20), { tone: "hi", lit: true }));
  out.push(L(k.ring(SENSOR_X, 0, 1.1, HEAD_Z + 11.9, P, 14), { tone: "lo" }));
  // ribbon cable from the sensor to the right bushing
  out.push(S(k.slabOf({ x: SENSOR_X + 8, y: -1, w: RAIL_X[1] - 3.5 - (SENSOR_X + 8), d: 2, r: 0.6 }, HEAD_Z + 5.5, 0.8, P, 2), { tone: "lo", crease: "none" }));
  return out.join("");
}

// ---- Timeline rail and Fact cards --------------------------------------------------
function strip() {
  const out = [];
  out.push(S(k.slabOf(STRIP, STRIP_Z, STRIP_H, P, 4, 0.5), { tone: "mid" }));
  // the slot the cards rise through
  out.push(L(k.planOutline({ x: STRIP.x + 3, y: CARD_Y - 0.4, w: STRIP.w - 6, d: CARD_D + 0.8, r: 0.5 }, STRIP_TOP, P, 2), { tone: "lo" }));
  // date ticks hanging from the front edge: one a week, a major every four weeks
  const ticks = k.topTicks(RAIL_FROM, RAIL_TO, 7 * perDay, 4, STRIP.y + STRIP.d - 0.8, STRIP_TOP, [-2.2, -3.8], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop([RAIL_FROM, STRIP.y + STRIP.d - 0.8], [RAIL_TO, STRIP.y + STRIP.d - 0.8], STRIP_TOP, P), { tone: "mid" }));
  out.push(D([at([STRIP.x + 2, STRIP.y + 2, STRIP_TOP]), at([STRIP.x + STRIP.w - 2, STRIP.y + 2, STRIP_TOP]), at([STRIP.x + 2, STRIP.y + STRIP.d - 2, STRIP_TOP]), at([STRIP.x + STRIP.w - 2, STRIP.y + STRIP.d - 2, STRIP_TOP])], { size: 0.45 }));
  out.push(k.faceTextSvg(k.topMatrix([RAIL_FROM, STRIP.y + 1.6], STRIP_TOP, P, "x"), "2025", { size: 2.2, tone: "lo" }));
  return out.join("");
}
const cardX = (f) => xOfDate(...f.date);
function card(f, i) {
  const cx = cardX(f);
  const plan = { x: cx - CARD_W / 2, y: CARD_Y, w: CARD_W, d: CARD_D, r: 0.4 };
  const z0 = STRIP_TOP, top = z0 + CARD_H;
  const own = f.source === "person";
  const out = [];
  out.push(S(k.slabOf(plan, z0, CARD_H, P, 2, 0.4), { tone: own ? "mid" : "hi", crease: "lo" }));
  // the Fact's text as rule lines on the near face, the first line longer
  const fy = plan.y + plan.d;
  out.push(L([[top - 3.2, 6.2], [top - 5.8, 4.6], [top - 8.4, 5.4], [top - 11, 3.8]].map(([z, len]) => k.segment([cx - CARD_W / 2 + 1, fy, z], [cx - CARD_W / 2 + 1 + len, fy, z], P)).join(""), { tone: own ? "lo" : "mid", free: true }));
  // a Person's Account carries a mark: a small ring on its face
  if (own) out.push(L(k.sideRing([cx + CARD_W / 2 - 2, fy, z0 + 2.6], 1.1, "y", P), { tone: "hi" }));
  // eyelet on top for the Pathway thread
  out.push(S(k.cylinder(cx, CARD_Y + CARD_D / 2, 1.1, top, 1.2, P, 14), { tone: "mid" }));
  out.push(D([at([cx, CARD_Y + CARD_D / 2, top + 1.2])], { size: 0.4, tone: "lo" }));
  return `<g data-card="${i}" transform="${k.translateAlong(P, [0, 0, CARD_DOWN])}">${out.join("")}</g>`;
}
function cardClip(f, i) {
  const cx = cardX(f);
  const plan = { x: cx - CARD_W / 2 - 0.6, y: CARD_Y - 0.6, w: CARD_W + 1.2, d: CARD_D + 1.2, r: 0 };
  const pts = [...k.boxCorners(plan, STRIP_TOP, STRIP_TOP + CARD_H + 6)].map(at);
  return `<clipPath id="slot-${i}"><path d="${pathOf(hull(pts))}"/></clipPath>`;
}
function cards() {
  // far cards first (larger x is nearer? sort by depth)
  const order = FACTS.map((f, i) => i).sort((a, b) => k.depthOf([cardX(FACTS[a]), CARD_Y, 0], P) - k.depthOf([cardX(FACTS[b]), CARD_Y, 0], P));
  return `<defs>${FACTS.map(cardClip).join("")}</defs>` + order.map((i) => `<g clip-path="url(#slot-${i})">${card(FACTS[i], i)}</g>`).join("");
}

// ---- Dial: Facts found -------------------------------------------------------------
function dial() {
  const [x, y] = DIAL;
  const out = [];
  out.push(S(k.cylinder(x, y, PED_R + 2, 0, 1.6, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, PED_R, 1.6, PED_H - 1.6, P, 28), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(x, y, PED_R, 5, P, 14), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3, DIAL_TOP, 72, P, 0.3), { tone: "lo" }));
  out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3, P, 40), { tone: "faint" }));
  out.push(L(k.ring(x, y, DIAL_R - 2, DIAL_TOP, P, 64), { tone: "lo" }));
  const ticks = k.radialTicks(x, y, DIAL_R - 2.6, FACTS_PER_TURN * 10, 10, DIAL_TOP, [1.2, 2.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  // crown on the +x side
  out.push(S(k.slabOf({ x: x + DIAL_R - 1, y: y - 2.2, w: 4.5, d: 4.4, r: 1 }, DIAL_Z + 2, 4.5, P, 3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x + DIAL_R + 3.2, y: y - 3, w: 2.4, d: 6, r: 1 }, DIAL_Z + 1.4, 5.8, P, 3), { tone: "mid" }));
  out.push(L(k.ring(x, y, 1.5, DIAL_TOP, P, 16), { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 7.5], DIAL_TOP, P, "x"), "FACTS", { size: 2.2, tone: "lo", anchor: "middle" }));
  return out.join("");
}
const needleAt = (count) => {
  const angle = (count / FACTS_PER_TURN) * Math.PI * 2;
  const [x, y] = DIAL;
  return k.lineOnTop([x - Math.sin(angle) * 3, y + Math.cos(angle) * 3], [x + Math.sin(angle) * (DIAL_R - 4), y - Math.cos(angle) * (DIAL_R - 4)], DIAL_TOP + 0.2, P);
};

// ---- Wires and thread: geometry the page rebuilds per frame -----------------------
// Each citation wire runs from the card's foot to its Source on the page or slip.
const SOURCES = FACTS.map((f) => (f.source === "person" ? [SLIP.x + 16, SLIP.y + 2.9, SLIP_TOP] : [SHEET.x + 5 + 50, f.line, SHEET_TOP]));
const FEET = FACTS.map((f) => [cardX(f), CARD_Y + CARD_D, STRIP_TOP]);
const TOPS = FACTS.map((f) => [cardX(f), CARD_Y + CARD_D / 2, STRIP_TOP + CARD_H + 1.2]);

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "The Record Reader. A clinic letter lies on a glass platen. An extraction head on two rails scans it line by line. Each Fact it finds rises out of a slot on the Timeline rail at the date it refers to, with a citation wire back to the line on the letter it came from. A thread strings the referral, the HbA1c result and the appointment into a Pathway. A fourth Fact comes from a Person Statement on a slip at the front and is marked as the Person's own account. A dial counts the Facts found.",
  body: [
    plate(),
    platen(),
    dial(),
    strip(),
    farPosts(),
    rails(),
    cards(),
    `<g data-part="wires"></g>`,
    `<g data-part="head" transform="${k.translateAlong(P, [0, HEAD_Y0, 0])}">${head()}</g>`,
    nearPosts(),
    `<g data-part="thread"></g>`,
    `<path data-part="needle" class="iso-line" data-tone="hi" data-free="start" d="${needleAt(0)}" style="stroke-width:1.1"/>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const FACTS = ${JSON.stringify(FACTS)};
const PATHWAY = ${JSON.stringify(PATHWAY)};
const SOURCES = ${JSON.stringify(SOURCES)};
const FEET = ${JSON.stringify(FEET)};
const TOPS = ${JSON.stringify(TOPS)};
const DIAL = ${JSON.stringify(DIAL)}, DIAL_R = ${DIAL_R}, DIAL_TOP = ${DIAL_TOP}, FACTS_PER_TURN = ${FACTS_PER_TURN};
const HEAD_Y0 = ${HEAD_Y0}, HEAD_Y1 = ${HEAD_Y1}, CARD_DOWN = ${CARD_DOWN};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const headEl = svg.querySelector('[data-part="head"]');
const wiresEl = svg.querySelector('[data-part="wires"]');
const threadEl = svg.querySelector('[data-part="thread"]');
const needleEl = svg.querySelector('[data-part="needle"]');
const cardEls = FACTS.map((_, i) => svg.querySelector('[data-card="' + i + '"]'));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const at = (p) => iso(p, P);
const needleAt = ${needleAt.toString().replace("k.lineOnTop", "lineOnTop")};
// Where along the scan each Fact is met: the head reaches its line on the page, or the run completes for the slip.
const headY = (s) => HEAD_Y0 + (HEAD_Y1 - HEAD_Y0) * s;
const metAt = FACTS.map((f) => (f.line === null ? 0.985 : (f.line - HEAD_Y0) / (HEAD_Y1 - HEAD_Y0)));
const STOPS = [0, ...FACTS.map((f, i) => (f.line === null ? null : metAt[i] + 0.03)).filter((v) => v !== null), 1];
let s = 0, target = 0;
const cards = FACTS.map(() => ({ z: CARD_DOWN, rate: 0 }));
let needle = { at: 0, rate: 0 };
let frame = 0, last = 0, clock = 0, touring = true, visible = false, idleTimer = 0;
// The idle tour: scan across in 6 s, rest 2.4 s with every Fact up, drop back over 0.8 s and go again.
const tourAt = (t) => { const T = 9.2, u = t % T; if (u < 6) return u / 6; if (u < 8.4) return 1; return 1 - (u - 8.4) / 0.8; };
const lift = (i) => clamp((cards[i].z - CARD_DOWN) / -CARD_DOWN, 0, 1);
function draw() {
  headEl.setAttribute("transform", translateAlong(P, [0, headY(s), 0]));
  cards.forEach((c, i) => cardEls[i].setAttribute("transform", translateAlong(P, [0, 0, c.z])));
  const wires = FACTS.map((f, i) => {
    const a = lift(i); if (a < 0.02) return "";
    const foot = FEET[i], src = SOURCES[i];
    const via = at([(foot[0] + src[0]) / 2, (foot[1] + src[1]) / 2, 9 + 3 * a]);
    return '<g opacity="' + a.toFixed(2) + '">' + wireSvg(at(foot), at(src), { via: [via], tone: f.source === "person" ? "lo" : "mid", dotted: f.source === "person", size: 1 }) + "</g>";
  }).join("");
  if (wiresEl.innerHTML !== wires) wiresEl.innerHTML = wires;
  const a = Math.min(...PATHWAY.map(lift));
  let thread = "";
  if (a > 0.02) {
    const pts = PATHWAY.map((i) => TOPS[i]);
    const via = [];
    for (let j = 0; j < pts.length - 1; j++) via.push(at([(pts[j][0] + pts[j + 1][0]) / 2, pts[j][1], pts[j][2] + 2]), ...(j < pts.length - 2 ? [at(pts[j + 1])] : []));
    thread = '<g opacity="' + a.toFixed(2) + '">' + wireSvg(at(pts[0]), at(pts[pts.length - 1]), { via, tone: "hi", dashed: true, size: 0.9 }) + "</g>";
  }
  if (threadEl.innerHTML !== thread) threadEl.innerHTML = thread;
  needleEl.setAttribute("d", needleAt(needle.at));
  const met = FACTS.filter((_, i) => s >= metAt[i]);
  const fromLetter = met.filter((f) => f.source === "letter").length, fromPerson = met.length - fromLetter;
  const pct = Math.round(s * 100);
  const text = (s >= 1 ? "Run complete" : "scanning " + pct + "%") + " · " + fromLetter + " Fact" + (fromLetter === 1 ? "" : "s") + " · " + fromPerson + " by the Person";
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(pct));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring) { clock += dt; target = tourAt(clock); }
  s = calm ? target : s + (target - s) * (1 - Math.exp(-dt / 0.22));
  if (Math.abs(target - s) < 0.0005) s = target;
  let moving = touring || s !== target;
  const stiff = 320, drag = calm ? 2 * Math.sqrt(320) : 22;
  cards.forEach((c, i) => {
    const want = s >= metAt[i] ? 0 : CARD_DOWN;
    for (let k = 0; k < 4; k++) { c.rate += ((want - c.z) * stiff - c.rate * drag) * dt / 4; c.z += c.rate * dt / 4; }
    if (Math.abs(want - c.z) < 0.005 && Math.abs(c.rate) < 0.005) { c.z = want; c.rate = 0; } else moving = true;
  });
  const count = FACTS.filter((_, i) => s >= metAt[i]).length;
  for (let k = 0; k < 4; k++) { needle.rate += ((count - needle.at) * 260 - needle.rate * (calm ? 2 * Math.sqrt(260) : 18)) * dt / 4; needle.at += needle.rate * dt / 4; }
  if (Math.abs(count - needle.at) < 0.002 && Math.abs(needle.rate) < 0.002) { needle.at = count; needle.rate = 0; } else moving = true;
  draw();
  frame = visible && moving ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const steer = (next) => { touring = false; target = clamp(next, 0, 1); clearTimeout(idleTimer); idleTimer = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 3600); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) { touring = false; target = 1; }
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  steer(clamp(((event.clientX - box.left) / box.width - 0.12) / 0.76, 0, 1));
});
stage.addEventListener("pointerleave", () => steer(target));
stage.addEventListener("keydown", (event) => {
  const from = touring ? s : target;
  const here = STOPS.reduce((best, stop, i) => (Math.abs(stop - from) < Math.abs(STOPS[best] - from) ? i : best), 0);
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = Math.min(STOPS.length - 1, here + 1);
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = Math.max(0, here - 1);
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = STOPS.length - 1;
  if (to === null) return;
  event.preventDefault();
  steer(STOPS[to]);
});
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "The Record Reader",
  hint: "Hover to scan · arrows step Facts",
  readout: "scanning 0% · 0 Facts · 0 by the Person",
  keys: [
    { mark: "lit", label: "Extraction head: reads the Record line by line" },
    { mark: "raised", label: "Facts, standing on the Timeline at the date they refer to" },
    { mark: "dashed", label: "Pathway thread: referral, HbA1c, appointment" },
    { mark: "dotted", label: "Citation to a Person Statement, the Person's own account" },
  ],
  caption:
    "Health Hub as a bench instrument. A Record never changes on the platen. Every Fact the head lifts from it stands on the Timeline at its own date, wired back to the line it came from. The dial only counts; nothing on the bench judges, flags or advises.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="The Record Reader: arrow keys step the extraction head from Fact to Fact" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">${svg}</div>`,
});

const file = theme === "light" ? "health-hub-light.html" : "health-hub.html";
writeFileSync(join(HERE, file), k.pageHtml({ title: "The Record Reader", theme, body, script: kitScript() + live }));
console.log("wrote", file);
