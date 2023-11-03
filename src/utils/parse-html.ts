import type { Stylesheet } from 'css';
import css from 'css';
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

type ParsedHtml = {
	document: Document;
	stylesheets: Stylesheet[];
};

export function parseHtml(html: string): ParsedHtml {
	const document = htmlparser.parseDocument(html);

	const styleNodes: Element[] = [];
	for (const childNode of document.childNodes) {
		styleNodes.push(...findStyleNodes(childNode));
	}

	const stylesheets: Stylesheet[] = [];
	for (const styleNode of styleNodes) {
		const styleTextNode = styleNode.childNodes[0] as Text | undefined;
		if (styleTextNode !== undefined) {
			stylesheets.push(css.parse(styleTextNode.data));
		}
	}

	return {
		document,
		stylesheets
	};
}
