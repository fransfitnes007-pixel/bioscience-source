import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import { ShoppingCart, Loader2 } from "lucide-react";
import { format } from "date-fns";

const AbandonedCheckouts = () => {
  const { data: checkouts = [], isLoading } = useQuery({
    queryKey: ["abandoned-checkouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("abandoned_checkouts")
        .select("*")
        .eq("recovered", false)
        .order("abandoned_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Abandoned checkouts</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : checkouts.length === 0 ? (
          <>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-8">
                <div className="max-w-lg">
                  <h2 className="text-lg font-semibold text-foreground mb-2">Abandoned checkouts will show here</h2>
                  <p className="text-sm text-muted-foreground">
                    See when customers put an item in their cart but don't check out. You can also email customers a link to their cart.
                  </p>
                </div>
                <div className="w-32 h-32 rounded-full bg-foreground flex items-center justify-center shrink-0 ml-8">
                  <ShoppingCart className="h-14 w-14 text-background" />
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-2">Recover sales with your abandoned checkout email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                An automated email is already created for you. Take a moment to review the email and make any additional adjustments.
              </p>
              <Button variant="outline" className="bg-card border-border text-foreground hover:bg-secondary">Review email</Button>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Email</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Items</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Subtotal</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Recovery sent</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Abandoned</th>
                </tr>
              </thead>
              <tbody>
                {checkouts.map((c: any) => {
                  const items = Array.isArray(c.cart_items) ? c.cart_items : [];
                  return (
                    <tr key={c.id} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="py-3 px-4 text-foreground">{c.customer_name || "Guest"}</td>
                      <td className="py-3 px-4 text-foreground">{c.email || "—"}</td>
                      <td className="py-3 px-4 text-foreground">{items.length} items</td>
                      <td className="py-3 px-4 text-foreground">${Number(c.subtotal).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={c.recovery_email_sent ? "sent" : "pending"} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{format(new Date(c.abandoned_at), "MMM d, yyyy h:mm a")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AbandonedCheckouts;
