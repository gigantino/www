import { handGeometry, type FrameStyle, type HandGeometry } from "@/lib/handFrame";

declare global {
  interface Window {
    __handCommit?: () => void;
  }
}

function handRuntime(geo: HandGeometry) {
  const FRAMES = ".neo-card, .neo-button, .hand-tag";
  const LINKS = ".neo-link, .neo-link-hover";
  const PAD = 12;
  const FIELDS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
  const IMPORTANT = new Set(["background-color", "border-color", "box-shadow", "background-image", "background-repeat", "background-size", "background-origin"]);

  type Entry = { seed: number; style: FrameStyle; inside: boolean; shift: number | null };
  type Props = Record<string, string>;
  const entries = new WeakMap<HTMLElement, Entry>();
  const sizes = new WeakMap<HTMLElement, string>();
  const done = new WeakSet<HTMLElement>();
  const pending = new Map<HTMLElement, Props>();
  let committed = false;
  let sheet: HTMLStyleElement | null = null;

  const selector = (el: Element) => {
    const parts: string[] = [];
    let node: Element = el;
    while (node.parentElement && node !== document.body) {
      parts.unshift(`:nth-child(${Array.prototype.indexOf.call(node.parentElement.children, node) + 1})`);
      node = node.parentElement;
    }
    return `body>${parts.join(">")}`;
  };

  const flush = () => {
    if (committed) return;
    if (!sheet) {
      sheet = document.createElement("style");
      document.head.appendChild(sheet);
    }
    let css = "";
    pending.forEach((props, el) => {
      css += `${selector(el)}{${Object.entries(props).map(([k, v]) => `${k}:${v} !important`).join(";")}}`;
    });
    sheet.textContent = css;
  };

  const write = (el: HTMLElement, props: Props) => {
    if (!committed) {
      pending.set(el, { ...pending.get(el), ...props });
      return;
    }
    for (const [k, v] of Object.entries(props)) el.style.setProperty(k, v, IMPORTANT.has(k) ? "important" : "");
  };

  const draw = (el: HTMLElement, entry: Entry) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    if (entry.inside) {
      const { frame, shade } = geo.handFrameInside(entry.seed, w, h, entry.style);
      write(el, { "background-image": `${frame}, ${shade}` });
      return;
    }
    const { frame, shade } = geo.handFrame(entry.seed, w, h, PAD, entry.style);
    write(el, {
      "--hf-frame": frame,
      "--hf-shade": entry.shift === null ? "none" : shade,
      "--hf-shift": `${entry.shift ?? 0}px`,
      "--hf-inset": `${-(PAD + entry.style.strokeWidth)}px`,
    });
  };

  const redraw = (el: HTMLElement) => {
    const entry = entries.get(el);
    if (!entry) return;
    const key = `${el.offsetWidth}x${el.offsetHeight}`;
    if (sizes.get(el) === key) return;
    sizes.set(el, key);
    draw(el, entry);
  };

  const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((items) => {
    for (const item of items) redraw(item.target as HTMLElement);
    flush();
  });

  const frameOne = (el: HTMLElement, fresh: HTMLElement[]) => {
    if (done.has(el)) return;
    const transition = el.style.transition;
    if (committed) el.style.transition = "none";
    const cs = getComputedStyle(el);
    const strokeWidth = parseFloat(cs.borderTopWidth);
    if (!strokeWidth) {
      el.style.transition = transition;
      return;
    }
    done.add(el);
    fresh.push(el);
    const fill = cs.backgroundColor;
    const fillOpacity = parseFloat(cs.getPropertyValue("--hf-fill-opacity"));
    const shift = [...cs.boxShadow.matchAll(/(\w+\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px/g)]
      .filter((m) => !/[,/]\s*0\)$/.test(m[1]))
      .map((m) => parseFloat(m[2]))
      .pop();
    const entry: Entry = {
      seed: Math.floor(Math.random() * 2 ** 31),
      inside: FIELDS.has(el.tagName),
      shift: shift ?? null,
      style: {
        fill: fill === "rgba(0, 0, 0, 0)" || fill === "transparent" ? "" : fill,
        fillOpacity: Number.isNaN(fillOpacity) ? 1 : fillOpacity,
        stroke: cs.borderTopColor,
        strokeWidth,
        radius: parseFloat(cs.borderTopLeftRadius) || 0,
      },
    };
    entries.set(el, entry);
    const props: Props = { "background-color": "transparent", "border-color": "transparent", "box-shadow": "none" };
    if (entry.inside) Object.assign(props, { "background-repeat": "no-repeat", "background-size": "100% 100%", "background-origin": "border-box" });
    if (el.classList.contains("hand-tag")) props.rotate = `${((entry.seed % 1000) / 1000 - 0.5) * 3.2}deg`;
    write(el, props);
    redraw(el);
    resizer?.observe(el, { box: "border-box" });
    if (committed) {
      void getComputedStyle(el).boxShadow;
      el.style.transition = transition;
    }
  };

  const underlineOne = (el: HTMLElement) => {
    if (done.has(el)) return;
    done.add(el);
    const cs = getComputedStyle(el);
    const width = Math.max(1.6, parseFloat(cs.fontSize) * 0.12);
    write(el, { "--hand-underline": geo.handUnderlineSvg(cs.color, width) });
  };

  const settle = (fresh: HTMLElement[]) => {
    if (committed || !fresh.length) return;
    fresh.forEach((el) => {
      pending.get(el)!.transition = "none";
    });
    flush();
    fresh.forEach((el) => {
      void getComputedStyle(el).boxShadow;
      delete pending.get(el)!.transition;
    });
    flush();
  };

  const prepare = (root: Element | Document) => {
    const fresh: HTMLElement[] = [];
    const frames = [...root.querySelectorAll<HTMLElement>(FRAMES)];
    const links = [...root.querySelectorAll<HTMLElement>(LINKS)];
    if (root instanceof HTMLElement) {
      if (root.matches(FRAMES)) frames.unshift(root);
      if (root.matches(LINKS)) links.unshift(root);
    }
    frames.forEach((el) => frameOne(el, fresh));
    links.forEach(underlineOne);
    settle(fresh);
    flush();
  };

  window.__handCommit = () => {
    if (committed) return;
    committed = true;
    pending.forEach((props, el) => write(el, props));
    pending.clear();
    sheet?.remove();
    sheet = null;
  };

  prepare(document);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) prepare(node);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });

  const refresh = () => {
    document.querySelectorAll<HTMLElement>(FRAMES).forEach(redraw);
    flush();
  };
  document.fonts?.ready.then(refresh);
  window.addEventListener("load", refresh);
  window.addEventListener("resize", refresh);
}

export const handRuntimeScript = `(${handRuntime.toString()})((${handGeometry.toString()})())`;
