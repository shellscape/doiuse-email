import css, { CssStylesheetAST } from '@adobe/css-tools';
import type { Document, Element, Node, Text } from 'domhandler';
import * as htmlparser from 'htmlparser2';

export function findStyleNodes(node: Node): Element[] {
  if (node.type === htmlparser.ElementType.Style) return [node as Element];

  const styleNodes: Element[] = [];

  if ('childNodes' in node) {
    for (const childNode of (node as Element).childNodes) {
      styleNodes.push(...findStyleNodes(childNode));
    }
  }

  return styleNodes;
}

interface ParsedHtml {
  document: Document;
  stylesheets: CssStylesheetAST[];
}

export function parseHtml(html: string): ParsedHtml {
  const document = htmlparser.parseDocument(html);

  const styleNodes: Element[] = [];
  for (const childNode of document.childNodes) {
    styleNodes.push(...findStyleNodes(childNode));
  }

  const stylesheets: CssStylesheetAST[] = [];
  for (const styleNode of styleNodes) {
    const styleTextNode = styleNode.childNodes[0] as Text | undefined;
    if (styleTextNode !== void 0) {
      stylesheets.push(css.parse(styleTextNode.data));
    }
  }

  return {
    document,
    stylesheets
  };
}
