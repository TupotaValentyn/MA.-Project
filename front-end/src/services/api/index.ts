import apiClientBuilder from './apiClientBuilder';
import CookiesTokensProvider from './CookiesTokensProveder';

export const tokensProvider = new CookiesTokensProvider();
export const apiClient = new apiClientBuilder(tokensProvider).client;
