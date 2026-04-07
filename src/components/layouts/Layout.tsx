import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";

interface LayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, noPadding = false }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const skipPadding = isHome || noPadding;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      <Navbar />
      <main className={`flex-1 w-full flex flex-col ${skipPadding ? "pt-0" : "pt-[82px] md:pt-[108px]"}`}>
        {children}
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default Layout;
