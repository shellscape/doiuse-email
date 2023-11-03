import type { emailClientsList } from './utils/email-clients';

export type EmailClient = (typeof emailClientsList)[number];

export type IsSupported = string;

export interface FeatureStats {
  aol: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
  };
  'apple-mail': {
    ios: Record<string, IsSupported>;
    macos: Record<string, IsSupported>;
  };
  fastmail: { 'desktop-webmail': Record<string, IsSupported> };
  gmail: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
    'mobile-webmail': Record<string, IsSupported>;
  };
  hey: { 'desktop-webmail': Record<string, IsSupported> };
  laposte: { 'desktop-webmail': Record<string, IsSupported> };
  'mail-ru': { 'desktop-webmail': Record<string, IsSupported> };
  orange: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
  };
  outlook: {
    android: Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
    macos: Record<string, IsSupported>;
    'outlook-com': Record<string, IsSupported>;
    windows: Record<string, IsSupported>;
    'windows-mail': Record<string, IsSupported>;
  };
  protonmail: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
  };
  'samsung-email': { android: Record<string, IsSupported> };
  sfr: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
  };
  thunderbird: { macos: Record<string, IsSupported> };
  yahoo: {
    android: Record<string, IsSupported>;
    'desktop-webmail': Record<string, IsSupported>;
    ios: Record<string, IsSupported>;
  };
}

export interface FeatureData {
  category: 'html' | 'css' | 'image';
  description: string | null;
  keywords: string | null;
  last_test_date: string;
  notes: string | null;
  notes_by_num: null | Record<string, string>;
  slug: string;
  stats: FeatureStats;
  test_results_url: string | null;
  test_url: string;
  title: string;
  url: string;
}

export interface CanIEmailData {
  data: FeatureData[];
}

export interface DoIUseEmailOptions {
  /**
		An array of globs to match email clients.
	*/
  emailClients: string[];
}
