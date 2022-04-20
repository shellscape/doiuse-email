import { program } from 'commander';
import process from 'node:process';

import type { EmailClient } from '~/types/email-client.js';
import { doIUseEmail } from '~/utils/doiuse.js';

program
	.name('doiuse-email')
	.showHelpAfterError()
	.option(
		'-e, --email-clients <email-clients>',
		'a comma separated list of email clients to check support against'
	)
	.argument('<file>', 'the path to the HTML file to check')
	.parse();

const opts = program.opts<{ emailClients: string }>();

const emailClients = opts.emailClients.split(',') as EmailClient[];

process.stdout.write(
	JSON.stringify(doIUseEmail(program.args[0]!, { emailClients }))
);
