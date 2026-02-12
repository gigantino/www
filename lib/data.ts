export const personalInfo = {
  name: "gigantino",
  title: "Full-stack developer",
  location: "Geneva, Switzerland",
  experience: "5+ years",
  bio: "I'm a full-stack developer with over 5 years of experience under my belt, currently based in Geneva, Switzerland.",
};

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/gigantino",
    icon: "github",
  },
  {
    name: "Email",
    url: "mailto:hello@ggtn.ch",
    icon: "email",
  },
];

export const blogPosts = [
  {
    title: "Building an LLM trained on Minecraft server chat",
    description:
      "Training a language model on the chaotic chat logs from a Minecraft server.",
    date: "2026-02-06",
    url: "/blog/minecraft-llm",
    tags: ["AI", "Dynamic article"],
    wip: true,
  },
  {
    title: "How We Got Free Chicken for a Year by Reverse Engineering a Mobile Game",
    description:
      "Reverse engineering a fast-food company's in-app minigame to win free food for an entire year.",
    date: "2026-01-13",
    url: "/blog/chicken-exploit",
    tags: ["Security", "Reverse Engineering"],
  },
  {
    title: "How I made an AI-generated show",
    description:
      "Building AI-generated conversations using ChatGPT and text-to-speech APIs.",
    date: "2023-10-17",
    url: "/blog/ai-generated-show",
    image: "/blog/ai-generated-show/ai_sponge.png",
    tags: ["Case Study", "AI"],
  },
  {
    title: "Automating lighthouse reports with Unlighthouse",
    description:
      "CI/CD integration with GitHub Actions for automated Lighthouse reporting.",
    date: "2023-10-10",
    url: "/blog/unlighthouse",
    tags: ["CI/CD", "Performance"],
  },
];

export const externalWriting = [
  {
    title: "How we hacked a billion-dollar company for unlimited snacks",
    url: "https://derewah.dev/projects/food-heist",
  },
];

export const newsletter = {
  description:
    "Get updates on new projects and articles.",
};


export const projects = [
  {
    name: "Delizioso",
    description: "Run your restaurant on autopilot",
    website: "https://delizioso.app",
    github: undefined,
    icon: "/icons/delizioso.png",
    pinned: true,
  },
  {
    name: "HyAuth",
    description: "The OAuth2 API to authenticate Hytale players",
    website: "https://www.hyauth.com",
    github: undefined,
    icon: "/icons/hyauth.png",
    pinned: true,
  },
  {
    name: "hn",
    description: "A modern yet lightweight front-end for HackerNews with zero JS shipped to the client",
    website: "https://hn.ggtn.ch",
    github: "https://github.com/gigantino/hn",
    icon: "/icons/hn.svg",
    pinned: true,
  },
  {
    name: "CoralProxy",
    description: "A proxy that makes use of real-time packet manipulation to extend the vanilla Minecraft client",
    website: "https://coralproxy.it",
    github: undefined,
    icon: "/icons/coralproxy.png",
    pinned: true,
  },
  {
    name: "diplate",
    description: "Get info about diplomatic license plates in Switzerland",
    website: "https://diplate.ch",
    github: "https://github.com/gigantino/diplate-ch",
    icon: "/icons/diplate.svg",
    pinned: false,
  },
  {
    name: "vibe-api",
    description: "Built as an April Fools' joke. It's the \"API for vibe coders\"",
    website: undefined,
    github: "https://github.com/gigantino/vibe-api",
    icon: "/icons/vibe-api.svg",
    pinned: false,
  },
  {
    name: "init7-iptv-igmp-proxy",
    description: "Dynamic proxy between Init7 IPTV (TV7) and your local IGMP network",
    website: "https://init7.ggtn.ch",
    github: "https://github.com/gigantino/init7-iptv-igmp-proxy",
    icon: "/icons/init7.svg",
    pinned: false,
  },
];
