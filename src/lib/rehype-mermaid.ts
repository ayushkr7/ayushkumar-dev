import type { Element, ElementContent, Root, RootContent } from 'hast';

/**
 * Turns ```mermaid fenced blocks (left untouched by Shiki via `excludeLangs`) into
 *
 *   <figure class="mermaid-figure" data-mermaid>
 *     <div class="code-header"><figcaption class="code-title">Title</figcaption></div>   (only with title="…")
 *     <div class="mermaid-canvas" data-mermaid-canvas></div>
 *     <pre class="mermaid-source" data-mermaid-source>…diagram source…</pre>
 *   </figure>
 *
 * The source stays in the page as the no-JS fallback; src/lib/mermaid-client.ts renders it to SVG.
 */

const isElement = (node: RootContent | ElementContent): node is Element => node.type === 'element';

function textOf(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

function isMermaidCode(node: Element): boolean {
  const className = node.properties.className;
  const classes = Array.isArray(className) ? className.map(String) : String(className ?? '').split(' ');
  return node.tagName === 'code' && classes.includes('language-mermaid');
}

function toFigure(code: Element): Element {
  const meta = String((code.data as { meta?: string } | undefined)?.meta ?? code.properties.metastring ?? '');
  const title = /title=(["'])(.*?)\1/.exec(meta)?.[2];
  const source = code.children.map(textOf).join('').replace(/\r\n?/g, '\n').trim();

  const children: ElementContent[] = [];
  if (title) {
    children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['code-header'] },
      children: [
        {
          type: 'element',
          tagName: 'figcaption',
          properties: { className: ['code-title'] },
          children: [{ type: 'text', value: title }],
        },
      ],
    });
  }
  children.push(
    {
      type: 'element',
      tagName: 'div',
      properties: { className: ['mermaid-canvas'], dataMermaidCanvas: '' },
      children: [],
    },
    {
      type: 'element',
      tagName: 'pre',
      properties: { className: ['mermaid-source'], dataMermaidSource: '' },
      children: [{ type: 'element', tagName: 'code', properties: {}, children: [{ type: 'text', value: source }] }],
    },
  );

  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['mermaid-figure'], dataMermaid: '', dataMermaidTitle: title, dataPagefindIgnore: '' },
    children,
  };
}

function walk(parent: Root | Element) {
  parent.children.forEach((child, index) => {
    if (!isElement(child)) return;
    const only = child.children.length === 1 ? child.children[0] : undefined;
    if (child.tagName === 'pre' && only && isElement(only) && isMermaidCode(only)) {
      parent.children[index] = toFigure(only);
      return;
    }
    walk(child);
  });
}

export default function rehypeMermaid() {
  return (tree: Root) => walk(tree);
}
