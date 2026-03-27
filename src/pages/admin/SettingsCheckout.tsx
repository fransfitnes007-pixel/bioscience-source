import { useState } from "react";
import { SettingsLayout } from "./SettingsGeneral";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronRight, MapPin, ShoppingBag } from "lucide-react";

const SettingsCheckout = () => {
  const [contactMethod, setContactMethod] = useState("phone_or_email");
  const [showTrackingLink, setShowTrackingLink] = useState(true);
  const [requireSignIn, setRequireSignIn] = useState(false);
  const [fullNameSetting, setFullNameSetting] = useState("require_both");
  const [companyName, setCompanyName] = useState("dont_include");
  const [addressLine2, setAddressLine2] = useState("dont_include");
  const [shippingPhone, setShippingPhone] = useState("required");
  const [showTipping, setShowTipping] = useState(false);

  return (
    <SettingsLayout>
      <div className="flex items-center gap-3 mb-2">
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Checkout</h1>
      </div>

      {/* Configurations */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">Configurations</CardTitle>
            <Badge variant="secondary" className="text-xs">New</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Customize Checkout, Thank you, and Order status pages</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border-2 border-green-500/30 rounded-lg bg-green-900/20/5">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">My Store configuration</p>
                <Badge className="bg-green-600 text-white text-xs">Live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Last saved: Active configuration</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Duplicate</Button>
              <Button size="sm">Customize</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer contact method */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Customer contact method</CardTitle>
          <p className="text-sm text-muted-foreground">The contact method customers enter at checkout will receive order and shipping notifications</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="contact"
                checked={contactMethod === "phone_or_email"}
                onChange={() => setContactMethod("phone_or_email")}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium">Phone number or email</p>
                <p className="text-xs text-muted-foreground">An SMS App is required to send SMS updates</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="contact"
                checked={contactMethod === "email"}
                onChange={() => setContactMethod("email")}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium">Email</p>
              </div>
            </label>
          </div>

          <Separator />

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={showTrackingLink}
                onCheckedChange={(c) => setShowTrackingLink(!!c)}
              />
              <div>
                <p className="text-sm font-medium">Show a link for customers to track their order with Shop</p>
                <p className="text-xs text-muted-foreground">Customers will be able to download the app from the order status page</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={requireSignIn}
                onCheckedChange={(c) => setRequireSignIn(!!c)}
              />
              <div>
                <p className="text-sm font-medium">Require customers to sign in to their account before checkout</p>
                <p className="text-xs text-muted-foreground">Customers can only use email when sign-in is required</p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Customer information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Customer information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            { label: "Full name", value: fullNameSetting, setValue: setFullNameSetting, options: [
              { value: "require_both", label: "Require first and last name" },
              { value: "last_optional", label: "Last name optional" },
            ]},
            { label: "Company name", value: companyName, setValue: setCompanyName, options: [
              { value: "dont_include", label: "Don't include" },
              { value: "optional", label: "Optional" },
              { value: "required", label: "Required" },
            ]},
            { label: "Address line 2 (apartment, unit, etc.)", value: addressLine2, setValue: setAddressLine2, options: [
              { value: "dont_include", label: "Don't include" },
              { value: "optional", label: "Optional" },
              { value: "required", label: "Required" },
            ]},
            { label: "Shipping address phone number", value: shippingPhone, setValue: setShippingPhone, options: [
              { value: "dont_include", label: "Don't include" },
              { value: "optional", label: "Optional" },
              { value: "required", label: "Required" },
            ]},
          ].map((field, i) => (
            <div key={field.label} className={cn(
              "flex items-center justify-between py-3 px-4",
              i > 0 && "border-t border-border"
            )}>
              <p className="text-sm">{field.label}</p>
              <Select value={field.value} onValueChange={field.setValue}>
                <SelectTrigger className="w-[220px] h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {field.options.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tipping */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tipping</CardTitle>
          <p className="text-sm text-muted-foreground">Customers can choose between 3 presets or enter a custom amount</p>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={showTipping}
              onCheckedChange={(c) => setShowTipping(!!c)}
            />
            <p className="text-sm">Show tipping options at checkout</p>
          </label>
        </CardContent>
      </Card>

      {/* Checkout language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Checkout language</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <p className="text-sm">English</p>
            <Button variant="outline" size="sm">Edit checkout content</Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced preferences */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Advanced preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="flex items-center gap-4 p-4 border border-border rounded-lg rounded-b-none">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Address collection</p>
              <p className="text-xs text-muted-foreground">Manage how you collect shipping and billing addresses</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4 p-4 border border-border border-t-0 rounded-lg rounded-t-none">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Add-to-cart limit</p>
                <Badge variant="secondary" className="text-xs">Recommended</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Protects your available inventory quantities from being revealed</p>
            </div>
            <Badge className="bg-green-900/30 text-green-400 border-green-300">On</Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Checkout rules */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Checkout rules</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rules set parameters for how the cart or checkout responds to different customer scenarios. You can set product limits, perform age verification and more.
          </p>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Checkout rules are configured and active for your store.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save</Button>
      </div>
    </SettingsLayout>
  );
};

export default SettingsCheckout;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
