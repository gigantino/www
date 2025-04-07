"use client";
import { ReactNode, useState } from "react";

type BadgeProps =
  | {
      type: "url";
      href: string;
      icon?: ReactNode;
      text: string;
      target: "_blank" | "_self";
    }
  | { type: "age" }
  | {
      type: "text";
      text: string;
      icon?: ReactNode;
    };

function calculateAgeStats() {
  const birthDate = new Date("2002-06-11");
  const now = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;
  const ageInDays = Math.floor(
    (now.getTime() - birthDate.getTime()) / msPerDay
  );
  const ageInYears = Math.floor(ageInDays / 365.25);
  const minecraftDays = ageInDays * 72; // 1 MC day = 20 minutes = 1/72 real day

  return [
    `📅 ${ageInYears}-year-old`,
    `⛏️ ${minecraftDays.toLocaleString("de-CH")} Minecraft days old`,
    `🦉 ${ageInDays.toLocaleString("de-CH")} days wise`,
    `⭐ Level ${ageInYears} being`,
  ];
}

export default function Badge(badgeProps: BadgeProps) {
  const baseClass =
    "inline-flex items-center gap-1 border border-zinc-200 bg-zinc-50 p-1 text-sm leading-4 text-neutral-900 no-underline dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  if (badgeProps.type === "url") {
    const { href, target, text, icon } = badgeProps;
    return (
      <a
        className={baseClass + " hover:underline cursor-pointer "}
        href={href}
        target={target}
      >
        {icon}
        <span className="capitalize">{text}</span>
      </a>
    );
  }

  if (badgeProps.type === "text") {
    return (
      <span className={baseClass}>
        {badgeProps.icon}
        {badgeProps.text}
      </span>
    );
  }

  if (badgeProps.type === "age") {
    const ageStats = calculateAgeStats();
    const [index, setIndex] = useState(0);

    const handleClick = () => {
      setIndex((prev) => (prev + 1) % ageStats.length);
    };

    return (
      <button
        className={baseClass + " cursor-pointer hover:underline"}
        onClick={handleClick}
        title="Click to cycle"
      >
        {ageStats[index]}
      </button>
    );
  }

  return null;
}
