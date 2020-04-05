import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import rootStore from '../../rootStore';
import createCallback from '../../utils/createCallback';
import { State, StateStatuses } from '../../utils/State';
import { ITokensProvider, TokensDto } from './apiTypes';

export interface IOnFulfilledInterceptor<V> {
  (value: V): V | Promise<V>;
}

export interface IOnRejectedRequestInterceptor {
  (error: any): any;
}

export interface IApiClientBuilder {
  readonly client: AxiosInstance;
}

export default class ApiClientBuilder implements IApiClientBuilder {
  private readonly _tokensProvider: ITokensProvider;
  private readonly _client: AxiosInstance;
  private _isRefreshing = false;
  private _pendingRequests: Array<AxiosRequestConfig> = [];

  constructor(tokensProvider: ITokensProvider) {
    this._tokensProvider = tokensProvider;
    this._client = axios.create();
    this._client.interceptors.request.use(this.createAuthInterceptor());
    this._client.interceptors.response.use(
      (value) => value,
      this.createErrorInterceptor()
    );

    rootStore.subscribe(this.onTokensUpdated);
  }

  private onTokensUpdated = () => {
    return createCallback<State<TokensDto>>(
      (tokensState) => {
        if (tokensState.status === StateStatuses.LOADED) {
          console.log(tokensState.payload);
        }
      },
      (state) => state as any
    );
  };

  private createAuthInterceptor(): IOnFulfilledInterceptor<AxiosRequestConfig> {
    const tokensProvider = this._tokensProvider;

    return (config: AxiosRequestConfig) => {
      const tokens = tokensProvider.loadTokens();

      if (!tokens) {
        return config;
      }

      const newConfig = {
        headers: {},
        ...config
      };

      newConfig.headers.Authorization = `Bearer ${tokens.token}`;
      return newConfig;
    };
  }

  private static handleErrorResponse(error: AxiosError): AxiosError {
    throw error;
  }

  private createErrorInterceptor(): IOnRejectedRequestInterceptor {
    return (error: AxiosError) => {
      switch (error?.response?.status) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 500:
          return ApiClientBuilder.handleErrorResponse(error);
        case 419:
          console.log('token expired');
          return null;
        // return this.handleTokenExpired(error);
        default:
          return error;
      }
    };
  }

  get client(): AxiosInstance {
    return this._client;
  }
}
