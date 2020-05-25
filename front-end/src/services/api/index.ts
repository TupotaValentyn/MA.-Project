import ApiClientBuilder from './apiClientBuilder';
import CookiesTokensProvider from './CookiesTokensProveder';

export const tokensProvider = new CookiesTokensProvider();
export const apiClient = new ApiClientBuilder(tokensProvider).client;
