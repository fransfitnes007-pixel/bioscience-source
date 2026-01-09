import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer } from "@/components/layout/Footer";
import labVideo from "@/assets/lab-facility-video.mp4";
import pointLogo from "@/assets/point-logo-transparent.png";
const Gateway = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLogoOverlay, setShowLogoOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Handle video end to show logo overlay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Show overlay when video is near the end (last 3 seconds)
      if (video.duration - video.currentTime <= 3) {
        setShowLogoOverlay(true);
      }
    };

    const handleEnded = () => {
      setShowLogoOverlay(true);
      // Restart video after a delay
      setTimeout(() => {
        setShowLogoOverlay(false);
        video.currentTime = 0;
        video.play();
      }, 4000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

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
      toast.success("Message sent! We'll get back to you shortly.");
      setShowContactModal(false);
      setContactData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 bg-secondary/30 border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30";
  const labelClassName = "font-heading text-sm font-medium text-foreground block mb-2";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Video */}
        <div className="lg:w-1/2 h-64 lg:h-auto relative bg-background overflow-hidden">
          {/* Lab facility video with blur effect */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover blur-sm scale-105"
            autoPlay
            loop
            muted
            playsInline
            src={labVideo}
          />
          
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-background/40 pointer-events-none" />
          
          {/* Logo overlay - slides in with transparent background */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
              showLogoOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img 
              src={pointLogo} 
              alt="PØINT BioSciences" 
              className={`w-80 lg:w-[420px] mb-12 transition-all duration-1000 ease-in-out ${
                showLogoOverlay ? 'opacity-100 scale-100 animate-pulse-glow' : 'opacity-0 scale-95'
              }`}
            />
            <p 
              className={`font-heading text-lg lg:text-2xl font-medium text-white tracking-[0.25em] uppercase text-center px-8 transition-all duration-1000 ease-in-out ${
                showLogoOverlay ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ 
                transitionDelay: '300ms',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)'
              }}
            >
              Absolute precision from the origin.
            </p>
          </div>
        </div>

        {/* Right side - Auth content */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 xl:p-16">
          <div className="w-full max-w-md mx-auto">
            {/* Welcome heading */}
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Welcome to PØINT BioSciences
            </h1>
            <p className="font-body text-muted-foreground mb-8">
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
                className="font-body text-sm text-foreground/70 hover:text-foreground transition-colors underline"
              >
                Forgot password?
              </button>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Open account section */}
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                Open an account with us!
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                Click on the button below to apply for an account with us. We respond within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowApplyModal(true)}
                  variant="hero"
                  className="flex-1"
                >
                  Apply for an account
                </Button>
                <Button
                  onClick={() => setShowContactModal(true)}
                  variant="heroOutline"
                  className="flex-1"
                >
                  Questions? Contact us!
                </Button>
              </div>
            </div>

            {/* Benefits link */}
            <div className="mt-8 text-center">
              <button className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors underline">
                Explore the benefits of the B2B experience
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Distributor CTA Banner */}
      <div className="bg-foreground px-8 py-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="font-heading text-lg font-semibold text-background text-center sm:text-left">
            Interested in becoming a distributor?
          </h3>
          <Button
            onClick={() => setShowApplyModal(true)}
            className="bg-background text-foreground hover:bg-background/90 font-body font-medium rounded-lg px-8 transition-colors"
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-foreground">
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
              variant="hero"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold text-foreground">
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
              variant="hero"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6"
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
