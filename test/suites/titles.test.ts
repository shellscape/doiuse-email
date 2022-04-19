import { expect, test } from 'vitest';

import caniemail from '~/utils/data.js';
import {
	atRuleTitles,
	propertyTitles,
	propertyValuePairTitles,
	selectorTitles,
	unitTitles,
} from '~/utils/titles.js';

const allCSSTitles = caniemail.data
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
	'z-index',
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
	'@supports',
];

const expectedPropertyValuePairTitles = [
	'display:flex',
	'display:grid',
	'display:none',
	'flex-direction:column',
	'flex-wrap: wrap',
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
];

export const expectedSelectorTitles = [
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
	'Universal selector *',
];

function expectEqualTitles(
	titles: Record<string, unknown>,
	actualTitles: string[]
) {
	expect(new Set(Object.keys(titles))).toEqual(actualTitles);
}

test('css titles', () => {
	expectEqualTitles(propertyTitles, expectedPropertyTitles);
	expectEqualTitles(atRuleTitles, expectedAtRuleTitles);
	expectEqualTitles(propertyValuePairTitles, expectedPropertyValuePairTitles);
	expectEqualTitles(unitTitles, expectedUnitTitles);
	expectEqualTitles(selectorTitles, expectedSelectorTitles);
	expectEqualTitles(
		{
			...propertyTitles,
			...atRuleTitles,
			...propertyValuePairTitles,
			...unitTitles,
			...selectorTitles,
		},
		allCSSTitles
	);

	expect(new Set([]));
});
