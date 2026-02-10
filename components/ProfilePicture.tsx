const flowerPath = (() => {
  const cx = 50,
    cy = 50;
  const innerR = 36,
    outerR = 46;
  const petals = 12;
  let d = "";

  for (let i = 0; i < petals; i++) {
    const angle1 = (i / petals) * Math.PI * 2;
    const angle2 = ((i + 0.5) / petals) * Math.PI * 2;
    const angle3 = ((i + 1) / petals) * Math.PI * 2;

    const x1 = Math.round((cx + Math.cos(angle1) * innerR) * 10) / 10;
    const y1 = Math.round((cy + Math.sin(angle1) * innerR) * 10) / 10;
    const x2 = Math.round((cx + Math.cos(angle2) * outerR) * 10) / 10;
    const y2 = Math.round((cy + Math.sin(angle2) * outerR) * 10) / 10;
    const x3 = Math.round((cx + Math.cos(angle3) * innerR) * 10) / 10;
    const y3 = Math.round((cy + Math.sin(angle3) * innerR) * 10) / 10;

    if (i === 0) {
      d += `M ${x1} ${y1}`;
    }
    d += ` Q ${x2} ${y2} ${x3} ${y3}`;
  }
  d += " Z";
  return d;
})();

export function ProfilePicture({ size = "lg" }: { size?: "sm" | "lg" }) {
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-20 w-20";
  const id = size === "sm" ? "sm" : "lg";

  return (
    <div className={`relative ${sizeClass} shrink-0`}>
      <svg viewBox="0 0 100 100" className="absolute -inset-[10%] h-[120%] w-[120%]">
        <defs>
          <clipPath id={`flower-clip-${id}`}>
            <path d={flowerPath} />
          </clipPath>
          <filter id={`flower-shadow-${id}`}>
            <feDropShadow dx="3" dy="3" stdDeviation="0" floodColor="#1f2937" />
          </filter>
        </defs>
        <path
          d={flowerPath}
          className="fill-violet-200 stroke-gray-800"
          strokeWidth="3"
          filter={`url(#flower-shadow-${id})`}
        />
        <image
          href="/favicon.ico"
          x="4"
          y="4"
          width="92"
          height="92"
          clipPath={`url(#flower-clip-${id})`}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
    </div>
  );
}
