import { createPackageBuilder } from "lionconfig";

await createPackageBuilder(import.meta, {
  packageJsonPath: "../package.json",
})
  .cleanDistFolder()
  .tsc()
  .generateBundles({ commonjs: true })
  .copyPackageFiles()
  .build();
