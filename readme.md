# doiuse-email

[![npm version](https://img.shields.io/npm/v/doiuse-email)](https://npmjs.com/package/doiuse-email)

A modification of the excellent [doiuse](https://github.com/anandthakker/doiuse) library to check the CSS support of various email clients based on [Can I email](https://caniemail.com).

## Installation

Install the package from npm using your favourite package manager:

```shell
npm install doiuse-email
```

Then, import it and run it by calling `doIUseEmail(html: string, options: DoIUseOptions)`:

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

## API

### doIUseEmail(html, options)

#### html

Type: `string`

The HTML that represents the email.

#### options

##### emailClients

Type: `string[]`

An array of email clients or email client families to be checked against the Can I Email database.

Possible values:
```javascript
"apple-mail.macos"
"apple-mail.ios"
"apple-mail" // equivalent to ["apple-mail.ios", "apple-mail.ios"]
"gmail.desktop-webmail"
"gmail.ios"
"gmail.android"
"gmail.mobile-webmail"
"gmail" // equivalent to ["gmail.desktop-webmail", "gmail.ios", "gmail.android", "gmail.mobile-webmail"]
"orange.desktop-webmail"
"orange.ios"
"orange.android"
"orange" // equivalent to ["orange.desktop-webmail", "orange.ios", "orange.android"]
"outlook.windows"
"outlook.windows-mail"
"outlook.macos"
"outlook.ios"
"outlook.android"
"outlook" // equivalent to ["outlook.windows", "outlook.windows-mail", "outlook.macos", "outlook.ios", "outlook.android"]
"yahoo.desktop-webmail"
"yahoo.ios"
"yahoo.android"
"yahoo" // equivalent to ["yahoo.desktop-webmail", "yahoo.ios", "yahoo.android"]
"aol.desktop-webmail"
"aol.ios"
"aol.android"
"aol" // equivalent to ["aol.desktop-webmail", "aol.ios", "aol.android"]
"samsung-email.android"
"samsung-email" // equivalent to ["samsung-email.android"]
"sfr.desktop-webmail"
"sfr.ios"
"sfr.android"
"sfr" // equivalent to ["sfr.desktop-webmail", "sfr.ios", "sfr.android"]
"thunderbird.macos"
"thunderbird" // equivalent to ["thunderbird"]
"protonmail.desktop-webmail"
"protonmail.ios"
"protonmail.android"
"protonmail" // ["protonmail.desktop-webmail", "protonmail.ios", "protonmail.android"]
"hey.desktop-webmail"
"hey" // equivalent to ["hey.desktop-webmail"]
"mail-ru.desktop-webmail"
"mail-ru" // equivalent to ["mail-ru.desktop-webmail"]
"fastmail.desktop-webmail"
"fastmail" // equivalent to ["fastmail.desktop-webmail"]
"laposte.desktop-webmail"
"laposte" // equivalent to ["laposte.desktop-webmail"]
```
