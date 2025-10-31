import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowLeft, Users, DollarSign, Building2, Map, Newspaper, Cloud, TrendingUp, Globe, Calendar, ExternalLink, Star, MapPin, Languages, Crown, Landmark, Thermometer, Wind, Droplets } from "lucide-react";
import { toast } from "sonner";
import { enhancedCountryService } from "@/services/enhancedCountryService";
import { weatherService } from "@/services/weatherService";
import { exchangeRateService } from "@/services/exchangeRateService";

const CountryProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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
      loadCountryData();
    }
  }, [user, code]);

  useEffect(() => {
    if (countryData && !loading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [countryData, loading]);

  const loadCountryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await enhancedCountryService.getCountryData(code);
      setCountryData(data);
    } catch (err) {
      console.error('Error loading country data:', err);
      setError('Failed to load country data');
      toast.error('Failed to load country information');
    } finally {
      setLoading(false);
    }
  };

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
            country_code: code,
            country_name: countryData?.basic?.name || code,
          });
        
        toast.success("Added to wishlist");
        setIsInWishlist(true);
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Hero Skeleton */}
            <div className="relative overflow-hidden rounded-3xl bg-muted p-8">
              <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-28 rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !countryData?.basic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
            <p className="text-muted-foreground mb-4">{error || 'Unable to load country information'}</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { basic, news, weather, exchange, wikipedia } = countryData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-white/50 dark:hover:bg-gray-800/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant={isInWishlist ? "default" : "outline"}
            onClick={toggleWishlist}
            className={`transition-all duration-300 ${
              isInWishlist 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105" 
                : "hover:bg-primary/5"
            }`}
          >
            <Heart className={`h-4 w-4 mr-2 transition-all duration-300 ${isInWishlist ? "fill-current scale-110" : ""}`} />
            {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
          </Button>
        </div>

        {/* Hero Section */}
        <div className={`relative overflow-hidden rounded-3xl bg-primary p-8 mb-8 shadow-2xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              {basic.flag && (
                <div className="relative group">
                  <img 
                    src={basic.flag} 
                    alt={`${basic.name} flag`} 
                    className="w-20 h-14 object-cover rounded-lg border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-5xl font-bold mb-2">
                  {basic.name}
                </h1>
                <p className="text-xl text-white/80 mb-3">{basic.officialName}</p>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{basic.capital}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{enhancedCountryService.formatNumber(basic.population)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Globe className="h-3 w-3 mr-1" />
                {basic.region}
              </Badge>
              {basic.subregion && (
                <Badge className="bg-white/15 text-white border-white/25 hover:bg-white/25 transition-colors">
                  <Map className="h-3 w-3 mr-1" />
                  {basic.subregion}
                </Badge>
              )}
              {basic.independent && (
                <Badge className="bg-primary/80 text-primary-foreground border-primary/50 hover:bg-primary/90 transition-colors">
                  <Crown className="h-3 w-3 mr-1" />
                  Independent
                </Badge>
              )}
              {basic.unMember && (
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  <Landmark className="h-3 w-3 mr-1" />
                  UN Member
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Demographics Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border bg-card hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-foreground font-bold">
                  Demographics
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Population
                  </dt>
                  <dd className="text-lg font-bold text-primary">
                    {enhancedCountryService.formatNumber(basic.population)}
                  </dd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Capital
                  </dt>
                  <dd className="text-lg font-bold text-foreground">{basic.capital}</dd>
                </div>
                <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </dt>
                  <dd className="flex flex-wrap gap-1">
                    {basic.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Economy Card */}
          <Card className="group hover:shadow-2xl transition-all duration-500 border bg-card hover:scale-105">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-foreground font-bold">
                  Economy & Currency
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <dt className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Currency
                  </dt>
                  <dd className="flex flex-wrap gap-1">
                    {basic.currencies.map((curr, index) => {
                      const details = basic.currencyDetails[curr];
                      return (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {details ? `${details.name} (${curr})` : curr}
                        </Badge>
                      );
                    })}
                  </dd>
                </div>
                {exchange && !exchange.error && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <dt className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Exchange Rate (USD)
                    </dt>
                    <dd className="text-lg font-bold text-primary">
                      {exchange.rates?.USD ? `1 ${exchange.primaryCurrency} = ${exchange.rates.USD.toFixed(4)} USD` : 'N/A'}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Geography Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-accent" />
                Geography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Area</dt>
                  <dd className="text-lg font-semibold">{enhancedCountryService.formatArea(basic.area)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Region</dt>
                  <dd className="text-lg font-semibold">{basic.region}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Landlocked</dt>
                  <dd className="text-lg font-semibold">{basic.landlocked ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Weather Card */}
          {weather && !weather.error && weather.current && (
            <Card className="group hover:shadow-2xl transition-all duration-500 border bg-card hover:scale-105">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <span className="text-foreground font-bold">
                    Weather in {basic.capital}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-5 w-5 text-primary" />
                      <span className="text-3xl font-bold text-primary">
                        {weatherService.formatTemperature(weather.current.temperature)}
                      </span>
                    </div>
                    <span className="text-4xl">
                      {weatherService.getWeatherDescription(weather.current.weatherCode, weather.current.isDay).icon}
                    </span>
                  </div>
                  <p className="text-center text-sm text-muted-foreground p-2 rounded-lg bg-muted">
                    {weatherService.getWeatherDescription(weather.current.weatherCode, weather.current.isDay).description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Droplets className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Humidity</p>
                        <p className="font-bold text-primary">{weather.current.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Wind</p>
                        <p className="font-bold text-primary">{weather.current.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Currency Exchange Card */}
          {exchange && !exchange.error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Currency Exchange
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">1 {exchange.primaryCurrency} equals:</p>
                    <div className="space-y-1">
                      {exchange.popularPairs.slice(0, 3).map(currency => (
                        <div key={currency} className="flex justify-between text-sm">
                          <span>{currency}:</span>
                          <span className="font-medium">
                            {exchange.rates[currency] ? exchange.rates[currency].toFixed(4) : 'N/A'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wikipedia Info Card */}
          {wikipedia && !wikipedia.error && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  About {basic.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wikipedia.thumbnail && (
                    <img src={wikipedia.thumbnail} alt={basic.name} className="w-full h-32 object-cover rounded" />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {wikipedia.extract}
                  </p>
                  {wikipedia.pageUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={wikipedia.pageUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Latest News Section */}
        <Card className={`mt-8 group hover:shadow-2xl transition-all duration-500 border bg-card ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                <Newspaper className="h-6 w-6" />
              </div>
              <span className="text-foreground font-bold text-xl">
                Latest News from {basic.name}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {news && news.articles && news.articles.length > 0 ? (
              <div className="grid gap-4">
                {news.articles.slice(0, 4).map((article, index) => (
                  <div key={index} className="group/article p-4 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-300">
                    <div className="flex gap-4">
                      {article.urlToImage && (
                        <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                          <img 
                            src={article.urlToImage} 
                            alt={article.title}
                            className="w-24 h-20 object-cover group-hover/article:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover/article:text-primary transition-colors">
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {article.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <Badge variant="outline" className="border-border">
                            {article.source}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/article:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  {news?.error ? `Unable to load news: ${news.error}` : 'No recent news available for this country.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CountryProfile;
