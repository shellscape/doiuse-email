import type { Comment, Declaration, Rule, Stylesheet } from 'css';
import { getProperty } from 'dot-prop';
import type { Document, Element } from 'parse5';

import type { EmailClient } from '~/types/email-client.js';
import type { DoIUseEmailOptions } from '~/types/options.js';
import { getEmailClientsFromOptions } from '~/utils/email-clients.js';
import { getCSSFeatures } from '~/utils/features.js';
import { parseHtml } from '~/utils/html.js';
import {
	getMatchingAtRuleTitles,
	getMatchingFunctionTitles,
	getMatchingKeywordTitles,
	getMatchingPropertyTitles,
	getMatchingPropertyValuePairTitles,
	getMatchingPseudoSelectorTitles,
	getMatchingSelectorTitles,
	getMatchingUnitTitles,
} from '~/utils/titles/css.js';
import {
	getMatchingAttributeTitles,
	getMatchingElementAttributePairTitles,
	getMatchingElementTitles,
} from '~/utils/titles/html.js';

const atRules = new Set([
	'charset',
	'custom-media',
	'document',
	'font-face',
	'host',
	'import',
	'keyframes',
	'keyframe',
	'media',
	'namespace',
	'page',
	'supports',
]);

export class DoIUse {
	emailClients: EmailClient[];
	options: DoIUseEmailOptions;

	constructor(options: DoIUseEmailOptions) {
		this.emailClients = getEmailClientsFromOptions(options);
		this.options = options;
	}

	checkFeaturesSupport(featureTitles: string | string[]) {
		const cssFeatures = getCSSFeatures();

		for (const featureTitle of [featureTitles].flat()) {
			for (const emailClient of this.emailClients) {
				const stats = cssFeatures[featureTitle];
				const supportMap = getProperty(stats, emailClient);

				if (supportMap === undefined) {
					throw new Error(
						`Feature ${featureTitle} not found on ${emailClient}.`
					);
				}

				if (!Object.values(supportMap).includes('y')) {
					this.error(`${featureTitle} is not supported by ${emailClient}`);
				}
			}
		}
	}

	error(message: string) {
		console.error(message);
	}

	checkCSSDeclarations(declarations: Array<Comment | Declaration>) {
		const cssFeatures = getCSSFeatures();

		for (const declaration of declarations) {
			if (declaration.type === 'comment') continue;

			const { property: propertyName, value: propertyValue } =
				declaration as Declaration;

			// Check that the property name is supported
			if (
				propertyName !== undefined &&
				cssFeatures[propertyName] !== undefined
			) {
				const matchingPropertyTitles = getMatchingPropertyTitles({
					propertyName,
				});
				this.checkFeaturesSupport(matchingPropertyTitles);
			}

			// Check that the units and functions in the property value are supported
			if (propertyValue !== undefined) {
				const matchingFunctionTitles = getMatchingFunctionTitles({
					propertyValue,
				});
				this.checkFeaturesSupport(matchingFunctionTitles);
				const matchingUnitTitles = getMatchingUnitTitles({ propertyValue });
				this.checkFeaturesSupport(matchingUnitTitles);
				const matchingKeywordTitles = getMatchingKeywordTitles({
					propertyValue,
				});
				this.checkFeaturesSupport(matchingKeywordTitles);
			}

			// Check that the property name + value pair is supported
			if (propertyName !== undefined && propertyValue !== undefined) {
				const matchingPropertyValuePairTitles =
					getMatchingPropertyValuePairTitles({ propertyName, propertyValue });
				this.checkFeaturesSupport(matchingPropertyValuePairTitles);
			}
		}
	}

	checkCSSSelectors(selectors: string[]) {
		for (const selector of selectors) {
			const matchingPseudoSelectorTitles = getMatchingPseudoSelectorTitles({
				selector,
			});
			this.checkFeaturesSupport(matchingPseudoSelectorTitles);
			const matchingSelectorTitles = getMatchingSelectorTitles({ selector });
			this.checkFeaturesSupport(matchingSelectorTitles);
		}
	}

	checkStylesheet(stylesheet: Stylesheet) {
		const matchedAtRules: string[] = [];
		for (const stylesheetRule of stylesheet.stylesheet?.rules ?? []) {
			if (stylesheetRule.type === 'rule') {
				const rule = stylesheetRule as Rule;
				this.checkCSSDeclarations(rule.declarations ?? []);
				this.checkCSSSelectors(rule.selectors ?? []);
			}

			if (atRules.has(stylesheetRule.type!)) {
				matchedAtRules.push(stylesheetRule.type!);
			}
		}

		const matchingAtRuleTitles = getMatchingAtRuleTitles({
			atRules: matchedAtRules,
		});
		this.checkFeaturesSupport(matchingAtRuleTitles);
	}

	checkHtmlNode(node: Element) {
		const matchingElementTitles = getMatchingElementTitles({
			tagName: node.tagName,
		});
		this.checkFeaturesSupport(matchingElementTitles);
		const matchingAttributeTitles = getMatchingAttributeTitles({
			attributes: node.attrs.map((attr) => attr.name),
		});
		this.checkFeaturesSupport(matchingAttributeTitles);
		const matchingElementAttributePairTitles =
			getMatchingElementAttributePairTitles({
				tagName: node.tagName,
				attributes: Object.fromEntries(
					node.attrs.map((attr) => [attr.name, attr.value])
				),
			});
		this.checkFeaturesSupport(matchingElementAttributePairTitles);

		for (const childNode of node.childNodes) {
			if (childNode.nodeName === '#text') continue;
			if (childNode.nodeName === '#comment') continue;

			this.checkHtmlNode(childNode as Element);
		}
	}

	checkHtml(document: Document) {
		for (const childNode of document.childNodes) {
			if (childNode.nodeName === '#text') continue;
			if (childNode.nodeName === '#comment') continue;

			this.checkHtmlNode(childNode as Element);
		}
	}

	check(code: string) {
		const { document, stylesheets } = parseHtml(code);

		// Check the CSS
		for (const stylesheet of stylesheets) {
			this.checkStylesheet(stylesheet);
		}

		// Check the HTML
		this.checkHtml(document);
	}
}
