import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, X, MoreHorizontal, Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SEGMENT_TEMPLATES = [
  { title: "Customers who have purchased at least once", desc: "Cross-sell customers who have placed at least one order.", category: "Engage high-value customers" },
  { title: "Email subscribers", desc: "Customers who have opted in to email marketing.", category: "Target email behavior" },
  { title: "Abandoned checkouts in the last 30 days", desc: "Customers who abandoned their checkouts recently.", category: "Target storefront behaviors" },
  { title: "Customers who have purchased more than once", desc: "Engage with repeat customers.", category: "Engage high-value customers" },
  { title: "Customers who haven't purchased", desc: "Customers who signed up but haven't placed an order.", category: "Re-engage customers" },
  { title: "High spend customers", desc: "Customers who have spent above average.", category: "Engage high-value customers" },
  { title: "Customers in a specific country", desc: "All customers with an address in a specific country.", category: "Target specific location" },
  { title: "First-time customers", desc: "Drive repeat orders after a customer's first order.", category: "Engage first-time customers" },
  { title: "Customers who haven't ordered recently", desc: "Win back customers that haven't ordered recently.", category: "Re-engage customers" },
];

const Segments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");

  const { data: segments = [], isLoading } = useQuery({
    queryKey: ["customer-segments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_segments")
        .select("*")
        .eq("is_template", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createSegment = useMutation({
    mutationFn: async (template: { title: string; desc: string; category: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from("customer_segments").insert({
        name: template.title,
        description: template.desc,
        template_category: template.category,
        created_by: session?.user?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-segments"] });
      toast({ title: "Segment created" });
      setShowTemplates(false);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteSegment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customer_segments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-segments"] });
      toast({ title: "Segment deleted" });
    },
  });

  const filteredSegments = segments.filter((s: any) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = SEGMENT_TEMPLATES.filter((t) =>
    !templateSearch || t.title.toLowerCase().includes(templateSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Segments</h1>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={() => setShowTemplates(true)}>
            Create segment
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search segments" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredSegments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No segments created yet</p>
              <p className="text-sm mt-1">Click "Create segment" to get started</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 w-10"><Checkbox /></th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Name</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium text-right">Customers</th>
                  <th className="py-3 px-4 text-muted-foreground font-medium">Category</th>
                  <th className="py-3 px-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSegments.map((seg: any) => (
                  <tr key={seg.id} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="py-3 px-4"><Checkbox /></td>
                    <td className="py-3 px-4 text-foreground font-medium">{seg.name}</td>
                    <td className="py-3 px-4 text-foreground text-right">{seg.customer_count}</td>
                    <td className="py-3 px-4 text-muted-foreground">{seg.template_category || "Custom"}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteSegment.mutate(seg.id)} className="p-1 hover:bg-red-900/20 rounded text-muted-foreground hover:text-red-400">
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

      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Segment templates
            </DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search templates" value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {filteredTemplates.map((t, i) => (
                <button key={i} onClick={() => createSegment.mutate(t)} className="border border-border rounded-xl p-4 hover:border-primary cursor-pointer transition-colors flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{t.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Segments;
