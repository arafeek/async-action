import { asyncActionReducer } from './async.reducer';

describe('AsyncAction reducer', () => {
  it('should record a pending request', () => {
    const state = {};
    const pendingAction = {
      type: 'GET_FOOS_BY_NAME',
      meta: {
        status: 'ASYNC_PENDING',
        identifier: 'nameOfTheFoo',
      },
    };

    const newState = asyncActionReducer(state, pendingAction);

    expect(newState).toEqual({
      GET_FOOS_BY_NAME: {
        nameOfTheFoo: {
          pending: true,
        },
      },
    });

    // Also check that the record is removed when the request
    // completes.
    const completeAction = {
      type: 'GET_FOOS_BY_NAME',
      meta: {
        status: 'ASYNC_COMPLETE',
        identifier: 'nameOfTheFoo',
      },
    };

    const finalState = asyncActionReducer(newState, completeAction);

    expect(finalState).toEqual({
      GET_FOOS_BY_NAME: {},
    });
  });

  it('should record a failed request', () => {
    const state = {};
    const action = {
      type: 'GET_FOOS_BY_NAME',
      error: new Error('BOOM'),
      meta: {
        status: 'ASYNC_FAILED',
        identifier: 'nameOfTheFoo',
      },
    };

    const newState = asyncActionReducer(state, action);

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

  it('gracefully handles a malformed error', () => {
    const state = {};
    const action = {
      type: 'GET_FOOS_BY_NAME',
      error: 'a am a string not an error silly!',
      meta: {
        status: 'ASYNC_FAILED',
        identifier: 'nameOfTheFoo',
      },
    };

    // $FlowFixMe - intentionally testing a bad runtime case.
    const newState = asyncActionReducer(state, action);

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
});