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
		const result = doIUseEmail(code, { emailClients: ['gmail.*'] });
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
		const result = doIUseEmail(code, { emailClients: ['gmail.*'] });
		expect(result.success).toEqual(true);
		expect(result).toMatchSnapshot();
	});

	test('should fail on unsupported <style> features', () => {
		// `filter` isn't supported by gmail.desktop-webmail: https://www.caniemail.com/features/css-filter/
		const code = outdent`
			<!doctype html>
			<html>
				<head>
					<style>
						.container {
							filter: blur(50%);
						}
					</style>
				</head>
				<body>
					<div class='container' style='background-color: orange'></div>
				</body>
			</html>
		`;
		const result = doIUseEmail(code, {
			emailClients: ['gmail.desktop-webmail'],
		});
		expect(result.success).toEqual(false);
		expect(result).toMatchSnapshot();
	});

	test('should fail on unsupported inline-style features', () => {
		// `flex-direction: column` isn't supported by Gmail: https://www.caniemail.com/features/css-flex-direction/
		const code = outdent`
			<!doctype html>
			<html>
				<body>
					<div style='flex-direction: column'></div>
				</body>
			</html>
		`;
		const result = doIUseEmail(code, {
			emailClients: ['gmail.desktop-webmail'],
		});
		expect(result.success).toEqual(false);
		expect(result).toMatchSnapshot();
	});
});
