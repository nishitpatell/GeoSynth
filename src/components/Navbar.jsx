import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, Heart, BarChart3, LogOut, User, Sparkles, TrendingUp, Bell, Search, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import CountrySearch from "@/components/CountrySearch";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Fetch wishlist count
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!user) {
        setWishlistCount(0);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('wishlists')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (!error) {
          setWishlistCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching wishlist count:', error);
      }
    };

    fetchWishlistCount();
  }, [user]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  const handleSearchSelect = (country) => {
    setSearchOpen(false);
    navigate(`/country/${country.code}`);
  };

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
    <nav className="border-b-2 border-black dark:border-white bg-white dark:bg-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Globe className="h-8 w-8 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
                GEOSYNTH
              </span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Travel Intelligence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Quick Search Button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(true)}
                  className="hidden lg:flex items-center gap-2 hover:bg-muted border border-border"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">Search...</span>
                  <Badge variant="outline" className="text-xs ml-1 border-primary text-primary">⌘K</Badge>
                </Button>
                
                {/* Mobile Search Icon */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(true)}
                  className="lg:hidden hover:bg-muted border border-border"
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                  <Button 
                    variant={isActive('/wishlist') ? 'default' : 'ghost'} 
                    size="sm" 
                    asChild
                    className={`transition-all duration-200 border ${isActive('/wishlist') ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                  >
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="hidden lg:inline">Wishlist</span>
                      {wishlistCount > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-secondary text-secondary-foreground border border-secondary">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  
                  <Button 
                    variant={isActive('/compare') ? 'default' : 'ghost'} 
                    size="sm" 
                    asChild
                    className={`transition-all duration-200 border ${isActive('/compare') ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:bg-muted'}`}
                  >
                    <Link to="/compare" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden lg:inline">Compare</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant={isActive('/currency') ? 'default' : 'ghost'} 
                    size="sm" 
                    asChild
                    className={`transition-all duration-200 ${isActive('/currency') ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' : 'hover:bg-yellow-50 dark:hover:bg-yellow-950'}`}
                  >
                    <Link to="/currency" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden lg:inline">Currency</span>
                    </Link>
                  </Button>
                </div>
                
                {/* Dark Mode Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleDarkMode}
                  className="hover:bg-primary/5"
                  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-primary/5">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Button>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none">Welcome back!</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <Badge variant="secondary" className="w-fit text-xs mt-1">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Pro Explorer
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Navigation */}
                    <div className="md:hidden space-y-1 mb-2">
                      <DropdownMenuItem asChild>
                        <Link to="/wishlist" className="flex items-center gap-2 w-full">
                          <Heart className="h-4 w-4" />
                          <span>Wishlist</span>
                          {wishlistCount > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">{wishlistCount}</Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/compare" className="flex items-center gap-2 w-full">
                          <BarChart3 className="h-4 w-4" />
                          <span>Compare</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/currency" className="flex items-center gap-2 w-full">
                          <TrendingUp className="h-4 w-4" />
                          <span>Currency Converter</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/profiles" className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5">
                  <Link to="/auth" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link to="/auth?mode=signup" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress Bar for Page Loading */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 transition-opacity duration-300" />
    </nav>

    {/* Search Dialog */}
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Search Countries
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <CountrySearch 
            onSelect={handleSearchSelect}
            hideQuickActions={true}
          />
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Navbar;
