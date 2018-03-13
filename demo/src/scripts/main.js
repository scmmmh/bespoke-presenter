var bespoke = require('bespoke'),
  bespokePresenter = require('../../../lib/bespoke-presenter.js'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale'),
  progress = require('bespoke-progress'),
  backdrop = require('bespoke-backdrop');

bespoke.from('article', [
  bespokePresenter(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  progress(),
  backdrop()
]);
