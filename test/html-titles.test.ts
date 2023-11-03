import { describe, expect, test } from 'vitest';

import canIEmailJson from '../src/data/can-i-email.json';
import type { CanIEmailData } from '../src/types';
import {
  attributeTitles,
  elementAttributePairTitles,
  elementTitles
} from '../src/utils/titles/html';

const canIEmailData = canIEmailJson as unknown as CanIEmailData;
const allHTMLTitles = canIEmailData.data.filter((d) => d.category === 'html').map((d) => d.title);

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
  '<wbr> element'
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
  'width attribute'
];

const expectedElementAttributePairTitles = [
  // <html amp4email>
  'AMP for Email',
  'Local anchors',
  '<button type="reset"> element',
  '<button type="submit"> element',
  '<input type="checkbox"> element',
  '<input type="hidden"> element',
  '<input type="radio"> element',
  '<input type="reset"> element',
  '<input type="submit"> element',
  '<input type="text"> element',
  'mailto: links'
];

function expectEqualTitles(titles: Record<string, unknown>, actualTitles: string[]) {
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
    expectEqualTitles(elementAttributePairTitles, expectedElementAttributePairTitles);
  });

  test('all titles', () => {
    expectEqualTitles(
      {
        ...elementTitles,
        ...attributeTitles,
        ...elementAttributePairTitles
      },
      allHTMLTitles
    );
  });
});
