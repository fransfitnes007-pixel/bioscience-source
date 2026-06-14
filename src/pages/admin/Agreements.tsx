import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, Clock, FileSignature } from "lucide-react";
import { AGREEMENT_TITLES, AgreementType, expectedInitials } from "@/lib/agreements";

const TYPE_TABS: { value: AgreementType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "creator_campaign", label: "Creator" },
  { value: "purchaser_terms", label: "Individual" },
  { value: "b2b_terms", label: "B2B" },
];

const AdminAgreements = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [tab, setTab] = useState<AgreementType | "all">("creator_campaign");
  const [loading, setLoading] = useState(true);
  const [counterRow, setCounterRow] = useState<any>(null);
  const [adminInitials, setAdminInitials] = useState("");
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("agreement_signatures").select("*").order("signed_at", { ascending: false });
    if (tab !== "all") q = q.eq("agreement_type", tab);
    const { data } = await q;
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setMe({
          id: data.user.id,
          name: (data.user.user_metadata as any)?.full_name || data.user.email || "Admin",
        });
      }
    })();
  }, [tab]);

  const counterSign = async () => {
    if (!counterRow || !me) return;
    const trimmed = adminInitials.trim().toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(trimmed)) {
      toast.error("Enter 2–4 letter initials");
      return;
    }
    const { error } = await supabase
      .from("agreement_signatures")
      .update({
        counter_signed_by: me.id,
        counter_signed_at: new Date().toISOString(),
        counter_signer_initials: trimmed,
        status: "executed",
      })
      .eq("id", counterRow.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Counter-signed");
    setCounterRow(null);
    setAdminInitials("");
    load();
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl tracking-tight">Agreements & Signatures</h1>
            <p className="text-muted-foreground">
              Review and counter-sign legally binding electronic signatures.
            </p>
          </div>
          <div className="flex gap-1 bg-secondary/30 p-1 rounded-lg">
            {TYPE_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`px-3 py-1.5 text-xs rounded-md transition ${
                  tab === t.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No signatures yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {rows.map((r) => {
              const counter = !!r.counter_signed_at;
              return (
                <Card key={r.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="font-display text-lg flex items-center gap-2">
                          <FileSignature className="w-4 h-4" />
                          {AGREEMENT_TITLES[r.agreement_type as AgreementType]}
                        </CardTitle>
                        <CardDescription>
                          {r.signer_name || r.signer_email} · v{r.agreement_version} ·{" "}
                          {new Date(r.signed_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      {counter ? (
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/40">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Fully executed
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" /> Awaiting counter-sign
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded border border-border p-3">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Signer</p>
                      <p className="font-display text-xl tracking-widest">{r.initials}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.signer_email}</p>
                    </div>
                    <div
                      className={`rounded border p-3 ${
                        counter ? "border-emerald-500/40 bg-emerald-500/5" : "border-dashed border-border"
                      }`}
                    >
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Resurrected Labz
                      </p>
                      {counter ? (
                        <>
                          <p className="font-display text-xl tracking-widest">{r.counter_signer_initials}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(r.counter_signed_at).toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => setCounterRow(r)}>
                          Counter-sign
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!counterRow} onOpenChange={(o) => !o && setCounterRow(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Counter-sign on behalf of Resurrected Labz</DialogTitle>
              <DialogDescription>
                Signing as <span className="font-medium">{me?.name}</span>. Expected initials:{" "}
                <span className="font-display">{expectedInitials(me?.name || "") || "AD"}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Your initials</Label>
                <Input
                  value={adminInitials}
                  onChange={(e) => setAdminInitials(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder={expectedInitials(me?.name || "") || "AD"}
                  className="font-display tracking-widest uppercase text-lg mt-1"
                  maxLength={4}
                />
              </div>
              <Button onClick={counterSign} className="w-full">
                Apply counter-signature
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminAuthGuard>
  );
};

export default AdminAgreements;
