import { program } from 'commander';
import * as fs from 'node:fs';
import process from 'node:process';

import type { EmailClient } from '~/types/email-client.js';
import { DoIUseEmail, doIUseEmail } from '~/utils/doiuse.js';

program
	.name('doiuse-email')
	.showHelpAfterError()
	.requiredOption(
		'-e, --email-clients <email-clients>',
		'a comma separated list of email clients to check support against'
	)
	.option(
		'--supported-features',
		'output the supported email features for the email clients specified'
	)
	.argument('[file]', 'the path to the HTML file to check')
	.parse();

const opts = program.opts<{
	emailClients: string;
	supportedFeatures?: boolean;
}>();
const file = program.args[0];

if (opts.supportedFeatures !== undefined && file !== undefined) {
	throw new Error(
		'Only one of `file` or `--supported-features` should be provided.'
	);
}

const emailClients = opts.emailClients.split(',') as EmailClient[];

if (file !== undefined) {
	const htmlCode = fs.readFileSync(program.args[0]!, 'utf8');
	process.stdout.write(JSON.stringify(doIUseEmail(htmlCode, { emailClients })));
}
// If the `--supported-features` flag is provided, output the supported features
else if (opts.supportedFeatures) {
	process.stdout.write(
		JSON.stringify(
			new DoIUseEmail({
				emailClients,
			}).getSupportedFeatures()
		)
	);
}
