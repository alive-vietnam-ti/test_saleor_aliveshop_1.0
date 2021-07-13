import * as React from 'react';
/* Async Reducer */

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return { status: 'pending', data: null, error: null };
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null };
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error };
    }
    default:
      throw new Error(`Unhandled action type ${action.type}`);
  }
}

function useAsync(initialState?: any) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  });

  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dispatch = React.useCallback((...args) => {
    if (mountedRef.current) {
      unsafeDispatch(...args);
    }
  }, []);

  const run = React.useCallback(
    (promise) => {
      dispatch({ type: 'pending' });
      promise.then(
        (data: any) => {
          dispatch({ type: 'resolved', data });
        },
        (error: any) => {
          dispatch({ type: 'rejected', error });
        }
      );
    },
    [dispatch]
  ); //not really needed as the dispatch function is stable and won't change

  return { ...state, run };
} //useAsync

export { useAsync };
