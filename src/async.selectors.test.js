// @flow
import {
  isPendingSelector,
  errorSelector,
  allPendingSelector,
} from './async.selectors';

describe('AsyncSelectors', () => {
  let state;
  let fakeError;

  beforeEach(() => {
    fakeError = new Error('BOOM');
    state = {
      asyncActions: {
        FOO_ACTION: {
          fooId0: { pending: true },
          fooId1: { pending: true },
          fooId2: {
            pending: false,
            error: {
              name: 'Error',
              message: 'BOOM',
              stack: fakeError.stack,
            },
          },
        },
      },
    };
  });

  it('should let you select an ongoing action', () => {
    const fooId1Pending = isPendingSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId1',
    });
    const fooId2Pending = isPendingSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId2',
    });
    const fooId3Pending = isPendingSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId3',
    });

    expect(fooId1Pending).toBe(true);
    expect(fooId2Pending).toBe(false);
    expect(fooId3Pending).toBe(false);
  });

  it('should let you select an error', () => {
    const fooId1Error = errorSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId1',
    });
    const fooId2Error = errorSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId2',
    });
    const fooId3Error = errorSelector(state, {
      type: 'FOO_ACTION',
      identifier: 'fooId3',
    });

    expect(fooId1Error).toBe(null);
    expect(fooId2Error).toEqual({
      name: 'Error',
      message: 'BOOM',
      stack: fakeError.stack,
    });

    expect(fooId3Error).toBe(null);
  });

  it('should let you select all ongoing identifiers for an action', () => {
    const fooActionAllPending = allPendingSelector(state, {
      type: 'FOO_ACTION',
    });

    expect(fooActionAllPending).toEqual(['fooId0', 'fooId1']);
  });
});
