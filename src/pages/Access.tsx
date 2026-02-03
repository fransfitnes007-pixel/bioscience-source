import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

type AuthTab = "login" | "signup" | "apply";

const Access = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    businessEmail: "",
    phone: "",
    website: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [applyData, setApplyData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    taxId: "",
    intendedUse: "",
    notes: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if identifier is an email or username
      let email = loginData.identifier;
      
      // If it doesn't contain @, treat it as a supplier username
      if (!loginData.identifier.includes("@")) {
        email = `${loginData.identifier.toLowerCase()}@supplier.pointbiosciences.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginData.password,
      });

      if (error) throw error;

      // Check user role to redirect appropriately
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const roles = roleData?.map(r => r.role) || [];

      toast.success("Logged in successfully");
      
      // Redirect based on role
      if (roles.includes("supplier")) {
        navigate("/supplier");
      } else if (roles.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/portal");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.businessEmail,
        password: signupData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          business_name: signupData.businessName,
          business_email: signupData.businessEmail,
          phone: signupData.phone || null,
          website: signupData.website || null,
          country: signupData.country || null,
        });

        if (profileError) throw profileError;
      }

      toast.success("Account created! Your account is pending approval.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("applications").insert({
        business_name: applyData.businessName,
        contact_name: applyData.contactName,
        email: applyData.email,
        phone: applyData.phone || null,
        business_type: applyData.businessType || null,
        tax_id: applyData.taxId || null,
        intended_use: applyData.intendedUse || null,
        notes: applyData.notes || null,
      });

      if (error) throw error;

      toast.success("Application submitted! We'll contact you shortly.");
      setApplyData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        businessType: "",
        taxId: "",
        intendedUse: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Application submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Video placeholder */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-card">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="text-center">
            <img src={logo} alt="PØINT BioSciences" className="h-16 w-auto mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              B2B Access Portal
            </h2>
            <p className="font-body text-muted-foreground max-w-md">
              Secure wholesale access for qualified research partners.
            </p>
          </div>
        </div>
        {/* Molecular grid background */}
        <div className="absolute inset-0 bg-molecular-grid opacity-30" />
      </div>

      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="PØINT BioSciences" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-foreground">B2B Access</h1>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 font-heading text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 font-heading text-sm font-medium transition-colors ${
                activeTab === "signup"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setActiveTab("apply")}
              className={`flex-1 py-3 font-heading text-sm font-medium transition-colors ${
                activeTab === "apply"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Apply
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, identifier: e.target.value }))}
                  placeholder="Email or supplier username"
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-heading text-sm font-medium text-foreground block mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupData.firstName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                  />
                </div>
                <div>
                  <label className="font-heading text-sm font-medium text-foreground block mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupData.lastName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                  />
                </div>
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.businessName}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={signupData.businessEmail}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, businessEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={signupData.website}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={signupData.country}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          {/* Apply Form */}
          {activeTab === "apply" && (
            <form onSubmit={handleApply} className="space-y-4 animate-fade-in">
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={applyData.businessName}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={applyData.contactName}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, contactName: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={applyData.email}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={applyData.phone}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Business Type
                </label>
                <select
                  value={applyData.businessType}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, businessType: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                >
                  <option value="">Select...</option>
                  <option value="research_lab">Research Laboratory</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="clinic">Clinic</option>
                  <option value="distributor">Distributor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Tax ID / EIN
                </label>
                <input
                  type="text"
                  value={applyData.taxId}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, taxId: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Intended Use
                </label>
                <select
                  value={applyData.intendedUse}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, intendedUse: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                >
                  <option value="">Select...</option>
                  <option value="research">Research</option>
                  <option value="distribution">Distribution</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="font-heading text-sm font-medium text-foreground block mb-2">
                  Notes / Message
                </label>
                <textarea
                  rows={3}
                  value={applyData.notes}
                  onChange={(e) => setApplyData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 resize-none"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Access;
