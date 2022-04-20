import { outdent } from 'outdent';
import { describe, expect, test } from 'vitest';

import { DoIUseEmail, doIUseEmail } from '~/index.js';

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

	test('should work with selectors', () => {
		// Desktop webmail supports most selectors
		const code = outdent`
			<!doctype html>
			<html>
				<head>
					<style>
						div > a#linkId[href="https://google.com"].link {}
						* { box-sizing: border-box }
					</style>
				</head>
				<body>
					<div>
						<a id='linkId' class='link' href='https://google.com'></div>
					</div>
				</body>
			</html>
		`;
		const result = doIUseEmail(code, {
			emailClients: ['gmail.desktop-webmail'],
		});
		expect(result.success).toEqual(true);
		expect(result).toMatchSnapshot();
	});

	test('should fail with unsupported element-attribute pairs', () => {
		// iOS Gmail does not support local anchors: https://www.caniemail.com/features/html-anchor-links/
		const code = outdent`
			<!doctype html>
			<html>
				<body>
					<div>
						<div id='header'>Header</div>
						<a href='#header'></div>
					</div>
				</body>
			</html>
		`;
		const result = doIUseEmail(code, {
			emailClients: ['gmail.ios'],
		});
		expect(result.success).toEqual(false);
		expect(result).toMatchSnapshot();
	});

	test('getSupportedFeatures()', () => {
		const doIUseEmail = new DoIUseEmail({ emailClients: ['*'] });
		expect(doIUseEmail.getSupportedFeatures()).toMatchSnapshot();
	});
});
