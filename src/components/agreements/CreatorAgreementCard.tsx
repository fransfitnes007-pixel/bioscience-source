import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileSignature, Clock } from "lucide-react";
import SignatureModal from "@/components/agreements/SignatureModal";
import { AGREEMENT_VERSIONS } from "@/lib/agreements";

interface Props {
  affiliateName: string;
  affiliateEmail: string;
  // When provided, shows a full-screen gate until signed.
  required?: boolean;
  onSigned?: () => void;
}

export const CreatorAgreementCard = ({ affiliateName, affiliateEmail, required = true, onSigned }: Props) => {
  const [loading, setLoading] = useState(true);
  const [sig, setSig] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("agreement_signatures")
      .select("*")
      .eq("user_id", u.user.id)
      .eq("agreement_type", "creator_campaign")
      .eq("agreement_version", AGREEMENT_VERSIONS.creator_campaign)
      .order("signed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSig(data || null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const signed = !!sig;
  const counterSigned = !!sig?.counter_signed_at;

  return (
    <>
      <Card className={!signed && required ? "border-amber-500/50 bg-amber-500/5" : undefined}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <FileSignature className="w-5 h-5" />
                Creator Campaign Agreement
              </CardTitle>
              <CardDescription>
                Version {AGREEMENT_VERSIONS.creator_campaign}
              </CardDescription>
            </div>
            {signed && counterSigned && (
              <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 mr-1" /> Fully executed
              </Badge>
            )}
            {signed && !counterSigned && (
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" /> Awaiting counter-signature
              </Badge>
            )}
            {!signed && (
              <Badge variant="destructive">Action required</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : signed ? (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded border border-border p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Creator</p>
                <p className="font-display text-2xl tracking-widest">{sig.initials}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sig.signer_name} · {new Date(sig.signed_at).toLocaleString()}
                </p>
              </div>
              <div className={`rounded border p-3 ${counterSigned ? "border-emerald-500/40 bg-emerald-500/5" : "border-dashed border-border"}`}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Resurrected Labz
                </p>
                {counterSigned ? (
                  <>
                    <p className="font-display text-2xl tracking-widest">{sig.counter_signer_initials}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(sig.counter_signed_at).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Pending admin review</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't signed the Creator Agreement yet. Review and sign to unlock payouts,
              retainer eligibility, and campaign access.
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)} variant={signed ? "outline" : "default"} size="sm">
              {signed ? "View / re-sign" : "Sign now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SignatureModal
        open={open}
        onOpenChange={setOpen}
        type="creator_campaign"
        signerName={affiliateName}
        signerEmail={affiliateEmail}
        onSigned={() => {
          load();
          onSigned?.();
        }}
        ctaLabel="Sign Creator Agreement"
      />
    </>
  );
};

export default CreatorAgreementCard;
