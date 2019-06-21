// @flow
import { createSelector } from 'reselect';
import type {
  AllPendingSelector,
  IsPendingSelector,
  ErrorSelector,
  CachedResponseSelector,
  SelectorProps,
} from './async.types';

const selectAllAsyncRequests = state => state.asyncActions;

/**
 * Creates a selector that returns a set of identifiers for the given action that
 * are pending.
 */
const _allPendingSelector = (state: *, props: SelectorProps) => {
  const allAsyncRequests = selectAllAsyncRequests(state);
  const { type } = props;
  return Object.keys(allAsyncRequests[type] || {}).filter(
    k => !!allAsyncRequests[type][k] && !!allAsyncRequests[type][k].pending,
  );
};
export const allPendingSelector: AllPendingSelector = createSelector(
  _allPendingSelector,
  allPending => allPending,
);

/**
 * Creates a selector that returns true if the given action is pending.
 * The optional identifier argument allows you to match a specific instance
 * of an action created with an identifier. Omitting it returns true if
 * any actions of that type are pending.
 */
const _isPendingSelector = (state: *, props: SelectorProps) => {
  const allAsyncRequests = selectAllAsyncRequests(state);
  const { type, identifier } = props;

  return (
    !!allAsyncRequests &&
    !!allAsyncRequests[type] &&
    !!allAsyncRequests[type][identifier || ''] &&
    !!allAsyncRequests[type][identifier || ''].pending
  );
};
export const isPendingSelector: IsPendingSelector = createSelector(
  _isPendingSelector,
  isPending => isPending,
);

/**
 * Creates a selector that returns any error for the given type and optional
 * identifier. Omitting the identifier looks for an error associated with the action
 * type alone and returns null if it is not found.
 */
const _errorSelector = (state: *, props: SelectorProps) => {
  const allAsyncRequests = selectAllAsyncRequests(state);
  const { type, identifier } = props;
  return !!allAsyncRequests &&
    !!allAsyncRequests[type] &&
    !!allAsyncRequests[type][identifier || '']
    ? allAsyncRequests[type][identifier || ''].error || null
    : null;
};
export const errorSelector: ErrorSelector = createSelector(
  _errorSelector,
  error => error,
);

/**
 * Internal use only
 */
const _cachedResponseSelector = (state: *, props: SelectorProps) => {
  const allAsyncRequests = selectAllAsyncRequests(state);
  const { type, identifier, ttlSeconds } = props;

  const cacheRecord =
    !!allAsyncRequests &&
    !!allAsyncRequests[type] &&
    !!allAsyncRequests[type][identifier || '']
      ? allAsyncRequests[type][identifier || ''].__do_not_use__response_cache
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
};
export const cachedResponseSelector: CachedResponseSelector = createSelector(
  _cachedResponseSelector,
  cachedResponse => cachedResponse,
);
