// @flow
import type { Dispatch } from 'redux';
import type {
  AsyncAction,
  AsyncThunk,
  AsyncActionOptions,
  SimpleAction,
  GetState,
} from './async.types';
import { isPendingSelector, cachedResponseSelector } from './async.selectors';

export const isPending = (action: $Subtype<SimpleAction>) =>
  !!action.meta && action.meta.status === 'ASYNC_PENDING';

export const isComplete = (action: $Subtype<SimpleAction>) =>
  !!action.meta &&
  (action.meta.status === 'ASYNC_COMPLETE' ||
    action.meta.status === 'ASYNC_CACHED');

export const isFailed = (action: $Subtype<SimpleAction>) =>
  !!action.meta && action.meta.status === 'ASYNC_FAILED';

const _dedupedPromises = {};

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
export const createAsyncAction = <Action: SimpleAction, Payload>(
  action: Action,
  operation: AsyncThunk,
  { identifier, cache, ttlSeconds, overwriteCache }: AsyncActionOptions = {},
): AsyncThunk => (
  dispatch: Dispatch<AsyncAction<Action, Payload>>,
  getState: GetState<*>,
): Promise<Payload> => {
  if (isPendingSelector(getState(), { type: action.type, identifier })) {
    dispatch({
      ...action,
      payload: null,
      error: null,
      meta: { status: 'ASYNC_DEDUPED', identifier },
    });
    return _dedupedPromises[`${action.type}(${identifier || ''})`];
  }

  if (cache && !overwriteCache) {
    // $FlowFixMe
    const cachedResponse: Payload = cachedResponseSelector(getState(), {
      type: action.type,
      identifier,
      ttlSeconds,
    });

    if (cachedResponse !== null && undefined !== cachedResponse) {
      dispatch({
        ...action,
        payload: cachedResponse,
        error: null,
        meta: { status: 'ASYNC_CACHED', identifier },
      });

      return Promise.resolve(cachedResponse);
    }
  }

  dispatch({
    ...action,
    payload: null,
    error: null,
    meta: { status: 'ASYNC_PENDING', identifier },
  });

  const promise = operation(dispatch, getState)
    .then(result => {
      dispatch({
        ...action,
        payload: result,
        error: null,
        meta: { status: 'ASYNC_COMPLETE', identifier, cache },
      });

      delete _dedupedPromises[`${action.type}(${identifier || ''})`];
      return result;
    })
    .catch(error => {
      try {
        dispatch({
          ...action,
          payload: null,
          error,
          meta: { status: 'ASYNC_FAILED', identifier },
        });
      } catch (e) {
        throw e;
      }

      delete _dedupedPromises[`${action.type}(${identifier || ''})`];
      throw error;
    });

  _dedupedPromises[`${action.type}(${identifier || ''})`] = promise;
  return promise;
};
