import { describe, expect, test } from 'vitest';

import canIEmailData from '~/data/can-i-email.cjs';
import {
	atRuleTitles,
	functionTitles,
	keywordTitles,
	propertyTitles,
	propertyValuePairTitles,
	psuedoSelectorTitles,
	selectorTitles,
	unitTitles
} from '~/utils/titles/css.js';

const allCSSTitles = canIEmailData.data
	.filter((d) => d.category === 'css')
	.map((d) => d.title);

const expectedPropertyTitles = [
	'align-items',
	'animation',
	'aspect-ratio',
	'background-blend-mode',
	'background-clip',
	'background-color',
	'background-image',
	'background-origin',
	'background-position',
	'background-repeat',
	'background-size',
	'background',
	'border-image',
	'border-radius',
	'border',
	'box-shadow',
	'box-sizing',
	'caption-side',
	'clip-path',
	'column-count',
	'direction',
	'display',
	'filter',
	'float',
	'font-weight',
	'font shorthand',
	'height property',
	'inline-size ',
	'justify-content',
	'left, right, top, bottom',
	'letter-spacing',
	'line-height',
	'list-style-image',
	'list-style-position',
	'list-style-type',
	'list-style',
	'margin',
	'max-height property',
	'max-width',
	'min-height property',
	'min-width property',
	'mix-blend-mode',
	'object-fit',
	'object-position',
	'opacity',
	'outline',
	'overflow',
	'padding',
	'position',
	'text-align',
	'text-decoration-color',
	'text-decoration-thickness',
	'text-decoration',
	'text-indent',
	'text-overflow',
	'text-shadow',
	'text-transform',
	'text-underline-offset',
	'transform',
	'vertical-align',
	'visibility',
	'white-space',
	'width property',
	'word-break',
	'z-index'
];

const expectedAtRuleTitles = [
	'@font-face',
	'@import',
	'@keyframes',
	'@media (-webkit-device-pixel-ratio)',
	'@media (orientation)',
	'@media (prefers-color-scheme)',
	'@media (prefers-reduced-motion)',
	'@media',
	'@supports'
];

const expectedPropertyValuePairTitles = [
	'display:flex',
	'display:grid',
	'display:none',
	'flex-direction:column',
	'flex-wrap: wrap'
];

const expectedUnitTitles = [
	'ch unit',
	'cm unit',
	'em unit',
	'ex unit',
	'in unit',
	'initial unit',
	'mm unit',
	'pc unit',
	'% unit',
	'pt unit',
	'px unit',
	'rem unit',
	'vh unit',
	'vmax unit',
	'vmin unit',
	'vw unit'
];

const expectedFunctionTitles = [
	'CSS Variables (Custom Properties)',
	'CSS calc() function',
	'clamp()',
	'radial-gradient()',
	'linear-gradient()',
	'max()',
	'min()',
	'rgb()',
	'rgba()'
];

const expectedPseudoSelectorTitles = [
	':active',
	':checked',
	':first-child',
	':first-of-type',
	':focus',
	':has()',
	':hover',
	':last-child',
	':last-of-type',
	':link',
	':not',
	':nth-child',
	':nth-last-child',
	':nth-last-of-type',
	':nth-of-type',
	':only-child',
	':only-of-type',
	':target',
	':visited',
	'::after',
	'::before',
	'::first-letter',
	'::first-line',
	'::placeholder'
];

const expectedSelectorTitles = [
	'Adjacent sibling combinator',
	'Attribute selector',
	'Chaining selectors',
	'Child combinator',
	'Class selector',
	'Descendant combinator',
	'General sibling combinator',
	'Grouping selectors',
	'ID selector',
	'Type selector',
	'Universal selector *'
];

const expectedKeywordTitles = ['!important keyword'];

function expectEqualTitles(
	titles: Record<string, unknown>,
	actualTitles: string[]
) {
	expect(Object.keys(titles).sort()).toEqual(actualTitles.sort());
}

describe('css titles', () => {
	test('property titles', () => {
		expectEqualTitles(propertyTitles, expectedPropertyTitles);
	});

	test('at rule titles', () => {
		expectEqualTitles(atRuleTitles, expectedAtRuleTitles);
	});

	test('property value pair titles', () => {
		expectEqualTitles(propertyValuePairTitles, expectedPropertyValuePairTitles);
	});

	test('unit titles', () => {
		expectEqualTitles(unitTitles, expectedUnitTitles);
	});

	test('selector titles', () => {
		expectEqualTitles(selectorTitles, expectedSelectorTitles);
	});

	test('function titles', () => {
		expectEqualTitles(functionTitles, expectedFunctionTitles);
	});

	test('pseudo selector titles', () => {
		expectEqualTitles(psuedoSelectorTitles, expectedPseudoSelectorTitles);
	});

	test('keyword titles', () => {
		expectEqualTitles(keywordTitles, expectedKeywordTitles);
	});

	test('all titles', () => {
		expectEqualTitles(
			{
				...propertyTitles,
				...atRuleTitles,
				...propertyValuePairTitles,
				...unitTitles,
				...selectorTitles,
				...psuedoSelectorTitles,
				...functionTitles,
				...keywordTitles
			},
			allCSSTitles
		);
	});
});
