import multimatch from 'multimatch';
import { decl, Declaration, Plugin } from 'postcss';
import { DoIUseEmailOptions } from '~/types/options.js';
import { getEmailClientsFromOptions } from '~/utils/email-clients.js';
import {} from '~/utils/data'

export function doiuseEmail(options: DoIUseEmailOptions): Plugin {
	const emailClients = getEmailClientsFromOptions(options);

	return {
		postcssPlugin: 'doiuse-email',
		Declaration(declaration: Declaration) {
			const property = declaration.prop;


		},
	};
}
