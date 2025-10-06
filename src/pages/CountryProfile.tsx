import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Users, DollarSign, Building2, Map } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const CountryProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        toast.error("Please sign in to view country details");
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
      checkWishlist();
    }
  }, [user, code]);

  const checkWishlist = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", user.id)
      .eq("country_code", code)
      .maybeSingle();

    setIsInWishlist(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please sign in to manage your wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("country_code", code);
        
        toast.success("Removed from wishlist");
        setIsInWishlist(false);
      } else {
        await supabase
          .from("wishlists")
          .insert({
            user_id: user.id,
            country_code: code!,
            country_name: code!, // In production, fetch actual country name
          });
        
        toast.success("Added to wishlist");
        setIsInWishlist(true);
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  // Mock data - in production, fetch from API
  const countryData = {
    name: code,
    capital: "Capital City",
    population: "50,000,000",
    gdp: "$1.5 trillion",
    area: "500,000 km²",
    currency: "Local Currency",
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant={isInWishlist ? "default" : "outline"}
            onClick={toggleWishlist}
          >
            <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current" : ""}`} />
            {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{countryData.name}</h1>
          <p className="text-xl text-muted-foreground">Comprehensive Country Profile</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Population</dt>
                  <dd className="text-lg font-semibold">{countryData.population}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Capital</dt>
                  <dd className="text-lg font-semibold">{countryData.capital}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-secondary" />
                Economy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">GDP</dt>
                  <dd className="text-lg font-semibold">{countryData.gdp}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Currency</dt>
                  <dd className="text-lg font-semibold">{countryData.currency}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-accent" />
                Geography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Area</dt>
                  <dd className="text-lg font-semibold">{countryData.area}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              News integration coming soon. This section will display latest headlines and updates for {countryData.name}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CountryProfile;
