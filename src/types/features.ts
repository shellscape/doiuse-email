export type IsSupported = string;

export type FeatureStats = {
	'apple-mail': {
		macos: Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
	};
	gmail: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
		'mobile-webmail': Record<string, IsSupported>;
	};
	orange: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	outlook: {
		windows: Record<string, IsSupported>;
		'windows-mail': Record<string, IsSupported>;
		macos: Record<string, IsSupported>;
		'outlook-com': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	yahoo: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	aol: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	'samsung-email': { android: Record<string, IsSupported> };
	sfr: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	thunderbird: { macos: Record<string, IsSupported> };
	protonmail: {
		'desktop-webmail': Record<string, IsSupported>;
		ios: Record<string, IsSupported>;
		android: Record<string, IsSupported>;
	};
	hey: { 'desktop-webmail': Record<string, IsSupported> };
	'mail-ru': { 'desktop-webmail': Record<string, IsSupported> };
	fastmail: { 'desktop-webmail': Record<string, IsSupported> };
	laposte: { 'desktop-webmail': Record<string, IsSupported> };
};

export type FeatureData = {
	slug: string;
	title: string;
	description: string | null;
	url: string;
	category: 'html' | 'css' | 'image';
	keywords: string | null;
	last_test_date: string;
	test_url: string;
	test_results_url: string | null;
	stats: FeatureStats;
	notes: string | null;
	notes_by_num: null | Record<string, string>;
};

export type CanIEmailData = {
	data: FeatureData[];
};
