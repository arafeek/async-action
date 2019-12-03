// @flow
import type { DispatchAPI } from 'redux';
import type {
  AsyncAction,
  AsyncThunk,
  AsyncActionOptions,
  SimpleAction,
  GetState,
} from './async.types';
import {
  makeIsPendingSelector,
  makeCachedResponseSelector,
} from './async.selectors';

export const isPending = (action: $Subtype<SimpleAction>) =>
  !!action.meta && action.meta.status === 'ASYNC_PENDING';

export const isComplete = (action: $Subtype<SimpleAction>) =>
  !!action.meta &&
  (action.meta.status === 'ASYNC_COMPLETE' ||
    action.meta.status === 'ASYNC_CACHED');

export const isFailed = (action: $Subtype<SimpleAction>) =>
  !!action.meta && action.meta.status === 'ASYNC_FAILED';

export const isBeingReset = (action: $Subtype<SimpleAction>) =>
  !!action.meta && action.meta.status === 'ASYNC_RESET';

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
export const createAsyncAction = <AAction: AsyncAction<SimpleAction, *>>(
  action: $Diff<AAction, { meta: mixed, error: mixed, payload: mixed }>,
  operation: AsyncThunk<$PropertyType<AAction, 'payload'>>,
  { identifier, cache, ttlSeconds, overwriteCache }: AsyncActionOptions = {},
): AsyncThunk<$NonMaybeType<$PropertyType<AAction, 'payload'>>> => {
  // We are returning a Thunk (a function that itself dispatches actions).
  const thunk = (
    dispatch: DispatchAPI<AAction>,
    getState: GetState<*>,
  ): Promise<$PropertyType<AAction, 'payload'>> => {
    const isPendingSelector = makeIsPendingSelector(action.type, identifier);
    if (isPendingSelector(getState())) {
      dispatch({
        ...action,
        payload: null,
        error: null,
        meta: { status: 'ASYNC_DEDUPED', identifier },
      });
      return _dedupedPromises[`${action.type}(${identifier || ''})`];
    }

    if (cache && !overwriteCache) {
      const cachedResponseSelector = makeCachedResponseSelector(
        action.type,
        identifier,
        ttlSeconds,
      );

      const cachedResponse = cachedResponseSelector(getState());
      if (cachedResponse) {
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

  return thunk;
};

export const resetAsyncAction = (type: string, identifier?: string) => ({
  type,
  meta: { status: 'ASYNC_RESET', identifier },
});
