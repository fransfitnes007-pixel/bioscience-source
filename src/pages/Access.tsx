import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

type AuthTab = "login" | "signup";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number, message: string) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const Access = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuth } = useAuth();
  const { addToCart } = useCart();

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
    initials: "",
  });

  const finishCustomerAccount = async (profile?: { firstName?: string; lastName?: string; phone?: string }) => {
    const { error } = await withTimeout(
      supabase.rpc("finish_b2c_account", {
        _first_name: profile?.firstName || undefined,
        _last_name: profile?.lastName || undefined,
        _phone: profile?.phone || undefined,
      }),
      8000,
      "Account saved, but the profile sync took too long. Please refresh."
    );
    if (error) throw error;
  };

  const goToProducts = () => {
    const redirect = searchParams.get("redirect");
    navigate(redirect && redirect.startsWith("/") ? redirect : "/products", { replace: true });
  };

  const addPendingCartItem = async () => {
    const raw = sessionStorage.getItem("pending-cart-item");
    if (!raw) return;

    try {
      const item = JSON.parse(raw);
      sessionStorage.removeItem("pending-cart-item");
      await addToCart(item);
    } catch {
      sessionStorage.removeItem("pending-cart-item");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = loginData.identifier.trim().toLowerCase();

      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password: loginData.password,
        }),
        12000,
        "Sign in took too long. Please try again."
      );

      if (error) throw error;

      await finishCustomerAccount();
      await refreshAuth();
      await addPendingCartItem();
      toast.success("Welcome back!");
      goToProducts();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed"));
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
    if (signupData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (
      !/[A-Z]/.test(signupData.password) ||
      !/[a-z]/.test(signupData.password) ||
      !/[0-9]/.test(signupData.password)
    ) {
      toast.error("Password must include uppercase, lowercase, and a number");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (signupData.firstName.trim().length < 1 || signupData.lastName.trim().length < 1) {
      toast.error("First and last name are required");
      return;
    }
    if (!signupData.agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    const expectedInitials = `${signupData.firstName.trim()[0] || ""}${signupData.lastName.trim()[0] || ""}`.toUpperCase();
    const enteredInitials = signupData.initials.trim().toUpperCase();
    if (!enteredInitials || enteredInitials.length < 2) {
      toast.error("Please type your initials to confirm agreement");
      return;
    }
    if (enteredInitials !== expectedInitials) {
      toast.error(`Initials must match your name (${expectedInitials})`);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await withTimeout(
        supabase.auth.signUp({
          email: signupData.email.trim().toLowerCase(),
          password: signupData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/products`,
            data: {
              first_name: signupData.firstName.trim(),
              last_name: signupData.lastName.trim(),
              phone: signupData.phone.trim(),
            },
          },
        }),
        12000,
        "Account creation took too long. Please try again."
      );

      if (authError) throw authError;

      // Supabase email-enumeration protection: returns a user with no identities
      const isExistingUser =
        !!data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

      if (isExistingUser) {
        toast.info("An account with this email already exists. Please sign in.");
        setActiveTab("login");
        setLoginData({ identifier: signupData.email.trim().toLowerCase(), password: "" });
        return;
      }

      // Best-effort: persist signature record (won't block if it fails)
      if (data.user?.id) {
        try {
          await supabase.from("agreement_signatures").insert({
            user_id: data.user.id,
            agreement_type: "purchaser_terms",
            agreement_version: "1.0",
            signer_name: `${signupData.firstName.trim()} ${signupData.lastName.trim()}`,
            signer_email: signupData.email.trim().toLowerCase(),
            initials: enteredInitials,
            user_agent: navigator.userAgent,
            signed_at: new Date().toISOString(),
            status: "signed",
            metadata: { source: "account_signup" },
          });
        } catch {
          /* non-blocking */
        }
      }

      if (data.session) {
        await finishCustomerAccount({
          firstName: signupData.firstName.trim(),
          lastName: signupData.lastName.trim(),
          phone: signupData.phone.trim(),
        });
        await refreshAuth();
        await addPendingCartItem();
        toast.success("Account created! You're signed in.");
        goToProducts();
      } else {
        toast.success("Account created! Please sign in.");
        setActiveTab("login");
        setLoginData({ identifier: signupData.email.trim().toLowerCase(), password: "" });
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error, "Signup failed");
      const lower = msg.toLowerCase();
      if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("user_already_exists")) {
        toast.info("This email is already registered. Please sign in instead.");
        setActiveTab("login");
        setLoginData({ identifier: signupData.email.trim().toLowerCase(), password: "" });
      } else if (lower.includes("weak") || lower.includes("pwned") || lower.includes("known to be weak")) {
        toast.error("This password has appeared in known data breaches. Please choose a different one.");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    "w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30";
  const labelClassName = "font-heading text-sm font-medium text-foreground block mb-2";

  const expectedInitials = `${signupData.firstName.trim()[0] || ""}${signupData.lastName.trim()[0] || ""}`.toUpperCase();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Account</h1>
            <p className="font-body text-muted-foreground">
              Sign in or create an account to start shopping.
            </p>
          </div>

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
                <div className="relative">
                  <input
                    type={showLoginPwd ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    className={`${inputClassName} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showLoginPwd ? "Hide password" : "Show password"}
                  >
                    {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}

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
                <div className="relative">
                  <input
                    type={showSignupPwd ? "text" : "password"}
                    required
                    value={signupData.password}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                    className={`${inputClassName} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showSignupPwd ? "Hide password" : "Show password"}
                  >
                    {showSignupPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Min 8 chars, with uppercase, lowercase, and a number.
                </p>
              </div>
              <div>
                <label className={labelClassName}>Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    required
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`${inputClassName} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                  >
                    {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms agreement + initials (matches checkout pattern) */}
              <label
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  signupData.agreedToTerms
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-border bg-secondary/20 hover:border-foreground/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={signupData.agreedToTerms}
                  onChange={(e) =>
                    setSignupData((prev) => ({ ...prev, agreedToTerms: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 accent-foreground"
                />
                <span className="font-body text-sm text-muted-foreground leading-relaxed">
                  By creating an account, I acknowledge and agree to the{" "}
                  <Link to="/terms" target="_blank" className="text-foreground underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" target="_blank" className="text-foreground underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <div>
                <label className={labelClassName}>
                  Type your initials to confirm{" "}
                  {expectedInitials && (
                    <span className="text-muted-foreground font-normal">
                      (expected: <span className="font-display tracking-widest">{expectedInitials}</span>)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={signupData.initials}
                  onChange={(e) =>
                    setSignupData((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))
                  }
                  placeholder={expectedInitials || "e.g. JD"}
                  className={`${inputClassName} font-display tracking-[0.3em] uppercase`}
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
