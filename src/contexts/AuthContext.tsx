import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: SupabaseUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } catch {
    return fallback;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const safeHasRole = async (userId: string) => {
  const response = await withTimeout(
    supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    }),
    2500,
    null
  );
  return !!response?.data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applyUser = (nextUser: SupabaseUser | null) => {
    setUser(nextUser);
    if (!nextUser) {
      setIsAdmin(false);
      return;
    }

    setIsAdmin(false);
    safeHasRole(nextUser.id).then((hasAdminRole) => setIsAdmin(hasAdminRole));
  };

  const refreshAuth = async () => {
    const { data: { session } } = await withTimeout(
      supabase.auth.getSession(),
      2500,
      { data: { session: null }, error: null }
    );
    applyUser(session?.user || null);
  };

  useEffect(() => {
    let mounted = true;

    withTimeout(
      supabase.auth.getSession(),
      2500,
      { data: { session: null }, error: null }
    ).then(({ data: { session } }) => {
      if (!mounted) return;
      applyUser(session?.user || null);
      if (mounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) setIsAdmin(false);
      if (mounted) setIsLoading(false);
      setTimeout(() => {
        if (mounted) applyUser(session?.user || null);
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin, isLoading, refreshAuth }),
    [user, isAdmin, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};