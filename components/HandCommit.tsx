"use client";

import { useEffect } from "react";

export function HandCommit() {
  useEffect(() => {
    window.__handCommit?.();
  }, []);

  return null;
}
