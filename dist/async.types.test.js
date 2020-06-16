(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['redux', 'redux-thunk', '.'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('redux'), require('redux-thunk'), require('.'));
  } else {
    var mod = {
      exports: {},
    };
    factory(global.redux, global.reduxThunk, global._);
    global.asyncTypesTest = mod.exports;
  }
})(this, function(_redux, _reduxThunk, _) {
  'use strict';

  _reduxThunk = _interopRequireDefault(_reduxThunk);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  /**
   * Typedef tests
   *
   * These tests don't do much at runtime. They are there to make sure that flow passes at
   * build time for a variety on scenarios.
   */
  describe('AsyncAction typedef tests', function() {
    var simpleAction;
    var store;
    beforeEach(function() {
      simpleAction = {
        type: 'FOO',
        param: 42,
      };
      store = (0, _redux.createStore)(function() {
        var state =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {};
        return state;
      }, (0, _redux.applyMiddleware)(_reduxThunk['default']));
    });
    describe('With no extra type specifications', function() {
      it('can create an AsyncAction', function() {
        var operation = function operation() {
          return Promise.resolve({
            message: 'OHAI',
          });
        };

        store.dispatch((0, _.createAsyncAction)(simpleAction, operation));
      });
      it('can create an AsyncAction with a semi-complex operation', function() {
        var operation = function operation(_dispatch) {
          return Promise.resolve({
            message: 'OHAI',
          });
        };

        store.dispatch((0, _.createAsyncAction)(simpleAction, operation));
      });
      it('can create an AsyncAction with a complex operation', function() {
        var operation = function operation(_dispatch, _getState) {
          return Promise.resolve({
            message: 'OHAI',
          });
        };

        store.dispatch((0, _.createAsyncAction)(simpleAction, operation));
      });
    });
    describe('With full type specifications', function() {
      describe('Using AsyncAction', function() {
        it('can type and create an AsyncAction', function() {
          var operation = function operation() {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
        it('can type and create an AsyncAction with a semi-complex operation', function() {
          var operation = function operation(_dispatch) {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
        it('can type and create an AsyncAction with a complex operation', function() {
          var operation = function operation(_dispatch, _getState) {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
      });
      describe('Using AAction', function() {
        it('can type and create an AsyncAction', function() {
          var operation = function operation() {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
        it('can type and create an AsyncAction with a semi-complex operation', function() {
          var operation = function operation(_dispatch) {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
        it('can type and create an AsyncAction with a complex operation', function() {
          var operation = function operation(_dispatch, _getState) {
            return Promise.resolve({
              message: 'OHAI',
            });
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
      });
      describe('thunk withExtraArgument supplying the extra argument', function() {
        it('can enforce the type between the operation and the thunk caller', function() {
          var operation = function operation(
            _dispatch,
            _getState,
            extraArguments,
          ) {
            return Promise.resolve(extraArguments);
          };

          var thunk = (0, _.createAsyncAction)(simpleAction, operation);
          store.dispatch(thunk);
        });
      });
    });
  });
});
