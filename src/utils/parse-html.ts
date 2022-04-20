import type { Stylesheet } from 'css';
import css from 'css';
import * as parse5 from 'parse5';
import type {
	ChildNode,
	Document,
	Element,
	TextNode,
} from 'parse5/dist/tree-adapters/default';

export function findStyleNodes(node: ChildNode): Element[] {
	if (node.nodeName === '#text') return [];
	if (node.nodeName === '#comment') return [];
	if (node.nodeName === 'style') return [node];

	const styleNodes: Element[] = [];

	if ('childNodes' in node) {
		for (const childNode of node.childNodes) {
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
	const document = parse5.parse(html);
	const styleNodes: Element[] = [];
	for (const childNode of document.childNodes) {
		styleNodes.push(...findStyleNodes(childNode));
	}

	const stylesheets: Stylesheet[] = [];
	for (const styleNode of styleNodes) {
		const styleTextNode = styleNode.childNodes[0] as TextNode;
		stylesheets.push(css.parse(styleTextNode.value));
	}

	return {
		document,
		stylesheets,
	};
}
