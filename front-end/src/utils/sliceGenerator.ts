import {
  createSlice,
  PayloadAction,
  SliceCaseReducers
} from '@reduxjs/toolkit';
import { State, StateStatuses } from './State';

enum SliceAction {
  REQUESTED = 'Requested',
  SUCCESS = 'Success',
  FAIL = 'Fail'
}

type MapSchema<M, T extends Record<string, keyof SliceCaseReducers<M>>> = {
  [K in keyof T]: T[K];
};

export const sliceGenerator = <S = any, CaseReducerState = any>(
  name: string,
  actionName = name
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const { actions, reducer } = createSlice<any, any>({
    name,
    initialState: { status: StateStatuses.INIT },
    reducers: {
      [`${actionName}${SliceAction.REQUESTED}`]: (
        state: State<any>,
        payload: any
      ) => {
        return payload
          ? {
              status: StateStatuses.LOADING,
              payload
            }
          : {
              status: StateStatuses.LOADING
            };
      },
      [`${actionName}${SliceAction.SUCCESS}`]: (
        state: State<any>,
        action: PayloadAction<StateStatuses.LOADED, any>
      ) => {
        return {
          status: StateStatuses.LOADED,
          payload: action.payload
        };
      },
      [`${actionName}${SliceAction.FAIL}`]: (
        state: any,
        errorResponse: PayloadAction<string, any>
      ) => {
        const data = errorResponse.payload;
        const type = errorResponse.type;

        return {
          status: StateStatuses.FAILED,
          error: {
            data,
            status: type
          }
        };
      }
    }
  });

  return { actions, reducer };
};
