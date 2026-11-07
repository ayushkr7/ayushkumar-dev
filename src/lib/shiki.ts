import type { ShikiTransformer, ThemeRegistration } from 'shiki';
import type { Element, ElementContent } from 'hast';

/**
 * Syntax colours from the design tokens table. Shiki needs literal colours at build
 * time; with `defaultColor: false` it emits them as --shiki-light / --shiki-dark
 * variables and src/styles/global.css picks one based on [data-theme].
 */
const palette = {
  light: {
    fg: '#16171A',
    bg: '#F3F3F0',
    comment: '#6A6E75',
    keyword: '#8237B8',
    string: '#2B7339',
    tag: '#2B50D6',
    attr: '#9A4A0B',
  },
  dark: {
    fg: '#ECECEA',
    bg: '#16181B',
    comment: '#8B8F96',
    keyword: '#C9A2FF',
    string: '#93D3A2',
    tag: '#8FA8FF',
    attr: '#F0B27E',
  },
};

function createTheme(name: string, type: 'light' | 'dark'): ThemeRegistration {
  const c = palette[type];
  return {
    name,
    type,
    colors: { 'editor.foreground': c.fg, 'editor.background': c.bg },
    settings: [
      { settings: { foreground: c.fg, background: c.bg } },
      {
        scope: [
          'comment',
          'punctuation.definition.comment',
          'punctuation.definition.tag.xi',
          'punctuation.section.embedded.begin.astro',
          'punctuation.section.embedded.end.astro',
          'markup.frontmatter.separator',
        ],
        settings: { foreground: c.comment },
      },
      {
        scope: [
          'keyword',
          'storage',
          'storage.type',
          'storage.modifier',
          'keyword.control',
          'keyword.operator.new',
          'keyword.operator.expression',
          'variable.language',
        ],
        settings: { foreground: c.keyword },
      },
      {
        scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'],
        settings: { foreground: c.string },
      },
      {
        scope: [
          'entity.name.tag',
          'support.class.component',
          'entity.name.type',
          'support.type',
          'entity.name.function',
          'support.function',
        ],
        settings: { foreground: c.tag },
      },
      {
        scope: [
          'entity.other.attribute-name',
          'support.type.property-name',
          'meta.attribute',
          'constant.numeric',
          'constant.language',
          'variable.parameter',
        ],
        settings: { foreground: c.attr },
      },
    ],
  };
}

export const lightTheme = createTheme('blog-light', 'light');
export const darkTheme = createTheme('blog-dark', 'dark');

const el = (tagName: string, properties: Element['properties'], children: ElementContent[] = []): Element => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const text = (value: string): ElementContent => ({ type: 'text', value });

/**
 * Wraps every highlighted block in
 *   <figure class="code-block"><div class="code-header"><figcaption/>…<button/></div><pre/></figure>
 * The caption comes from a `title="…"` meta string (```astro title="src/pages/index.astro").
 * The copy button is wired up by the script in src/pages/blog/[...slug].astro.
 */
export function codeFigure(): ShikiTransformer {
  return {
    name: 'blog:code-figure',
    // Files saved with Windows line endings would otherwise copy as CRLF.
    preprocess(code) {
      return code.replace(/\r\n?/g, '\n');
    },
    root(root) {
      const pre = root.children.find((n): n is Element => n.type === 'element' && n.tagName === 'pre');
      if (!pre) return;

      const raw = (this.options.meta as { __raw?: string } | undefined)?.__raw ?? '';
      const title = /title=(["'])(.*?)\1/.exec(raw)?.[2];
      const label = title ?? (this.options.lang && this.options.lang !== 'plaintext' ? String(this.options.lang) : '');

      // Make the scrollable <pre> keyboard-focusable so overflowing code can be scrolled without a mouse.
      pre.properties.tabindex = '0';

      const copyIcon = el(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: '16',
          height: '16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '1.75',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          ariaHidden: 'true',
          focusable: 'false',
        },
        [
          el('rect', { x: '9', y: '9', width: '11', height: '11', rx: '2' }),
          el('path', { d: 'M5 15V6a2 2 0 0 1 2-2h9' }),
        ],
      );

      const header = el('div', { className: ['code-header'], dataPagefindIgnore: '' }, [
        el('figcaption', { className: ['code-title'] }, label ? [text(label)] : []),
        el('button', { type: 'button', className: ['code-copy'], dataCopy: '' }, [
          copyIcon,
          el('span', { className: ['code-copy-label'], ariaLive: 'polite' }, [text('Copy')]),
          el('span', { className: ['visually-hidden'] }, [text(' code')]),
        ]),
      ]);

      root.children = [el('figure', { className: ['code-block'] }, [header, pre])];
    },
  };
}
