import type {
	emailClientFamiliesList,
	emailClientsList,
} from '../utils/email-clients.js';

export type EmailClient = typeof emailClientsList[number];

export type EmailClientFamily = typeof emailClientFamiliesList[number];

export type EmailClientOrFamily = EmailClient | EmailClientFamily;
