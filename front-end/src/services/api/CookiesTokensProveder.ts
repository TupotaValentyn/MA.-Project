import Cookies, { Cookie } from 'universal-cookie';
import { ITokensProvider, TokensDto } from './apiTypes';

// const DOMAIN = process.env.REACT_APP_DOMAIN as string;
const DOMAIN = window.location.hostname;

console.log(DOMAIN);

export enum StorageStrategy {
  LOCAL = 'LOCAL',
  SESSION = 'SESSION'
}

export interface ITokensProviderConfig {
  accessTokenKey: string;
  refreshTokenKey: string;
  storageStrategy: StorageStrategy;
}

export const regularConfig: ITokensProviderConfig = {
  accessTokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  storageStrategy: StorageStrategy.LOCAL
};

class CookiesTokensProvider implements ITokensProvider {
  private readonly _accessTokenKey: string;
  // private readonly _refreshTokenKey: string;
  private readonly _storage: Cookie;

  constructor() {
    const { accessTokenKey, refreshTokenKey } = regularConfig;
    this._accessTokenKey = accessTokenKey;
    // this._refreshTokenKey = refreshTokenKey;
    this._storage = new Cookies();
  }

  loadTokens(): TokensDto | undefined {
    const token = this._storage.get(this._accessTokenKey);
    // const refreshToken = this._storage.get(this._refreshTokenKey);

    if (token) {
      return { token };
    }

    return undefined;
  }

  private _saveToken(key: string, token?: string) {
    if (token) {
      this._storage.set(key, token, { path: '/', domain: DOMAIN });
    }
  }

  saveAccessToken(token?: string) {
    this._saveToken(this._accessTokenKey, token);
  }

  // saveRefreshToken(token?: string) {
  //   this._saveToken(this._refreshTokenKey, token);
  // }

  saveTokens(tokens: TokensDto) {
    console.log(tokens);
    this.saveAccessToken(tokens.token);
    // this.saveRefreshToken(tokens.refreshToken);
  }

  removeTokens(): void {
    this._storage.remove(this._accessTokenKey, {
      path: '/',
      domain: DOMAIN
    });
    // this._storage.remove(this._refreshTokenKey, { path: '/', domain: DOMAIN });
  }
}

export default CookiesTokensProvider;
