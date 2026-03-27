import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsLayout } from "./SettingsGeneral";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ChevronRight, MapPin, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKOUT_KEYS = [
  "checkout_contact_method",
  "checkout_show_tracking_link",
  "checkout_require_signin",
  "checkout_full_name",
  "checkout_company_name",
  "checkout_address_line2",
  "checkout_shipping_phone",
  "checkout_show_tipping",
];

const SettingsCheckout = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = {} } = useQuery({
    queryKey: ["site-settings-checkout"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s: any) => { map[s.key] = s.value || ""; });
      return map;
    },
  });

  const [contactMethod, setContactMethod] = useState("phone_or_email");
  const [showTrackingLink, setShowTrackingLink] = useState(true);
  const [requireSignIn, setRequireSignIn] = useState(false);
  const [fullNameSetting, setFullNameSetting] = useState("require_both");
  const [companyName, setCompanyName] = useState("dont_include");
  const [addressLine2, setAddressLine2] = useState("dont_include");
  const [shippingPhone, setShippingPhone] = useState("required");
  const [showTipping, setShowTipping] = useState(false);

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setContactMethod(settings.checkout_contact_method || "phone_or_email");
      setShowTrackingLink(settings.checkout_show_tracking_link !== "false");
      setRequireSignIn(settings.checkout_require_signin === "true");
      setFullNameSetting(settings.checkout_full_name || "require_both");
      setCompanyName(settings.checkout_company_name || "dont_include");
      setAddressLine2(settings.checkout_address_line2 || "dont_include");
      setShippingPhone(settings.checkout_shipping_phone || "required");
      setShowTipping(settings.checkout_show_tipping === "true");
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const entries: Record<string, string> = {
        checkout_contact_method: contactMethod,
        checkout_show_tracking_link: String(showTrackingLink),
        checkout_require_signin: String(requireSignIn),
        checkout_full_name: fullNameSetting,
        checkout_company_name: companyName,
        checkout_address_line2: addressLine2,
        checkout_shipping_phone: shippingPhone,
        checkout_show_tipping: String(showTipping),
      };
      for (const [key, value] of Object.entries(entries)) {
        await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-checkout"] });
      toast({ title: "Checkout settings saved" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <SettingsLayout>
      <div className="flex items-center gap-3 mb-2">
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Configurations</CardTitle>
            <Badge variant="secondary" className="text-xs">New</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Customize Checkout, Thank you, and Order status pages</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border-2 border-green-500/30 rounded-lg bg-green-900/10">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">My Store configuration</p>
                <Badge className="bg-green-600 text-white text-xs">Live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Last saved: Active configuration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Customer contact method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="contact" checked={contactMethod === "phone_or_email"} onChange={() => setContactMethod("phone_or_email")} className="mt-1" />
              <div><p className="text-sm font-medium">Phone number or email</p></div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="contact" checked={contactMethod === "email"} onChange={() => setContactMethod("email")} className="mt-1" />
              <div><p className="text-sm font-medium">Email</p></div>
            </label>
          </div>
          <Separator />
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={showTrackingLink} onCheckedChange={(c) => setShowTrackingLink(!!c)} />
            <div><p className="text-sm font-medium">Show tracking link for customers</p></div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox checked={requireSignIn} onCheckedChange={(c) => setRequireSignIn(!!c)} />
            <div><p className="text-sm font-medium">Require sign-in before checkout</p></div>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Customer information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            { label: "Full name", value: fullNameSetting, setValue: setFullNameSetting, options: [{ value: "require_both", label: "Require first and last name" }, { value: "last_optional", label: "Last name optional" }] },
            { label: "Company name", value: companyName, setValue: setCompanyName, options: [{ value: "dont_include", label: "Don't include" }, { value: "optional", label: "Optional" }, { value: "required", label: "Required" }] },
            { label: "Address line 2", value: addressLine2, setValue: setAddressLine2, options: [{ value: "dont_include", label: "Don't include" }, { value: "optional", label: "Optional" }, { value: "required", label: "Required" }] },
            { label: "Shipping phone", value: shippingPhone, setValue: setShippingPhone, options: [{ value: "dont_include", label: "Don't include" }, { value: "optional", label: "Optional" }, { value: "required", label: "Required" }] },
          ].map((field, i) => (
            <div key={field.label} className={cn("flex items-center justify-between py-3 px-4", i > 0 && "border-t border-border")}>
              <p className="text-sm">{field.label}</p>
              <Select value={field.value} onValueChange={field.setValue}>
                <SelectTrigger className="w-[220px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {field.options.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tipping</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={showTipping} onCheckedChange={(c) => setShowTipping(!!c)} />
            <p className="text-sm">Show tipping options at checkout</p>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </SettingsLayout>
  );
};

export default SettingsCheckout;
