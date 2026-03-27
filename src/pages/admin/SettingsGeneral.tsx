import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Settings, CreditCard, ShoppingCart, Users, Truck, Receipt, MapPin, AppWindow,
  Share2, Globe, Sparkles, Bell, Tags, Languages, Shield, FileText, ChevronRight,
} from "lucide-react";

const settingsNav = [
  { title: "General", href: "/admin/settings", icon: Settings },
  { title: "Payments", href: "/admin/settings/payments", icon: CreditCard },
  { title: "Checkout", href: "/admin/settings/checkout", icon: ShoppingCart },
  { title: "Customer accounts", href: "/admin/settings/customers", icon: Users },
  { title: "Shipping and delivery", href: "/admin/settings/shipping", icon: Truck },
  { title: "Taxes and duties", href: "/admin/settings/taxes", icon: Receipt },
  { title: "Locations", href: "/admin/settings/locations", icon: MapPin },
  { title: "Sales channels", href: "/admin/settings/channels", icon: Share2 },
  { title: "Domains", href: "/admin/settings/domains", icon: Globe },
  { title: "Notifications", href: "/admin/settings/notifications", icon: Bell },
  { title: "Languages", href: "/admin/settings/languages", icon: Languages },
  { title: "Customer privacy", href: "/admin/settings/privacy", icon: Shield },
  { title: "Policies", href: "/admin/settings/policies", icon: FileText },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Settings sidebar */}
        <div>
          <Card>
            <CardContent className="p-2">
              <div className="px-3 py-3 mb-1">
                <p className="font-semibold">Resurrected</p>
                <p className="text-xs text-muted-foreground">resurrectedclothing.com</p>
              </div>
              <nav className="space-y-0.5">
                {settingsNav.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/admin/settings"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      location.pathname === item.href
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.title}</span>
                  </NavLink>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </AdminLayout>
  );
};

// ─── General Settings ───
const GeneralSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      data?.forEach((s) => { map[s.key] = s.value || ""; });
      return map;
    },
  });

  const [formData, setFormData] = useState<Record<string, string>>({});

  const getVal = (key: string, fallback = "") => formData[key] ?? settings[key] ?? fallback;

  const saveMutation = useMutation({
    mutationFn: async (entries: Record<string, string>) => {
      for (const [key, value] of Object.entries(entries)) {
        await supabase
          .from("site_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Settings saved" });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      ...settings,
      ...formData,
    });
  };

  return (
    <SettingsLayout>
      <div className="flex items-center gap-3 mb-2">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">General</h1>
      </div>

      {/* Business details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Business details</CardTitle>
          <p className="text-sm text-muted-foreground">Used for payments, markets, and apps</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
            <div className="text-2xl">🇺🇸</div>
            <div className="flex-1">
              <p className="font-medium">{getVal("business_name", "Resurrected Body")}</p>
              <p className="text-sm text-muted-foreground">
                {getVal("business_type", "Sole proprietorship")} • {getVal("business_address", "8631 West Mary Ann Drive, Peoria, AZ 85382, United States")}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Store contact details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Store contact details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg rounded-b-none">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{getVal("store_name", "Resurrected")}</p>
              <p className="text-sm text-muted-foreground">
                {getVal("store_email", "resurr3ctedclothing@gmail.com")} · {getVal("store_phone", "4806784950")}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4 p-4 border border-border border-t-0 rounded-lg rounded-t-none">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Store address</p>
              <p className="text-sm text-muted-foreground">
                {getVal("business_address", "8631 West Mary Ann Drive, Peoria Arizona 85382, United States")}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Store defaults */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Store defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium">Currency display</p>
              <p className="text-sm text-muted-foreground">To manage currencies customers see, go to Markets</p>
            </div>
            <Badge variant="outline">US Dollar (USD $)</Badge>
          </div>

          <div className="space-y-2">
            <Label>Backup Region</Label>
            <Select defaultValue="us">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Determines settings for customers outside of your markets</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit system</Label>
              <Select defaultValue="imperial">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial system</SelectItem>
                  <SelectItem value="metric">Metric system</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default weight unit</Label>
              <Select defaultValue="lb">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pound (lb)</SelectItem>
                  <SelectItem value="oz">Ounce (oz)</SelectItem>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time zone</Label>
            <Select defaultValue="america_phoenix">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="america_phoenix">(GMT-07:00) Arizona</SelectItem>
                <SelectItem value="america_los_angeles">(GMT-08:00) Pacific Time</SelectItem>
                <SelectItem value="america_denver">(GMT-07:00) Mountain Time</SelectItem>
                <SelectItem value="america_chicago">(GMT-06:00) Central Time</SelectItem>
                <SelectItem value="america_new_york">(GMT-05:00) Eastern Time</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Sets the time for when orders and analytics are recorded</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </SettingsLayout>
  );
};

export default GeneralSettings;
export { SettingsLayout };
