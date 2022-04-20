import { getCSSFeatures } from '~/utils/features.js';
import { fromTitleEntries } from '~/utils/titles/utils.js';

const propertyNameRegex = /^[a-z-]+$/;

// Map of property titles to the properties they support
export const propertyTitles = fromTitleEntries<string[]>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (title === 'left, right, top, bottom') {
			return {
				title,
				value: ['left', 'right', 'top', 'bottom'],
			};
		}

		const trimmedTitle = title
			.trim()
			.replace(/ shorthand$/, '')
			.replace(/ property$/, '');
		if (propertyNameRegex.test(trimmedTitle)) {
			return {
				title,
				value: [trimmedTitle],
			};
		}

		return undefined;
	})
);

export function getMatchingPropertyTitles({
	propertyName,
}: {
	propertyName: string;
}): string[] {
	const matchingPropertyTitles: string[] = [];

	for (const [title, propertyNames] of Object.entries(propertyTitles)) {
		if (propertyNames.includes(propertyName)) {
			matchingPropertyTitles.push(title);
		}
	}

	return matchingPropertyTitles;
}

export const propertyValuePairTitles = fromTitleEntries<
	readonly [/* property */ string, /* value */ string]
>(
	Object.keys(getCSSFeatures()).map((title) => {
		const matches = /([a-z-]+):\s*([a-z-]+)/.exec(title);
		if (matches === null) return undefined;

		return {
			title,
			value: [matches[1]!, matches[2]!] as const,
		};
	})
);

export function getMatchingPropertyValuePairTitles({
	propertyName,
	propertyValue,
}: {
	propertyName: string;
	propertyValue: string;
}): string[] {
	const matchingPropertyValuePairTitles: string[] = [];

	for (const [title, value] of Object.entries(propertyValuePairTitles)) {
		if (value[0] === propertyName && value[1] === propertyValue) {
			matchingPropertyValuePairTitles.push(title);
		}
	}

	return matchingPropertyValuePairTitles;
}

export const atRuleTitles = fromTitleEntries<string>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (!title.startsWith('@')) return;

		return {
			title,
			value: title.replace(/^@/, ''),
		};
	})
);

export function getMatchingAtRuleTitles({ atRules }: { atRules: string[] }) {
	const matchingAtRuleTitles: string[] = [];
	for (const [atRuleTitle, atRuleValue] of Object.entries(atRuleTitles)) {
		if (atRules.includes(atRuleValue)) {
			matchingAtRuleTitles.push(atRuleTitle);
		}
	}

	return matchingAtRuleTitles;
}

export const unitTitles = fromTitleEntries<string>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (!title.endsWith(' unit')) return;

		return {
			title,
			value: title.replace(/ unit$/, ''),
		};
	})
);

export function getMatchingUnitTitles({
	propertyValue,
}: {
	propertyValue: string;
}) {
	const matchingUnitTitles: string[] = [];

	for (const [unitTitle, unit] of Object.entries(unitTitles)) {
		if (unit === 'initial') {
			if (/\binitial\b/.test(propertyValue)) {
				matchingUnitTitles.push(unitTitle);
			}
		} else if (new RegExp(`\\d${unit}`).test(propertyValue)) {
			matchingUnitTitles.push(unitTitle);
		}
	}

	return matchingUnitTitles;
}

export const functionTitles = fromTitleEntries</* function name */ string>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (title.startsWith(':')) return;

		if (title === 'CSS Variables (Custom Properties)') {
			return {
				title,
				value: 'var',
			};
		}

		if (!title.includes('()')) {
			return;
		}

		const matches = /([a-z-]+)\(\)/.exec(title);
		if (matches === null) {
			throw new Error(`Could not determine function name in ${title}`);
		}

		return {
			title,
			value: matches[1]!,
		};
	})
);

export function getMatchingFunctionTitles({
	propertyValue,
}: {
	propertyValue: string;
}) {
	const matchingFunctionNames: string[] = [];

	// Match `<function>(` (e.g. `max(`, `calc(`)
	const valueFunctionNames = new Set(
		[...propertyValue.matchAll(/([a-z-]+)\(/g)].map((match) => match[1]!)
	);

	for (const [functionName, functionTitle] of Object.entries(functionTitles)) {
		if (valueFunctionNames.has(functionName)) {
			matchingFunctionNames.push(functionTitle);
		}

		valueFunctionNames.delete(functionName);
	}

	return matchingFunctionNames;
}

const selectorsRegexMap = {
	'Adjacent sibling combinator': /\+/, // a + b
	'Attribute selector': /\[.*(.?=.*)?]/, // [attr^="value"]
	'Chaining selectors': /(\.|#)[^.]+(\.|#)/, // .foo.bar
	'Child combinator': />/, // a > b
	'Class selector': /\./, // .className
	'Descendant combinator': /\S\s\S/, // a b
	'General sibling combinator': /~/, // img ~ p
	'Grouping selectors': /(\.|#)\S+?,/, // .foo, bar
	'ID selector': /#/, // #id
	'Type selector': /(^|\s)\S+(\s|$)/, // p
	'Universal selector *': /\*/, // *
};

export const selectorTitles = fromTitleEntries<RegExp>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (
			selectorsRegexMap[title as keyof typeof selectorsRegexMap] === undefined
		) {
			return;
		}

		return {
			title,
			value: selectorsRegexMap[title as keyof typeof selectorsRegexMap]!,
		};
	})
);

export function getMatchingSelectorTitles({ selector }: { selector: string }) {
	const matchingSelectorTitles: string[] = [];

	for (const [selectorTitle, selectorRegex] of Object.entries(selectorTitles)) {
		if (selectorRegex.test(selector)) {
			matchingSelectorTitles.push(selectorTitle);
		}
	}

	return matchingSelectorTitles;
}

export const psuedoSelectorTitles = fromTitleEntries<string>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (!title.startsWith(':')) return;

		return {
			title,
			value: title,
		};
	})
);

export function getMatchingPseudoSelectorTitles({
	selector,
}: {
	selector: string;
}) {
	const matchingPseudoSelectorTitles: string[] = [];

	for (const [selectorTitle, selectorValue] of Object.entries(
		psuedoSelectorTitles
	)) {
		if (selector.includes(selectorValue)) {
			matchingPseudoSelectorTitles.push(selectorTitle);
		}
	}

	return matchingPseudoSelectorTitles;
}

export const keywordTitles = fromTitleEntries<string>(
	Object.keys(getCSSFeatures()).map((title) => {
		if (!title.includes(' keyword')) return;

		return {
			title,
			value: title.replace(/ keyword$/, ''),
		};
	})
);

export function getMatchingKeywordTitles({
	propertyValue,
}: {
	propertyValue: string;
}) {
	const matchingKeywordTitles: string[] = [];
	for (const [keywordTitle, keywordValue] of Object.entries(keywordTitles)) {
		if (propertyValue.includes(keywordValue)) {
			matchingKeywordTitles.push(keywordTitle);
		}
	}

	return matchingKeywordTitles;
}
