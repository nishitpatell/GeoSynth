import { useState } from "react";
import Navbar from "@/components/Navbar";
import WorldMap from "@/components/WorldMap";
import CountrySearch from "@/components/CountrySearch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Map, Heart, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: Map,
      title: "Interactive Map",
      description: "Explore countries with our beautiful, interactive world map",
    },
    {
      icon: Globe,
      title: "Detailed Profiles",
      description: "Access comprehensive data on demographics, economy, and culture",
    },
    {
      icon: Heart,
      title: "Create Wishlists",
      description: "Save and organize your favorite countries for future reference",
    },
    {
      icon: BarChart3,
      title: "Compare Countries",
      description: "Side-by-side comparison with advanced visualizations",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Explore the World
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover comprehensive information about every country. Compare data, create wishlists, and gain insights with our interactive platform.
            </p>
            <CountrySearch />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="p-6 shadow-[var(--shadow-strong)]">
          <h2 className="text-2xl font-bold mb-6 text-center">Interactive World Map</h2>
          <p className="text-center text-muted-foreground mb-6">
            Click on any country to view detailed information
          </p>
          <WorldMap onCountryClick={setSelectedCountry} />
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-[var(--shadow-medium)] transition-shadow">
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Country Preview Dialog */}
      <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCountry?.name}</DialogTitle>
            <DialogDescription>
              Click below to view full details about this country (requires sign in)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Basic information is available to all visitors. Sign in to access:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Complete demographic data
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Economic indicators and trends
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Cultural information and travel advisories
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Latest news and updates
              </li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => navigate(`/country/${selectedCountry?.code}`)}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
