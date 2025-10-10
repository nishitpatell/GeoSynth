import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Globe3D } from "@/features/globe";
import CountrySearch from "@/components/CountrySearch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Heart, BarChart3, Sparkles, TrendingUp, Users, Newspaper, ArrowRight, Star, MapPin, Languages, Map as MapIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { enhancedCountryService } from "@/services/enhancedCountryService";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ countries: 195, users: 1250, searches: 15420 });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        countries: 195,
        users: prev.users + Math.floor(Math.random() * 3),
        searches: prev.searches + Math.floor(Math.random() * 10)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedCountry && user) {
      fetchCountryDetails(selectedCountry.code);
    }
  }, [selectedCountry, user]);

  const fetchCountryDetails = async (countryCode) => {
    try {
      setLoadingDetails(true);
      const data = await enhancedCountryService.getBasicCountryData(countryCode);
      setCountryDetails(data);
    } catch (error) {
      console.error('Error fetching country details:', error);
      setCountryDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const features = [
    {
      icon: MapIcon,
      title: "Interactive Map",
      description: "Explore countries with our beautiful, interactive world map",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      delay: "0ms"
    },
    {
      icon: Globe,
      title: "Real-time Data",
      description: "Access live news, weather, and economic data for every country",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      delay: "100ms"
    },
    {
      icon: Heart,
      title: "Smart Wishlists",
      description: "AI-powered recommendations and personalized country collections",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with interactive charts and trend analysis",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      delay: "300ms"
    },
  ];

  const quickActions = [
    { icon: TrendingUp, label: "Currency Converter", path: "/currency", color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
    { icon: Newspaper, label: "Global News", path: "/news", color: "bg-gradient-to-r from-blue-400 to-purple-500" },
    { icon: Users, label: "Demographics", path: "/demographics", color: "bg-gradient-to-r from-green-400 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className={`text-center max-w-4xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Real-time APIs
              </Badge>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Geosynth
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              Discover comprehensive information about every country with 
              <span className="text-primary font-semibold"> real-time data</span>, 
              <span className="text-secondary font-semibold"> interactive maps</span>, and 
              <span className="text-accent font-semibold"> AI-powered insights</span>
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stats.countries}</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">{stats.users.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stats.searches.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Searches Today</div>
              </div>
            </div>
            
            <CountrySearch />
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`${action.color} text-white border-0 hover:scale-105 transition-all duration-200 shadow-lg`}
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-16">
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Interactive 3D Globe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our beautiful, interactive 3D globe. Click on any country to discover real-time data, news, weather, and cultural insights.
            </p>
          </div>
          
          <Globe3D onCountrySelect={setSelectedCountry} className="animate-in fade-in duration-700" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-background to-muted/10">
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the next generation of country exploration with our cutting-edge features and real-time data integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 ${feature.bgColor} hover:scale-105 hover:-translate-y-2`}
                style={{animationDelay: feature.delay}}
              >
                <div className="relative">
                  <div className={`w-16 h-16 ${feature.color} mb-6 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="p-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20 shadow-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Explore the World?
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who trust Geosynth for accurate, real-time country information.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Enhanced Country Preview Dialog */}
      <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedCountry?.flag && (
                <img 
                  src={selectedCountry.flag} 
                  alt={`${selectedCountry.name} flag`} 
                  className="w-12 h-8 object-cover rounded border shadow-sm"
                />
              )}
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {selectedCountry?.name}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  Discover comprehensive insights about this country
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-6">
            {user && countryDetails && !loadingDetails ? (
              /* Signed-in user: Show basic country overview */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Capital</span>
                    </div>
                    <p className="font-semibold text-lg">{countryDetails.capital}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-muted-foreground">Population</span>
                    </div>
                    <p className="font-semibold text-lg">{enhancedCountryService.formatNumber(countryDetails.population)}</p>
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Region</span>
                  </div>
                  <p className="font-semibold">{countryDetails.region} {countryDetails.subregion && `• ${countryDetails.subregion}`}</p>
                </div>
                {countryDetails.languages && countryDetails.languages.length > 0 && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Languages</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {countryDetails.languages.slice(0, 3).map((lang, idx) => (
                        <Badge key={idx} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : user && loadingDetails ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading country details...</p>
              </div>
            ) : (
              /* Not signed in: Show feature preview */
              <>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Population Data</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Economic Insights</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    What you'll discover:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Real-time weather & climate
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Latest news & headlines
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      Currency exchange rates
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Cultural information
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      Demographics & statistics
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      Travel recommendations
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate(`/country/${selectedCountry?.code}`)}
            >
              <Globe className="w-4 h-4 mr-2" />
              Explore {selectedCountry?.name}
            </Button>
            {!user && (
              <Button
                variant="outline"
                className="flex-1 border-primary/20 hover:bg-primary/5"
                onClick={() => navigate("/auth")}
              >
                Sign In for More
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
