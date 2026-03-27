import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Megaphone, Plus, QrCode, Settings } from "lucide-react";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignName, setCampaignName] = useState("");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [description, setDescription] = useState("");

  const campaignId = useState(() => crypto.randomUUID().slice(0, 6))[0];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("campaigns").insert({
        name: campaignName,
        utm_campaign: campaignId,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        description: description || null,
        created_by: session?.user?.id || null,
        status: "draft",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Campaign created" });
      navigate("/admin/marketing/campaigns");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const emptyCharts = [
    ["Sessions by channel", "Sales by channel"],
    ["Sessions by UTM parameters", "Sales by UTM parameters"],
    ["Orders from new vs. returning customers", "Sales by order"],
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="bg-[#1a1a1a] text-white rounded-xl px-4 py-2 flex items-center justify-between -mx-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            Unsaved changes
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent border-[#555] text-white hover:bg-accent" onClick={() => navigate("/admin/marketing/campaigns")}>Discard</Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90" onClick={() => saveMutation.mutate()} disabled={!campaignName || saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => navigate("/admin/marketing/campaigns")} className="hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /><Megaphone className="h-4 w-4" />
          </button>
          <span>›</span>
          <span className="text-foreground font-semibold">Create campaign</span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">Draft</span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex divide-x divide-border">
                {["Sessions", "Sales", "Orders", "Average order value"].map((label) => (
                  <div key={label} className="flex-1 px-4 py-3">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-1">No data yet</p>
                  </div>
                ))}
              </div>
            </div>
            {emptyCharts.map((pair, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                {pair.map((title) => (
                  <div key={title} className="bg-card rounded-xl border border-border p-5 min-h-[200px] flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">{title}</p>
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">No data yet</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <input type="text" placeholder="Campaign name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div>
                <p className="text-xs text-muted-foreground">UTM Campaign ID</p>
                <p className="text-sm text-foreground font-mono">{campaignId}</p>
              </div>
              <input type="text" placeholder="UTM Source (e.g. tiktok)" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" placeholder="UTM Medium (e.g. social)" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Shareable links</h2>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <QrCode className="h-8 w-8 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-mono">/s/{campaignId}</p>
                  <p className="text-xs text-muted-foreground">/?utm_campaign={campaignId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCampaign;
