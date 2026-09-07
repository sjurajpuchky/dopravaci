"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const result = await api.auth.me();
      setUser(result.user || null);
      return result.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const login = async (email, password) => {
    const result = await api.auth.login(email, password);
    setUser(result.user);
    return result.user;
  };

  const logout = async (shouldRedirect = true) => {
    await api.auth.logout().catch(() => {});
    setUser(null);
    if (shouldRedirect) router.push("/login");
    else router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        authChecked: !isLoadingAuth,
        login,
        logout,
        checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth musí být použit uvnitř AuthProvider");
  return context;
}
