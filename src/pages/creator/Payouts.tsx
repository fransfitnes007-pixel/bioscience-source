import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCents, getCurrentAffiliate } from "@/lib/creator-utils";

const methodLabels: Record<string, string> = {
  stripe_connect: "Stripe Connect (instant)",
  crypto_usdc_base: "USDC on Base",
  crypto_usdc_polygon: "USDC on Polygon",
  crypto_usdc_ethereum: "USDC on Ethereum",
  ach_plaid: "ACH (Plaid)",
  ach_mercury: "ACH (Mercury)",
  paypal: "PayPal",
};

const CreatorPayouts = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [newMethod, setNewMethod] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const load = async () => {
    const a = await getCurrentAffiliate();
    if (!a) return setLoading(false);
    setAffiliate(a);
    const [{ data: m }, { data: p }] = await Promise.all([
      supabase.from("payout_methods").select("*").eq("affiliate_id", a.id),
      supabase.from("affiliate_payouts").select("*").eq("affiliate_id", a.id).order("created_at", { ascending: false }),
    ]);
    setMethods(m || []);
    setPayouts(p || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addMethod = async () => {
    if (!newMethod || !newDetail) return toast({ title: "Pick a method and enter details", variant: "destructive" });
    const payload: any = {
      affiliate_id: affiliate.id,
      method: newMethod,
      is_default: methods.length === 0,
      display_label: `${methodLabels[newMethod]} — ${newDetail.slice(0, 12)}…`,
    };
    if (newMethod.startsWith("crypto_")) {
      payload.crypto_address = newDetail;
      payload.crypto_network = newMethod.replace("crypto_usdc_", "");
    } else if (newMethod === "paypal") {
      payload.paypal_email = newDetail;
    } else {
      payload.metadata = { raw: newDetail };
    }
    const { error } = await supabase.from("payout_methods").insert(payload);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewMethod(""); setNewDetail("");
    toast({ title: "Payout method added" });
    load();
  };

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Payouts</h1>
        <p className="text-muted-foreground mt-1">Configure how you get paid and review past transfers.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add payout method</CardTitle>
          <CardDescription>Stripe Connect for instant, USDC for crypto, or PayPal.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-[200px_1fr_auto] gap-3 items-end">
          <div>
            <Label>Method</Label>
            <Select value={newMethod} onValueChange={setNewMethod}>
              <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
              <SelectContent>
                {Object.entries(methodLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Details</Label>
            <Input value={newDetail} onChange={(e) => setNewDetail(e.target.value)} placeholder="Wallet address / email / account…" />
          </div>
          <Button onClick={addMethod}>Add</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Your methods</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-24 w-full" /> : methods.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payout methods configured.</p>
          ) : (
            <div className="space-y-2">
              {methods.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">{m.display_label}</p>
                    <p className="text-xs text-muted-foreground">{methodLabels[m.method]}</p>
                  </div>
                  <div className="flex gap-2">
                    {m.is_default && <Badge>Default</Badge>}
                    {m.is_verified ? <Badge variant="outline">Verified</Badge> : <Badge variant="secondary">Pending verification</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payout history</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-24 w-full" /> : payouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No payouts yet. Minimum payout threshold: {formatCents(affiliate?.payout_threshold_cents || 5000)}.</p>
          ) : (
            <div className="space-y-2">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium tabular-nums">{formatCents(p.net_amount_cents)}</p>
                    <p className="text-xs text-muted-foreground">{methodLabels[p.method]} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={p.status === "paid" ? "default" : p.status === "failed" ? "destructive" : "secondary"}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </CreatorLayout>
  );
};

export default CreatorPayouts;
