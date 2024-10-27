import { describe, expect, test } from 'vitest';

import {
  attributeTitles,
  elementAttributePairTitles,
  elementTitles
} from '../src/utils/titles/html';

const expectEqualTitles = (titles: Record<string, unknown>) =>
  expect(Object.keys(titles).sort()).toMatchSnapshot();

describe('css titles', () => {
  test('element titles', () => {
    expectEqualTitles(elementTitles);
  });

  test('attribute titles', () => {
    expectEqualTitles(attributeTitles);
  });

  test('element-attribute pair titles', () => {
    expectEqualTitles(elementAttributePairTitles);
  });
});
