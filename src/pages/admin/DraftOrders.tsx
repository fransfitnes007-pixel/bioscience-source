import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FileText, Plus, Trash2 } from "lucide-react";

interface DraftOrder {
  id: string;
  draft_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
}

const DraftOrders = () => {
  const [drafts, setDrafts] = useState<DraftOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { fetchDrafts(); }, []);

  const fetchDrafts = async () => {
    const { data } = await supabase.from("draft_orders").select("*").order("created_at", { ascending: false });
    setDrafts(data || []);
    setIsLoading(false);
  };

  const deleteDraft = async (id: string) => {
    await supabase.from("draft_orders").delete().eq("id", id);
    toast({ title: "Draft deleted" });
    fetchDrafts();
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Drafts</h1>
          </div>
          <Button
            size="sm"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => navigate("/admin/orders/new")}
          >
            Create order
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-secondary flex items-center justify-center">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Manually create orders and invoices</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Use draft orders to take orders over the phone, email invoices to customers, and collect payments.
              </p>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate("/admin/orders/new")}
              >
                Create draft order
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 text-muted-foreground font-medium">Draft</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium text-right">Total</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {drafts.map(draft => (
                  <tr key={draft.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">{draft.draft_number}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {format(new Date(draft.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-foreground">{draft.customer_name || "No customer"}</p>
                      {draft.customer_email && <p className="text-xs text-muted-foreground">{draft.customer_email}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                        {draft.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">${Number(draft.total).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteDraft(draft.id)} className="p-1 rounded hover:bg-accent">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
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

export default DraftOrders;
