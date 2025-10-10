import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, Heart, BarChart3, LogOut, User, Sparkles, TrendingUp, Bell, Search } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

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

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Globe className="h-8 w-8 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                World Lens
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Explore • Discover • Connect
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                  <Button 
                    variant={isActive('/wishlist') ? 'default' : 'ghost'} 
                    size="sm" 
                    asChild
                    className={`transition-all duration-200 ${isActive('/wishlist') ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'hover:bg-pink-50 dark:hover:bg-pink-950'}`}
                  >
                    <Link to="/wishlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span className="hidden lg:inline">Wishlist</span>
                      <Badge variant="secondary" className="ml-1 text-xs bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                        3
                      </Badge>
                    </Link>
                  </Button>
                  
                  <Button 
                    variant={isActive('/compare') ? 'default' : 'ghost'} 
                    size="sm" 
                    asChild
                    className={`transition-all duration-200 ${isActive('/compare') ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'hover:bg-blue-50 dark:hover:bg-blue-950'}`}
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
                          <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
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
  );
};

export default Navbar;
