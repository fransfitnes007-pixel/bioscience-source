import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Building2, MapPin, Phone, Package, Target, Sparkles } from "lucide-react";
import pointLogo from "@/assets/point-logo-transparent.png";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const Apply = () => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    
    // Step 2: Business Type
    businessType: "",
    
    // Step 3: Business Address
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    
    // Step 4: Product Interest
    productsInterest: "",
    productUsage: "",
    
    // Step 5: Partnership Value
    howWeBenefit: "",
    companyImpact: "",
    
    // Step 6: Additional Info
    monthlyVolume: "",
    referralSource: "",
    notes: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.from("applications").insert({
        business_name: formData.businessName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone || null,
        website: formData.website || null,
        business_type: formData.businessType || null,
        business_address: formData.businessAddress || null,
        city: formData.city || null,
        state: formData.state || null,
        zip_code: formData.zipCode || null,
        country: formData.country || null,
        products_interest: formData.productsInterest || null,
        product_usage: formData.productUsage || null,
        how_we_benefit: formData.howWeBenefit || null,
        company_impact: formData.companyImpact || null,
        monthly_volume: formData.monthlyVolume || null,
        referral_source: formData.referralSource || null,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll respond within 24 hours.");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Application submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all";
  const labelClassName = "font-heading text-sm font-medium text-foreground block mb-2";

  const isStep1Valid = formData.businessName && formData.contactName && formData.email;
  const isStep2Valid = formData.businessType;
  const isStep3Valid = formData.businessAddress && formData.city && formData.country;
  const isStep4Valid = formData.productsInterest && formData.productUsage;
  const isStep5Valid = formData.howWeBenefit && formData.companyImpact;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      case 4: return isStep4Valid;
      case 5: return isStep5Valid;
      case 6: return true;
      default: return false;
    }
  };

  const steps = [
    { num: 1, label: "Business Info", icon: Building2 },
    { num: 2, label: "Business Type", icon: Package },
    { num: 3, label: "Location", icon: MapPin },
    { num: 4, label: "Products", icon: Package },
    { num: 5, label: "Partnership", icon: Target },
    { num: 6, label: "Finish", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-sm">Back to Home</span>
          </button>
          <img 
            src={pointLogo} 
            alt="PØINT BioSciences" 
            className="h-8 w-auto"
            style={{ filter: 'invert(1)' }}
          />
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                    isActive 
                      ? "bg-foreground text-background" 
                      : isCompleted 
                        ? "bg-foreground/20 text-foreground" 
                        : "bg-secondary/50 text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="font-heading text-xs font-medium hidden sm:inline">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 md:w-12 h-0.5 mx-1 ${
                      currentStep > step.num ? "bg-foreground/40" : "bg-border"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Tell us about your business
                </h1>
                <p className="font-body text-muted-foreground">
                  Let's start with the basics about you and your company.
                </p>
              </div>

              <div>
                <label className={labelClassName}>Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your company name"
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Website (Optional)</label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Type */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  What type of business are you?
                </h1>
                <p className="font-body text-muted-foreground">
                  This helps us understand how we can best serve you.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  { value: "research_lab", label: "Research Laboratory", desc: "Academic or private research facility" },
                  { value: "pharmacy", label: "Compounding Pharmacy", desc: "Licensed pharmaceutical compounding" },
                  { value: "clinic", label: "Medical Clinic / Practice", desc: "Healthcare provider or medical office" },
                  { value: "wellness_center", label: "Wellness Center / Med Spa", desc: "Aesthetic or wellness services" },
                  { value: "distributor", label: "Distributor / Wholesaler", desc: "Resale and distribution" },
                  { value: "manufacturer", label: "Manufacturer", desc: "Product manufacturing" },
                  { value: "other", label: "Other", desc: "Please describe in additional notes" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("businessType", option.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.businessType === option.value
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/50 hover:bg-secondary/30"
                    }`}
                  >
                    <div className="font-heading font-medium text-foreground">{option.label}</div>
                    <div className="font-body text-sm text-muted-foreground">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Business Address */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Where is your business located?
                </h1>
                <p className="font-body text-muted-foreground">
                  We need your business address for verification and shipping.
                </p>
              </div>

              <div>
                <label className={labelClassName}>Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="123 Business Street, Suite 100"
                  value={formData.businessAddress}
                  onChange={(e) => updateField("businessAddress", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>State / Province</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>ZIP / Postal Code</label>
                  <input
                    type="text"
                    placeholder="12345"
                    value={formData.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Country *</label>
                  <input
                    type="text"
                    required
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Product Interest */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  What products are you interested in?
                </h1>
                <p className="font-body text-muted-foreground">
                  Help us understand your product needs and intended use.
                </p>
              </div>

              <div>
                <label className={labelClassName}>What products are you looking for? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the specific peptides, compounds, or product categories you're interested in..."
                  value={formData.productsInterest}
                  onChange={(e) => updateField("productsInterest", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>How will you use these products? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the intended application of these products in your business operations..."
                  value={formData.productUsage}
                  onChange={(e) => updateField("productUsage", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          )}

          {/* Step 5: Partnership Value */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Let's build a partnership
                </h1>
                <p className="font-body text-muted-foreground">
                  Help us understand how we can create value together.
                </p>
              </div>

              <div>
                <label className={labelClassName}>How can PØINT BioSciences benefit your business? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="What are you looking for in a supplier? Quality, pricing, reliability, specific certifications, etc..."
                  value={formData.howWeBenefit}
                  onChange={(e) => updateField("howWeBenefit", e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>What impact can we make on your company? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your goals and how a partnership with us could help you achieve them..."
                  value={formData.companyImpact}
                  onChange={(e) => updateField("companyImpact", e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
          )}

          {/* Step 6: Additional Info */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Almost there!
                </h1>
                <p className="font-body text-muted-foreground">
                  Just a few more optional details to complete your application.
                </p>
              </div>

              <div>
                <label className={labelClassName}>Estimated Monthly Order Volume</label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => updateField("monthlyVolume", e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select estimated volume...</option>
                  <option value="under_1k">Under $1,000</option>
                  <option value="1k_5k">$1,000 - $5,000</option>
                  <option value="5k_10k">$5,000 - $10,000</option>
                  <option value="10k_25k">$10,000 - $25,000</option>
                  <option value="25k_50k">$25,000 - $50,000</option>
                  <option value="over_50k">Over $50,000</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>How did you hear about us?</label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => updateField("referralSource", e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select...</option>
                  <option value="google">Google Search</option>
                  <option value="social_media">Social Media</option>
                  <option value="referral">Referral / Word of Mouth</option>
                  <option value="trade_show">Trade Show / Conference</option>
                  <option value="industry_publication">Industry Publication</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Additional Notes or Questions</label>
                <textarea
                  rows={4}
                  placeholder="Anything else you'd like us to know..."
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className={inputClassName}
                />
              </div>

              {/* Summary */}
              <div className="mt-8 p-6 bg-secondary/30 rounded-xl border border-border">
                <h3 className="font-heading font-semibold text-foreground mb-4">Application Summary</h3>
                <div className="space-y-2 font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business:</span>
                    <span className="text-foreground">{formData.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="text-foreground">{formData.contactName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-foreground">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{formData.city}, {formData.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < 6 ? (
              <Button
                type="button"
                variant="hero"
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="hero"
                onClick={handleSubmit}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;