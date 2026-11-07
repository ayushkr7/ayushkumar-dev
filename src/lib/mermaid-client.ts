/**
 * Renders <figure data-mermaid> blocks (see src/lib/rehype-mermaid.ts) to SVG.
 *
 * - mermaid itself is only downloaded when a diagram scrolls near the viewport.
 * - Colours come from the design tokens in src/styles/tokens.css, read at render time,
 *   and every diagram is re-rendered when [data-theme] changes.
 */
import type { Mermaid, MermaidConfig } from 'mermaid';

type State = 'rendered' | 'error';

let mermaidPromise: Promise<Mermaid> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let renderCount = 0;

/** Smallest scale a diagram may be shrunk to before it scrolls instead (labels stay ≥ ~11px). */
const MIN_SCALE = 0.8;

const loadMermaid = () => (mermaidPromise ??= import('mermaid').then((module) => module.default));

function config(): MermaidConfig {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(name).trim();
  const font = token('--font-sans');

  return {
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    fontFamily: font,
    themeVariables: {
      darkMode: document.documentElement.dataset.theme === 'dark',
      fontFamily: font,
      fontSize: '14px',
      background: token('--card'),
      textColor: token('--text'),
      lineColor: token('--muted'),
      primaryColor: token('--surface'),
      primaryTextColor: token('--text'),
      primaryBorderColor: token('--border-strong'),
      secondaryColor: token('--code'),
      secondaryTextColor: token('--text'),
      secondaryBorderColor: token('--border-strong'),
      tertiaryColor: token('--card'),
      tertiaryTextColor: token('--text'),
      tertiaryBorderColor: token('--border'),
      mainBkg: token('--surface'),
      nodeBorder: token('--border-strong'),
      nodeTextColor: token('--text'),
      clusterBkg: token('--code'),
      clusterBorder: token('--border'),
      titleColor: token('--text'),
      edgeLabelBackground: token('--card'),
      noteBkgColor: token('--code'),
      noteTextColor: token('--text'),
      noteBorderColor: token('--accent'),
      actorBkg: token('--surface'),
      actorBorder: token('--border-strong'),
      actorTextColor: token('--text'),
      actorLineColor: token('--border-strong'),
      signalColor: token('--text'),
      signalTextColor: token('--text'),
      labelBoxBkgColor: token('--surface'),
      labelBoxBorderColor: token('--border-strong'),
      labelTextColor: token('--text'),
      loopTextColor: token('--text'),
      activationBkgColor: token('--code'),
      activationBorderColor: token('--border-strong'),
      sequenceNumberColor: token('--accent-ink'),
      // Pie / journey / git charts
      pie1: token('--accent'),
      pieStrokeColor: token('--card'),
      pieOuterStrokeColor: token('--border'),
      pieTitleTextColor: token('--text'),
      pieSectionTextColor: token('--accent-ink'),
      pieLegendTextColor: token('--text'),
    },
  };
}

async function render(figure: HTMLElement): Promise<void> {
  const canvas = figure.querySelector<HTMLElement>('[data-mermaid-canvas]');
  const source = figure.querySelector('[data-mermaid-source]')?.textContent ?? '';
  if (!canvas || !source.trim()) return;

  try {
    const mermaid = await loadMermaid();
    // Measure labels with the real web fonts, not the fallback.
    await document.fonts?.ready;
    mermaid.initialize(config());

    if (!(await mermaid.parse(source, { suppressErrors: true }))) throw new Error('Invalid Mermaid syntax');

    const { svg, bindFunctions } = await mermaid.render(`mermaid-diagram-${++renderCount}`, source);

    keepScrollPosition(figure, () => {
      canvas.innerHTML = svg;
      bindFunctions?.(canvas);

      const graphic = canvas.querySelector('svg');
      if (graphic) {
        // Diagrams without accTitle still need an accessible name.
        if (!graphic.hasAttribute('aria-labelledby')) {
          graphic.setAttribute('aria-label', figure.dataset.mermaidTitle || 'Diagram');
        }
        // Shrink to fit, but not past legibility — wider diagrams scroll inside the figure instead.
        const naturalWidth = graphic.viewBox?.baseVal?.width;
        if (naturalWidth) graphic.style.minWidth = `${Math.round(naturalWidth * MIN_SCALE)}px`;
      }
      setState(figure, 'rendered');
    });
    updateScrollable(canvas);
  } catch (error) {
    console.warn('[mermaid] Could not render diagram; showing its source instead.', error);
    keepScrollPosition(figure, () => {
      canvas.replaceChildren();
      setState(figure, 'error');
    });
  }
}

