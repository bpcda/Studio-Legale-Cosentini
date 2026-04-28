import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { account, isConfigured } from "@/lib/appwrite";
import type { Models } from "appwrite";

type AppwriteUser = Models.User<Models.Preferences>;

interface AuthContextType {
  user: AppwriteUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    try {
      const u = await account.get();
      // Anonymous sessions have empty email — don't treat them as logged-in admin users
      if (u && u.email) {
        setUser(u as AppwriteUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) return { error: "Appwrite non configurato" };
    try {
      // Drop any existing (e.g. anonymous) session first
      try { await account.deleteSession("current"); } catch { /* no session */ }
      await account.createEmailPasswordSession(email, password);
      const u = await account.get();
      setUser(u as AppwriteUser);
      return { error: null };
    } catch (err: any) {
      return { error: err?.message ?? "Errore di autenticazione" };
    }
  };

  const signOut = async () => {
    if (!isConfigured) return;
    try {
      await account.deleteSession("current");
    } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
