"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { config } from "./config";

type User = {
  username: string;
  displayName: string;
  following: {username: string, displayName: string}[]
  followers: {username: string, displayName: string}[]
};

type AuthContextType = {
  user: User | null;
  sessionId: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  sessionId: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to read a cookie from document.cookie
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  // Helper to delete a cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  useEffect(() => {
    const storedSessionId = getCookie("sessionId");
    setSessionId(storedSessionId);

    if (!storedSessionId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch(`${config.api_url}/auth/fetchself`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
        });

        if (!res.ok) {
          // Session invalid — clear sessionId and user
          deleteCookie("sessionId");
          setSessionId(null);
          setUser(null);
          return;
        }

        const data = await res.json();

        setUser({
          username: data.username,
          displayName: data.displayName,
          following: data.following,
          followers: data.followers,
        });
      } catch (err) {
        console.error("Verification failed:", err);
        deleteCookie("sessionId");
        setSessionId(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, sessionId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
