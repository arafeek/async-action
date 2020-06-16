(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./async.selectors'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('./async.selectors'));
  } else {
    var mod = {
      exports: {},
    };
    factory(global.async);
    global.asyncSelectorsTest = mod.exports;
  }
})(this, function(_async) {
  'use strict';

  describe('AsyncSelectors', function() {
    var state;
    var fakeError;
    beforeEach(function() {
      fakeError = new Error('BOOM');
      state = {
        asyncActions: {
          FOO_ACTION: {
            fooId0: {
              pending: true,
            },
            fooId1: {
              pending: true,
            },
            fooId2: {
              pending: false,
              error: {
                name: 'Error',
                message: 'BOOM',
                stack: fakeError.stack,
              },
            },
          },
          FOO_ACTION_1: {},
        },
      };
    });
    it('should let you select an ongoing action', function() {
      var fooId1PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION',
        'fooId1',
      );
      var fooId2PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION',
        'fooId2',
      );
      var fooId3PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION',
        'fooId3',
      );
      var fooWrongActionPendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION_2',
      );
      expect(fooId1PendingSelector(state)).toBe(true);
      expect(fooId2PendingSelector(state)).toBe(false);
      expect(fooId3PendingSelector(state)).toBe(false);
      expect(fooWrongActionPendingSelector(state)).toBe(false);
    });
    it('should let you select an error', function() {
      var fooId1ErrorSelector = (0, _async.makeErrorSelector)(
        'FOO_ACTION',
        'fooId1',
      );
      var fooId2ErrorSelector = (0, _async.makeErrorSelector)(
        'FOO_ACTION',
        'fooId2',
      );
      var fooId3ErrorSelector = (0, _async.makeErrorSelector)(
        'FOO_ACTION',
        'fooId3',
      );
      expect(fooId1ErrorSelector(state)).toBe(null);
      expect(fooId2ErrorSelector(state)).toEqual({
        name: 'Error',
        message: 'BOOM',
        stack: fakeError.stack,
      });
      expect(fooId3ErrorSelector(state)).toBe(null);
    });
    it('should return the initial value for an action that has not been executed yet', function() {
      var fooActionId0PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION',
        'fooId0',
        true,
      );
      var fooActionId2PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION',
        'fooId2',
        true,
      );
      var fooAction1PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION_1',
        undefined,
        true,
      );
      var fooAction2PendingSelector = (0, _async.makeIsPendingSelector)(
        'FOO_ACTION_2',
        undefined,
        true,
      ); // if never ran before

      expect(fooAction2PendingSelector(state)).toBe(true); // if pending

      expect(fooActionId0PendingSelector(state)).toBe(true); // if empty but ran at least once

      expect(fooAction1PendingSelector(state)).toBe(false); // if error

      expect(fooActionId2PendingSelector(state)).toBe(false);
    });
    it('should let you select all ongoing identifiers for an action', function() {
      var fooActionAllPendingSelector = (0, _async.makeAllPendingSelector)(
        'FOO_ACTION',
      );
      expect(fooActionAllPendingSelector(state)).toEqual(['fooId0', 'fooId1']);
    });
  });
});
