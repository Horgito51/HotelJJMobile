import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMutation } from '@apollo/client/react';
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REFRESH_TOKEN_MUTATION,
  REGISTER_CLIENT_MUTATION,
} from '../../features/auth/graphql/mutations';
import { authStorage } from '../../features/auth/services/authStorage';
import type {
  AuthPayloadResult,
  AuthUser,
  LoginFormValues,
  RegisterFormValues,
} from '../../features/auth/types/auth.types';
import { apolloClient } from '../../services/apolloClient';
import { parseGraphQLError } from '../../shared/utils/graphqlError';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (values: LoginFormValues) => Promise<{ success: boolean; message?: string }>;
  register: (values: RegisterFormValues) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAuthMessage(result: AuthPayloadResult | undefined, fallback: string) {
  if (!result) {
    return fallback;
  }
  return parseGraphQLError({
    graphQLErrors: [
      {
        message: result.errors?.[0]?.message ?? result.message ?? fallback,
      },
    ],
  }).message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginMutation] = useMutation<{ login: AuthPayloadResult }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ registerClient: AuthPayloadResult }>(
    REGISTER_CLIENT_MUTATION,
  );
  const [logoutMutation] = useMutation<{ logout: { success: boolean } }>(LOGOUT_MUTATION);
  const [refreshTokenMutation] = useMutation<{ refreshToken: AuthPayloadResult }>(
    REFRESH_TOKEN_MUTATION,
  );

  const persistAuth = useCallback(async (payload: {
    token?: string | null;
    refreshToken?: string | null;
    user?: AuthUser | null;
  }) => {
    if (!payload.token || !payload.refreshToken || !payload.user) {
      throw new Error('No pudimos iniciar la sesion. Intentalo nuevamente.');
    }
    await authStorage.saveSession(payload.token, payload.refreshToken, payload.user);
    setUser(payload.user);
  }, []);

  const clearLocalSession = useCallback(async () => {
    await authStorage.clearSession();
    setUser(null);
    await apolloClient.clearStore();
  }, []);

  const refreshSession = useCallback(async () => {
    const storedUser = await authStorage.getUser();
    const refreshToken = await authStorage.getRefreshToken();

    if (!storedUser || !refreshToken) {
      await clearLocalSession();
      return;
    }

    try {
      const { data } = await refreshTokenMutation({
        variables: { input: { refreshToken } },
        context: { skipAuth: true },
      });
      const result = data?.refreshToken;

      if (!result?.success) {
        await clearLocalSession();
        return;
      }

      await persistAuth(result);
    } catch {
      await clearLocalSession();
    }
  }, [clearLocalSession, persistAuth, refreshTokenMutation]);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const login = useCallback(
    async (values: LoginFormValues) => {
      const { data } = await loginMutation({
        variables: { input: values },
      });
      const result = data?.login;
      if (!result?.success) {
        return {
          success: false,
          message: getAuthMessage(result, 'Credenciales invalidas.'),
        };
      }
      await persistAuth(result);
      return { success: true };
    },
    [loginMutation, persistAuth],
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      const { data } = await registerMutation({
        variables: { input: values },
      });
      const result = data?.registerClient;
      if (!result?.success) {
        return {
          success: false,
          message: getAuthMessage(result, 'No se pudo registrar.'),
        };
      }
      await persistAuth(result);
      return { success: true };
    },
    [persistAuth, registerMutation],
  );

  const logout = useCallback(async () => {
    const refreshToken = await authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await logoutMutation({ variables: { input: { refreshToken } } });
      } catch {
        // Ignore logout downstream errors locally.
      }
    }
    await authStorage.clearSession();
    setUser(null);
    await apolloClient.clearStore();
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, loading, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}
