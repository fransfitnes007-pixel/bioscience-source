import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State = "loading" | "ready" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, {
          headers: { apikey: ANON },
        });
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") setState("already");
        else if (data.valid === true) setState("ready");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if ((data as any)?.success) setState("success");
      else if ((data as any)?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-foreground mb-3">Unsubscribe</h1>

        {state === "loading" && (
          <p className="text-muted-foreground">Validating your link…</p>
        )}

        {state === "ready" && (
          <>
            <p className="text-muted-foreground mb-6">
              Click below to unsubscribe from Resurrected Labs emails. You can resubscribe any time from our site.
            </p>
            <Button onClick={confirm} disabled={submitting} variant="hero" size="lg" className="rounded-full">
              {submitting ? "Unsubscribing…" : "Confirm unsubscribe"}
            </Button>
          </>
        )}

        {state === "already" && (
          <p className="text-muted-foreground">You've already been unsubscribed.</p>
        )}

        {state === "success" && (
          <p className="text-foreground">You've been unsubscribed. Sorry to see you go.</p>
        )}

        {state === "invalid" && (
          <p className="text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
        )}

        {state === "error" && (
          <p className="text-destructive">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
