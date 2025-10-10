import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Heart, BarChart3, Globe, Sparkles, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profiles = () => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const { data: wishlistData, error } = await supabase
        .from("wishlists")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (error) throw error;
      setWishlistCount(wishlistData?.length || 0);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("Failed to load profile statistics");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20 ring-4 ring-primary/20">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl font-bold">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Information Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white">
                  <User className="h-5 w-5" />
                </div>
                Account Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <Calendar className="h-5 w-5 text-secondary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <Sparkles className="h-5 w-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <Badge className="mt-1 bg-gradient-to-r from-primary to-secondary text-white">
                    Active Explorer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent to-secondary text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Activity Stats
              </CardTitle>
              <CardDescription>Your exploration journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading stats...</p>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-center gap-3">
                      <Heart className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Wishlist</p>
                        <p className="text-2xl font-bold text-primary">{wishlistCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-secondary/10 to-secondary/5">
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Countries Explored</p>
                        <p className="text-2xl font-bold text-secondary">{wishlistCount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-8 w-8 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Comparisons Made</p>
                        <p className="text-2xl font-bold text-accent">0</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-secondary to-accent text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-2">Theme</p>
                <p className="font-medium">Use the toggle in the navigation bar</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-2">Notifications</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-2">Language</p>
                <p className="font-medium">English (US)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border-0 shadow-lg bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">
                Edit Profile
              </Button>
              <Button variant="outline" className="hover:bg-secondary/10 hover:border-secondary">
                Export Data
              </Button>
              <Button variant="outline" className="hover:bg-accent/10 hover:border-accent">
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profiles;
