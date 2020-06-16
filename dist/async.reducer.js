(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports);
    global.asyncReducer = mod.exports;
  }
})(this, function(_exports) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true,
  });
  _exports.asyncActionReducer = void 0;

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source),
        );
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key),
          );
        });
      }
    }
    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Keeps information about pending or failed async actions in the store.
   * UI can use this info to display spinners or error information.
   */
  var asyncActionReducer = function asyncActionReducer() {
    var state =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (!action.meta) {
      return state;
    }

    switch (action.meta.status) {
      case 'ASYNC_PENDING':
        return _objectSpread(
          {},
          state,
          _defineProperty(
            {},
            action.type,
            _objectSpread(
              {},
              state[action.type],
              _defineProperty({}, action.meta.identifier || '', {
                pending: true,
              }),
            ),
          ),
        );

      case 'ASYNC_COMPLETE':
        return _objectSpread(
          {},
          state,
          _defineProperty(
            {},
            action.type,
            _objectSpread(
              {},
              state[action.type],
              _defineProperty(
                {},
                action.meta.identifier || '',
                action.meta.cache
                  ? {
                      __do_not_use__response_cache: {
                        value: action.payload,
                        secondsSinceEpoch: Math.floor(Date.now() / 1000),
                      },
                    }
                  : undefined,
              ),
            ),
          ),
        );

      case 'ASYNC_FAILED':
        return _objectSpread(
          {},
          state,
          _defineProperty(
            {},
            action.type,
            _objectSpread(
              {},
              state[action.type],
              _defineProperty({}, action.meta.identifier || '', {
                pending: false,
                error: {
                  name:
                    action.error && action.error.name
                      ? action.error.name
                      : 'UNKNOWN',
                  message:
                    action.error && action.error.message
                      ? action.error.message
                      : 'UNKNOWN',
                  stack: action.error ? action.error.stack : undefined,
                },
              }),
            ),
          ),
        );

      case 'ASYNC_RESET':
        return _objectSpread(
          {},
          state,
          _defineProperty(
            {},
            action.type,
            _objectSpread(
              {},
              state[action.type],
              _defineProperty({}, action.meta.identifier || '', undefined),
            ),
          ),
        );

      default:
        return state;
    }
  };

  _exports.asyncActionReducer = asyncActionReducer;
});
