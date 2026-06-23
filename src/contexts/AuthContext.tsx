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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applyUser = async (nextUser: SupabaseUser | null) => {
    setUser(nextUser);
    if (!nextUser) {
      setIsAdmin(false);
      return;
    }

    const { data } = await supabase.rpc("has_role", {
      _user_id: nextUser.id,
      _role: "admin",
    });
    setIsAdmin(!!data);
  };

  const refreshAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await applyUser(session?.user || null);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      await applyUser(session?.user || null);
      if (mounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user || null).finally(() => {
        if (mounted) setIsLoading(false);
      });
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