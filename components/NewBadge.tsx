"use client";

import { seeded } from "@/lib/handFrame";
import { NewDoodle } from "@/components/icons";
import { useHandSeed } from "@/components/HandSeed";

const POINTS = 10;

function starburst(seed: number) {
  const rand = seeded(seed);
  const between = (a: number, b: number) => a + rand() * (b - a);
  const tilt = between(-0.2, 0.2);
  const corners: [number, number][] = [];
  for (let i = 0; i < POINTS * 2; i++) {
    const outer = i % 2 === 0;
    const angle = tilt + (Math.PI * i) / POINTS + between(-0.07, 0.07);
    const radius = outer ? between(44, 50) : between(31, 38);
    corners.push([50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius]);
  }
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(corners[0][0])},${f(corners[0][1])}`;
  corners.forEach((_, i) => {
    const [x1, y1] = corners[i];
    const [x2, y2] = corners[(i + 1) % corners.length];
    const bend = between(-1.4, 1.4);
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend * 0.04;
    const my = (y1 + y2) / 2 + (x2 - x1) * bend * 0.04;
    d += `Q${f(mx)},${f(my)} ${f(x2)},${f(y2)}`;
  });
  const [sx, sy] = corners[0];
  const over = `M${f(sx)},${f(sy)}L${f(sx + between(-2, 2))},${f(sy + between(1.5, 3.5))}`;
  return { d: d + "Z", over };
}

export function NewBadge() {
  const seed = useHandSeed() ^ 0x5bd1e995;
  const { d, over } = starburst(seed);
  return (
    <div className="absolute -top-8 -right-8">
      <div className="w-26 h-26 animate-spin" style={{ animationDuration: "20s" }}>
        <svg viewBox="-6 -6 112 112" className="h-full w-full overflow-visible" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} transform="translate(3 3)" className="fill-gray-800" />
          <path d={d} className="fill-yellow-100 stroke-gray-800" strokeWidth="3" />
          <path d={over} fill="none" className="stroke-gray-800" strokeWidth="3" />
        </svg>
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold rotate-[20deg]">
        <NewDoodle size={22} />
        <span className="sr-only">New</span>
      </span>
    </div>
  );
}
