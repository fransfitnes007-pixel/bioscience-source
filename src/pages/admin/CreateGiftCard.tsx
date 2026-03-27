import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Gift, Search, Pencil } from "lucide-react";

const CreateGiftCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code] = useState(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  });
  const [value, setValue] = useState("10.00");
  const [customerSearch, setCustomerSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("gift_cards").insert({
        code,
        initial_value: parseFloat(value),
        current_balance: parseFloat(value),
        customer_email: customerSearch || null,
        notes: notes || null,
        created_by: session?.user?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Gift card created" });
      navigate("/admin/gift-cards");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate("/admin/gift-cards")} className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <Gift className="h-4 w-4" />
          </button>
          <span>›</span>
          <span className="text-foreground font-semibold">Create gift card</span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="bg-card rounded-xl border border-border p-5 space-y-5">
              <h2 className="font-semibold text-foreground">Gift card details</h2>
              <div>
                <label className="block text-sm text-foreground font-medium mb-1">Gift card code</label>
                <input type="text" value={code} readOnly className="w-full h-10 px-3 rounded-lg border border-border bg-secondary text-sm text-foreground font-mono" />
              </div>
              <div>
                <label className="block text-sm text-foreground font-medium mb-1">Initial value</label>
                <div className="relative w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} step="0.01" className="w-full h-10 pl-7 pr-3 rounded-lg border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📅</span><span>Doesn't expire</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h2 className="font-semibold text-foreground">Customer</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Customer email" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} className="w-full h-10 pl-8 pr-3 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Notes</h2>
                <button onClick={() => setIsEditingNotes(!isEditingNotes)}><Pencil className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              {isEditingNotes ? (
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." rows={3} className="w-full rounded-lg border border-border bg-card text-sm text-foreground p-2 focus:outline-none focus:ring-2 focus:ring-ring" />
              ) : (
                <p className="text-sm text-muted-foreground">{notes || "No notes"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !value} className="bg-foreground text-background hover:bg-foreground/90">
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateGiftCard;
