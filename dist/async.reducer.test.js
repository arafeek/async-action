(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./async.reducer', './async.action'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('./async.reducer'), require('./async.action'));
  } else {
    var mod = {
      exports: {},
    };
    factory(global.async, global.async);
    global.asyncReducerTest = mod.exports;
  }
})(this, function(_async, _async2) {
  'use strict';

  describe('AsyncAction reducer', function() {
    it('should record a pending request', function() {
      var state = {};
      var pendingAction = {
        type: 'GET_FOOS_BY_NAME',
        meta: {
          status: 'ASYNC_PENDING',
          identifier: 'nameOfTheFoo',
        },
      };
      var newState = (0, _async.asyncActionReducer)(state, pendingAction);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            pending: true,
          },
        },
      }); // Also check that the record is removed when the request
      // completes.

      var completeAction = {
        type: 'GET_FOOS_BY_NAME',
        meta: {
          status: 'ASYNC_COMPLETE',
          identifier: 'nameOfTheFoo',
        },
      };
      var finalState = (0, _async.asyncActionReducer)(newState, completeAction);
      expect(finalState).toEqual({
        GET_FOOS_BY_NAME: {},
      });
    });
    it('should record a pending request', function() {
      var state = {};
      var pendingAction = {
        type: 'GET_FOOS_BY_NAME',
        meta: {
          status: 'ASYNC_PENDING',
          identifier: 'nameOfTheFoo',
        },
      };
      var newState = (0, _async.asyncActionReducer)(state, pendingAction);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            pending: true,
          },
        },
      }); // Also check that the record is removed when the request
      // completes.

      var completeAction = {
        type: 'GET_FOOS_BY_NAME',
        meta: {
          status: 'ASYNC_COMPLETE',
          identifier: 'nameOfTheFoo',
        },
      };
      var finalState = (0, _async.asyncActionReducer)(newState, completeAction);
      expect(finalState).toEqual({
        GET_FOOS_BY_NAME: {},
      });
    });
    it('should cache a payload if asked to', function() {
      jest.spyOn(Date, 'now').mockReturnValue(1522620261999);
      var state = {};
      var completedAction = {
        type: 'GET_FOOS_BY_NAME',
        payload: 'a payload',
        meta: {
          status: 'ASYNC_COMPLETE',
          identifier: 'nameOfTheFoo',
          cache: true,
        },
      };
      var newState = (0, _async.asyncActionReducer)(state, completedAction);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            __do_not_use__response_cache: {
              value: 'a payload',
              secondsSinceEpoch: 1522620261,
            },
          },
        },
      });
    });
    it('should record a failed request', function() {
      var state = {};
      var action = {
        type: 'GET_FOOS_BY_NAME',
        error: new Error('BOOM'),
        meta: {
          status: 'ASYNC_FAILED',
          identifier: 'nameOfTheFoo',
        },
      };
      var newState = (0, _async.asyncActionReducer)(state, action);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            pending: false,
            error: {
              name: 'Error',
              message: 'BOOM',
              stack: action.error.stack,
            },
          },
        },
      });
    });
    it('gracefully handles a malformed error', function() {
      var state = {};
      var action = {
        type: 'GET_FOOS_BY_NAME',
        error: 'a am a string not an error silly!',
        meta: {
          status: 'ASYNC_FAILED',
          identifier: 'nameOfTheFoo',
        },
      };
      var newState = (0, _async.asyncActionReducer)(state, action);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            pending: false,
            error: {
              name: 'UNKNOWN',
              message: 'UNKNOWN',
            },
          },
        },
      });
    });
    it('resets a record if asked to', function() {
      var initialState = {
        GET_FOOS_BY_NAME: {
          nameOfTheFoo: {
            pending: false,
            error: {
              name: 'Error',
              message: 'BOOM',
            },
          },
        },
        GET_BARS_BY_NAME: {
          nameOfTheBar: {
            pending: false,
            error: {
              name: 'Error2',
              message: 'BOOM2',
            },
          },
        },
      };
      var action = (0, _async2.resetAsyncAction)(
        'GET_FOOS_BY_NAME',
        'nameOfTheFoo',
      );
      var newState = (0, _async.asyncActionReducer)(initialState, action);
      expect(newState).toEqual({
        GET_FOOS_BY_NAME: {},
        GET_BARS_BY_NAME: {
          nameOfTheBar: {
            pending: false,
            error: {
              name: 'Error2',
              message: 'BOOM2',
            },
          },
        },
      });
    });
  });
});
