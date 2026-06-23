import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, isRoleLoading } = useAuth();

  useEffect(() => {
    if (authLoading || isRoleLoading) return;
    if (!user || !isAdmin) {
      setIsAuthorized(false);
      setIsLoading(false);
      navigate("/admin/login");
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authLoading, isRoleLoading, isAdmin, navigate, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
