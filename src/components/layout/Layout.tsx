import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/CookieConsent";

interface LayoutProps {
  children: ReactNode;
  footerWordmark?: string;
}

export const Layout = ({ children, footerWordmark }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer wordmark={footerWordmark} />
      <CookieConsent />
    </div>
  );
};
