import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface WishlistItem {
  id: string;
  country_code: string;
  country_name: string;
  notes: string | null;
  created_at: string;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        toast.error("Please sign in to view your wishlist");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
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

  const removeFromWishlist = async (id: string) => {
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            My Wishlist
          </h1>
          <p className="text-xl text-muted-foreground">
            Countries you want to explore
          </p>
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
              <Button onClick={() => navigate("/")}>
                Explore Countries
              </Button>
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
    </div>
  );
};

export default Wishlist;
