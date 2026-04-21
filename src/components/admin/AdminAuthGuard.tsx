import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { isLovablePreview } from "@/lib/preview-auth";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isLovablePreview()) {
          setIsAuthorized(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate("/admin/login");
          return;
        }

        // Check if user has admin role using the database function
        const { data: hasAdminRole, error } = await supabase
          .rpc('has_role', { _user_id: session.user.id, _role: 'admin' });

        if (error) {
          console.error("Error checking admin role:", error);
          navigate("/admin/login");
          return;
        }

        if (!hasAdminRole) {
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isLovablePreview()) {
        setIsAuthorized(true);
        return;
      }

      if (event === "SIGNED_OUT" || !session) {
        navigate("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
