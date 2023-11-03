import onetime from 'onetime';

import canIEmailData from '../data/can-i-email.cjs';
import type { FeatureData } from '~/types/features.js';

export const getCSSFeatures = onetime((): Record<string, FeatureData> => {
	const cssFeatures: Record<string, FeatureData> = {};

	for (const data of canIEmailData.data) {
		if (data.category !== 'css') continue;
		cssFeatures[data.title] = data;
	}

	return cssFeatures;
});

export const getHTMLFeatures = onetime((): Record<string, FeatureData> => {
	const htmlFeatures: Record<string, FeatureData> = {};

	for (const data of canIEmailData.data) {
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
