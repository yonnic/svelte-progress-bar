"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ProgressBar = function () {
  'use strict';

  function noop() {}

  function assign(tar, src) {
    for (var k in src) {
      tar[k] = src[k];
    }

    return tar;
  }

  function append(target, node) {
    target.appendChild(node);
  }

  function insert(target, node, anchor) {
    target.insertBefore(node, anchor);
  }

  function detachNode(node) {
    node.parentNode.removeChild(node);
  }

  function createElement(name) {
    return document.createElement(name);
  }

  function createComment() {
    return document.createComment('');
  }

  function blankObject() {
    return Object.create(null);
  }

  function destroy(detach) {
    this.destroy = noop;
    this.fire('destroy');
    this.set = noop;

    this._fragment.d(detach !== false);

    this._fragment = null;
    this._state = {};
  }

  function _differs(a, b) {
    return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
  }

  function fire(eventName, data) {
    var handlers = eventName in this._handlers && this._handlers[eventName].slice();

    if (!handlers) return;

    for (var i = 0; i < handlers.length; i += 1) {
      var handler = handlers[i];

      if (!handler.__calling) {
        try {
          handler.__calling = true;
          handler.call(this, data);
        } finally {
          handler.__calling = false;
        }
      }
    }
  }

  function flush(component) {
    component._lock = true;
    callAll(component._beforecreate);
    callAll(component._oncreate);
    callAll(component._aftercreate);
    component._lock = false;
  }

  function get() {
    return this._state;
  }

  function init(component, options) {
    component._handlers = blankObject();
    component._slots = blankObject();
    component._bind = options._bind;
    component._staged = {};
    component.options = options;
    component.root = options.root || component;
    component.store = options.store || component.root.store;

    if (!options.root) {
      component._beforecreate = [];
      component._oncreate = [];
      component._aftercreate = [];
    }
  }

  function on(eventName, handler) {
    var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
    handlers.push(handler);
    return {
      cancel: function cancel() {
        var index = handlers.indexOf(handler);
        if (~index) handlers.splice(index, 1);
      }
    };
  }

  function set(newState) {
    this._set(assign({}, newState));

    if (this.root._lock) return;
    flush(this.root);
  }

  function _set(newState) {
    var oldState = this._state,
        changed = {},
        dirty = false;
    newState = assign(this._staged, newState);
    this._staged = {};

    for (var key in newState) {
      if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
    }

    if (!dirty) return;
    this._state = assign(assign({}, oldState), newState);

    this._recompute(changed, this._state);

    if (this._bind) this._bind(changed, this._state);

    if (this._fragment) {
      this.fire("state", {
        changed: changed,
        current: this._state,
        previous: oldState
      });

      this._fragment.p(changed, this._state);

      this.fire("update", {
        changed: changed,
        current: this._state,
        previous: oldState
      });
    }
  }

  function _stage(newState) {
    assign(this._staged, newState);
  }

  function callAll(fns) {
    while (fns && fns.length) {
      fns.shift()();
    }
  }

  function _mount(target, anchor) {
    this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
  }

  var proto = {
    destroy: destroy,
    get: get,
    fire: fire,
    on: on,
    set: set,
    _recompute: noop,
    _set: _set,
    _stage: _stage,
    _mount: _mount,
    _differs: _differs
  };
  /* ProgressBar.html generated by Svelte v2.15.3 */

  var getIncrement = function getIncrement(number) {
    if (number >= 0 && number < 0.2) return 0.1;else if (number >= 0.2 && number < 0.5) return 0.04;else if (number >= 0.5 && number < 0.8) return 0.02;else if (number >= 0.8 && number < 0.99) return 0.005;
    return 0;
  };

  var updater;

  function barClass(_ref) {
    var completed = _ref.completed;
    return completed ? 'svelte-progress-bar-hiding' : '';
  }

  function barStyle(_ref2) {
    var width = _ref2.width,
        color = _ref2.color;
    var barColorStyle = color && "background-color: ".concat(color, ";") || '';
    var barWidth = width && width * 100 && "width: ".concat(width * 100, "%;") || '';
    return [barColorStyle, barWidth].filter(Boolean).join('');
  }

  function leaderColorStyle(_ref3) {
    var color = _ref3.color;
    // the box shadow of the leader bar uses `color` to set its shadow color
    return color && "background-color: ".concat(color, "; color: ").concat(color, ";") || '';
  }

  function data() {
    return {
      minimum: 0.08,
      maximum: 0.994,
      settleTime: 700,
      intervalTime: 700,
      stepSizes: [0, 0.005, 0.01, 0.02]
    };
  }

  var methods = {
    start: function start() {
      this.reset();
      this.continue();
    },
    reset: function reset() {
      var startingWidth = this.get().minimum;
      this.set({
        width: startingWidth,
        running: true
      });
    },
    continue: function _continue() {
      var _this = this;

      var maximumWidth = this.get().maximum;
      var intervalTime = this.get().intervalTime;

      if (updater) {
        // prevent multiple intervals by clearing before making
        clearInterval(updater);
      }

      this.set({
        running: true
      });
      updater = setInterval(function () {
        var value = _this.get().width;

        var stepSizes = _this.get().stepSizes;

        var randomStep = stepSizes[Math.floor(Math.random() * stepSizes.length)];
        var step = getIncrement(value) + randomStep;

        if (value < maximumWidth) {
          value = value + step;
        }

        if (value > maximumWidth) {
          value = maximumWidth;

          _this.stop();
        }

        _this.set({
          width: value
        });
      }, intervalTime);
    },
    stop: function stop() {
      if (updater) {
        clearInterval(updater);
      }
    },
    complete: function complete() {
      var _this2 = this;

      clearInterval(updater);
      this.set({
        width: 1,
        running: false
      });
      var settleTime = this.get().settleTime;
      setTimeout(function () {
        _this2.set({
          completed: true
        });

        setTimeout(function () {
          _this2.set({
            completed: false,
            width: 0
          });
        }, settleTime);
      }, settleTime);
    },
    setWidthRatio: function setWidthRatio(widthRatio) {
      this.stop();
      this.set({
        width: widthRatio,
        completed: false,
        running: true
      });
    }
  };

  function add_css() {
    var style = createElement("style");
    style.id = 'svelte-1fsw3ov-style';
    style.textContent = ".svelte-progress-bar.svelte-1fsw3ov{position:fixed;top:0;left:0;height:2px;transition:width 0.16s ease-in-out;z-index:1}.svelte-progress-bar-hiding.svelte-1fsw3ov{transition:top 0.16s ease;top:-8px}.svelte-progress-bar-leader.svelte-1fsw3ov{position:absolute;top:0;right:0;height:2px;width:100px;transform:rotate(2.5deg) translate(0px, -4px);box-shadow:0 0 8px;z-index:2}";
    append(document.head, style);
  }

  function create_main_fragment(component, ctx) {
    var if_block_anchor;
    var if_block = ctx.width && create_if_block(component, ctx);
    return {
      c: function c() {
        if (if_block) if_block.c();
        if_block_anchor = createComment();
      },
      m: function m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function p(changed, ctx) {
        if (ctx.width) {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block(component, ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d: function d(detach) {
        if (if_block) if_block.d(detach);

        if (detach) {
          detachNode(if_block_anchor);
        }
      }
    };
  } // (1:0) {#if width}


  function create_if_block(component, ctx) {
    var div, div_class_value;
    var if_block = ctx.running && create_if_block_1(component, ctx);
    return {
      c: function c() {
        div = createElement("div");
        if (if_block) if_block.c();
        div.className = div_class_value = "svelte-progress-bar " + ctx.barClass + " svelte-1fsw3ov";
        div.style.cssText = ctx.barStyle;
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p: function p(changed, ctx) {
        if (ctx.running) {
          if (if_block) {
            if_block.p(changed, ctx);
          } else {
            if_block = create_if_block_1(component, ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }

        if (changed.barClass && div_class_value !== (div_class_value = "svelte-progress-bar " + ctx.barClass + " svelte-1fsw3ov")) {
          div.className = div_class_value;
        }

        if (changed.barStyle) {
          div.style.cssText = ctx.barStyle;
        }
      },
      d: function d(detach) {
        if (detach) {
          detachNode(div);
        }

        if (if_block) if_block.d();
      }
    };
  } // (3:1) {#if running}


  function create_if_block_1(component, ctx) {
    var div;
    return {
      c: function c() {
        div = createElement("div");
        div.className = "svelte-progress-bar-leader svelte-1fsw3ov";
        div.style.cssText = ctx.leaderColorStyle;
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
      },
      p: function p(changed, ctx) {
        if (changed.leaderColorStyle) {
          div.style.cssText = ctx.leaderColorStyle;
        }
      },
      d: function d(detach) {
        if (detach) {
          detachNode(div);
        }
      }
    };
  }

  function ProgressBar(options) {
    init(this, options);
    this._state = assign(data(), options.data);

    this._recompute({
      completed: 1,
      width: 1,
      color: 1
    }, this._state);

    this._intro = true;
    if (!document.getElementById("svelte-1fsw3ov-style")) add_css();
    this._fragment = create_main_fragment(this, this._state);

    if (options.target) {
      this._fragment.c();

      this._mount(options.target, options.anchor);
    }
  }

  assign(ProgressBar.prototype, proto);
  assign(ProgressBar.prototype, methods);

  ProgressBar.prototype._recompute = function _recompute(changed, state) {
    if (changed.completed) {
      if (this._differs(state.barClass, state.barClass = barClass(state))) changed.barClass = true;
    }

    if (changed.width || changed.color) {
      if (this._differs(state.barStyle, state.barStyle = barStyle(state))) changed.barStyle = true;
    }

    if (changed.color) {
      if (this._differs(state.leaderColorStyle, state.leaderColorStyle = leaderColorStyle(state))) changed.leaderColorStyle = true;
    }
  };

  return ProgressBar;
}();