"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useHandSeed } from "@/components/HandSeed";
import { handBlob, hash } from "@/lib/handFrame";

export function HandAvatar({ src, alt, size, id }: { src: string; alt: string; size: number; id: string }) {
  const seed = useHandSeed() ^ hash(id);
  const { clip, stroke } = useMemo(() => handBlob(seed, size, 1.5), [seed, size]);
  const width = Math.max(1.6, size / 14);

  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible" width={size} height={size}>
        <path d={clip} transform="translate(1.5 1.5)" fill="#1f2937" />
      </svg>
      <span className="guestbook-avatar relative block size-full" style={{ clipPath: `path("${clip}")` }}>
        <Image src={src} alt={alt} width={size} height={size} className="block size-full object-cover" />
      </span>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible" width={size} height={size}>
        <path d={stroke} fill="none" stroke="#1f2937" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
