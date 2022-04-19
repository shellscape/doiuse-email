import onetime from 'onetime';

import type { FeatureStats } from '~/types/features.js';
import canIEmailData from '~/utils/data.js';

export const getCSSFeatures = onetime((): Record<string, FeatureStats> => {
	const cssFeatures: Record<string, FeatureStats> = {};

	for (const { title, stats, category } of canIEmailData.data) {
		if (category !== 'css') continue;
		cssFeatures[title] = stats;
	}

	return cssFeatures;
});

export const getHTMLFeatures = onetime((): Record<string, FeatureStats> => {
	const htmlFeatures: Record<string, FeatureStats> = {};

	for (const { title, stats, category } of canIEmailData.data) {
		if (category !== 'html') continue;
		htmlFeatures[title] = stats;
	}

	return htmlFeatures;
});
