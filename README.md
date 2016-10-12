# lego-webapp [![Build status](https://ci.frigg.io/badges/webkom/lego-webapp/)](https://ci.frigg.io/webkom/lego-webapp/last/)

> Next-gen frontend for abakus.no

## Setup
```bash
$ npm install -g yarnpkg
$ yarn
$ yarn start
```

Everything should be up and running on [localhost:3000](http://localhost:3000).

Noob guide for setting up LEGO:
https://github.com/webkom/lego/wiki/Noob-Guide

## Text Editor
[Atom](https://atom.io) with these plugins installed provides the best developer experience:
́```bash
$ apm install nuclide pigments linter-eslint linter-stylelint
```

You should disable linter

## Tests
Run all the tests and check for lint errors with the command:
```
$ yarn test
```

For development you can run the tests continuously by using:
```
$ yarn run test:watch
```

## Flow
[Flow](https://flowtype.org/) is gradually being introduced so we can reap the benefits of static type checking.

Run `flow` in the project directory to check if everything is good.

## Linting
ESLint and Stylelint is used to maintain high code quality and a unified code style. Please run them before committing code.

To run the linter, use_
```bash
$ yarn run lint

# or
$ yarn run lint:js
$ yarn run lint:css
```

Some ESLint errors can be fixed by running
́́́```bash
$ yarn run lint:js -- --fix
́```

## License
The MIT License (MIT)

Copyright (c) 2016 webkom <webkom@abakus.no>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
