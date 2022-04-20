import type { emailClientsList } from '../utils/email-clients.js';

export type EmailClient = typeof emailClientsList[number];
