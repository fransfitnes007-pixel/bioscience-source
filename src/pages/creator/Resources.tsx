import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

const CreatorResources = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("affiliate_resources")
        .select("*")
        .eq("active", true)
        .order("display_order");
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Brand resources</h1>
        <p className="text-muted-foreground mt-1">Logos, banners, product shots and copy templates.</p>
      </div>

      {loading ? <Skeleton className="h-64 w-full" /> : items.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No resources uploaded yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((r) => (
            <Card key={r.id}>
              {r.thumbnail_url && <img src={r.thumbnail_url} alt={r.title} className="aspect-video object-cover w-full rounded-t-lg" />}
              <CardHeader>
                <CardTitle className="text-base">{r.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {r.description && <p className="text-sm text-muted-foreground mb-3">{r.description}</p>}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={r.file_url} target="_blank" rel="noopener"><Download className="h-4 w-4 mr-2" />Download</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CreatorLayout>
  );
};

export default CreatorResources;
