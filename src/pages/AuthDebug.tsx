import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-border/40 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-mono text-right break-all">{value}</span>
  </div>
);

const AuthDebug = () => {
  const { user, isAdmin, isB2B, isLoading, isRoleLoading, refreshAuth } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | null>(null);

  const loadRoles = async () => {
    setRolesError(null);
    if (!user) {
      setRoles([]);
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    if (error) {
      setRolesError(error.message);
      return;
    }
    setRoles((data ?? []).map((r: { role: string }) => r.role));
  };

  useEffect(() => {
    void loadRoles();
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionExpiresAt(
        session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null
      );
    });
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Auth Debug
            {isLoading || isRoleLoading ? (
              <Badge variant="outline">loading…</Badge>
            ) : (
              <Badge variant="secondary">ready</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row label="isLoading" value={String(isLoading)} />
          <Row label="isRoleLoading" value={String(isRoleLoading)} />
          <Row label="Signed in" value={user ? "yes" : "no"} />
          <Row label="User ID" value={user?.id ?? "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
          <Row label="isAdmin" value={<Badge variant={isAdmin ? "default" : "outline"}>{String(isAdmin)}</Badge>} />
          <Row label="isB2B" value={<Badge variant={isB2B ? "default" : "outline"}>{String(isB2B)}</Badge>} />
          <Row label="Roles (live query)" value={roles.length ? roles.join(", ") : "—"} />
          <Row label="Roles error" value={rolesError ?? "—"} />
          <Row label="Session expires" value={sessionExpiresAt ?? "—"} />

          <div className="flex gap-2 mt-6 flex-wrap">
            <Button size="sm" onClick={() => refreshAuth()}>Refresh auth</Button>
            <Button size="sm" variant="outline" onClick={() => loadRoles()}>Re-query roles</Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.reload();
              }}
            >
              Sign out
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a href="/account">Go to /account</a>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a href="/admin">Go to /admin</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebug;
