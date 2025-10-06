import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Plus } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import CountrySearch from "@/components/CountrySearch";

const Compare = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        toast.error("Please sign in to compare countries");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Compare Countries
          </h1>
          <p className="text-xl text-muted-foreground">
            Side-by-side comparison of country data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Countries to Compare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">First Country</p>
                <CountrySearch />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Second Country</p>
                <CountrySearch />
              </div>
            </div>
            <Button className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare
            </Button>
            
            <div className="mt-8 p-8 text-center border-2 border-dashed rounded-lg">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-2">
                Comparison Coming Soon
              </p>
              <p className="text-sm text-muted-foreground">
                Select two countries above to see detailed comparative analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compare;
