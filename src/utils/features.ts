// eslint-disable-next-line import/no-extraneous-dependencies
import onetime from 'onetime';

import canIEmailJson from '../data/can-i-email.json';
import type { CanIEmailData, FeatureData } from '../types';

const canIEmailData = canIEmailJson as unknown as CanIEmailData;

export const getCSSFeatures = onetime((): Record<string, FeatureData> => {
  const cssFeatures: Record<string, FeatureData> = {};

  for (const data of canIEmailData.data) {
    // eslint-disable-next-line no-continue
    if (data.category !== 'css') continue;
    cssFeatures[data.title] = data;
  }

  return cssFeatures;
});

export const getHTMLFeatures = onetime((): Record<string, FeatureData> => {
  const htmlFeatures: Record<string, FeatureData> = {};

  for (const data of canIEmailData.data) {
    // eslint-disable-next-line no-continue
    if (data.category !== 'html') continue;
    htmlFeatures[data.title] = data;
  }

  return htmlFeatures;
});

export const getAllFeatures = onetime((): Record<string, FeatureData> => {
  const allFeatures: Record<string, FeatureData> = {};

  for (const data of canIEmailData.data) {
    allFeatures[data.title] = data;
  }

  return allFeatures;
});
