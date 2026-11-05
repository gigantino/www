"use client";

import { Fragment } from "react";
import { useHandSeed } from "@/components/HandSeed";
import { HAND_GLYPHS, HAND_STROKE, type HandGlyph } from "@/lib/handFont";
import { hash, seeded } from "@/lib/handFrame";

const CAP = 0.6;
const GAP = 11;
const PAD_Y = 18;
const PAD_X = 9;

const MARKS: Record<string, HandGlyph> = {
  "!": { advance: 16, d: ["M8.2,2C8.8,25 8.5,46 7.6,68", "M7.8,96L7.9,96.3"] },
  "'": { advance: 14, d: ["M8,2C7.7,10 7.1,17 5.9,26"] },
  ".": { advance: 14, d: ["M7,96L7.1,96.3"] },
  ",": { advance: 15, d: ["M8.6,93C8.7,100 7.2,106 4.8,111"] },
  "-": { advance: 40, d: ["M6.4,58C16,56.6 25,57.6 33.6,56.4"] },
};

type Piece =
  | {
      kind: "glyph";
      char: string;
      glyph: HandGlyph;
      rotate: number;
      lift: number;
      scale: number;
    }
  | { kind: "text"; text: string };

function layoutWord(word: string, next: () => number, used: Map<string, number>) {
  const pieces: Piece[] = [];
  for (const char of word) {
    const upper = char.toUpperCase();
    const versions = HAND_GLYPHS[upper];
    let glyph = MARKS[char];
    if (versions) {
      let pick = Math.floor(next() * versions.length);
      if (used.get(upper) === pick) pick = (pick + 1 + Math.floor(next() * (versions.length - 1))) % versions.length;
      used.set(upper, pick);
      glyph = versions[pick];
    }
    if (glyph) {
      pieces.push({
        kind: "glyph",
        char,
        glyph,
        rotate: (next() - 0.5) * 5,
        lift: (next() - 0.5) * 5,
        scale: 0.97 + next() * 0.06,
      });
    } else {
      pieces.push({ kind: "text", text: char });
    }
  }
  return pieces;
}

function GlyphRun({ glyphs }: { glyphs: Extract<Piece, { kind: "glyph" }>[] }) {
  const lefts = glyphs.map((_, i) => glyphs.slice(0, i).reduce((sum, piece) => sum + piece.glyph.advance + GAP, 0));
  const total = lefts.length ? lefts[lefts.length - 1] + glyphs[glyphs.length - 1].glyph.advance : 0;
  const placed = glyphs.map((piece, i) => {
    const mid = lefts[i] + piece.glyph.advance / 2;
    return (
      <g
        key={i}
        transform={`translate(${mid} ${100 + piece.lift}) rotate(${piece.rotate.toFixed(2)}) scale(${piece.scale.toFixed(3)}) translate(${-piece.glyph.advance / 2} -100)`}
      >
        {piece.glyph.d.map((d, j) => (
          <path key={j} d={d} />
        ))}
      </g>
    );
  });
  const width = total + PAD_X * 2;
  const height = 100 + PAD_Y * 2;
  const em = (units: number) => `${(units / 100) * CAP}em`;
  return (
    <span className="relative inline-block" style={{ marginInline: em(-PAD_X), verticalAlign: em(-PAD_Y) }}>
      <span
        className="absolute inset-y-0 whitespace-pre text-transparent"
        style={{ left: em(PAD_X), lineHeight: em(height), fontSize: "1em" }}
      >
        {glyphs.map((piece, i) => (
          <span key={i} className="inline-block text-center" style={{ width: em(piece.glyph.advance + (i < glyphs.length - 1 ? GAP : 0)) }}>
            {piece.char}
          </span>
        ))}
      </span>
      <svg
        aria-hidden="true"
        className="block select-none"
        viewBox={`${-PAD_X} ${-PAD_Y} ${width} ${height}`}
        style={{ width: em(width), height: em(height), overflow: "visible" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={HAND_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {placed}
      </svg>
    </span>
  );
}

export function HandText({ text, className }: { text: string; className?: string }) {
  const seed = useHandSeed();
  const next = seeded(hash(text) ^ seed);
  const used = new Map<string, number>();
  const words = text.split(/(\s+)/);

  return (
    <span className={className}>
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => {
          if (/^\s+$/.test(word))
            return (
              <span key={w} style={{ wordSpacing: "0.15em" }}>
                {" "}
              </span>
            );
          const pieces = layoutWord(word, next, used);
          const runs: Piece[][] = [];
          for (const piece of pieces) {
            const last = runs[runs.length - 1];
            if (last && last[0].kind === piece.kind) last.push(piece);
            else runs.push([piece]);
          }
          return (
            <span key={w} className="inline-block whitespace-nowrap">
              {runs.map((run, r) =>
                run[0].kind === "glyph" ? (
                  <GlyphRun key={r} glyphs={run as Extract<Piece, { kind: "glyph" }>[]} />
                ) : (
                  <Fragment key={r}>{run.map((p) => (p.kind === "text" ? p.text : "")).join("")}</Fragment>
                ),
              )}
            </span>
          );
        })}
      </span>
    </span>
  );
}
