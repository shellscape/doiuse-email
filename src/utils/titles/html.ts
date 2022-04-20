import { getHTMLFeatures } from '~/utils/features.js';
import { fromTitleEntries } from '~/utils/titles/utils.js';

// Map of property titles to the properties they support
export const elementTitles = fromTitleEntries<string[]>(
	Object.keys(getHTMLFeatures()).map((title) => {
		if (title === 'address') {
			return { title, value: ['address'] };
		}

		if (title === 'HTML5 doctype') {
			return { title, value: ['!doctype html'] };
		}

		if (title === 'HTML5 semantics') {
			return {
				title,
				value: [
					'article',
					'aside',
					'details',
					'figcaption',
					'figure',
					'footer',
					'header',
					'main',
					'mark',
					'nav',
					'section',
					'summary',
					'time',
				],
			};
		}

		if (title === 'Image maps') {
			return { title, value: ['map'] };
		}

		if (title === 'Embedded <svg> image') {
			return { title, value: ['image'] };
		}

		const htmlMatches = /<(\w+)>/.exec(title);
		if (htmlMatches === null) return;

		return {
			title,
			value: [htmlMatches[1]!],
		};
	})
);

export const attributeTitles = fromTitleEntries<string[]>(
	Object.keys(getHTMLFeatures()).map((title) => {
		if (title === 'srcset and sizes attributes') {
			return {
				title,
				value: ['srcset', 'sizes'],
			};
		}

		if (!title.endsWith('attribute')) return;

		return {
			title,
			value: [title.replace(/ attribute$/, '')],
		};
	})
);

export const elementAttributePairTitles = fromTitleEntries<{
	element: string;
	attributes: Array<string | [string, RegExp | string]>; // Can match any of these
}>(
	Object.keys(getHTMLFeatures()).map((title) => {
		if (title === 'Local anchors') {
			return {
				title,
				value: {
					element: 'a',
					attributes: [['href', /^#/], 'name'],
				},
			};
		}

		if (title === 'mailto: links') {
			return {
				title,
				value: {
					element: 'a',
					attributes: [['href', /^mailto:/]],
				},
			};
		}

		if (title === 'AMP for Email') {
			return {
				title,
				value: {
					element: 'html',
					attributes: ['⚡4email', 'amp4email'],
				},
			};
		}

		const attributePairMatch = /<(\w+) (\w+)="(\w+)"> element/.exec(title);
		if (attributePairMatch === null) return;

		return {
			title,
			value: {
				element: attributePairMatch[1]!,
				attributes: [[attributePairMatch[2]!, attributePairMatch[3]!]],
			},
		};
	})
);
