import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: SupabaseUser | null;
  isAdmin: boolean;
  isB2B: boolean;
  isLoading: boolean;
  isRoleLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


const ROLE_CHECK_TIMEOUT_MS = 10000;

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

const safeFetchRoles = async (userId: string) => {
  const response = await withTimeout(
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId),
    ROLE_CHECK_TIMEOUT_MS,
    null
  );

  if (!response) {
    throw new Error("Role check timed out");
  }

  if (response.error) {
    throw response.error;
  }

  const rows = (response?.data ?? []) as Array<{ role: string }>;
  return {
    isAdmin: rows.some((r) => r.role === "admin"),
    isB2B: rows.some((r) => r.role === "b2b"),
  };
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isB2B, setIsB2B] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const roleRequestRef = useRef(0);

  const applyUser = async (nextUser: SupabaseUser | null) => {
    const requestId = ++roleRequestRef.current;
    setUser(nextUser);
    if (!nextUser) {
      setIsAdmin(false);
      setIsB2B(false);
      setIsRoleLoading(false);
      return;
    }

    setIsAdmin(false);
    setIsB2B(false);
    setIsRoleLoading(true);
    try {
      const roles = await safeFetchRoles(nextUser.id);
      if (roleRequestRef.current !== requestId) return;
      setIsAdmin(roles.isAdmin);
      setIsB2B(roles.isB2B);
    } catch (error) {
      if (roleRequestRef.current !== requestId) return;
      console.warn("Role lookup failed", error);
      setIsAdmin(false);
      setIsB2B(false);
    } finally {
      if (roleRequestRef.current !== requestId) return;
      setIsRoleLoading(false);
    }
  };

  const refreshAuth = async () => {
    const { data: { session } } = await withTimeout(
      supabase.auth.getSession(),
      8000,
      { data: { session: null }, error: null }
    );
    await applyUser(session?.user || null);
  };

  useEffect(() => {
    let mounted = true;

    withTimeout(
      supabase.auth.getSession(),
      8000,
      { data: { session: null }, error: null }
    ).then(({ data: { session } }) => {
      if (!mounted) return;
      void applyUser(session?.user || null).finally(() => {
        if (mounted) setIsLoading(false);
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsLoading(false);
      if (mounted) void applyUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin, isB2B, isLoading, isRoleLoading, refreshAuth }),
    [user, isAdmin, isB2B, isLoading, isRoleLoading]
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