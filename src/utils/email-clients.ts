import micromatch from 'micromatch';

import type { EmailClient } from '~/types/email-client.js';
import type { IsSupported } from '~/types/features.js';
import type { DoIUseEmailOptions } from '~/types/options.js';

export const emailClientsList = [
	'apple-mail.macos',
	'apple-mail.ios',
	'gmail.desktop-webmail',
	'gmail.ios',
	'gmail.android',
	'gmail.mobile-webmail',
	'orange.desktop-webmail',
	'orange.ios',
	'orange.android',
	'outlook.windows',
	'outlook.windows-mail',
	'outlook.macos',
	'outlook.ios',
	'outlook.android',
	'yahoo.desktop-webmail',
	'yahoo.ios',
	'yahoo.android',
	'aol.desktop-webmail',
	'aol.ios',
	'aol.android',
	'samsung-email.android',
	'sfr.desktop-webmail',
	'sfr.ios',
	'sfr.android',
	'thunderbird.macos',
	'protonmail.desktop-webmail',
	'protonmail.ios',
	'protonmail.android',
	'hey.desktop-webmail',
	'mail-ru.desktop-webmail',
	'fastmail.desktop-webmail',
	'laposte.desktop-webmail'
] as const;

export function getEmailClientsFromOptions(
	options: DoIUseEmailOptions
): EmailClient[] {
	const { emailClients: emailClientGlobs } = options;

	const emailClients = new Set<EmailClient>();

	for (const match of micromatch(emailClientsList, emailClientGlobs)) {
		emailClients.add(match as EmailClient);
	}

	return [...emailClients];
}

type EmailClientSupportStatus = {
	type: 'full' | 'partial' | 'none';
	noteNumbers: number[] | undefined;
};

export function getEmailClientSupportStatus(
	// Map from email client versions to support status
	emailClientStats: Record<string, IsSupported>
): EmailClientSupportStatus {
	const statKeys = Object.keys(emailClientStats).sort((k1, k2) => {
		if (k1 < k2) {
			return -1;
		} else if (k1 > k2) {
			return 1;
		} else {
			return 0;
		}
	});

	// TODO: option to specify specific version, right now, it defaults to latest
	const latestEmailClient = statKeys[statKeys.length - 1];

	const supportStatus = emailClientStats[latestEmailClient!]!;

	let noteNumbers: number[] | undefined = [...supportStatus.matchAll(/#(\d+)/g)]
		.map((matches) => matches[1]!)
		.map((noteNumber) => Number(noteNumber));
	if (noteNumbers.length === 0) {
		noteNumbers = undefined;
	}

	if (supportStatus.startsWith('y')) {
		return { type: 'full', noteNumbers };
	} else if (supportStatus.startsWith('n')) {
		return { type: 'none', noteNumbers };
	} else {
		return {
			type: 'partial',
			noteNumbers
		};
	}
}
