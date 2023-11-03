import { createPackageBuilder } from 'lionconfig';
import { join } from 'desm';
import fs from 'node:fs';

await createPackageBuilder(import.meta, {
	packageJsonPath: '../package.json'
})
	.cleanDistFolder()
	.tsc()
	.generateBundles({ commonjs: true })
	.copyPackageFiles()
	.run(() => {
		fs.cpSync(
			join(import.meta.url, '../src/data/can-i-email.cjs'),
			join(import.meta.url, '../dist/data/can-i-email.cjs')
		);
	})
	.build();
