import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Plus, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import CountrySearch from "@/components/CountrySearch";
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
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
        )}
      </div>

      {/* Add Country Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-3xl p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
