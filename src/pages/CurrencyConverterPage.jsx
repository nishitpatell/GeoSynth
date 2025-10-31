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
    <div className="h-screen overflow-hidden bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-2 h-[calc(100vh-64px)] flex flex-col">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-primary/5">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="max-w-7xl mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="flex justify-center mb-1">
              <Badge className="bg-primary text-primary-foreground px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Real-time Exchange Rates
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-1 text-foreground">
              Currency Converter
            </h1>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Convert between different currencies with real-time exchange rates from around the world
            </p>
          </div>

          {/* About Exchange Rates at top */}
          <Card className="mb-2 border-primary/20">
            <CardHeader className="py-1.5">
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4 text-primary" />
                About Exchange Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground grid md:grid-cols-3 gap-1">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden">
            {/* Main Converter */}
            <div className="lg:col-span-7 overflow-hidden">
              <CurrencyConverter compact />
            </div>

            {/* Popular Pairs Sidebar */}
            <div className="space-y-4 lg:col-span-5 overflow-hidden">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Popular Pairs
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="grid grid-cols-1 gap-2">
                    {popularPairs.map((pair, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-between hover:bg-primary/10 transition-all"
                        onClick={() => navigate(`/currency?from=${pair.from}&to=${pair.to}&amount=100`)}
                      >
                        <span className="font-mono">{pair.label}</span>
                        <span className="text-xs text-muted-foreground">Set</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Live Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Exchange rates are automatically refreshed to ensure you always have the most current information for your currency conversions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Note hidden to ensure no page scroll */}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterPage;
