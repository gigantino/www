import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/format";

type ModelFamily = {
  name: string;
  base: string;
  baseUrl: string;
  models: { id: string; date: string }[];
};

const HF = "https://huggingface.co/AfkaraLP";

const families: ModelFamily[] = [
  {
    name: "CoralGPT Supra",
    base: "Supra-1.5 50M",
    baseUrl: "https://huggingface.co/SupraLabs/Supra1.5-50M-Base-exp",
    models: [
      { id: "CoralGPT-Supra-50M-merge-70", date: "2026-06-17" },
      { id: "CoralGPT-Supra-50M-merge-50", date: "2026-06-17" },
      { id: "CoralGPT-Supra-50M-ckpt-10000", date: "2026-06-17" },
    ],
  },
  {
    name: "Gemma 3 270M",
    base: "Gemma 3 270M",
    baseUrl: "https://huggingface.co/google/gemma-3-270m",
    models: [
      { id: "gemma-3-270M-coralmc-1ep-8batch-v13", date: "2026-04-26" },
      { id: "gemma-3-270M-coralmc-1800it-8batch-v12", date: "2026-02-07" },
      { id: "gemma-3-270M-coralmc-1800it-8batch-v11", date: "2026-02-07" },
      { id: "gemma-3-270M-coralmc-3750it-v10", date: "2026-01-24" },
      { id: "gemma-3-270M-coralmc-8500it-v09", date: "2026-01-22" },
      { id: "gemma-3-270M-coralmc-8500it-v08", date: "2026-01-21" },
      { id: "gemma-3-270M-coralmc-9500it-v07", date: "2026-01-21" },
      { id: "gemma-3-270M-coralmc-9500it-v06", date: "2026-01-20" },
      { id: "gemma-3-270M-coralmc-9500it-v06_F16", date: "2026-01-20" },
      { id: "gemma-3-270-coralmc-350it-v04", date: "2026-01-16" },
      { id: "gemma-3-270-coralmc-350it-v03", date: "2026-01-16" },
    ],
  },
  {
    name: "Gemma 3 4B",
    base: "Gemma 3 4B",
    baseUrl: "https://huggingface.co/google/gemma-3-4b-it",
    models: [{ id: "gemma-3-4b-coralmc-7000it-v05", date: "2026-01-17" }],
  },
];

export function CoralModels() {
  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {families.map((family) => (
        <section
          key={family.name}
          className="neo-card flex flex-col gap-3 bg-white p-4 dark:bg-gray-800"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-lg font-bold dark:text-gray-100">{family.name}</h3>
            <a
              href={family.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-link text-sm text-gray-600 dark:text-gray-400"
            >
              Base: {family.base}
            </a>
          </div>
          <ul className="flex flex-col gap-2">
            {family.models.map((model) => (
              <li key={model.id}>
                <a
                  href={`${HF}/${model.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 text-sm"
                >
                  <span className="neo-link flex min-w-0 items-center gap-1 font-mono text-gray-800 dark:text-gray-200">
                    <span className="truncate">{model.id}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </span>
                  <time className="shrink-0 text-gray-500">{formatDate(model.date)}</time>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
