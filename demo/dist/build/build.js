(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../../../lib/bespoke-presenter.js":2,"bespoke":14,"bespoke-backdrop":7,"bespoke-bullets":8,"bespoke-keys":10,"bespoke-progress":11,"bespoke-scale":12,"bespoke-touch":13}],2:[function(require,module,exports){

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
  var css = "/*! normalize.css v3.0.0 | MIT License | git.io/normalize */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=\"button\"],input[type=\"reset\"],input[type=\"submit\"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=\"checkbox\"],input[type=\"radio\"]{box-sizing:border-box;padding:0}input[type=\"number\"]::-webkit-inner-spin-button,input[type=\"number\"]::-webkit-outer-spin-button{height:auto}input[type=\"search\"]{-webkit-appearance:textfield;box-sizing:content-box}input[type=\"search\"]::-webkit-search-cancel-button,input[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}.bespoke-slide aside.notes{display:none}.bespoke-presenter-wrapper{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;with:100vw;height:100vh;background:#222}.bespoke-presenter-slide-wrapper{width:100%;height:100%;position:relative;box-shadow:0 0 5px #222}.bespoke-presenter-current-pane,.bespoke-presenter-presenter-pane{width:50%;height:100%;position:relative}.bespoke-presenter-current-pane{box-sizing:border-box;padding:.5rem}.bespoke-presenter-presenter-pane{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.bespoke-presenter-notes-pane{height:50%;box-sizing:border-box;padding:1rem;display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;color:#f0f0f0;overflow:auto}.bespoke-presenter-presenter-bottom-pane{height:50%;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;position:relative}.bespoke-presenter-preview-pane{width:50%;height:100%;position:relative}.bespoke-presenter-preview-pane .bespoke-inactive,.bespoke-presenter-preview-pane .bespoke-bullet-inactive{opacity:1;visibility:visible}.bespoke-presenter-status-pane{width:50%;height:100%;display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;color:#f0f0f0;font-size:14pt;font-weight:900}";
  insertCss(css, { prepend: true });

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
        var slave = window.open('', 'bespoke-presenter-slave');
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
        if(!initialised) {
            // Build presenter view
            var wrapper = templateBuilder(document, UI_TEMPLATE);
            deck.parent.parentNode.replaceChild(wrapper, deck.parent);
            wrapper.querySelector('.bespoke-presenter-current-pane').appendChild(deck.parent);
            var previewSlide = wrapper.querySelector('.bespoke-presenter-preview-pane .bespoke-slide');
            scaler({element: previewSlide});
            var timePane = wrapper.querySelector('.bespoke-presenter-time-pane');
            var notesPane = wrapper.querySelector('.bespoke-presenter-notes-pane');
            // Build slave view
            slave = constructSlide();
            slaveSlide = slave.document.querySelector('.bespoke-slide');
            scaler({element: slaveSlide, window: slave});
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
            var observer = new MutationObserver(updateSlaves);
            observer.observe(wrapper, {attributes: true, subtree: true});
            updateSlaves();
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

            progressCloner = cloner();
            progressCloner.clone(wrapper.querySelector('.bespoke-progress-parent'), slave.document.querySelector('.bespoke-progress-parent'));

            initialised = true;
        } else {
            slave = constructSlide();
            slaveSlide = slave.document.querySelector('.bespoke-slide');
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

},{"./cloner":3,"./run-timer":4,"./scale-to-parent":5,"./template-builder":6,"bespoke-classes":9,"insert-css":15}],3:[function(require,module,exports){
module.exports = function(options) {
    var Cloner = function() {
        var cloner = this;
        cloner._observer = new MutationObserver(function() {
            cloner._update();
        });
    };
    Cloner.prototype.clone = function(source, target) {
        this._source = source;
        this._target = target;
        this._observer.disconnect();
        this._observer.observe(this._source, {attributes: true, subtree: true});
    }
    Cloner.prototype._update = function() {
        this._target.innerHTML = this._source.innerHTML;
    }
    return new Cloner();
}

},{}],4:[function(require,module,exports){
module.exports = function(target) {
    var runTimer = function() {
        var timer = this;
        timer.startTime = null;
        timer.running = false;
        setInterval(function() {
            if(timer.running) {
                var timePassed = Math.floor((Date.now() - timer.startTime) / 1000);
                var hours = Math.floor(timePassed / 3600);
                timePassed = timePassed - hours * 3600;
                if(hours < 10) {
                    hours = '0' + hours;
                }
                var minutes = Math.floor(timePassed / 60);
                if(minutes < 10) {
                    minutes = '0' + minutes;
                }
                timePassed = timePassed - minutes * 60;
                if(timePassed < 10) {
                    timePassed = '0' + timePassed;
                }
                target.innerHTML = hours + ':' + minutes + ':' + timePassed;
            }
        }, 1000);
    };
    runTimer.prototype.start = function() {
        this.startTime = Date.now();
        this.running = true;
    }
    return new runTimer();
};

},{}],5:[function(require,module,exports){
module.exports = function(options) {
    var element = options.element,
        parent = element.parentNode,
        width = element.offsetWidth,
        height = element.offsetHeight,
        useZoom = options.zoom === 'zoom' || ('zoom' in parent.style && options.zoom !== 'transform'),
        transformProperty = (function(property) {
            var prefixes = 'Moz Webkit O ms'.split(' ');
            return prefixes.reduce(function(currentProperty, prefix) {
                return prefix + property in parent.style ? prefix + property : currentProperty;
            }, property.toLowerCase());
        }('Transform')),
        scale = useZoom ?
            function(ratio) {
                element.style.zoom = ratio;
            } :
            function(ratio) {
                element.style[transformProperty] = 'scale(' + ratio + ')';
            };

        function scale_slide() {
            var xScale = parent.offsetWidth / width,
                yScale = parent.offsetHeight / height;
            scale(Math.min(xScale, yScale));
        }
        scale_slide();
        (options.window || window).addEventListener('resize', scale_slide);
};

},{}],6:[function(require,module,exports){
module.exports = function(doc, structure) {
    function createElement(template) {
        var node = doc.createElement(template.tag);
        if(template.attrs) {
            for(key in template.attrs) {
                node.setAttribute(key, template.attrs[key]);
            }
        }
        if(template.children) {
            for(var idx = 0; idx < template.children.length; idx++) {
                var child = createElement(template.children[idx]);
                node.appendChild(child);
            }
        }
        return node;
    }
    return createElement(structure);
};

},{}],7:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var backdrops;

    function createBackdropForSlide(slide) {
      var backdropAttribute = slide.getAttribute('data-bespoke-backdrop');

      if (backdropAttribute) {
        var backdrop = document.createElement('div');
        backdrop.className = backdropAttribute;
        backdrop.classList.add('bespoke-backdrop');
        deck.parent.appendChild(backdrop);
        return backdrop;
      }
    }

    function updateClasses(el) {
      if (el) {
        var index = backdrops.indexOf(el),
          currentIndex = deck.slide();

        removeClass(el, 'active');
        removeClass(el, 'inactive');
        removeClass(el, 'before');
        removeClass(el, 'after');

        if (index !== currentIndex) {
          addClass(el, 'inactive');
          addClass(el, index < currentIndex ? 'before' : 'after');
        } else {
          addClass(el, 'active');
        }
      }
    }

    function removeClass(el, className) {
      el.classList.remove('bespoke-backdrop-' + className);
    }

    function addClass(el, className) {
      el.classList.add('bespoke-backdrop-' + className);
    }

    backdrops = deck.slides
      .map(createBackdropForSlide);

    deck.on('activate', function() {
      backdrops.forEach(updateClasses);
    });
  };
};

},{}],8:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var activeSlideIndex,
      activeBulletIndex,

      bullets = deck.slides.map(function(slide) {
        return [].slice.call(slide.querySelectorAll((typeof options === 'string' ? options : '[data-bespoke-bullet]')), 0);
      }),

      next = function() {
        var nextSlideIndex = activeSlideIndex + 1;

        if (activeSlideHasBulletByOffset(1)) {
          activateBullet(activeSlideIndex, activeBulletIndex + 1);
          return false;
        } else if (bullets[nextSlideIndex]) {
          activateBullet(nextSlideIndex, 0);
        }
      },

      prev = function() {
        var prevSlideIndex = activeSlideIndex - 1;

        if (activeSlideHasBulletByOffset(-1)) {
          activateBullet(activeSlideIndex, activeBulletIndex - 1);
          return false;
        } else if (bullets[prevSlideIndex]) {
          activateBullet(prevSlideIndex, bullets[prevSlideIndex].length - 1);
        }
      },

      activateBullet = function(slideIndex, bulletIndex) {
        activeSlideIndex = slideIndex;
        activeBulletIndex = bulletIndex;

        bullets.forEach(function(slide, s) {
          slide.forEach(function(bullet, b) {
            bullet.classList.add('bespoke-bullet');

            if (s < slideIndex || s === slideIndex && b <= bulletIndex) {
              bullet.classList.add('bespoke-bullet-active');
              bullet.classList.remove('bespoke-bullet-inactive');
            } else {
              bullet.classList.add('bespoke-bullet-inactive');
              bullet.classList.remove('bespoke-bullet-active');
            }

            if (s === slideIndex && b === bulletIndex) {
              bullet.classList.add('bespoke-bullet-current');
            } else {
              bullet.classList.remove('bespoke-bullet-current');
            }
          });
        });
      },

      activeSlideHasBulletByOffset = function(offset) {
        return bullets[activeSlideIndex][activeBulletIndex + offset] !== undefined;
      };

    deck.on('next', next);
    deck.on('prev', prev);

    deck.on('slide', function(e) {
      activateBullet(e.index, 0);
    });

    activateBullet(0, 0);
  };
};

},{}],9:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var addClass = function(el, cls) {
        el.classList.add('bespoke-' + cls);
      },

      removeClass = function(el, cls) {
        el.className = el.className
          .replace(new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ')
          .trim();
      },

      deactivate = function(el, index) {
        var activeSlide = deck.slides[deck.slide()],
          offset = index - deck.slide(),
          offsetClass = offset > 0 ? 'after' : 'before';

        ['before(-\\d+)?', 'after(-\\d+)?', 'active', 'inactive'].map(removeClass.bind(null, el));

        if (el !== activeSlide) {
          ['inactive', offsetClass, offsetClass + '-' + Math.abs(offset)].map(addClass.bind(null, el));
        }
      };

    addClass(deck.parent, 'parent');
    deck.slides.map(function(el) { addClass(el, 'slide'); });

    deck.on('activate', function(e) {
      deck.slides.map(deactivate);
      addClass(e.slide, 'active');
      removeClass(e.slide, 'inactive');
    });
  };
};

},{}],10:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var isHorizontal = options !== 'vertical';

    document.addEventListener('keydown', function(e) {
      if (e.which == 34 || // PAGE DOWN
        (e.which == 32 && !e.shiftKey) || // SPACE WITHOUT SHIFT
        (isHorizontal && e.which == 39) || // RIGHT
        (!isHorizontal && e.which == 40) // DOWN
      ) { deck.next(); }

      if (e.which == 33 || // PAGE UP
        (e.which == 32 && e.shiftKey) || // SPACE + SHIFT
        (isHorizontal && e.which == 37) || // LEFT
        (!isHorizontal && e.which == 38) // UP
      ) { deck.prev(); }
    });
  };
};

},{}],11:[function(require,module,exports){
module.exports = function(options) {
  return function (deck) {
    var progressParent = document.createElement('div'),
      progressBar = document.createElement('div'),
      prop = options === 'vertical' ? 'height' : 'width';

    progressParent.className = 'bespoke-progress-parent';
    progressBar.className = 'bespoke-progress-bar';
    progressParent.appendChild(progressBar);
    deck.parent.appendChild(progressParent);

    deck.on('activate', function(e) {
      progressBar.style[prop] = (e.index * 100 / (deck.slides.length - 1)) + '%';
    });
  };
};

},{}],12:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var parent = deck.parent,
      firstSlide = deck.slides[0],
      slideHeight = firstSlide.offsetHeight,
      slideWidth = firstSlide.offsetWidth,
      useZoom = options === 'zoom' || ('zoom' in parent.style && options !== 'transform'),

      wrap = function(element) {
        var wrapper = document.createElement('div');
        wrapper.className = 'bespoke-scale-parent';
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        return wrapper;
      },

      elements = useZoom ? deck.slides : deck.slides.map(wrap),

      transformProperty = (function(property) {
        var prefixes = 'Moz Webkit O ms'.split(' ');
        return prefixes.reduce(function(currentProperty, prefix) {
            return prefix + property in parent.style ? prefix + property : currentProperty;
          }, property.toLowerCase());
      }('Transform')),

      scale = useZoom ?
        function(ratio, element) {
          element.style.zoom = ratio;
        } :
        function(ratio, element) {
          element.style[transformProperty] = 'scale(' + ratio + ')';
        },

      scaleAll = function() {
        var xScale = parent.offsetWidth / slideWidth,
          yScale = parent.offsetHeight / slideHeight;

        elements.forEach(scale.bind(null, Math.min(xScale, yScale)));
      };

    window.addEventListener('resize', scaleAll);
    scaleAll();
  };

};

},{}],13:[function(require,module,exports){
module.exports = function(options) {
  return function(deck) {
    var axis = options == 'vertical' ? 'Y' : 'X',
      startPosition,
      delta;

    deck.parent.addEventListener('touchstart', function(e) {
      if (e.touches.length == 1) {
        startPosition = e.touches[0]['page' + axis];
        delta = 0;
      }
    });

    deck.parent.addEventListener('touchmove', function(e) {
      if (e.touches.length == 1) {
        e.preventDefault();
        delta = e.touches[0]['page' + axis] - startPosition;
      }
    });

    deck.parent.addEventListener('touchend', function() {
      if (Math.abs(delta) > 50) {
        deck[delta > 0 ? 'prev' : 'next']();
      }
    });
  };
};

},{}],14:[function(require,module,exports){
var from = function(opts, plugins) {
  var parent = (opts.parent || opts).nodeType === 1 ? (opts.parent || opts) : document.querySelector(opts.parent || opts),
    slides = [].filter.call(typeof opts.slides === 'string' ? parent.querySelectorAll(opts.slides) : (opts.slides || parent.children), function(el) { return el.nodeName !== 'SCRIPT'; }),
    activeSlide = slides[0],
    listeners = {},

    activate = function(index, customData) {
      if (!slides[index]) {
        return;
      }

      fire('deactivate', createEventData(activeSlide, customData));
      activeSlide = slides[index];
      fire('activate', createEventData(activeSlide, customData));
    },

    slide = function(index, customData) {
      if (arguments.length) {
        fire('slide', createEventData(slides[index], customData)) && activate(index, customData);
      } else {
        return slides.indexOf(activeSlide);
      }
    },

    step = function(offset, customData) {
      var slideIndex = slides.indexOf(activeSlide) + offset;

      fire(offset > 0 ? 'next' : 'prev', createEventData(activeSlide, customData)) && activate(slideIndex, customData);
    },

    on = function(eventName, callback) {
      (listeners[eventName] || (listeners[eventName] = [])).push(callback);
      return off.bind(null, eventName, callback);
    },

    off = function(eventName, callback) {
      listeners[eventName] = (listeners[eventName] || []).filter(function(listener) { return listener !== callback; });
    },

    fire = function(eventName, eventData) {
      return (listeners[eventName] || [])
        .reduce(function(notCancelled, callback) {
          return notCancelled && callback(eventData) !== false;
        }, true);
    },

    createEventData = function(el, eventData) {
      eventData = eventData || {};
      eventData.index = slides.indexOf(el);
      eventData.slide = el;
      return eventData;
    },

    deck = {
      on: on,
      off: off,
      fire: fire,
      slide: slide,
      next: step.bind(null, 1),
      prev: step.bind(null, -1),
      parent: parent,
      slides: slides
    };

  (plugins || []).forEach(function(plugin) {
    plugin(deck);
  });

  activate(0);

  return deck;
};

module.exports = {
  from: from
};

},{}],15:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}]},{},[1])