import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ClientAuthGuardProps {
  children: React.ReactNode;
}

const ClientAuthGuard = ({ children }: ClientAuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, isB2B, isLoading: authLoading, isRoleLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAuthorized(false);
      setIsLoading(false);
      navigate("/account?redirect=/portal");
      return;
    }

    // Wait for roles before deciding
    if (isRoleLoading) return;

    if (!isB2B && !isAdmin) {
      // Retail (B2C) accounts don't have a portal — send them back to the normal site
      setIsAuthorized(false);
      setIsLoading(false);
      navigate("/", { replace: true });
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authLoading, isRoleLoading, isB2B, isAdmin, navigate, user]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ClientAuthGuard;