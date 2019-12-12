// HACK!
// Copied from the redux typedefs so that flowgen has a self-contained
// setup to work with. I don't like this. Ideas welcome.
export interface Action<T = any> {
  type: T;
}

export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}

export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}
// END HACK!

type Status =
  | 'ASYNC_COMPLETE'
  | 'ASYNC_PENDING'
  | 'ASYNC_FAILED'
  | 'ASYNC_DEDUPED'
  | 'ASYNC_CACHED'
  | 'ASYNC_RESET';

// Deprecated. Use the AAction shorthand below.
export type AsyncAction<A extends Action, PayloadType> = A & {
  payload?: PayloadType | null;
  error?: ErrorInfo | null;
  meta: {
    status: Status;
    identifier?: string;
  };
};

// Shorthand form of AsyncAction:
export type AAction<
  ActionType extends string,
  PayloadType,
  ActionFields = object
> = {
  type: ActionType;
} & ActionFields & {
    payload?: PayloadType | null;
    error?: ErrorInfo | null;
    meta: {
      status: Status;
      identifier?: string;
    };
  };

export type GetState<State extends object = object> = () => State;

export type AsyncThunk<Payload, State extends object = object> = (
  dispatch: Dispatch,
  getState: GetState<State>,
) => Promise<Payload>;

export type AsyncActionOptions = {
  identifier?: string;
  cache?: boolean;
  overwriteCache?: boolean;
  ttlSeconds?: number;
};

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

export type AllPendingSelector<S = object> = (state: S) => string[];
export type IsPendingSelector<S = object> = (state: S) => boolean;
export type ErrorSelector<S = object> = (
  state: S,
) => ErrorInfo | undefined | null;
