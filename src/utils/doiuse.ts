import type { Comment, Declaration, Rule, Stylesheet } from 'css';
import { getProperty } from 'dot-prop';
import type { Document } from 'parse5';

import type { EmailClient } from '~/types/email-client.js';
import type { DoIUseEmailOptions } from '~/types/options.js';
import { getEmailClientsFromOptions } from '~/utils/email-clients.js';
import { getCSSFeatures, getHTMLFeatures } from '~/utils/features.js';
import { parseHtml } from '~/utils/html.js';
import {
	getMatchingFunctionTitles,
	getMatchingPropertyTitles,
	getMatchingPropertyValuePairTitles,
	getMatchingPsuedoSelectorTitles,
	getMatchingUnitTitles,
} from '~/utils/titles.js';

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
				const matchingPropertyTitles = getMatchingPropertyTitles(propertyName);
				this.checkFeaturesSupport(matchingPropertyTitles);
			}

			// Check that the units and functions in the property value are supported
			if (propertyValue !== undefined) {
				const matchingFunctionTitles = getMatchingFunctionTitles(propertyValue);
				this.checkFeaturesSupport(matchingFunctionTitles);
				const matchingUnitTitles = getMatchingUnitTitles(propertyValue);
				this.checkFeaturesSupport(matchingUnitTitles);
			}

			// Check that the property name + value pair is supported
			if (propertyName !== undefined && propertyValue !== undefined) {
				const matchingPropertyValuePairTitles =
					getMatchingPropertyValuePairTitles(propertyName, propertyValue);
				this.checkFeaturesSupport(matchingPropertyValuePairTitles);
			}
		}
	}

	checkCSSSelectors(selectors: string[]) {
		for (const selector of selectors) {
			const matchingPsuedoSelectorTitles =
				getMatchingPsuedoSelectorTitles(selector);
			this.checkFeaturesSupport(matchingPsuedoSelectorTitles);
		}
	}

	checkStylesheet(stylesheet: Stylesheet) {
		for (const stylesheetRule of stylesheet.stylesheet?.rules ?? []) {
			if (stylesheetRule.type === 'rule') {
				const rule = stylesheetRule as Rule;
				this.checkCSSDeclarations(rule.declarations ?? []);
				this.checkCSSSelectors(rule.selectors ?? []);
			}
		}
	}

	checkHtml(document: Document) {
		const htmlFeatures = getHTMLFeatures();

		new Set<string>();

		for (const childNodes of document.childNodes) {
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
