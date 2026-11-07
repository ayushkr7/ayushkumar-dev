/**
 * ClientRouter swaps pages without a reload, so a <script> only runs the first time its page is
 * reached, and the elements it found are gone after the next navigation. Put per-page setup here
 * instead: it runs on every page, including the first.
 *
 * Pass `signal` to listeners on `document`, `window` or `matchMedia` so they are removed when the
 * reader moves on. Listeners on elements in the page don't need it; they leave with the page.
 */
export function onPageLoad(setup: (signal: AbortSignal) => void) {
  let controller: AbortController | undefined;

  document.addEventListener('astro:page-load', () => {
    controller?.abort();
    controller = new AbortController();
    setup(controller.signal);
  });
}
