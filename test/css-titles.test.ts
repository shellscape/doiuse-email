import { describe, expect, test } from 'vitest';

import {
  atRuleTitles,
  functionTitles,
  keywordTitles,
  propertyTitles,
  propertyValuePairTitles,
  psuedoSelectorTitles,
  selectorTitles,
  unitTitles
} from '../src/utils/titles/css';

const expectEqualTitles = (titles: Record<string, unknown>) =>
  expect(Object.keys(titles).sort()).toMatchSnapshot();

describe('css titles', () => {
  test('property titles', () => {
    expectEqualTitles(propertyTitles);
  });

  test('at rule titles', () => {
    expectEqualTitles(atRuleTitles);
  });

  test('property value pair titles', () => {
    expectEqualTitles(propertyValuePairTitles);
  });

  test('unit titles', () => {
    expectEqualTitles(unitTitles);
  });

  test('selector titles', () => {
    expectEqualTitles(selectorTitles);
  });

  test('function titles', () => {
    expectEqualTitles(functionTitles);
  });

  test('pseudo selector titles', () => {
    expectEqualTitles(psuedoSelectorTitles);
  });

  test('keyword titles', () => {
    expectEqualTitles(keywordTitles);
  });
});
