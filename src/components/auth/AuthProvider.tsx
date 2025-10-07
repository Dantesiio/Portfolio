"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { fetchProfile, loginUser, registerUser } from "@/lib/api/authClient";
import type { AuthResponse, AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "portfolio_auth_token";

const saveToken = (token: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const loadToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthenticatedUser = useCallback(async (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.token);
    saveToken(authResponse.token);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await loginUser({ email, password });
      await setAuthenticatedUser(auth);
    },
    [setAuthenticatedUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const auth = await registerUser({ name, email, password });
      await setAuthenticatedUser(auth);
    },
    [setAuthenticatedUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    saveToken(null);
  }, []);

  const setUserFromToken = useCallback(
    async (existingToken: string) => {
      const profile = await fetchProfile(existingToken);
      setUser(profile);
      setToken(existingToken);
      saveToken(existingToken);
    },
    []
  );

  useEffect(() => {
    const bootstrap = async () => {
      const existingToken = loadToken();

      if (!existingToken) {
        setLoading(false);
        return;
      }

      try {
        await setUserFromToken(existingToken);
      } catch (error) {
        console.warn("Failed to restore session", error);
        saveToken(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [setUserFromToken]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [loading]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, setUserFromToken }),
    [user, token, loading, login, register, logout, setUserFromToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
