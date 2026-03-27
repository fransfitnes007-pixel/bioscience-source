import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import { Megaphone, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Campaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({ title: "Campaign deleted" });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Campaigns</h1>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={() => navigate("/admin/marketing/campaigns/new")}>
            Create campaign
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-foreground rounded-full flex items-center justify-center">
                <Megaphone className="h-10 w-10 text-background" />
              </div>
              <h2 className="font-semibold text-foreground text-lg mb-2">Centralize your campaign tracking</h2>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Create campaigns to evaluate how marketing initiatives drive business goals.
              </p>
              <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={() => navigate("/admin/marketing/campaigns/new")}>
                Create campaign
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 text-muted-foreground font-medium">Name</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Sessions</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Sales</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Orders</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Created</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c: any) => (
                  <tr key={c.id} className="border-b border-border hover:bg-secondary transition-colors cursor-pointer" onClick={() => navigate(`/admin/marketing/campaigns/${c.id}`)}>
                    <td className="py-3 px-4 font-medium text-foreground">{c.name}</td>
                    <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 px-4 text-foreground">{c.total_sessions}</td>
                    <td className="py-3 px-4 text-foreground">${Number(c.total_sales).toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground">{c.total_orders}</td>
                    <td className="py-3 px-4 text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => deleteCampaign.mutate(c.id)} className="p-1 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Campaigns;
