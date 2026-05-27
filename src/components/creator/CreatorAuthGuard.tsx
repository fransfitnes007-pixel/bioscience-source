import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
}

const CreatorAuthGuard = ({ children }: Props) => {
  const [state, setState] = useState<"loading" | "ok" | "no_auth" | "no_affiliate">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return setState("no_auth");

      const { data: aff } = await supabase
        .from("affiliates")
        .select("id, status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!aff) return setState("no_affiliate");
      setState("ok");
    };
    check();
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-16 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (state === "no_auth") return <Navigate to="/account?redirect=/creator/dashboard" replace />;
  if (state === "no_affiliate") return <Navigate to="/affiliate" replace />;

  return <>{children}</>;
};

export default CreatorAuthGuard;
