export interface TokensDto {
  token: string;
}

export interface ITokensProvider {
  loadTokens(): TokensDto | undefined;
  saveAccessToken(token?: string): void;
  // saveRefreshToken(token?: string): void;
  saveTokens(tokens: TokensDto): void;
  removeTokens(): void;
}
