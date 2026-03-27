import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/admin/StatusBadge";
import { Gift, Search, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const GiftCards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: giftCards = [], isLoading } = useQuery({
    queryKey: ["gift-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_cards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteCard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gift_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift-cards"] });
      toast({ title: "Gift card deleted" });
    },
  });

  const filtered = giftCards.filter((gc: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return gc.code.toLowerCase().includes(q) || gc.customer_name?.toLowerCase().includes(q) || gc.customer_email?.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </AdminLayout>
    );
  }

  if (giftCards.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-foreground" />
              <h1 className="text-xl font-semibold text-foreground">Gift cards</h1>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <div className="mx-auto mb-6 w-32 h-32 bg-foreground rounded-full flex items-center justify-center">
              <Gift className="h-16 w-16 text-background" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Start selling gift cards</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Add gift card products to sell or create gift cards and send them directly to your customers.
            </p>
            <Button onClick={() => navigate("/admin/gift-cards/new")} className="bg-foreground text-background hover:bg-foreground/90">
              Create gift card
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Gift cards</h1>
          </div>
          <Button onClick={() => navigate("/admin/gift-cards/new")} className="bg-foreground text-background hover:bg-foreground/90">
            Create gift card
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search gift cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 w-10"><Checkbox /></th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Code</th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Customer</th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Initial value</th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Balance</th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="py-3 px-4 text-muted-foreground font-medium">Created</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((gc: any) => (
                <tr key={gc.id} className="border-b border-border hover:bg-secondary transition-colors">
                  <td className="py-3 px-4"><Checkbox /></td>
                  <td className="py-3 px-4 font-mono text-foreground">{gc.code}</td>
                  <td className="py-3 px-4 text-foreground">{gc.customer_name || gc.customer_email || "—"}</td>
                  <td className="py-3 px-4 text-foreground">${Number(gc.initial_value).toFixed(2)}</td>
                  <td className="py-3 px-4 text-foreground">${Number(gc.current_balance).toFixed(2)}</td>
                  <td className="py-3 px-4"><StatusBadge status={gc.status} /></td>
                  <td className="py-3 px-4 text-muted-foreground">{format(new Date(gc.created_at), "MMM d, yyyy")}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => deleteCard.mutate(gc.id)} className="p-1 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GiftCards;
