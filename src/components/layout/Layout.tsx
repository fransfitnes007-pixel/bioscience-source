import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { AgeVerification } from "@/components/AgeVerification";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AgeVerification />
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};
