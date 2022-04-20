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
		const result = doIUseEmail(code, { emailClients: ['gmail'] });
		expect(result.success).toEqual(true);
		expect(result).toMatchSnapshot();
	});

	test('parses inline CSS', () => {
		const code = outdent`
			<!doctype html>
			<html>
				<body>
					<div style='background-color: orange'></div>
				</body>
			</html>
		`;
		const result = doIUseEmail(code, { emailClients: ['gmail'] });
		expect(result.success).toEqual(true);
		expect(result).toMatchSnapshot();
	});
});
