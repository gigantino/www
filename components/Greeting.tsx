"use client";
import { useEffect, useRef } from "react";
import ScrambleIn, {
  ScrambleInHandle,
} from "@/fancy/components/text/scramble-in";

export default function Greeting() {
  const text = "hello, human!";

  const scrambleRef = useRef<ScrambleInHandle | null>(null);

  useEffect(() => {
    scrambleRef.current?.start();
  }, []);

  return (
    <h1 className="text-3xl font-extrabold dark:text-white">
      <span className="wave mr-2">👋</span>
      <ScrambleIn
        ref={scrambleRef}
        text={text}
        scrambleSpeed={25}
        scrambledLetterCount={2}
        autoStart={false}
      />
    </h1>
  );
}
