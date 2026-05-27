import { useEffect, useState } from "react";
import CreatorLayout from "@/components/creator/CreatorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentAffiliate } from "@/lib/creator-utils";

const CreatorProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [id, setId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const a = await getCurrentAffiliate();
      if (!a) return setLoading(false);
      setId(a.id);
      setForm({
        display_name: a.display_name || a.name || "",
        legal_name: a.legal_name || "",
        email: a.email || "",
        phone: a.phone || "",
        country: a.country || "",
        vanity_slug: a.vanity_slug || "",
        social_instagram: a.instagram || "",
        social_tiktok: a.tiktok || "",
        social_youtube: a.youtube || "",
        social_twitter: a.social_twitter || "",
      });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("affiliates").update({
      display_name: form.display_name,
      legal_name: form.legal_name,
      phone: form.phone,
      country: form.country,
      vanity_slug: form.vanity_slug || null,
      instagram: form.social_instagram,
      tiktok: form.social_tiktok,
      youtube: form.social_youtube,
      social_twitter: form.social_twitter,
    }).eq("id", id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Profile updated" });
  };

  if (loading) return <CreatorLayout><Skeleton className="h-96 w-full" /></CreatorLayout>;

  const field = (k: string, label: string, placeholder?: string) => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={placeholder} />
    </div>
  );

  return (
    <CreatorLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Edit your creator information.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Personal</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {field("display_name", "Display name")}
            {field("legal_name", "Legal name (for tax)")}
            <div>
              <Label>Email</Label>
              <Input value={form.email} disabled />
            </div>
            {field("phone", "Phone")}
            {field("country", "Country", "US")}
            {field("vanity_slug", "Vanity slug", "your-name → resurrectedlabs.com/your-name")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social</CardTitle>
            <CardDescription>So we know where your audience is.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {field("social_instagram", "Instagram", "@handle")}
            {field("social_tiktok", "TikTok", "@handle")}
            {field("social_youtube", "YouTube", "channel URL")}
            {field("social_twitter", "Twitter/X", "@handle")}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorProfile;
