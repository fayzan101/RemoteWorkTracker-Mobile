import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken, onSessionExpired } from '../services/api/client';
import * as authService from '../services/auth/auth.service';
import * as usersApi from '../services/api/users.api';
import { registerPushToken, unregisterPushToken } from '../services/notifications/push.registration';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

async function persistUser(user) {
  if (user) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearLocalSession = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await usersApi.getProfile();
    setUser(profile);
    await persistUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    return onSessionExpired(() => {
      clearLocalSession();
    });
  }, [clearLocalSession]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([
          getAccessToken(),
          authService.loadStoredUser(),
        ]);
        if (!mounted) return;
        if (token && storedUser) {
          setUser(storedUser);
          try {
            const profile = await usersApi.getProfile();
            if (!mounted) return;
            setUser(profile);
            await persistUser(profile);
          } catch (e) {
            if (e?.status === 401 || /session expired/i.test(e?.message || '')) {
              await clearLocalSession();
              return;
            }
            // Keep cached user when profile is temporarily unavailable.
          }
          registerPushToken();
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [clearLocalSession]);

  const signIn = useCallback(async (email, password) => {
    const result = await authService.signIn(email, password);
    const userObj = result?.user || null;
    setUser(userObj);
    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
      await persistUser(profile);
    } catch {
      if (userObj) await persistUser(userObj);
    }
    registerPushToken();
    return result;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await unregisterPushToken();
    } catch {
      // Best-effort.
    }
    try {
      await usersApi.logoutWithStoredRefresh();
    } catch {
      // Best-effort server revoke; always clear local session.
    }
    await clearLocalSession();
  }, [clearLocalSession]);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signIn,
      signOut,
      refreshProfile,
      isSignedIn: Boolean(user),
    }),
    [user, initializing, signIn, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
