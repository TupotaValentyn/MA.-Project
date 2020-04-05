export enum StateStatuses {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED'
}

export interface ErrorResponse {
  code: string;
  errors?: any;
  message?: string;
}

export type ErrorData = {
  data: ErrorResponse;
  status: number;
};

export type State<P, R = any> =
  | { status: StateStatuses.INIT }
  | { status: StateStatuses.LOADING; request: R }
  | { status: StateStatuses.LOADED; payload: P }
  | { status: StateStatuses.FAILED; error: ErrorData; payload?: P };
