import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck } from "lucide-react";
import {
  AgreementType,
  AGREEMENT_BODIES,
  AGREEMENT_TITLES,
  AGREEMENT_VERSIONS,
  expectedInitials,
} from "@/lib/agreements";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AgreementType;
  signerName: string;
  signerEmail: string;
  // When true, persist to agreement_signatures table (requires auth.uid()).
  persist?: boolean;
  onSigned: (sig: { initials: string; signedAt: string; id?: string }) => void;
  ctaLabel?: string;
}

export const SignatureModal = ({
  open,
  onOpenChange,
  type,
  signerName,
  signerEmail,
  persist = true,
  onSigned,
  ctaLabel = "Sign & Accept",
}: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [initials, setInitials] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const expected = useMemo(() => expectedInitials(signerName), [signerName]);
  const title = AGREEMENT_TITLES[type];
  const body = AGREEMENT_BODIES[type];
  const version = AGREEMENT_VERSIONS[type];

  const initialsValid =
    initials.trim().length >= 2 &&
    initials.trim().length <= 4 &&
    /^[A-Za-z]+$/.test(initials.trim());

  const matchesExpected = expected.length === 0 || initials.trim().toUpperCase() === expected;

  const canSubmit = agreed && initialsValid && matchesExpected && !submitting;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) setScrolledToBottom(true);
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const signedAt = new Date().toISOString();
      const cleanInitials = initials.trim().toUpperCase();
      let row: { id?: string } = {};

      if (persist) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) {
          toast.error("You must be signed in to sign this agreement.");
          setSubmitting(false);
          return;
        }
        const { data, error } = await supabase
          .from("agreement_signatures")
          .insert({
            user_id: userData.user.id,
            agreement_type: type,
            agreement_version: version,
            signer_name: signerName || null,
            signer_email: signerEmail || userData.user.email || null,
            initials: cleanInitials,
            user_agent: navigator.userAgent,
            signed_at: signedAt,
            status: "signed",
            metadata: { source: "signature_modal" },
          })
          .select("id")
          .single();
        if (error) throw error;
        row = data || {};
      }

      onSigned({ initials: cleanInitials, signedAt, id: row.id });
      toast.success("Signature recorded.");
      onOpenChange(false);
      // reset for next time
      setAgreed(false);
      setInitials("");
      setScrolledToBottom(false);
    } catch (err: any) {
      console.error("signature error", err);
      toast.error(err?.message || "Failed to record signature.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> {title}
          </DialogTitle>
          <DialogDescription>
            Version {version}. Read in full, then sign electronically by entering your initials.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className="h-80 rounded-md border border-border bg-background/40 p-4"
          onScrollCapture={handleScroll}
        >
          <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed text-foreground/90">
            {body}
          </pre>
        </ScrollArea>
        {!scrolledToBottom && (
          <p className="text-xs text-muted-foreground -mt-2">Scroll to the bottom to enable signing.</p>
        )}

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(!!v)}
              disabled={!scrolledToBottom}
            />
            <Label htmlFor="agree" className="text-sm leading-snug">
              I have read and agree to the {title}. I understand that entering my initials below
              constitutes a legally binding electronic signature under the E-SIGN Act and UETA.
            </Label>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <div>
              <Label htmlFor="initials" className="text-sm">
                Your initials{" "}
                {expected && (
                  <span className="text-muted-foreground">
                    (first letter of first name + first letter of last name — e.g. {expected})
                  </span>
                )}
              </Label>
              <Input
                id="initials"
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 4))}
                placeholder={expected || "AB"}
                className="font-display text-lg tracking-widest uppercase mt-1"
                disabled={!agreed}
                maxLength={4}
              />
              {initials && !matchesExpected && (
                <p className="text-xs text-destructive mt-1">
                  Initials must match the name on file: {expected}
                </p>
              )}
            </div>
            <Button onClick={submit} disabled={!canSubmit} size="lg" className="min-w-[140px]">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : ctaLabel}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Signed as {signerName || signerEmail}. A timestamped record will be saved to your
            account.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
