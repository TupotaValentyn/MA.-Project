import { createContext } from 'react';

export interface AuthContext {
  authenticated: boolean;
  isAdmin: boolean;
  token?: string;
  toLoginRedirect: () => any;
  toLogoutRedirect: () => any;
}

const authContext = createContext<AuthContext>({
  authenticated: false,
  isAdmin: false,
  toLoginRedirect: () => null,
  toLogoutRedirect: () => null
});

export const { Provider: AuthProvider, Consumer: AuthConsumer } = authContext;

export default authContext;
