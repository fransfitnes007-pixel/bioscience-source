import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, Building2, Mail, Phone, Globe, Lock, Tags, FileImage, Trash2, MapPin } from "lucide-react";
import LogoUploader from "@/components/shared/LogoUploader";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  business_name: string | null;
  business_email: string | null;
  phone: string | null;
  website: string | null;
  country: string | null;
  company_logo_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
}

const PortalProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setEmail(session.user.email || "");
      setUserId(session.user.id);

      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, business_name, business_email, phone, website, country, company_logo_url, address_line1, address_line2, city, state, postal_code')
        .eq('user_id', session.user.id)
        .single();

      setProfile(data as Profile);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        business_name: profile.business_name,
        business_email: profile.business_email,
        phone: profile.phone,
        website: profile.website,
        country: profile.country,
        company_logo_url: profile.company_logo_url,
        address_line1: profile.address_line1,
        address_line2: profile.address_line2,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    }

    setSaving(false);
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/set-password`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email sent",
        description: "Check your inbox for the password reset link.",
      });
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile?.first_name || ""}
                      onChange={(e) => updateField('first_name', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile?.last_name || ""}
                      onChange={(e) => updateField('last_name', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile?.phone || ""}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profile?.business_name || ""}
                    onChange={(e) => updateField('business_name', e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessEmail"
                      type="email"
                      value={profile?.business_email || ""}
                      onChange={(e) => updateField('business_email', e.target.value)}
                      placeholder="contact@business.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={profile?.website || ""}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="https://www.business.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile?.country || ""}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Saved Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Shipping Address
                </CardTitle>
                <CardDescription>
                  Save your address so it's auto-filled the next time you check out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    id="address1"
                    value={profile?.address_line1 || ""}
                    onChange={(e) => updateField('address_line1', e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2 (optional)</Label>
                  <Input
                    id="address2"
                    value={profile?.address_line2 || ""}
                    onChange={(e) => updateField('address_line2', e.target.value)}
                    placeholder="Apt, suite, etc."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile?.city || ""}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Los Angeles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Region</Label>
                    <Input
                      id="state"
                      value={profile?.state || ""}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">ZIP / Postal Code</Label>
                    <Input
                      id="postal"
                      value={profile?.postal_code || ""}
                      onChange={(e) => updateField('postal_code', e.target.value)}
                      placeholder="90001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Company Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Company Logo
                </CardTitle>
                <CardDescription>
                  Upload your company logo for custom vial labeling on your orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.company_logo_url ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-border">
                      <div className="w-20 h-20 rounded-lg border border-border overflow-hidden bg-background flex items-center justify-center">
                        {profile.company_logo_url.toLowerCase().endsWith('.pdf') ? (
                          <FileImage className="w-10 h-10 text-muted-foreground" />
                        ) : (
                          <img
                            src={profile.company_logo_url}
                            alt="Company logo"
                            className="w-full h-full object-contain p-2"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Logo uploaded</p>
                        <p className="text-sm text-muted-foreground">
                          Your logo will be used for custom vial labeling
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (profile) {
                            setProfile({ ...profile, company_logo_url: null });
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </Button>
                    </div>
                  </div>
                ) : userId ? (
                  <LogoUploader
                    bucketPath={`profiles/${userId}`}
                    existingLogoUrl={null}
                    onUploadComplete={(url) => {
                      if (profile) {
                        setProfile({ ...profile, company_logo_url: url });
                      }
                    }}
                    compact
                  />
                ) : (
                  <div className="p-4 bg-secondary/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                )}

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-heading text-sm font-medium text-foreground mb-2">Requirements:</p>
                  <ul className="font-body text-sm text-muted-foreground space-y-1">
                    <li>• PNG or PDF format</li>
                    <li>• Transparent background</li>
                    <li>• Recommended: 300x100px minimum</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Contact support to change your email</p>
                </div>

                <Button variant="outline" onClick={handlePasswordReset}>
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalProfile;
