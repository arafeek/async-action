(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', './async.selectors'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('./async.selectors'));
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports, global.async);
    global.asyncAction = mod.exports;
  }
})(this, function(_exports, _async) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true,
  });
  _exports.resetAsyncAction = _exports.createAsyncAction = _exports.isBeingReset = _exports.isFailed = _exports.isComplete = _exports.isPending = void 0;

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

  var isPending = function isPending(action) {
    return !!action.meta && action.meta.status === 'ASYNC_PENDING';
  };

  _exports.isPending = isPending;

  var isComplete = function isComplete(action) {
    return (
      !!action.meta &&
      (action.meta.status === 'ASYNC_COMPLETE' ||
        action.meta.status === 'ASYNC_CACHED')
    );
  };

  _exports.isComplete = isComplete;

  var isFailed = function isFailed(action) {
    return !!action.meta && action.meta.status === 'ASYNC_FAILED';
  };

  _exports.isFailed = isFailed;

  var isBeingReset = function isBeingReset(action) {
    return !!action.meta && action.meta.status === 'ASYNC_RESET';
  };

  _exports.isBeingReset = isBeingReset;
  var _dedupedPromises = {};
  /**
   * Helper for API requests or other async actions.
   *
   * Associates an action with a function that returns a promise; dispatches
   * three versions of the action with status PENDING, SUCCESS, or ERROR as
   * appropriate.
   *
   * Returns a thunk that you can dispatch.
   *
   * The optional 'options' parameter gives you more control:
   *   * identifier can be used to disambiguate two instances of the same action.
   */

  var createAsyncAction = function createAsyncAction(action, operation) {
    var _ref =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      identifier = _ref.identifier,
      cache = _ref.cache,
      ttlSeconds = _ref.ttlSeconds,
      overwriteCache = _ref.overwriteCache;

    // We are returning a Thunk (a function that itself dispatches actions).
    var thunk = function thunk(dispatch, getState, extraArgument) {
      var isPendingSelector = (0, _async.makeIsPendingSelector)(
        action.type,
        identifier,
      );

      if (isPendingSelector(getState())) {
        dispatch(
          _objectSpread({}, action, {
            payload: null,
            error: null,
            meta: {
              status: 'ASYNC_DEDUPED',
              identifier: identifier,
            },
          }),
        );
        return _dedupedPromises[
          ''.concat(action.type, '(').concat(identifier || '', ')')
        ];
      }

      if (cache && !overwriteCache) {
        var cachedResponseSelector = (0, _async.makeCachedResponseSelector)(
          action.type,
          identifier,
          ttlSeconds,
        );
        var cachedResponse = cachedResponseSelector(getState());

        if (cachedResponse) {
          dispatch(
            _objectSpread({}, action, {
              payload: cachedResponse,
              error: null,
              meta: {
                status: 'ASYNC_CACHED',
                identifier: identifier,
              },
            }),
          );
          return Promise.resolve(cachedResponse);
        }
      }

      dispatch(
        _objectSpread({}, action, {
          payload: null,
          error: null,
          meta: {
            status: 'ASYNC_PENDING',
            identifier: identifier,
          },
        }),
      );
      var promise = operation(dispatch, getState, extraArgument)
        .then(function(result) {
          dispatch(
            _objectSpread({}, action, {
              payload: result,
              error: null,
              meta: {
                status: 'ASYNC_COMPLETE',
                identifier: identifier,
                cache: cache,
              },
            }),
          );
          delete _dedupedPromises[
            ''.concat(action.type, '(').concat(identifier || '', ')')
          ];
          return result;
        })
        ['catch'](function(error) {
          try {
            dispatch(
              _objectSpread({}, action, {
                payload: null,
                error: error,
                meta: {
                  status: 'ASYNC_FAILED',
                  identifier: identifier,
                },
              }),
            );
          } catch (e) {
            throw e;
          }

          delete _dedupedPromises[
            ''.concat(action.type, '(').concat(identifier || '', ')')
          ];
          throw error;
        });
      _dedupedPromises[
        ''.concat(action.type, '(').concat(identifier || '', ')')
      ] = promise;
      return promise;
    };

    return thunk;
  };

  _exports.createAsyncAction = createAsyncAction;

  var resetAsyncAction = function resetAsyncAction(type, identifier) {
    return {
      type: type,
      meta: {
        status: 'ASYNC_RESET',
        identifier: identifier,
      },
    };
  };

  _exports.resetAsyncAction = resetAsyncAction;
});
