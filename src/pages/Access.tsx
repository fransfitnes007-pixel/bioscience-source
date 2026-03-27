import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

type AuthTab = "login" | "signup";

const Access = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let email = loginData.identifier;
      if (!loginData.identifier.includes("@")) {
        email = `${loginData.identifier.toLowerCase()}@supplier.pointbiosciences.com`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginData.password,
      });

      if (error) throw error;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const roles = roleData?.map(r => r.role) || [];

      toast.success("Welcome back!");
      
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
        email: signupData.email,
        password: signupData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Auto-approve consumer accounts
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: authData.user.id,
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          business_email: signupData.email,
          phone: signupData.phone || null,
          status: "approved" as any,
        }, { onConflict: "user_id" });

        if (profileError) {
          console.error("Profile error:", profileError);
        }
      }

      toast.success("Account created! Please check your email to verify, then sign in.");
      setActiveTab("login");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30";
  const labelClassName = "font-heading text-sm font-medium text-foreground block mb-2";

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              My Account
            </h1>
            <p className="font-body text-muted-foreground">
              Sign in or create an account to start shopping.
            </p>
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
              Sign In
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
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, identifier: e.target.value }))}
                  placeholder="you@email.com"
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Password</label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>First Name *</label>
                  <input
                    type="text"
                    required
                    value={signupData.firstName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, firstName: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Last Name *</label>
                  <input
                    type="text"
                    required
                    value={signupData.lastName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, lastName: e.target.value }))}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div>
                <label className={labelClassName}>Email *</label>
                <input
                  type="email"
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Phone</label>
                <input
                  type="tel"
                  value={signupData.phone}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, phone: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Password *</label>
                <input
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Access;