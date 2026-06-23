import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/layout/CartIcon";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SpinningLogo3D } from "@/components/home/SpinningLogo3D";
import resurrectedMark from "@/assets/resurrected-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "B2B", path: "/b2b/apply" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Resurrected Labz home">
            <SpinningLogo3D
              src={resurrectedMark}
              size={2.6}
              cameraZ={3.6}
              speed={0.8}
              className="w-14 h-14 lg:w-16 lg:h-16 drop-shadow-[0_0_18px_rgba(255,255,255,0.55)]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <CartIcon />
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-sm tracking-wide">
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/portal")}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/portal/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <Link to="/account">
                <Button variant="outline" size="sm" className="min-w-20 text-sm tracking-wide text-foreground">
                  Sign In
                </Button>
              </Link>
            ) : null}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <CartIcon />
            {!isLoading && !user && (
              <Link to="/account">
                <Button variant="outline" size="sm" className="min-w-20 px-3 text-xs tracking-wide text-foreground">
                  Sign In
                </Button>
              </Link>
            )}
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-border/30 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-sm font-medium tracking-wide uppercase py-2 transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isLoading && user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="font-body text-sm font-medium tracking-wide py-2 text-muted-foreground">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/portal" onClick={() => setIsMenuOpen(false)} className="font-body text-sm font-medium tracking-wide py-2 text-muted-foreground">
                    My Orders
                  </Link>
                  <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : !isLoading ? (
                <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full mt-4 text-foreground">
                    Sign In
                  </Button>
                </Link>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
