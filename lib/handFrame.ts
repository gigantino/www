type Point = [number, number];

export type FrameStyle = { fill: string; fillOpacity: number; stroke: string; strokeWidth: number; radius: number };

export function handGeometry() {
  function seeded(seed: number) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function outline(rand: () => number, x: number, y: number, w: number, h: number, radius: number, amp: number) {
    const between = (a: number, b: number) => a + rand() * (b - a);
    const r = Math.max(2, Math.min(radius * between(0.75, 1.25), w / 2, h / 2));
    const jitter = () => [between(-amp, amp), between(-amp, amp)] as Point;
    const corners: { c: Point; from: number; d: Point }[] = [
      { c: [x + r, y + r], from: Math.PI, d: jitter() },
      { c: [x + w - r, y + r], from: Math.PI * 1.5, d: jitter() },
      { c: [x + w - r, y + h - r], from: 0, d: jitter() },
      { c: [x + r, y + h - r], from: Math.PI * 0.5, d: jitter() },
    ];
    const points: Point[] = [];
    corners.forEach((corner, i) => {
      for (let k = 0; k <= 2; k++) {
        const a = corner.from + (Math.PI / 2) * (k / 2);
        points.push([corner.c[0] + Math.cos(a) * r + corner.d[0], corner.c[1] + Math.sin(a) * r + corner.d[1]]);
      }
      const next = corners[(i + 1) % 4];
      const start = points[points.length - 1];
      const endAngle = next.from;
      const end: Point = [next.c[0] + Math.cos(endAngle) * r + next.d[0], next.c[1] + Math.sin(endAngle) * r + next.d[1]];
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      const steps = Math.max(1, Math.round(length / 34));
      const nx = -(end[1] - start[1]) / (length || 1);
      const ny = (end[0] - start[0]) / (length || 1);
      const phase = between(0, Math.PI * 2);
      const waves = between(0.6, 1.6) * Math.max(1, length / 260);
      const bow = between(-amp, amp) * 0.9;
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const off = bow * Math.sin(Math.PI * t) + amp * 0.55 * Math.sin(Math.PI * 2 * waves * t + phase) + between(-0.25, 0.25);
        points.push([start[0] + (end[0] - start[0]) * t + nx * off, start[1] + (end[1] - start[1]) * t + ny * off]);
      }
    });
    return points;
  }

  function curve(points: Point[], closed: boolean, digits = 1) {
    const f = (n: number) => n.toFixed(digits);
    const n = points.length;
    const at = (i: number) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f(points[0][0])},${f(points[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
    }
    return closed ? d + "Z" : d;
  }

  function stroked(points: Point[], rand: () => number) {
    const start = Math.floor(rand() * points.length);
    const ordered = [...points.slice(start), ...points.slice(0, start)];
    const overshoot = ordered.slice(0, 2).map(([px, py]) => [px + (rand() - 0.5) * 2.4, py + (rand() - 0.5) * 2.4] as Point);
    return curve([...ordered, ...overshoot], false);
  }

  const svgUrl = (w: number, h: number, body: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}")`;

  function paint(w: number, h: number, body: Point[], shadow: Point[], rand: () => number, style: FrameStyle, sw: string | number, fillAttrs: string) {
    const fill = style.fill ? `<path d="${curve(body, true)}" fill="${style.fill}"${fillAttrs}/>` : "";
    const frame = svgUrl(
      w,
      h,
      `${fill}<path d="${stroked(body, rand)}" fill="none" stroke="${style.stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
    const shade = svgUrl(w, h, `<path d="${curve(shadow, true)}" fill="${style.stroke}" stroke="${style.stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`);
    return { frame, shade };
  }

  function handFrame(seed: number, width: number, height: number, pad: number, style: FrameStyle) {
    const rand = seeded(seed);
    const amp = Math.min(2.2, 0.9 + Math.min(width, height) / 160);
    const inset = style.strokeWidth / 2;
    const body = outline(rand, pad + inset, pad + inset, width - style.strokeWidth, height - style.strokeWidth, style.radius, amp);
    const sw = (style.strokeWidth * (0.92 + rand() * 0.22)).toFixed(2);
    return paint(width + pad * 2, height + pad * 2, body, body, rand, style, sw, ` fill-opacity="${style.fillOpacity}"`);
  }

  function handFrameInside(seed: number, width: number, height: number, style: FrameStyle) {
    const rand = seeded(seed);
    const shift = 4;
    const lead = style.strokeWidth / 2 + 2.5;
    const tail = style.strokeWidth / 2 + 0.5;
    const amp = Math.min(1.6, 0.7 + Math.min(width, height) / 200);
    const body = outline(rand, lead, lead, width - shift - lead - tail, height - shift - lead - tail, style.radius, amp);
    const shadow = body.map(([x, y]) => [x + shift, y + shift] as Point);
    return paint(width, height, body, shadow, rand, style, style.strokeWidth, "");
  }

  function handBlob(seed: number, size: number, inset: number) {
    const rand = seeded(seed);
    const between = (a: number, b: number) => a + rand() * (b - a);
    const c = size / 2;
    const r = c - inset;
    const count = 8;
    const turn = between(0, Math.PI * 2);
    const squash = between(0.85, 1.15);
    const points: Point[] = [];
    for (let i = 0; i < count; i++) {
      const a = turn + (i / count) * Math.PI * 2 + between(-0.18, 0.18);
      const k = r * between(0.82, 1.06);
      points.push([c + Math.cos(a) * k * squash, c + Math.sin(a) * k / squash]);
    }
    return { clip: curve(points, true), stroke: stroked(points, rand) };
  }

  function between(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  function wave(fromX: number, toX: number, baseY: number, tilt: number, amplitude: number, frequency: number, phase: number) {
    const steps = 12;
    const points: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push([
        fromX + (toX - fromX) * t,
        baseY + tilt * (t - 0.5) + amplitude * Math.sin(Math.PI * 2 * frequency * t + phase) + between(-0.15, 0.15),
      ]);
    }
    return points;
  }

  function crossingPair() {
    const baseY = between(4.4, 5.4);
    const tilt = between(-1.2, 1.2);
    const frequency = between(0.8, 1.4);
    const phase = between(0, Math.PI * 2);
    const gap = between(0.9, 1.4);
    const first = wave(between(0, 3), between(95, 100), baseY - gap / 2, tilt, between(0.7, 1.1), frequency, phase);
    const second = wave(
      between(2, 8),
      between(90, 99),
      baseY + gap / 2,
      tilt + between(-0.4, 0.4),
      between(0.7, 1.1),
      frequency + between(-0.15, 0.15),
      phase + Math.PI + between(-0.5, 0.5),
    );
    return [first, second];
  }

  function handUnderlineSvg(color: string, strokeWidth: number) {
    const [main, second] = crossingPair();

    if (Math.random() < 0.3) {
      const [x, y] = main[0];
      main.unshift([x + between(0.4, 1.2), y - between(1, 2)]);
    }
    if (Math.random() < 0.35) {
      const [x, y] = second[second.length - 1];
      second.push([x - between(0.6, 1.6), y - between(1.4, 2.6)]);
    }

    const paths = [curve(main, false, 2), curve(second, false, 2)];
    const widths = [strokeWidth * 0.85, strokeWidth * between(0.6, 0.75)];

    const body = paths
      .map((d, i) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${widths[i].toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`)
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none">${body}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  return { seeded, handFrame, handFrameInside, handBlob, handUnderlineSvg };
}

export type HandGeometry = ReturnType<typeof handGeometry>;

export function createHandSeed() {
  return Math.floor(Math.random() * 2 ** 31) + 1;
}

export function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const { seeded, handFrame, handFrameInside, handBlob, handUnderlineSvg } = handGeometry();
