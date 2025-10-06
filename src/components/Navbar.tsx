import { Link, useNavigate } from "react-router-dom";
import { Globe, Heart, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Globe className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WorldLens
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/wishlist">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/compare">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Compare
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
