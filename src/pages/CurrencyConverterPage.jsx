import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, DollarSign, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";

const CurrencyConverterPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        toast.error("Please sign in to use the currency converter");
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const popularPairs = [
    { from: 'USD', to: 'EUR', label: 'USD → EUR' },
    { from: 'USD', to: 'GBP', label: 'USD → GBP' },
    { from: 'EUR', to: 'USD', label: 'EUR → USD' },
    { from: 'GBP', to: 'USD', label: 'GBP → USD' },
    { from: 'USD', to: 'JPY', label: 'USD → JPY' },
    { from: 'USD', to: 'INR', label: 'USD → INR' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-primary/5">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real-time Exchange Rates
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Currency Converter
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Convert between different currencies with real-time exchange rates from around the world
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Converter */}
            <div className="lg:col-span-2">
              <CurrencyConverter />
              
              {/* Info Card */}
              <Card className="mt-6 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-primary" />
                    About Exchange Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Real-time Data:</strong> Exchange rates are updated regularly and sourced from reliable financial data providers.
                  </p>
                  <p>
                    <strong>Accuracy:</strong> Rates shown are indicative and may vary slightly from actual transaction rates at banks or exchange services.
                  </p>
                  <p>
                    <strong>Usage:</strong> Use this tool for quick conversions and reference. For official transactions, please consult your financial institution.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Popular Pairs Sidebar */}
            <div className="space-y-6">
              <Card className="border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Popular Pairs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {popularPairs.map((pair, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start hover:bg-secondary/10 hover:border-secondary transition-all"
                        onClick={() => {
                          // This would set the converter to these currencies
                          toast.info(`Click the converter to set ${pair.label}`);
                        }}
                      >
                        <span className="font-mono">{pair.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <RefreshCw className="h-4 w-4 text-accent" />
                    Live Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Exchange rates are automatically refreshed to ensure you always have the most current information for your currency conversions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="font-semibold">Need More Features?</h3>
                    <p className="text-sm text-muted-foreground">
                      Historical rates, charts, and advanced analytics coming soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <Card className="bg-muted/50 border-0">
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Pro Tip:</strong> Bookmark this page for quick access to currency conversions while exploring countries!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterPage;
