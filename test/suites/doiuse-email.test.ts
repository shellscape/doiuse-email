import { outdent } from 'outdent';
import { describe, expect, test } from 'vitest';

import { doIUseEmail } from '~/index.js';

describe('doIUseEmail() works', () => {
	test('works with blank email template', () => {
		const code = outdent`
			<!doctype html>
			<html>
				<body>
				</body>
			</html>
		`;
		expect(doIUseEmail(code, { emailClients: ['gmail'] }).success).toEqual(
			true
		);
	});
});
