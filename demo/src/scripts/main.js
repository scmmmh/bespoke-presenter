var bespoke = require('bespoke'),
  cube = require('bespoke-theme-cube'),
  bespokePresenter = require('../../../lib/bespoke-presenter.js'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  progress = require('bespoke-progress'),
  backdrop = require('bespoke-backdrop');

bespoke.from('article', [
  cube(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  progress(),
  bespokePresenter()
]);
