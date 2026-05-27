import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber, formatCents, generateShortSlug, getCurrentAffiliate } from "@/lib/creator-utils";
import { Copy, Plus } from "lucide-react";

const CreatorLinks = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [destination, setDestination] = useState("");
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const a = await getCurrentAffiliate();
    if (!a) return setLoading(false);
    setAffiliate(a);
    const { data } = await supabase
      .from("tracking_links")
      .select("*")
      .eq("affiliate_id", a.id)
      .order("created_at", { ascending: false });
    setLinks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!destination) return toast({ title: "Destination URL required", variant: "destructive" });
    setCreating(true);
    const prefix = (affiliate?.vanity_slug || affiliate?.display_name || affiliate?.name || "link")
      .toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12);
    const slug = generateShortSlug(prefix);
    const { error } = await supabase.from("tracking_links").insert({
      affiliate_id: affiliate.id,
      short_slug: slug,
      destination_url: destination,
      label: label || null,
    });
    setCreating(false);
    if (error) return toast({ title: "Failed to create link", description: error.message, variant: "destructive" });
    setDestination(""); setLabel("");
    toast({ title: "Link created" });
    load();
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/a/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied", description: url });
  };

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Tracking links</h1>
        <p className="text-muted-foreground mt-1">Create short, trackable links for any product or page.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a link</CardTitle>
          <CardDescription>Paste any URL on resurrectedlabs.com.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dest">Destination URL</Label>
              <Input id="dest" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://resurrectedlabs.com/products/bpc-157" />
            </div>
            <div>
              <Label htmlFor="label">Label (optional)</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="IG bio link" />
            </div>
          </div>
          <Button onClick={create} disabled={creating}><Plus className="h-4 w-4 mr-2" />Create link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Your links</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-32 w-full" /> : links.length === 0 ? (
            <p className="text-muted-foreground text-sm">No links yet.</p>
          ) : (
            <div className="space-y-2">
              {links.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-border">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">/a/{l.short_slug}</code>
                      {l.label && <Badge variant="outline">{l.label}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">{l.destination_url}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{formatNumber(l.click_count)} clicks</span>
                    <span className="text-muted-foreground">{formatNumber(l.conversion_count)} conv.</span>
                    <span className="tabular-nums">{formatCents(l.revenue_cents)}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyLink(l.short_slug)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </CreatorLayout>
  );
};

export default CreatorLinks;
