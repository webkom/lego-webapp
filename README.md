# lego-webapp [![Build status](https://ci.frigg.io/badges/webkom/lego-webapp/)](https://ci.frigg.io/webkom/lego-webapp/last/)

> Next-gen frontend for abakus.no

## Setup
```bash
$ npm install
$ gem install foreman
$ make watch
```

In order for `make watch` to work, you must have [foreman](https://github.com/ddollar/foreman), [forego](https://github.com/ddollar/forego) or similar installed and change the `Makefile` accordingly.

# Live Reloading
Add the browser plugin and start the livereload server
```bash
make livereload
```
then `make watch`.

## Flux
[draw nice diagram of the system here]

## ES6
Some ES6 features may be used and some may not. Ask a management consultant or your financial supervisor.

## Roadmap
* Authentication Flow
* Event Calendar View
* Design Decisions
* ...
* ...
* Keyboard Shortcuts

## Coding Standards
2 spaces, clever hacks and visual appeal are encouraged. The code should look like a beautiful mountain range when the screen is rotated π/2 radians CW. No kidding.

## License
The MIT License (MIT)

Copyright (c) 2015 webkom

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
