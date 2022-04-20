import type { EmailClient, EmailClientFamily } from '~/types/email-client.js';
import type { IsSupported } from '~/types/features.js';
import type { DoIUseEmailOptions } from '~/types/options.js';

export const emailClientFamiliesList = [
	'apple-mail',
	'gmail',
	'orange',
	'outlook',
	'yahoo',
	'aol',
	'samsung-email',
	'sfr',
	'thunderbird',
	'protonmail',
	'hey',
	'mail-ru',
	'fastmail',
	'laposte',
] as const;

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
	'laposte.desktop-webmail',
] as const;

const emailClientFamilyToClients = {} as Record<
	EmailClientFamily,
	EmailClient[]
>;

for (const emailClient of emailClientsList) {
	const family = emailClient.split('.')[0]! as EmailClientFamily;

	emailClientFamilyToClients[family] ??= [];
	emailClientFamilyToClients[family].push(emailClient);
}

export function getEmailClientsFromOptions(
	options: DoIUseEmailOptions
): EmailClient[] {
	const { emailClients: emailClientsOrFamilies } = options;

	const emailClients = new Set<EmailClient>();

	for (const emailClientOrFamily of emailClientsOrFamilies) {
		if (emailClientOrFamily.includes('.')) {
			emailClients.add(emailClientOrFamily as EmailClient);
		} else {
			const family = emailClientOrFamily.split('.')[0]! as EmailClientFamily;

			for (const emailClient of emailClientFamilyToClients[family]) {
				emailClients.add(emailClient);
			}
		}
	}

	return [...emailClients];
}

type EmailClientSupportStatus =
	| { type: 'full' }
	| { type: 'partial'; noteNumbers: number[] }
	| { type: 'none' };

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

	if (supportStatus === 'y') {
		return { type: 'full' };
	} else if (supportStatus === 'n') {
		return { type: 'none' };
	} else {
		return {
			type: 'partial',
			noteNumbers: [...supportStatus.matchAll(/#(\d+)/g)]
				.map((matches) => matches[1]!)
				.map((noteNumber) => Number(noteNumber)),
		};
	}
}
