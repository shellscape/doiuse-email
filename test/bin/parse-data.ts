import { join } from 'desm';
import * as fs from 'node:fs';

import type { CanIEmailData } from '~/types/features';

const caniemail = JSON.parse(
	fs.readFileSync(join(import.meta.url, '../../data/can-i-email.json'), 'utf8')
) as CanIEmailData;

console.log(
	JSON.stringify(
		caniemail.data.filter((d) => d.category === 'html').map((d) => d.title),
		null,
		'\t'
	)
);
