import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatNumber, getCurrentAffiliate } from "@/lib/creator-utils";
import { Copy } from "lucide-react";

const CreatorCodes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const a = await getCurrentAffiliate();
      if (!a) return setLoading(false);
      const { data } = await supabase
        .from("affiliate_codes")
        .select("*")
        .eq("affiliate_id", a.id)
        .order("is_default", { ascending: false });
      setCodes(data || []);
      setLoading(false);
    })();
  }, []);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: code });
  };

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Discount codes</h1>
        <p className="text-muted-foreground mt-1">Codes give your audience a discount and you commission on every order.</p>
      </div>

      {loading ? <Skeleton className="h-40 w-full" /> : codes.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No codes assigned yet. Your admin will issue a default code shortly.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {codes.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono">{c.code}</CardTitle>
                  {c.is_default && <Badge>Default</Badge>}
                </div>
                <CardDescription>
                  {c.discount_type === "percentage" ? `${c.discount_value}% off` :
                   c.discount_type === "fixed_amount" ? `$${c.discount_value} off` : "Tracking only"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{formatNumber(c.uses_count)} uses</span>
                <Button size="sm" variant="outline" onClick={() => copy(c.code)}><Copy className="h-4 w-4 mr-2" />Copy</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CreatorLayout>
  );
};

export default CreatorCodes;
