# doiuse-email

[![npm version](https://img.shields.io/npm/v/doiuse-email)](https://npmjs.com/package/doiuse-email)

A tool for checking the HTML and CSS support of various email clients based on [Can I email](https://caniemail.com).
\
Inspired by the excellent [doiuse](https://github.com/anandthakker/doiuse) library.

## Installation

Install the package from npm using your favourite package manager:

```shell
npm install doiuse-email
```

## Programmatic Usage

Import it and run it by calling `doIUseEmail(html: string, options: DoIUseOptions)`:

```typescript
import { doIUseEmail } from 'doiuse-email';

const result = doIUseEmail(
  `
  <!doctype html>
  <html>
    <body>
      <div style='background-color: orange'></div>
    </body>
  </html>
  `,
  { emailClients: ['gmail.*'] }
);

console.log(result);
/*
  {
    "notes": [
      "Note about `<body> element` support for `gmail.desktop-webmail`: Partial. Replaced by a `<div>` with supported attributes.",
      "Note about `<body> element` support for `gmail.ios`: Partial. Replaced by a `<div>` with supported attributes.",
      "Note about `<body> element` support for `gmail.android`: Partial. Replaced by a `<div>` with supported attributes.",
      "Note about `<body> element` support for `gmail.mobile-webmail`: Partial. Replaced by a `<div>` with supported attributes.",
    ],
    "success": true,
  }
*/

// Output is based on https://caniemail.com
```

## CLI Usage

You can also call `doiuse-email` from the CLI:

```shell
doiuse-email --email-clients='gmail.*' myfile.html
```

The command will output a JSON representing the support for the HTML in the provided file. It's recommended to use it with a tool like [jq](https://github.com/stedolan/jq) for more human-readable output:

```shell
doiuse-email --email-clients='gmail.*' myfile.html | jq
```

## API

### doIUseEmail(html, options)

#### html

Type: `string`

The HTML that represents the email.

#### options

##### emailClients

Type: `string[]`

An array of globs for matching email clients to be checked against the Can I Email database. For more information about the glob syntax that is used, refer to the [micromatch](https://www.npmjs.com/package/micromatch) package.

Possible email clients:

```javascript
[
  'apple-mail.macos',
  'apple-mail.ios',
  'gmail.desktop-webmail',
  'gmail.ios',
  'gmail.android',
  'gmail.mobile-webmail',
  'orange.desktop-webmail',
  'orange.ios',
  'orange.android',
  'outlook.windows',
  'outlook.windows-mail',
  'outlook.macos',
  'outlook.ios',
  'outlook.android',
  'yahoo.desktop-webmail',
  'yahoo.ios',
  'yahoo.android',
  'aol.desktop-webmail',
  'aol.ios',
  'aol.android',
  'samsung-email.android',
  'sfr.desktop-webmail',
  'sfr.ios',
  'sfr.android',
  'thunderbird.macos',
  'protonmail.desktop-webmail',
  'protonmail.ios',
  'protonmail.android',
  'hey.desktop-webmail',
  'mail-ru.desktop-webmail',
  'fastmail.desktop-webmail',
  'laposte.desktop-webmail'
];
```

Example: `["gmail.*", "*.desktop-webmail"]`
