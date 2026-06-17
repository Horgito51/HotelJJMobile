import * as SecureStore from 'expo-secure-store';
import { config } from '../../../services/config';
import type { AuthUser } from '../types/auth.types';

export const authStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(config.authTokenKey);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(config.authRefreshKey);
  },

  async getUser(): Promise<AuthUser | null> {
    const raw = await SecureStore.getItemAsync(config.authUserKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  async saveSession(token: string, refreshToken: string, user: AuthUser): Promise<void> {
    await SecureStore.setItemAsync(config.authTokenKey, token);
    await SecureStore.setItemAsync(config.authRefreshKey, refreshToken);
    await SecureStore.setItemAsync(config.authUserKey, JSON.stringify(user));
  },

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(config.authTokenKey);
    await SecureStore.deleteItemAsync(config.authRefreshKey);
    await SecureStore.deleteItemAsync(config.authUserKey);
  },
};
