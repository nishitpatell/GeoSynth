import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Plus, Search as SearchIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import CountrySearch from "@/components/CountrySearch";
import { aiInsightsService } from "@/services/aiInsightsService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load wishlist");
    } else {
      setWishlist(data || []);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (id) => {
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to remove item");
    } else {
      toast.success("Removed from wishlist");
      fetchWishlist();
    }
  };

  const handleAddToWishlist = async (country) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    // Check if already in wishlist
    const existing = wishlist.find(item => item.country_code === country.code);
    if (existing) {
      toast.error("Country already in your wishlist");
      setAddDialogOpen(false);
      return;
    }

    const { error } = await supabase
      .from("wishlists")
      .insert({
        user_id: user.id,
        country_code: country.code,
        country_name: country.name,
      });

    if (error) {
      toast.error("Failed to add to wishlist");
    } else {
      toast.success(`Added ${country.name} to wishlist`);
      setAddDialogOpen(false);
      fetchWishlist();
    }
  };

  const generateAIInsight = async () => {
    if (wishlist.length === 0) {
      toast.error('Add some countries to your wishlist first');
      return;
    }
    
    try {
      setAiLoading(true);
      const insight = await aiInsightsService.analyzeWishlist({
        countries: wishlist
      });
      setAiInsight(insight);
    } catch (error) {
      console.error('Error generating AI insight:', error);
      toast.error('Failed to generate AI insight');
    } finally {
      setAiLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                Please sign in to view your wishlist
              </p>
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              My Wishlist
            </h1>
            <p className="text-xl text-muted-foreground">
              Countries you want to explore {wishlist.length > 0 && `(${wishlist.length})`}
            </p>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : wishlist.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                Your wishlist is empty
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Country
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Explore Countries
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* AI Insights Card */}
            {wishlist.length > 0 && (
              <Card className="mb-6 border-2 border-primary/30 bg-card">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Wishlist Analysis
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIInsight}
                      disabled={aiLoading}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      {aiLoading ? 'Analyzing...' : aiInsight ? 'Regenerate' : 'Analyze Wishlist'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!aiInsight && !aiLoading && (
                    <div className="text-center py-6">
                      <Sparkles className="h-10 w-10 text-primary mx-auto mb-2 opacity-50" />
                      <p className="text-foreground font-medium">Get AI-powered insights about your travel wishlist</p>
                    </div>
                  )}
                  {aiLoading && (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                  )}
                  {aiInsight && !aiLoading && (
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground leading-relaxed">{aiInsight.summary}</p>
                      </div>
                      {aiInsight.bullets && aiInsight.bullets.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Insights:</p>
                          <ul className="space-y-2">
                            {aiInsight.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-sm text-foreground">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiInsight.recommendations && aiInsight.recommendations.length > 0 && (
                        <div className="space-y-2 mt-4 p-3 rounded-lg bg-background/50">
                          <p className="text-sm font-semibold text-foreground">Recommended Destinations:</p>
                          <ul className="space-y-2">
                            {aiInsight.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">→</span>
                                <span className="text-sm text-muted-foreground">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
              <Card key={item.id} className="hover:shadow-[var(--shadow-medium)] transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.country_name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mb-4">{item.notes}</p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/country/${item.country_code}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Country Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Add Country to Wishlist
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <CountrySearch 
              onSelect={handleAddToWishlist}
              hideQuickActions={true}
              placeholder="Search for a country to add..."
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wishlist;
