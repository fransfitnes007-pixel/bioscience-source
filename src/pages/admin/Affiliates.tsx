import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  DollarSign,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Check,
  X,
  Eye,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const commissionTiers = [
  { value: "10", label: "10% Commission" },
  { value: "15", label: "15% Commission" },
  { value: "20", label: "20% Commission" },
  { value: "25", label: "25% Commission" },
  { value: "30", label: "30% Commission" },
];

const tierColor = (rate: number) => {
  if (rate >= 25) return "bg-purple-900/30 text-purple-400";
  if (rate >= 20) return "bg-green-900/30 text-green-400";
  if (rate >= 15) return "bg-blue-900/30 text-blue-400";
  return "bg-secondary text-muted-foreground";
};

const Affiliates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [viewing, setViewing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [approveRate, setApproveRate] = useState("15");
  const [approveCode, setApproveCode] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    sport: "",
    commission_rate: "10",
    code: "",
    notes: "",
  });

  const { data: affiliates, isLoading } = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const pending = affiliates?.filter((a: any) => a.status === "pending") || [];
  const active = affiliates?.filter((a: any) => a.status !== "pending") || [];

  const createAffiliate = useMutation({
    mutationFn: async () => {
      const code = form.code.toUpperCase() || form.name.toUpperCase().replace(/\s+/g, "").slice(0, 10);
      const { data: affiliate, error: affErr } = await supabase
        .from("affiliates")
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          instagram: form.instagram || null,
          tiktok: form.tiktok || null,
          youtube: form.youtube || null,
          sport: form.sport || null,
          commission_rate: parseFloat(form.commission_rate),
          discount_code: code,
          notes: form.notes || null,
          status: "approved",
          is_active: true,
        })
        .select()
        .single();
      if (affErr) throw affErr;

      const { error: discErr } = await supabase.from("discounts").insert({
        code,
        description: `${form.name}'s affiliate code - 10% off`,
        discount_type: "percentage",
        discount_value: 10,
        applies_to: "order",
        method: "code",
        is_affiliate: true,
        affiliate_id: affiliate.id,
      });
      if (discErr) throw discErr;
      return affiliate;
    },
    onSuccess: () => {
      toast({ title: "Affiliate created" });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      setShowCreate(false);
      setForm({ name: "", email: "", phone: "", instagram: "", tiktok: "", youtube: "", sport: "", commission_rate: "10", code: "", notes: "" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const approveApplication = useMutation({
    mutationFn: async ({ id, rate, code, name }: { id: string; rate: number; code: string; name: string }) => {
      const finalCode = (code || name).toUpperCase().replace(/\s+/g, "").slice(0, 12);
      const { error: updErr } = await supabase
        .from("affiliates")
        .update({
          status: "approved",
          is_active: true,
          commission_rate: rate,
          discount_code: finalCode,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (updErr) throw updErr;

      const { error: discErr } = await supabase.from("discounts").insert({
        code: finalCode,
        description: `${name}'s affiliate code - 10% off`,
        discount_type: "percentage",
        discount_value: 10,
        applies_to: "order",
        method: "code",
        is_affiliate: true,
        affiliate_id: id,
      });
      if (discErr) throw discErr;

      // Send approval email (non-blocking)
      const { data: aff } = await supabase
        .from("affiliates")
        .select("email, name, display_name")
        .eq("id", id)
        .maybeSingle();
      if (aff?.email) {
        supabase.functions.invoke("affiliate-notify", {
          body: {
            type: "application_approved",
            affiliate_id: id,
            email: aff.email,
            display_name: aff.display_name ?? aff.name,
            data: { code: finalCode },
          },
        }).catch((err) => console.warn("notify failed", err));
      }
    },
    onSuccess: () => {
      toast({ title: "Affiliate approved", description: "They've been added to your active roster." });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      setViewing(null);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const rejectApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("affiliates")
        .update({ status: "rejected", is_active: false, reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Application rejected" });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      setViewing(null);
    },
  });

  const filtered = active.filter(
    (a: any) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.discount_code && a.discount_code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/discounts")} className="p-1 hover:bg-secondary rounded">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <Users className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Affiliates & Creators</h1>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Pending Apps", value: pending.length, icon: Eye },
            { label: "Active", value: active.filter((a: any) => a.is_active).length, icon: Users },
            { label: "Total Earnings", value: `$${affiliates?.reduce((s: number, a: any) => s + Number(a.total_earnings || 0), 0).toFixed(2) || "0.00"}`, icon: DollarSign },
            { label: "Total Orders", value: affiliates?.reduce((s: number, a: any) => s + (a.total_orders || 0), 0) || 0, icon: ShoppingCart },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <stat.icon className="h-4 w-4" />
                {stat.label}
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Applications {pending.length > 0 && <span className="ml-2 bg-foreground text-background text-xs rounded-full px-2 py-0.5">{pending.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="active">Active Affiliates</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : pending.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">No pending applications</h3>
                  <p className="text-sm text-muted-foreground mt-1">New affiliate applications appear here for review.</p>
                  <p className="text-xs text-muted-foreground mt-3">Public form: <code className="bg-secondary px-2 py-1 rounded">/affiliate-apply</code></p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">Niche</th>
                      <th className="px-4 py-3">Audience</th>
                      <th className="px-4 py-3">Socials</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((a: any) => (
                      <tr key={a.id} className="border-b border-border hover:bg-secondary">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-foreground">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.email}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{a.content_niche || "—"}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{a.audience_size || "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {[a.instagram && "IG", a.tiktok && "TT", a.youtube && "YT"].filter(Boolean).join(" · ") || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => { setViewing(a); setApproveRate("15"); setApproveCode(a.name.toUpperCase().replace(/\s+/g, "").slice(0, 10)); }}>
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <Input placeholder="Search affiliates..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm border-border bg-secondary h-9 text-sm" />
                <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm" onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Manually
                </Button>
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">No active affiliates</h3>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                      <th className="px-4 py-3">Affiliate</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Commission</th>
                      <th className="px-4 py-3">Orders</th>
                      <th className="px-4 py-3">Earnings</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a: any) => (
                      <tr key={a.id} className="border-b border-border hover:bg-secondary cursor-pointer" onClick={() => setViewing(a)}>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-foreground">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.email}</div>
                        </td>
                        <td className="px-4 py-3"><code className="text-sm bg-secondary px-2 py-1 rounded font-mono">{a.discount_code}</code></td>
                        <td className="px-4 py-3"><Badge className={tierColor(Number(a.commission_rate))}>{a.commission_rate}%</Badge></td>
                        <td className="px-4 py-3 text-sm text-foreground">{a.total_orders}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">${Number(a.total_earnings || 0).toFixed(2)}</td>
                        <td className="px-4 py-3"><Badge className={a.is_active ? "bg-green-900/30 text-green-400" : "bg-muted text-muted-foreground"}>{a.is_active ? "Active" : "Inactive"}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail / approval dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewing?.status === "pending" ? "Review Application" : "Affiliate Details"} — {viewing?.name}
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-6 mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div><div>{viewing.email}</div></div>
                <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone</div><div>{viewing.phone || "—"}</div></div>
                <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Niche</div><div>{viewing.content_niche || "—"}</div></div>
                <div><div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Audience size</div><div>{viewing.audience_size || "—"}</div></div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Social handles</div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {viewing.instagram && <a href={`https://instagram.com/${viewing.instagram.replace("@","")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/70"><Instagram className="w-3 h-3" /> {viewing.instagram} <ExternalLink className="w-3 h-3" /></a>}
                  {viewing.tiktok && <a href={`https://tiktok.com/@${viewing.tiktok.replace("@","")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/70">TikTok {viewing.tiktok} <ExternalLink className="w-3 h-3" /></a>}
                  {viewing.youtube && <a href={viewing.youtube.startsWith("http") ? viewing.youtube : `https://youtube.com/${viewing.youtube}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/70"><Youtube className="w-3 h-3" /> {viewing.youtube} <ExternalLink className="w-3 h-3" /></a>}
                  {!viewing.instagram && !viewing.tiktok && !viewing.youtube && <span className="text-muted-foreground text-xs">No socials provided</span>}
                </div>
              </div>

              {viewing.viral_video_links && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Viral content links</div>
                  <Textarea readOnly value={viewing.viral_video_links} rows={3} className="text-xs" />
                </div>
              )}

              {viewing.portfolio_url && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Portfolio</div>
                  <a href={viewing.portfolio_url} target="_blank" rel="noreferrer" className="text-sm text-foreground underline inline-flex items-center gap-1">{viewing.portfolio_url} <ExternalLink className="w-3 h-3" /></a>
                </div>
              )}

              {viewing.why_join && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Why they want to join</div>
                  <p className="text-sm leading-relaxed bg-secondary/50 p-4 rounded-lg">{viewing.why_join}</p>
                </div>
              )}

              {viewing.status === "pending" ? (
                <div className="border-t border-border pt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs uppercase tracking-wider">Set commission rate</Label>
                      <Select value={approveRate} onValueChange={setApproveRate}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>{commissionTiers.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-wider">Discount code</Label>
                      <Input value={approveCode} onChange={(e) => setApproveCode(e.target.value.toUpperCase())} className="mt-1.5 font-mono" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => rejectApplication.mutate(viewing.id)} disabled={rejectApplication.isPending}>
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                    <Button
                      className="bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => approveApplication.mutate({ id: viewing.id, rate: parseFloat(approveRate), code: approveCode, name: viewing.name })}
                      disabled={approveApplication.isPending}
                    >
                      <Check className="w-4 h-4 mr-1.5" /> {approveApplication.isPending ? "Approving…" : "Approve & Issue Code"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border pt-4 grid grid-cols-3 gap-4 text-sm">
                  <div><div className="text-xs uppercase text-muted-foreground">Code</div><code className="bg-secondary px-2 py-1 rounded">{viewing.discount_code}</code></div>
                  <div><div className="text-xs uppercase text-muted-foreground">Commission</div><Badge className={tierColor(Number(viewing.commission_rate))}>{viewing.commission_rate}%</Badge></div>
                  <div><div className="text-xs uppercase text-muted-foreground">Earnings</div>${Number(viewing.total_earnings || 0).toFixed(2)}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual create */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Affiliate Manually</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-sm">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label className="text-sm">Email *</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-sm">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label className="text-sm">Niche</Label><Input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-sm">Instagram</Label><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></div>
              <div><Label className="text-sm">TikTok</Label><Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} /></div>
              <div><Label className="text-sm">YouTube</Label><Input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Commission *</Label>
                <Select value={form.commission_rate} onValueChange={(v) => setForm({ ...form, commission_rate: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{commissionTiers.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-sm">Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Auto" /></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-foreground text-background hover:bg-foreground/90" onClick={() => createAffiliate.mutate()} disabled={!form.name || !form.email || createAffiliate.isPending}>
                {createAffiliate.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Affiliates;
