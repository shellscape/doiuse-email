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
					'time'
				]
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
			value: [htmlMatches[1]!]
		};
	})
);

export function getMatchingElementTitles({ tagName }: { tagName: string }) {
	const matchingElementTitles: string[] = [];

	for (const [elementTitle, elementTags] of Object.entries(elementTitles)) {
		if (elementTags.includes(tagName)) {
			matchingElementTitles.push(elementTitle);
		}
	}

	return matchingElementTitles;
}

export const attributeTitles = fromTitleEntries<string[]>(
	Object.keys(getHTMLFeatures()).map((title) => {
		if (title === 'srcset and sizes attributes') {
			return {
				title,
				value: ['srcset', 'sizes']
			};
		}

		if (!title.endsWith('attribute')) return;

		return {
			title,
			value: [title.replace(/ attribute$/, '')]
		};
	})
);

export function getMatchingAttributeTitles({
	attributes
}: {
	attributes: string[];
}) {
	const matchingAttributeTitles: string[] = [];

	for (const [attributeTitle, attributeValues] of Object.entries(
		attributeTitles
	)) {
		if (attributeValues.some((attribute) => attributes.includes(attribute))) {
			matchingAttributeTitles.push(attributeTitle);
		}
	}

	return matchingAttributeTitles;
}

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
					attributes: [['href', /^#/], 'name']
				}
			};
		}

		if (title === 'mailto: links') {
			return {
				title,
				value: {
					element: 'a',
					attributes: [['href', /^mailto:/]]
				}
			};
		}

		if (title === 'AMP for Email') {
			return {
				title,
				value: {
					element: 'html',
					attributes: ['⚡4email', 'amp4email']
				}
			};
		}

		const attributePairMatch = /<(\w+) (\w+)="(\w+)"> element/.exec(title);
		if (attributePairMatch === null) return;

		return {
			title,
			value: {
				element: attributePairMatch[1]!,
				attributes: [[attributePairMatch[2]!, attributePairMatch[3]!]]
			}
		};
	})
);

export function getMatchingElementAttributePairTitles({
	tagName,
	attributes
}: {
	tagName: string;
	attributes: Record<string, string>;
}) {
	const matchingElementAttributePairTitles: string[] = [];

	for (const [
		elementAttributePairTitle,
		elementAttributePairValues
	] of Object.entries(elementAttributePairTitles)) {
		// Don't bother trying to match if the elements aren't even equal
		if (elementAttributePairValues.element !== tagName) continue;

		for (const attributeMatcher of elementAttributePairValues.attributes) {
			// If the attribute matcher is a string, we just check whether the element contains the attribute name
			if (
				typeof attributeMatcher === 'string' &&
				Object.keys(attributes).includes(attributeMatcher)
			) {
				matchingElementAttributePairTitles.push(elementAttributePairTitle);
			}
			// If the attribute matcher is an array, we check each attribute name against an expected attribute value
			else if (Array.isArray(attributeMatcher)) {
				const attributeName = attributeMatcher[0];
				const attributeValue = attributeMatcher[1];

				// If the attribute doesn't even exist, try checking the next attribute
				if (attributes[attributeName] === undefined) continue;

				// If the attribute to match is a string, we check for equality
				if (
					typeof attributeValue === 'string' &&
					attributes[attributeName] === attributeValue
				) {
					matchingElementAttributePairTitles.push(elementAttributePairTitle);
				}
				// If the attribute to match is a regex, we check if the regex matches
				else if (
					attributeValue instanceof RegExp &&
					attributeValue.test(attributes[attributeName]!)
				) {
					matchingElementAttributePairTitles.push(elementAttributePairTitle);
				}
			}
		}
	}

	return matchingElementAttributePairTitles;
}
