(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'reselect'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('reselect'));
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports, global.reselect);
    global.asyncSelectors = mod.exports;
  }
})(this, function(_exports, _reselect) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true,
  });
  _exports.makeCachedResponseSelector = _exports.makeErrorSelector = _exports.makeIsPendingSelector = _exports.makeAllPendingSelector = void 0;

  var selectAllAsyncRequests = function selectAllAsyncRequests(state) {
    return state.asyncActions || {};
  };
  /**
   * Creates a selector that returns a set of identifiers for the given action that
   * are pending.
   */

  var makeAllPendingSelector = function makeAllPendingSelector(actionType) {
    return (0, _reselect.createSelector)(selectAllAsyncRequests, function(
      allAsyncRequests,
    ) {
      return Object.keys(allAsyncRequests[actionType] || {}).filter(function(
        k,
      ) {
        return (
          !!allAsyncRequests[actionType][k] &&
          !!allAsyncRequests[actionType][k].pending
        );
      });
    });
  };
  /**
   * Creates a selector that returns true if the given action is pending.
   * The optional identifier argument allows you to match a specific instance
   * of an action created with an identifier. Omitting it returns true if
   * any actions of that type are pending.
   */

  _exports.makeAllPendingSelector = makeAllPendingSelector;

  var makeIsPendingSelector = function makeIsPendingSelector(
    actionType,
    identifier,
  ) {
    var initialValue =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return (0, _reselect.createSelector)(selectAllAsyncRequests, function(
      allAsyncRequests,
    ) {
      if (!!allAsyncRequests && !allAsyncRequests[actionType]) {
        return initialValue;
      }

      return (
        !!allAsyncRequests &&
        !!allAsyncRequests[actionType] &&
        !!allAsyncRequests[actionType][identifier || ''] &&
        !!allAsyncRequests[actionType][identifier || ''].pending
      );
    });
  };
  /**
   * Creates a selector that returns any error for the given actionType and optional
   * identifier. Omitting the identifier looks for an error associated with the action
   * type alone and returns null if it is not found.
   */

  _exports.makeIsPendingSelector = makeIsPendingSelector;

  var makeErrorSelector = function makeErrorSelector(actionType, identifier) {
    return (0, _reselect.createSelector)(selectAllAsyncRequests, function(
      allAsyncRequests,
    ) {
      return !!allAsyncRequests &&
        !!allAsyncRequests[actionType] &&
        !!allAsyncRequests[actionType][identifier || '']
        ? allAsyncRequests[actionType][identifier || ''].error || null
        : null;
    });
  };
  /**
   * Internal use only
   */

  _exports.makeErrorSelector = makeErrorSelector;

  var makeCachedResponseSelector = function makeCachedResponseSelector(
    actionType,
    identifier,
    ttlSeconds,
  ) {
    return (0, _reselect.createSelector)(selectAllAsyncRequests, function(
      allAsyncRequests,
    ) {
      var cacheRecord =
        !!allAsyncRequests &&
        !!allAsyncRequests[actionType] &&
        !!allAsyncRequests[actionType][identifier || '']
          ? allAsyncRequests[actionType][identifier || '']
              .__do_not_use__response_cache
          : null;

      if (!cacheRecord) {
        return null;
      }

      if (
        undefined !== ttlSeconds &&
        cacheRecord.secondsSinceEpoch + ttlSeconds < Date.now() / 1000
      ) {
        return null;
      }

      return cacheRecord.value;
    });
  };

  _exports.makeCachedResponseSelector = makeCachedResponseSelector;
});
