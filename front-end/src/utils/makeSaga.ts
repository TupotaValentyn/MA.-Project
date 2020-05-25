import { call, put, PutEffect } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';

type ActionsTypes<A> = {
  [key: string]: (param?: A | string) => PutEffect<PayloadAction<A>>;
};

// name: string,
//   actions: ActionsTypes<R>,
//   apiFunc: ApiCaller<M, R>

export const makeSaga = <M = any, R = any>(
  name: string,
  actions: any,
  apiFunc: any
) => {
  return function*(action: PayloadAction<R, string>) {
    try {
      const successFnName = `${name}Success`;
      const response = yield call(apiFunc, action.payload);
      yield put(actions[successFnName](response));
    } catch (error) {
      const failFnName = `${name}Fail`;
      yield put(actions[failFnName](error.response));
    }
  };
};
