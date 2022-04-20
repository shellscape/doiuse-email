# doiuse-email

[![npm version](https://img.shields.io/npm/v/doiuse-email)](https://npmjs.com/package/doiuse-email)

A modification of the excellent [doiuse](https://github.com/anandthakker/doiuse) library to check the CSS support of various email clients based on [Can I email](https://caniemail.com).

## Installation

Install the package from npm using your favourite package manager:

```shell
npm install doiuse-email
```

Then, import it and run it by calling `doIUseEmail(code: string, options: DoIUseOptions)`:

```typescript
import { doIUseEmail } from 'doiuse-email';

const result = doIUseEmail(`
  <!doctype html>
  <html>
    <body>
      <div style='background-color: orange'></div>
    </body>
  </html>
  `,
  { emailClients: ['gmail'] }
);

console.log(result);
/*
{
  "notes": [
    "Note about \`<body> element\` support for \`gmail.desktop-webmail\`: Partial. Replaced by a \`<div>\` with supported attributes.",
    "Note about \`<body> element\` support for \`gmail.ios\`: Partial. Replaced by a \`<div>\` with supported attributes.",
    "Note about \`<body> element\` support for \`gmail.android\`: Partial. Replaced by a \`<div>\` with supported attributes.",
    "Note about \`<body> element\` support for \`gmail.mobile-webmail\`: Partial. Replaced by a \`<div>\` with supported attributes.",
  ],
  "success": true,
}
*/

// Output is based on https://caniemail.com
```
