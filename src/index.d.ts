import { ThunkAction } from 'redux-thunk';
import { Action as ReduxAction } from 'redux';

type Nullable<T> = T | null;

export type SimpleAction<T = any> = ReduxAction<T>;

type AsyncStatus =
  | 'ASYNC_COMPLETE'
  | 'ASYNC_PENDING'
  | 'ASYNC_FAILED'
  | 'ASYNC_DEDUPED'
  | 'ASYNC_CACHED'
  | 'ASYNC_RESET';

// Intentionally recursive type.
// eslint-disable-next-line no-use-before-define
export type JSONLiteral = JSONObject | JSONArray | string | number;
export type JSONObject = {
  [key: string]: JSONLiteral;
};
export type JSONArray = JSONLiteral[];

export type AsyncAction<
  ActionType,
  PayloadType,
  ActionFields = Record<string, unknown>
> = SimpleAction<ActionType> &
  ActionFields & {
    payload?: Nullable<PayloadType>;
    error?: Nullable<JSONLiteral | Error>;
    meta: {
      status: AsyncStatus;
      identifier?: string;
    };
  };

export type GetStateFn<State> = () => State;

export type AsyncThunk<Payload, State, ExtraArg = unknown> = ThunkAction<
  Promise<Payload>,
  State,
  ExtraArg,
  SimpleAction
>;

export type CreateAsyncAction = <A, Payload, State>(
  action: A,
  thunk: AsyncThunk<Payload, State>,
) => AsyncThunk<Payload, State>;

// Reducer types
export type ErrorInfo = {
  name: string;
  message: string;
  stack?: string;
};

export type AsyncActionRecord = {
  pending: boolean;
  error?: ErrorInfo;
  __do_not_use__response_cache?: {
    value: any;
    secondsSinceEpoch: number;
  };
};

export type AsyncActionState = {
  [actionType: string]: {
    [identifier: string]: AsyncActionRecord;
  };
};

export type AllPendingSelector<S = unknown> = (state: S) => string[];
export type IsPendingSelector<S = unknown> = (state: S) => boolean;
export type ErrorSelector<S = unknown> = (state: S) => Nullable<ErrorInfo>;

export type AsyncActionReducer = (
  state: AsyncActionState,
  action: AsyncAction<string, any>,
) => AsyncActionState;

// Re-exporting typed versions of the functions

declare function createAsyncAction<A, Payload, State>(
  action: A,
  thunk: AsyncThunk<Payload, State>,
): AsyncThunk<Payload, State>;

declare function asyncActionReducer(
  state: AsyncActionState,
  action: AsyncAction<string, any>,
): AsyncActionState;

declare function makeIsPendingSelector<S>(
  actionType: string,
  identifier?: string,
  initialValue?: boolean,
): IsPendingSelector<S>;

declare function makeAllPendingSelector(
  actionType: string,
): AllPendingSelector<S>;

declare function makeErrorSelector<S>(
  actionType: string,
  identifier?: string,
): ErrorSelector<S>;

declare function isComplete(action: SimpleAction<any>): boolean;

declare function isFailed(action: SimpleAction<any>): boolean;
declare function isBeingReset(action: SimpleAction<any>): boolean;

declare function isPending(action: SimpleAction<any>): boolean;
