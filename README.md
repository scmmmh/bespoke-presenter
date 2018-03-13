[![Build Status](https://secure.travis-ci.org/scmmmh/bespoke-theme-bespoke-presenter.png?branch=master)](https://travis-ci.org/scmmmh/bespoke-theme-bespoke-presenter)

# bespoke-theme-bespoke-presenter

A presenter plugin for [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) &mdash; [View demo](http://scmmmh.github.io/bespoke-theme-bespoke-presenter)

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/scmmmh/bespoke-theme-bespoke-presenter/master/dist/bespoke-theme-bespoke-presenter.min.js
[max]: https://raw.github.com/scmmmh/bespoke-theme-bespoke-presenter/master/dist/bespoke-theme-bespoke-presenter.js

## Usage

This theme is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  bespokePresenter = require('bespoke-theme-bespoke-presenter');

bespoke.from('#presentation', [
  bespokePresenter()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.themes.bespokePresenter()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-theme-bespoke-presenter
```

### Bower

```bash
$ bower install bespoke-theme-bespoke-presenter
```

## Credits

This theme was built with [generator-bespoketheme](https://github.com/markdalgleish/generator-bespoketheme).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
