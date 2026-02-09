interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "a";
  href?: string;
  id?: string;
}

export function BentoCard({
  children,
  className = "",
  hover = false,
  as = "div",
  href,
  id,
}: BentoCardProps) {
  const Component = as;

  const props = {
    id,
    className: `neo-card ${hover ? "neo-card-hover" : ""} p-6 ${className}`,
    ...(as === "a" && { href, target: "_blank", rel: "noopener noreferrer" }),
  };

  return <Component {...props}>{children}</Component>;
}