/* ---------- Scroll anchoring ----------
 * A diagram changes height when it renders. If that happens above what the reader is looking at —
 * or mid-way through a smooth scroll to a TOC heading — the page would jump. Keep it still.
 */

let lastJump = { id: '', at: -Infinity };
const JUMP_WINDOW_MS = 1500;

function rememberJump(hash: string) {
  if (hash.length > 1) lastJump = { id: decodeURIComponent(hash.slice(1)), at: performance.now() };
}

document.addEventListener(
  'click',
  (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (link) rememberJump(link.hash);
  },
  { capture: true },
);
window.addEventListener('hashchange', () => rememberJump(window.location.hash));

const comesAfter = (figure: Element, el: Element) =>
  !figure.contains(el) && Boolean(figure.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);

function keepScrollPosition(figure: HTMLElement, mutate: () => void) {
  // 1. A recent in-page jump (smooth scroll may still be running): land on its target.
  const target = performance.now() - lastJump.at < JUMP_WINDOW_MS ? document.getElementById(lastJump.id) : null;
  if (target && comesAfter(figure, target)) {
    mutate();
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    return;
  }

  // 2. Otherwise pin the first block in view, if the diagram sits above it.
  const blocks = figure.parentElement ? [...figure.parentElement.children] : [];
  const anchor = blocks.find((el) => el.getBoundingClientRect().bottom > 0);
  const before = anchor && comesAfter(figure, anchor) ? anchor.getBoundingClientRect().top : null;
  mutate();
  if (anchor && before !== null) {
    const shift = anchor.getBoundingClientRect().top - before;
    if (Math.abs(shift) > 0.5) window.scrollBy({ top: shift, behavior: 'instant' });
  }
}

function setState(figure: HTMLElement, state: State) {
  figure.dataset.state = state;
}

/** A canvas that scrolls horizontally must be reachable by keyboard. */
function updateScrollable(canvas: HTMLElement) {
  if (canvas.scrollWidth > canvas.clientWidth + 1) {
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'group');
    canvas.setAttribute('aria-label', 'Diagram (scrollable)');
  } else {
    canvas.removeAttribute('tabindex');
    canvas.removeAttribute('role');
    canvas.removeAttribute('aria-label');
  }
}

/** Renders one at a time — mermaid uses shared global config. */
function enqueue(figure: HTMLElement) {
  queue = queue.then(() => render(figure));
  return queue;
}

export function initMermaid(root: ParentNode = document) {
  const figures = [...root.querySelectorAll<HTMLElement>('[data-mermaid]')];
  if (!figures.length) return;

  const seen = new WeakSet<HTMLElement>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const figure = entry.target as HTMLElement;
        observer.unobserve(figure);
        seen.add(figure);
        void enqueue(figure);
      }
    },
    { rootMargin: '400px 0px' },
  );
  figures.forEach((figure) => observer.observe(figure));

  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() =>
      figures
        .filter((figure) => figure.dataset.state === 'rendered')
        .forEach((figure) => updateScrollable(figure.querySelector<HTMLElement>('[data-mermaid-canvas]')!)),
    );
  });

  // Re-theme diagrams that have already been drawn.
  new MutationObserver(() => {
    figures
      .filter((figure) => seen.has(figure) && figure.dataset.state === 'rendered')
      .forEach((figure) => void enqueue(figure));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
