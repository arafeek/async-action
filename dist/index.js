(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([
      'exports',
      './async.action',
      './async.reducer',
      './async.selectors',
      './async.types',
    ], factory);
  } else if (typeof exports !== 'undefined') {
    factory(
      exports,
      require('./async.action'),
      require('./async.reducer'),
      require('./async.selectors'),
      require('./async.types'),
    );
  } else {
    var mod = {
      exports: {},
    };
    factory(
      mod.exports,
      global.async,
      global.async,
      global.async,
      global.async,
    );
    global.index = mod.exports;
  }
})(this, function(_exports, _async, _async2, _async3, _async4) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true,
  });
  var _exportNames = {
    makeIsPendingSelector: true,
    makeErrorSelector: true,
    makeAllPendingSelector: true,
  };
  Object.defineProperty(_exports, 'makeIsPendingSelector', {
    enumerable: true,
    get: function get() {
      return _async3.makeIsPendingSelector;
    },
  });
  Object.defineProperty(_exports, 'makeErrorSelector', {
    enumerable: true,
    get: function get() {
      return _async3.makeErrorSelector;
    },
  });
  Object.defineProperty(_exports, 'makeAllPendingSelector', {
    enumerable: true,
    get: function get() {
      return _async3.makeAllPendingSelector;
    },
  });
  Object.keys(_async).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _async[key];
      },
    });
  });
  Object.keys(_async2).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _async2[key];
      },
    });
  });
  Object.keys(_async4).forEach(function(key) {
    if (key === 'default' || key === '__esModule') return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _async4[key];
      },
    });
  });
});
