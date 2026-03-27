import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Users,
  Plus,
  DollarSign,
  ShoppingCart,
  Percent,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const commissionTiers = [
  { value: "10", label: "10% Commission", color: "bg-gray-100 text-gray-700" },
  { value: "15", label: "15% Commission", color: "bg-blue-900/30 text-blue-400" },
  { value: "20", label: "20% Commission", color: "bg-green-900/30 text-green-400" },
  { value: "25", label: "25% Commission", color: "bg-orange-900/30 text-orange-400" },
  { value: "30", label: "30% Commission", color: "bg-purple-900/30 text-purple-400" },
];

const Affiliates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

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

  const createAffiliate = useMutation({
    mutationFn: async () => {
      const code = form.code.toUpperCase() || form.name.toUpperCase().replace(/\s+/g, "").slice(0, 10);

      // Create affiliate
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
        })
        .select()
        .single();
      if (affErr) throw affErr;

      // Create discount code for the affiliate (10% off for customers)
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
      toast({ title: "Affiliate created", description: "Athlete and their discount code have been set up." });
      queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-discounts"] });
      setShowCreate(false);
      setForm({ name: "", email: "", phone: "", instagram: "", tiktok: "", youtube: "", sport: "", commission_rate: "10", code: "", notes: "" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filtered = affiliates?.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.discount_code && a.discount_code.toLowerCase().includes(search.toLowerCase()))
  );

  const getTierColor = (rate: number) =>
    commissionTiers.find((t) => t.value === String(rate))?.color || "bg-gray-100 text-gray-700";

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/discounts")} className="p-1 hover:bg-secondary rounded">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <Users className="h-5 w-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">Athletes & Affiliates</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Affiliates", value: affiliates?.length || 0, icon: Users },
            { label: "Active", value: affiliates?.filter((a) => a.is_active).length || 0, icon: Users },
            { label: "Total Earnings", value: `$${affiliates?.reduce((s, a) => s + Number(a.total_earnings || 0), 0).toFixed(2) || "0.00"}`, icon: DollarSign },
            { label: "Total Orders", value: affiliates?.reduce((s, a) => s + (a.total_orders || 0), 0) || 0, icon: ShoppingCart },
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

        {/* List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <Input
              placeholder="Search affiliates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm border-border bg-secondary h-9 text-sm"
            />
            <Button className="bg-primary text-white hover:bg-accent text-sm" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Athlete
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !filtered?.length ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">No affiliates yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add athletes who will promote your products and earn commission.
              </p>
              <Button className="mt-4 bg-primary text-white hover:bg-accent" onClick={() => setShowCreate(true)}>
                Add your first athlete
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground uppercase">
                  <th className="px-4 py-3">Athlete</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Earnings</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((affiliate) => (
                  <tr key={affiliate.id} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{affiliate.name}</p>
                        <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                        {affiliate.sport && (
                          <p className="text-xs text-muted-foreground">{affiliate.sport}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm bg-secondary px-2 py-1 rounded font-mono">
                        {affiliate.discount_code}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getTierColor(Number(affiliate.commission_rate))}>
                        {affiliate.commission_rate}%
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{affiliate.total_orders}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      ${Number(affiliate.total_earnings || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={affiliate.is_active ? "bg-green-900/30 text-green-400" : "bg-muted text-muted-foreground"}>
                        {affiliate.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Athlete / Affiliate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" />
              </div>
              <div>
                <Label className="text-sm">Email *</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="athlete@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label className="text-sm">Sport</Label>
                <Input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} placeholder="e.g. MMA, Football" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm">Instagram</Label>
                <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@handle" />
              </div>
              <div>
                <Label className="text-sm">TikTok</Label>
                <Input value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} placeholder="@handle" />
              </div>
              <div>
                <Label className="text-sm">YouTube</Label>
                <Input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="Channel" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Commission Tier *</Label>
                <Select value={form.commission_rate} onValueChange={(v) => setForm({ ...form, commission_rate: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionTiers.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Discount Code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="Auto-generated if empty"
                />
                <p className="text-xs text-muted-foreground mt-1">Gives customers 10% off</p>
              </div>
            </div>
            <div>
              <Label className="text-sm">Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button
                className="bg-primary text-white hover:bg-accent"
                onClick={() => createAffiliate.mutate()}
                disabled={!form.name || !form.email || createAffiliate.isPending}
              >
                {createAffiliate.isPending ? "Creating..." : "Create Affiliate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Affiliates;
