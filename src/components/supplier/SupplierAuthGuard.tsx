import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SupplierAuthGuardProps {
  children: React.ReactNode;
}

export const SupplierAuthGuard = ({ children }: SupplierAuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSupplierAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/access");
          return;
        }

        // Check if user has supplier role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "supplier")
          .single();

        if (!roleData) {
          // Also check if they're an admin (admins can access supplier area)
          const { data: adminRole } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .single();

          if (!adminRole) {
            navigate("/access");
            return;
          }
        }

        // Verify supplier record exists and is active
        const { data: supplierData } = await supabase
          .from("suppliers")
          .select("id, is_active")
          .eq("user_id", user.id)
          .single();

        if (!supplierData?.is_active && !roleData) {
          navigate("/access");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/access");
      } finally {
        setIsLoading(false);
      }
    };

    checkSupplierAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSupplierAccess();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
