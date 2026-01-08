import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Gateway = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
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
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast.success("Logged in successfully");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
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

      toast.success("Application submitted! We respond within 24 hours.");
      setShowApplyModal(false);
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

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, just show success - you can add a contact table later
      toast.success("Message sent! We'll get back to you shortly.");
      setShowContactModal(false);
      setContactData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg font-body text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00a6ed]/50 focus:border-[#00a6ed]";
  const labelClassName = "font-body text-sm font-medium text-gray-900 block mb-2";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left side - Video */}
      <div className="lg:w-1/2 h-64 lg:h-auto relative bg-gray-900">
        {/* Video placeholder - replace src with your video */}
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster=""
        >
          {/* Add your video source here */}
          {/* <source src="/your-video.mp4" type="video/mp4" /> */}
        </video>
        
        {/* Fallback gradient background when no video */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10" />
        
        {/* Optional overlay for video */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Right side - Auth content */}
      <div className="lg:w-1/2 flex flex-col">
        {/* Main form area */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Welcome heading */}
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Welcome to PØINT BioSciences
            </h1>
            <p className="font-body text-gray-600 mb-8">
              Sign in below to access our B2B platform.
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={labelClassName}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClassName}
                />
              </div>
              
              <div>
                <label className={labelClassName}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  className={inputClassName}
                />
              </div>

              <button
                type="button"
                className="font-body text-sm text-[#00a6ed] hover:text-[#0090d0] transition-colors"
              >
                Forgot password?
              </button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#00a6ed] hover:bg-[#0090d0] text-white font-body font-medium text-base rounded-lg transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Open account section */}
            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">
                Open an account with us!
              </h2>
              <p className="font-body text-gray-600 mb-6">
                Click on the button below to apply for an account with us. We respond within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowApplyModal(true)}
                  className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-body font-medium rounded-lg transition-colors"
                >
                  Apply for an account
                </Button>
                <Button
                  onClick={() => setShowContactModal(true)}
                  variant="outline"
                  className="flex-1 h-12 border-gray-300 text-gray-900 hover:bg-gray-50 font-body font-medium rounded-lg transition-colors"
                >
                  Questions? Contact us today!
                </Button>
              </div>
            </div>

            {/* Benefits link */}
            <div className="mt-8 text-center">
              <button className="font-body text-sm text-[#00a6ed] hover:text-[#0090d0] transition-colors underline">
                Explore the benefits of the B2B experience
              </button>
            </div>
          </div>
        </div>

        {/* Distributor CTA Banner */}
        <div className="bg-[#00a6ed] px-8 py-6">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-heading text-lg font-semibold text-white">
              Interested in becoming a distributor?
            </h3>
            <Button
              onClick={() => setShowApplyModal(true)}
              className="bg-white text-[#00a6ed] hover:bg-gray-100 font-body font-medium rounded-lg px-6 transition-colors"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="bg-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-gray-900">
              Apply for an Account
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleApply} className="space-y-4 mt-4">
            <div>
              <label className={labelClassName}>Business Name *</label>
              <input
                type="text"
                required
                value={applyData.businessName}
                onChange={(e) => setApplyData((prev) => ({ ...prev, businessName: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Contact Name *</label>
              <input
                type="text"
                required
                value={applyData.contactName}
                onChange={(e) => setApplyData((prev) => ({ ...prev, contactName: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Email *</label>
              <input
                type="email"
                required
                value={applyData.email}
                onChange={(e) => setApplyData((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Phone</label>
              <input
                type="tel"
                value={applyData.phone}
                onChange={(e) => setApplyData((prev) => ({ ...prev, phone: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Business Type</label>
              <select
                value={applyData.businessType}
                onChange={(e) => setApplyData((prev) => ({ ...prev, businessType: e.target.value }))}
                className={inputClassName}
              >
                <option value="">Select...</option>
                <option value="research_lab">Research Laboratory</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="clinic">Clinic</option>
                <option value="distributor">Distributor</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className={labelClassName}>Tax ID / EIN</label>
              <input
                type="text"
                value={applyData.taxId}
                onChange={(e) => setApplyData((prev) => ({ ...prev, taxId: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Intended Use</label>
              <textarea
                rows={3}
                value={applyData.intendedUse}
                onChange={(e) => setApplyData((prev) => ({ ...prev, intendedUse: e.target.value }))}
                className={inputClassName}
                placeholder="Describe how you plan to use our products..."
              />
            </div>
            
            <div>
              <label className={labelClassName}>Additional Notes</label>
              <textarea
                rows={2}
                value={applyData.notes}
                onChange={(e) => setApplyData((prev) => ({ ...prev, notes: e.target.value }))}
                className={inputClassName}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00a6ed] hover:bg-[#0090d0] text-white font-body font-medium text-base rounded-lg transition-colors mt-6"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-gray-900">
              Contact Us
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleContact} className="space-y-4 mt-4">
            <div>
              <label className={labelClassName}>Your Name *</label>
              <input
                type="text"
                required
                value={contactData.name}
                onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Email *</label>
              <input
                type="email"
                required
                value={contactData.email}
                onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClassName}
              />
            </div>
            
            <div>
              <label className={labelClassName}>Message *</label>
              <textarea
                rows={4}
                required
                value={contactData.message}
                onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                className={inputClassName}
                placeholder="How can we help you?"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00a6ed] hover:bg-[#0090d0] text-white font-body font-medium text-base rounded-lg transition-colors mt-6"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gateway;
