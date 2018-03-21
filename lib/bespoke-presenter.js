var fs = require('fs');
var classes = require('bespoke-classes');
var insertCss = require('insert-css');
var scaler = require('./scale-to-parent');
var templateBuilder = require('./template-builder');
var runTimer = require('./run-timer');
var cloner = require('./cloner');

var UI_TEMPLATE = {
    tag: 'div',
    attrs: {class: 'bespoke-presenter-wrapper'},
    children: [{
        tag: 'div',
        attrs: {class: 'bespoke-presenter-current-pane'}
    }, {
        tag: 'div',
        attrs: {class: 'bespoke-presenter-presenter-pane'},
        children: [{
            tag: 'div',
            attrs: {class: 'bespoke-presenter-notes-pane'}
        }, {
            tag: 'div',
            attrs: {class: 'bespoke-presenter-presenter-bottom-pane'},
            children: [{
                tag: 'div',
                attrs: {class: 'bespoke-presenter-status-pane'},
                children: [{
                    tag: 'div',
                    attrs: {class: 'bespoke-presenter-time-pane'}
                }]
            }, {
                tag: 'div',
                attrs: {class: 'bespoke-presenter-preview-pane'},
                children: [{
                    tag: 'section',
                    attrs: {class: 'bespoke-slide bespoke-active'}
                }]
            }]
        }]
    }]
};
var SLAVE_TEMPLATE = {
    tag: 'article',
    attrs: {class: 'bespoke-parent'},
    children: [{
        tag: 'section',
        attrs: {class: 'bespoke-slide bespoke-active'}
    }, {
        tag: 'div',
        attrs: {class: 'bespoke-progress-parent'}
    }]
}

module.exports = function(options) {
  var css = fs.readFileSync(__dirname + '/tmp/theme.css', 'utf8');
  insertCss(css, { prepend: true });
  var wrapper = null;
  var previewSlide = null;
  var timePane = null;
  var notesPane = null;
  var observer = null;

  return function(deck) {
    classes()(deck);
    var initialised = false,
        slave = null,
        slaveSlide = null,
        startTime = null,
        progressCloner = null;

    function cloneCSS(source, target) {
        var sourceCSS = source.document.querySelectorAll('head style');
        var targetHead = target.document.querySelector('head');
        while(targetHead.firstChild) {
            targetHead.removeChild(targetHead.firstChild);
        }
        for(var idx = 0; idx < sourceCSS.length; idx++) {
            var targetCSS = target.document.createElement('style');
            targetHead.appendChild(targetCSS);
            targetCSS.setAttribute('type', 'text/css');
            if('textContent' in sourceCSS[idx]) {
              targetCSS.textContent = sourceCSS[idx].textContent;
            } else {
              targetCSS.styleSheet.cssText = sourceCSS[idx].styleSheet.cssText;
            }
        }
    }

    function constructSlide() {
        var slave = window.open('#', 'bespoke-presenter-slave');
        cloneCSS(window, slave);
        while(slave.document.body.firstChild) {
            slave.document.body.removeChild(slave.document.body.firstChild);
        }
        var slaveNode = templateBuilder(slave.document, SLAVE_TEMPLATE);
        slave.document.body.appendChild(slaveNode);
        slave.document.title = document.title;
        return slave;
    }

    function init_presenter() {
        // Update on changes
        function updateSlaves() {
            var nextSlide = wrapper.querySelector('.bespoke-slide.bespoke-after-1');
            if(nextSlide) {
                previewSlide.innerHTML = nextSlide.innerHTML;
            } else {
                previewSlide.innerHTML = '';
            }
            var currentSlide = wrapper.querySelector('.bespoke-slide.bespoke-active');
            slaveSlide.innerHTML = currentSlide.innerHTML;
            while(notesPane.firstChild) {
                notesPane.removeChild(notesPane.firstChild);
            }
            var notes = currentSlide.querySelectorAll('aside.notes');
            for(var idx = 0; idx < notes.length; idx++) {
                notesPane.appendChild(notes[idx].cloneNode(true));
            }
        }
        if(!initialised) {
            // Build presenter view
            wrapper = templateBuilder(document, UI_TEMPLATE);
            deck.parent.parentNode.replaceChild(wrapper, deck.parent);
            wrapper.querySelector('.bespoke-presenter-current-pane').appendChild(deck.parent);
            var slides = wrapper.querySelectorAll('.bespoke-parent .bespoke-slide');
            slides.forEach(function(slide) {
                scaler({element: slide});
            });
            previewSlide = wrapper.querySelector('.bespoke-presenter-preview-pane .bespoke-slide');
            scaler({element: previewSlide});
            timePane = wrapper.querySelector('.bespoke-presenter-time-pane');
            notesPane = wrapper.querySelector('.bespoke-presenter-notes-pane');
            // Build slave view
            slave = constructSlide();
            slaveSlide = slave.document.querySelector('.bespoke-slide');
            scaler({element: slaveSlide, window: slave});
            // Observer for changes
            observer = new MutationObserver(updateSlaves);
            observer.observe(wrapper, {attributes: true, subtree: true});
            // Update slave views
            updateSlaves();
            // Track time running
            var timer = runTimer(wrapper.querySelector('.bespoke-presenter-time-pane'));
            deck.on('next', function() {
                if(!timer.running) {
                    timer.start();
                }
            });
            deck.on('prev', function() {
                if(!timer.running) {
                    timer.start();
                }
            });
            // Track progress
            progressCloner = cloner();
            progressCloner.clone(wrapper.querySelector('.bespoke-progress-parent'), slave.document.querySelector('.bespoke-progress-parent'));
            // Mark as initialised
            initialised = true;
        } else {
            // Rebuild slave view
            slave = constructSlide();
            slaveSlide = slave.document.querySelector('.bespoke-slide');
            scaler({element: slaveSlide, window: slave});
            // Update slave views
            updateSlaves();
            // Track progress
            progressCloner.clone(wrapper.querySelector('.bespoke-progress-parent'), slave.document.querySelector('.bespoke-progress-parent'));
        }
    }
    if(options && options.autostart) {
        init_presenter();
    }
    document.addEventListener('keyup', function(ev) {
        if(ev.key === 'a' || ev.key === 'A') {
            init_presenter();
        } else if(ev.key === 's' || ev.key === 'S') {
            startTime = Date.now();
        }
    });
  };
};
