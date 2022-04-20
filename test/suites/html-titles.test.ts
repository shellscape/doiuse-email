import { describe, expect, test } from 'vitest';

import {
	attributeTitles,
	elementAttributePairTitles,
	elementTitles,
} from '~/utils/titles/html.js';
import caniemail from '~data/can-i-email.json';

const allHTMLTitles = caniemail.data
	.filter((d) => d.category === 'html')
	.map((d) => d.title);

const expectedElementTitles = [
	'address',
	'<audio> element',
	'<base>',
	'<bdi> element',
	'<blockquote> element',
	'<body> element',
	'<del> element',
	'<dialog> element',
	'<div> element',
	'HTML5 doctype',
	'<form> element',
	'<h1> to <h6> elements',
	'Image maps',
	'<link> element',
	'<ul>, <ol> and <dl>',
	'<marquee> element',
	'<meter> element',
	'<object> element',
	'<p> element',
	'<picture> element',
	'<progress> element',
	'<rp> element',
	'<rt> element',
	'<ruby> element',
	'<select> element',
	'HTML5 semantics',
	'<small> element',
	'<span> element',
	'<strike> element',
	'<strong> element',
	'<style> element',
	'Embedded <svg> image',
	'<table> element',
	'<textarea> element',
	'<video> element',
	'<wbr> element',
];

const expectedAttributeTitles = [
	'align attribute',
	'aria-describedby attribute',
	'aria-hidden attribute',
	'aria-label attribute',
	'aria-labelledby attribute',
	'aria-live attribute',
	'background attribute',
	'dir attribute',
	'height attribute',
	'lang attribute',
	'loading attribute',
	'required attribute',
	'role attribute',
	'srcset and sizes attributes',
	'target attribute',
	'valign attribute',
	'width attribute',
];

const expectedElementAttributePairTitles = [
	'AMP for Email', // <html amp4email>
	'Local anchors',
	'<button type="reset"> element',
	'<button type="submit"> element',
	'<input type="checkbox"> element',
	'<input type="hidden"> element',
	'<input type="radio"> element',
	'<input type="reset"> element',
	'<input type="submit"> element',
	'<input type="text"> element',
	'mailto: links',
];

function expectEqualTitles(
	titles: Record<string, unknown>,
	actualTitles: string[]
) {
	expect(Object.keys(titles).sort()).toEqual(actualTitles.sort());
}

describe('css titles', () => {
	test('element titles', () => {
		expectEqualTitles(elementTitles, expectedElementTitles);
	});

	test('attribute titles', () => {
		expectEqualTitles(attributeTitles, expectedAttributeTitles);
	});

	test('element-attribute pair titles', () => {
		expectEqualTitles(
			elementAttributePairTitles,
			expectedElementAttributePairTitles
		);
	});

	test('all titles', () => {
		expectEqualTitles(
			{
				...elementTitles,
				...attributeTitles,
				...elementAttributePairTitles,
			},
			allHTMLTitles
		);
	});
});
