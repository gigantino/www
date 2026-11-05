"use client";

import { createContext, useContext, type ReactNode } from "react";

const HandSeedContext = createContext(1);

export function HandSeedProvider({ seed, children }: { seed: number; children: ReactNode }) {
  return <HandSeedContext.Provider value={seed}>{children}</HandSeedContext.Provider>;
}

export function useHandSeed() {
  return useContext(HandSeedContext);
}
