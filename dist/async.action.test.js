(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./async.action'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('./async.action'));
  } else {
    var mod = {
      exports: {},
    };
    factory(global.async);
    global.asyncActionTest = mod.exports;
  }
})(this, function(_async) {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function() {
      var self = this,
        args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(
            gen,
            resolve,
            reject,
            _next,
            _throw,
            'next',
            value,
          );
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
        }
        _next(undefined);
      });
    };
  }

  describe('Async Action Creators', function() {
    it(
      'notifies when the action completes successfully',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
          var mockDispatch, mockGetState, mockPayload, actionThunk, payload;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  mockDispatch = jest.fn();

                  mockGetState = function mockGetState() {
                    return {};
                  };

                  mockPayload = 'a payload';
                  actionThunk = (0, _async.createAsyncAction)(
                    {
                      type: 'SOME_ACTION',
                    },
                    function() {
                      return Promise.resolve(mockPayload);
                    },
                    {
                      identifier: 'anIdentifier',
                    },
                  );
                  _context.next = 6;
                  return actionThunk(mockDispatch, mockGetState);

                case 6:
                  payload = _context.sent;
                  expect(payload).toEqual(mockPayload);
                  expect(mockDispatch).toHaveBeenCalledTimes(2);
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    meta: {
                      status: 'ASYNC_PENDING',
                      identifier: 'anIdentifier',
                    },
                    error: null,
                    payload: null,
                  });
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    payload: 'a payload',
                    meta: {
                      status: 'ASYNC_COMPLETE',
                      identifier: 'anIdentifier',
                    },
                    error: null,
                  });

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee);
        }),
      ),
    );
    it(
      'notifies when the action fails',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
          var mockDispatch, mockGetState, actionThunk;
          return regeneratorRuntime.wrap(
            function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    mockDispatch = jest.fn();

                    mockGetState = function mockGetState() {
                      return {};
                    };

                    _context2.prev = 2;
                    actionThunk = (0, _async.createAsyncAction)(
                      {
                        type: 'SOME_ACTION',
                      },
                      function() {
                        return Promise.reject(new Error('BOOM'));
                      },
                      {
                        identifier: 'anIdentifier',
                      },
                    );
                    _context2.next = 6;
                    return actionThunk(mockDispatch, mockGetState);

                  case 6:
                    _context2.next = 11;
                    break;

                  case 8:
                    _context2.prev = 8;
                    _context2.t0 = _context2['catch'](2);
                    expect(_context2.t0).toEqual(new Error('BOOM'));

                  case 11:
                    expect(mockDispatch).toHaveBeenCalledTimes(2);
                    expect(mockDispatch).toHaveBeenCalledWith({
                      type: 'SOME_ACTION',
                      meta: {
                        status: 'ASYNC_PENDING',
                        identifier: 'anIdentifier',
                      },
                      payload: null,
                      error: null,
                    });
                    expect(mockDispatch).toHaveBeenCalledWith({
                      type: 'SOME_ACTION',
                      error: new Error('BOOM'),
                      meta: {
                        status: 'ASYNC_FAILED',
                        identifier: 'anIdentifier',
                      },
                      payload: null,
                    });

                  case 14:
                  case 'end':
                    return _context2.stop();
                }
              }
            },
            _callee2,
            null,
            [[2, 8]],
          );
        }),
      ),
    );
    it(
      'de-dupes already pending actions',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee3() {
          var mockDispatch, mockGetState, actionThunk;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch ((_context3.prev = _context3.next)) {
                case 0:
                  mockDispatch = jest.fn();

                  mockGetState = function mockGetState() {
                    return {
                      asyncActions: {
                        SOME_ACTION: {
                          anIdentifier: {
                            pending: true,
                          },
                        },
                      },
                    };
                  };

                  actionThunk = (0, _async.createAsyncAction)(
                    {
                      type: 'SOME_ACTION',
                    },
                    function() {
                      return Promise.resolve('a payload');
                    },
                    {
                      identifier: 'anIdentifier',
                    },
                  );
                  _context3.next = 5;
                  return actionThunk(mockDispatch, mockGetState);

                case 5:
                  expect(mockDispatch).toHaveBeenCalledTimes(1);
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    meta: {
                      status: 'ASYNC_DEDUPED',
                      identifier: 'anIdentifier',
                    },
                    payload: null,
                    error: null,
                  });

                case 7:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3);
        }),
      ),
    );
    it(
      "doesn't swallow errors that happen while notifying",
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee4() {
          var mockDispatch, mockGetState, actionThunk;
          return regeneratorRuntime.wrap(
            function _callee4$(_context4) {
              while (1) {
                switch ((_context4.prev = _context4.next)) {
                  case 0:
                    mockDispatch = jest
                      .fn() // First call: pretend that set to pending succeeds.
                      .mockImplementationOnce(function(_a) {
                        return _a;
                      }) // Second call: pretend dispatching the success case explodes in a reducer somewhere.
                      .mockImplementationOnce(function(_a) {
                        throw new Error('DISPATCH BOOM');
                      });

                    mockGetState = function mockGetState() {
                      return {};
                    };

                    actionThunk = (0, _async.createAsyncAction)(
                      {
                        type: 'SOME_ACTION',
                      },
                      function() {
                        return Promise.resolve('foo');
                      },
                      {
                        identifier: 'anIdentifier',
                      },
                    );
                    _context4.prev = 3;
                    _context4.next = 6;
                    return actionThunk(mockDispatch, mockGetState);

                  case 6:
                    _context4.next = 11;
                    break;

                  case 8:
                    _context4.prev = 8;
                    _context4.t0 = _context4['catch'](3);
                    expect(_context4.t0).toEqual(new Error('DISPATCH BOOM'));

                  case 11:
                  case 'end':
                    return _context4.stop();
                }
              }
            },
            _callee4,
            null,
            [[3, 8]],
          );
        }),
      ),
    );
    it('can tell when an async action is pending', function() {
      expect(
        (0, _async.isPending)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_PENDING',
          },
        }),
      ).toBe(true);
      expect(
        (0, _async.isPending)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_COMPLETE',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isPending)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_FAILED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isPending)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_CACHED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isPending)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_RESET',
          },
        }),
      ).toBe(false);
    });
    it('can tell when an async action completed successfully', function() {
      expect(
        (0, _async.isComplete)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_PENDING',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isComplete)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_COMPLETE',
          },
        }),
      ).toBe(true);
      expect(
        (0, _async.isComplete)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_FAILED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isComplete)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_CACHED',
          },
        }),
      ).toBe(true);
      expect(
        (0, _async.isComplete)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_RESET',
          },
        }),
      ).toBe(false);
    });
    it('can tell when an async action has failed', function() {
      expect(
        (0, _async.isFailed)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_PENDING',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isFailed)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_COMPLETE',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isFailed)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_FAILED',
          },
        }),
      ).toBe(true);
      expect(
        (0, _async.isFailed)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_CACHED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isFailed)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_RESET',
          },
        }),
      ).toBe(false);
    });
    it('can tell when an async action is being reset', function() {
      expect(
        (0, _async.isBeingReset)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_PENDING',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isBeingReset)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_COMPLETE',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isBeingReset)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_FAILED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isBeingReset)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_CACHED',
          },
        }),
      ).toBe(false);
      expect(
        (0, _async.isBeingReset)({
          type: 'FOO_ACTION',
          meta: {
            status: 'ASYNC_RESET',
          },
        }),
      ).toBe(true);
    });
    it(
      'caches responses if asked to',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee5() {
          var mockPayload,
            mockDispatch,
            mockGetState,
            mockOperation,
            actionThunk,
            payload;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  mockPayload = 'a payload';
                  mockDispatch = jest.fn();

                  mockGetState = function mockGetState() {
                    return {
                      asyncActions: {
                        SOME_ACTION: {
                          anIdentifier: {
                            __do_not_use__response_cache: {
                              value: mockPayload,
                            },
                          },
                        },
                      },
                    };
                  };

                  mockOperation = jest
                    .fn()
                    .mockReturnValue(Promise.resolve(mockPayload));
                  actionThunk = (0, _async.createAsyncAction)(
                    {
                      type: 'SOME_ACTION',
                    },
                    mockOperation,
                    {
                      identifier: 'anIdentifier',
                      cache: true,
                    },
                  );
                  _context5.next = 7;
                  return actionThunk(mockDispatch, mockGetState);

                case 7:
                  payload = _context5.sent;
                  expect(payload).toEqual(mockPayload);
                  expect(mockDispatch).toHaveBeenCalledTimes(1);
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    meta: {
                      status: 'ASYNC_CACHED',
                      identifier: 'anIdentifier',
                    },
                    payload: mockPayload,
                    error: null,
                  });
                  expect(mockOperation).not.toHaveBeenCalled();

                case 12:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5);
        }),
      ),
    );
    it(
      'respects a cache TTL if one is set',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee6() {
          var mockPayload,
            mockDispatch,
            mockGetState,
            mockOperation,
            actionThunk,
            payload;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch ((_context6.prev = _context6.next)) {
                case 0:
                  jest.spyOn(Date, 'now').mockReturnValue(1522620263000);
                  mockPayload = 'a payload';
                  mockDispatch = jest.fn();

                  mockGetState = function mockGetState() {
                    return {
                      asyncActions: {
                        SOME_ACTION: {
                          anIdentifier: {
                            __do_not_use__response_cache: {
                              value: mockPayload,
                              secondsSinceEpoch: 1522620260, // 3 seconds ago.
                            },
                          },
                        },
                      },
                    };
                  };

                  mockOperation = jest
                    .fn()
                    .mockReturnValue(Promise.resolve(mockPayload));
                  actionThunk = (0, _async.createAsyncAction)(
                    {
                      type: 'SOME_ACTION',
                    },
                    mockOperation,
                    {
                      identifier: 'anIdentifier',
                      cache: true,
                      ttlSeconds: 2,
                    },
                  );
                  _context6.next = 8;
                  return actionThunk(mockDispatch, mockGetState);

                case 8:
                  payload = _context6.sent;
                  expect(payload).toEqual(mockPayload);
                  expect(mockDispatch).toHaveBeenCalledTimes(2);
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    meta: {
                      status: 'ASYNC_PENDING',
                      identifier: 'anIdentifier',
                    },
                    payload: null,
                    error: null,
                  });
                  expect(mockDispatch).toHaveBeenCalledWith({
                    type: 'SOME_ACTION',
                    meta: {
                      status: 'ASYNC_COMPLETE',
                      identifier: 'anIdentifier',
                      cache: true,
                    },
                    payload: mockPayload,
                    error: null,
                  });
                  expect(mockOperation).toHaveBeenCalledTimes(1);

                case 14:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6);
        }),
      ),
    );
    it(
      'can correctly forward extraArguments',
      /*#__PURE__*/ _asyncToGenerator(
        /*#__PURE__*/ regeneratorRuntime.mark(function _callee7() {
          var mockDispatch,
            mockGetState,
            mockExtraArguments,
            mockOperation,
            actionThunk;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch ((_context7.prev = _context7.next)) {
                case 0:
                  mockDispatch = jest.fn();

                  mockGetState = function mockGetState() {
                    return {};
                  };

                  mockExtraArguments = 'extraArguments';
                  mockOperation = jest.fn(function() {
                    return Promise.resolve('a payload');
                  });
                  actionThunk = (0, _async.createAsyncAction)(
                    {
                      type: 'SOME_ACTION',
                    },
                    mockOperation,
                    {
                      identifier: 'anIdentifier',
                    },
                  );
                  _context7.next = 7;
                  return actionThunk(
                    mockDispatch,
                    mockGetState,
                    mockExtraArguments,
                  );

                case 7:
                  expect(mockOperation).toHaveBeenCalledTimes(1);
                  expect(mockOperation).toHaveBeenCalledWith(
                    mockDispatch,
                    mockGetState,
                    mockExtraArguments,
                  );

                case 9:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7);
        }),
      ),
    );
  });
});
