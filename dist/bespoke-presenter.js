/*!
 * bespoke-presenter v1.0.0
 *
 * Copyright 2018, Mark
 * This content is released under the MIT license
 * 
 */

!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.presenter=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){

var classes = _dereq_('bespoke-classes');
var insertCss = _dereq_('insert-css');
var scaler = _dereq_('./scale-to-parent');
var templateBuilder = _dereq_('./template-builder');
var runTimer = _dereq_('./run-timer');
var cloner = _dereq_('./cloner');

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

},{"./cloner":1,"./run-timer":3,"./scale-to-parent":4,"./template-builder":5,"bespoke-classes":6,"insert-css":7}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
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

},{}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
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

},{}]},{},[2])
(2)
});