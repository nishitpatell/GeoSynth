import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { demographicsService, INDICATORS } from "@/services/demographicsService";
import { supabase } from "@/integrations/supabase/client";
import { newsService } from "@/services/newsService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiInsightsService } from "@/services/aiInsightsService";

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ countries: 195, users: 1250, searches: 15420 });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [globalNews, setGlobalNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [metricKey, setMetricKey] = useState('POPULATION');
  const [heat, setHeat] = useState({ map: {}, min: 0, max: 0 });
  const [topByMetric, setTopByMetric] = useState([]);
  const [aiCountryBusy, setAiCountryBusy] = useState(false);
  const [aiCountryText, setAiCountryText] = useState("");
  const [aiNewsBusy, setAiNewsBusy] = useState(false);
  const [aiNewsText, setAiNewsText] = useState("");

  useEffect(() => {
    setIsVisible(true);
    return () => {};
  }, []);

  useEffect(() => {
    if (selectedCountry && user) {
      fetchCountryDetails(selectedCountry.code);
    }
  }, [selectedCountry, user]);

  // Load heatmap and top countries for selected metric
  useEffect(() => {
    (async () => {
      const indicatorKey = INDICATORS[metricKey] || INDICATORS.POPULATION;
      const h = await demographicsService.getAllByIndicatorYear(indicatorKey);
      setHeat(h || { map: {}, min: 0, max: 0 });
      const top = await demographicsService.getTopCountriesByIndicator(indicatorKey, 5);
      setTopByMetric(top.items || []);
    })();
  }, [metricKey]);

  // Load Global News for logged-in users
  useEffect(() => {
    const loadNews = async () => {
      if (!user) return;
      try {
        setNewsLoading(true);
        const res = await newsService.searchNews('world', '', 6);
        setGlobalNews(res.articles || []);
      } catch (_) {
        setGlobalNews([]);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, [user]);

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
      color: "text-primary",
      bgColor: "bg-muted",
      delay: "0ms"
    },
    {
      icon: Globe,
      title: "Real-time Data",
      description: "Access live news, weather, and economic data for every country",
      color: "text-primary",
      bgColor: "bg-muted",
      delay: "100ms"
    },
    {
      icon: Heart,
      title: "Smart Wishlists",
      description: "AI-powered recommendations and personalized country collections",
      color: "text-primary",
      bgColor: "bg-muted",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with interactive charts and trend analysis",
      color: "text-primary",
      bgColor: "bg-muted",
      delay: "300ms"
    },
  ];

  const quickActions = [
    { icon: TrendingUp, label: "Currency Converter", path: "/currency", color: "bg-primary text-primary-foreground" },
    { icon: Newspaper, label: "Global News", path: "/news", color: "bg-foreground text-background" },
    { icon: Users, label: "Demographics", path: "/demographics", color: "bg-muted text-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero heading + search, visible to everyone */}
      <section className="container mx-auto px-4 pt-8 pb-6">
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Globe className="h-16 w-16 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                GEOSYNTH
              </h1>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Travel Intelligence
              </span>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore countries, compare data, and get smart insights.
          </p>
        </div>
        <div className="max-w-2xl mx-auto mb-4">
          <CountrySearch 
            onSelect={(c)=> navigate(`/country/${c.code}`)}
            hideQuickActions={true}
          />
        </div>
      </section>
      
      {/* Logged-in Home: Globe-first experience */}
      {user && (
        <section className="relative bg-background">
          {/* Primary Globe Section */}
          <div className="container mx-auto px-4 pt-6 pb-6">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="rounded-2xl border bg-card p-2 relative">
                {/* Metric selector dropdown on the card */}
                <div className="absolute top-3 right-3 z-10">
                  <Select value={metricKey} onValueChange={setMetricKey}>
                    <SelectTrigger className="h-9 w-[200px] text-xs md:text-sm bg-background/90 backdrop-blur">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {Object.keys(INDICATORS).map((key) => (
                        <SelectItem key={key} value={key} className="text-xs md:text-sm">
                          {key.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[70vh] w-full">
                  <Globe3D
                    onCountrySelect={setSelectedCountry}
                    className="h-full w-full"
                    valuesMap={heat.map}
                    min={heat.min}
                    max={heat.max}
                    metricLabel={metricKey.replace(/_/g,' ')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top by metric */}
          <div className="container mx-auto px-4 pb-8">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Top by {metricKey.replace(/_/g,' ')}</h3>
              </div>
              <div className="space-y-2">
                {topByMetric.map((i) => (
                  <div key={i.code} className="flex items-center gap-3">
                    <div className="w-40 truncate text-sm">{i.name}</div>
                    <div className="flex-1 h-2 bg-muted rounded">
                      <div className="h-2 rounded bg-primary" style={{ width: `${heat.max ? (i.value/heat.max)*100 : 0}%` }} />
                    </div>
                    <div className="w-28 text-right text-xs text-muted-foreground">{i.value?.toLocaleString?.() ?? i.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global News Section */}
          <div className="container mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Global News</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/news')}>View all</Button>
            </div>
            {newsLoading ? (
              <div className="text-muted-foreground">Loading latest headlines…</div>
            ) : globalNews.length === 0 ? (
              <div className="text-muted-foreground">No headlines available right now.</div>
            ) : (
              <>
                <div className="flex items-center justify-end mb-2">
                  <button
                    disabled={aiNewsBusy}
                    className={`text-xs underline ${aiNewsBusy ? 'text-muted-foreground' : 'text-primary'}`}
                    onClick={async ()=>{
                      try{
                        setAiNewsBusy(true);
                        const titles = globalNews.map(n=>n.title).filter(Boolean);
                        const payload = await aiInsightsService.summarizeHeadlines({ titles });
                        setAiNewsText(payload);
                      }catch(e){
                        setAiNewsText('AI summary unavailable.');
                      }finally{
                        setAiNewsBusy(false);
                      }
                    }}
                  >
                    {aiNewsBusy ? 'Summarizing…' : 'Summarize headlines'}
                  </button>
                </div>
                {aiNewsText && (
                  <div className="mb-3 p-3 border rounded bg-muted/20 text-[13px] space-y-2">
                    <div className="whitespace-pre-wrap">{typeof aiNewsText === 'string' ? aiNewsText : (aiNewsText.summary || '')}</div>
                    {Array.isArray(aiNewsText.bullets) && aiNewsText.bullets.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1">
                        {aiNewsText.bullets.map((b,i)=> (<li key={i}>{b}</li>))}
                      </ul>
                    )}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {globalNews.map((a, i) => (
                    <Card key={i} className="border bg-card overflow-hidden hover:bg-muted/50 transition-colors">
                      {a.urlToImage && (
                        <img src={a.urlToImage} alt={a.title} className="w-full h-36 object-cover" loading="lazy" />
                      )}
                      <div className="p-4">
                        <a href={a.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline line-clamp-2">
                          {a.title}
                        </a>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                          <span>{a.source}</span>
                          <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Guest-only content */}
      {!user && (
      <>
        <section className="container mx-auto px-4 py-16">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
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
      <section className="container mx-auto px-4 py-20">
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
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
                className={`group p-8 transition-all duration-500 cursor-pointer border bg-card hover:bg-muted hover:scale-105 hover:-translate-y-2`}
                style={{animationDelay: feature.delay}}
              >
                <div className="relative">
                  <div className={`w-16 h-16 ${feature.color} mb-6 p-4 rounded-2xl bg-background border border-border transition-all duration-300`}>
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
            <Card className="p-12 bg-muted border border-border">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-primary" />
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
                    onClick={() => navigate('/auth')}
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                    onClick={() => navigate('/about')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
        </>
      )}

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
                <DialogTitle className="text-3xl font-bold text-foreground">
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
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Economic Insights</div>
                  </div>
                </div>
                
                <div className="bg-muted p-6 rounded-lg mb-6">
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
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      Latest news & headlines
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      Currency exchange rates
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Cultural information
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      Demographics & statistics
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      Travel recommendations
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
              onClick={() => navigate(`/country/${selectedCountry?.code}`)}
            >
              Explore {selectedCountry?.name}
            </Button>
            {!user && (
              <Button
                variant="outline"
                className="flex-1 hover:bg-primary/5"
                onClick={() => navigate("/auth")}
              >
                Sign In for More
              </Button>
            )}
          </div>

          {/* AI Country Insight */}
          {user && countryDetails && (
            <div className="mt-3">
              <button
                disabled={aiCountryBusy}
                className={`text-xs underline ${aiCountryBusy ? 'text-muted-foreground' : 'text-primary'}`}
                onClick={async ()=>{
                  try{
                    setAiCountryBusy(true);
                    const payload = await aiInsightsService.summarizeCountry({
                      name: selectedCountry?.name,
                      region: countryDetails.region,
                      capital: countryDetails.capital,
                      population: countryDetails.population,
                      area: countryDetails.area,
                      indicators: {}
                    });
                    setAiCountryText(payload);
                  }catch(e){
                    setAiCountryText('AI insight unavailable.');
                  }finally{
                    setAiCountryBusy(false);
                  }
                }}
              >
                {aiCountryBusy ? 'Generating AI insight…' : 'Generate AI insight'}
              </button>
              {aiCountryText && (
                <div className="mt-2 p-3 border rounded bg-muted/20 text-[13px] space-y-2">
                  <div className="whitespace-pre-wrap">{typeof aiCountryText === 'string' ? aiCountryText : (aiCountryText.summary || '')}</div>
                  {Array.isArray(aiCountryText.bullets) && aiCountryText.bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1">
                      {aiCountryText.bullets.map((b,i)=> (<li key={i}>{b}</li>))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick actions when signed in */}
          {user && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => navigate(`/compare?add=${selectedCountry?.code}`)}>
                <BarChart3 className="w-4 h-4 mr-2" /> Compare
              </Button>
              <Button variant="outline" onClick={async () => {
                if (!selectedCountry) return;
                try {
                  await supabase.from('wishlists').insert({
                    user_id: user.id,
                    country_code: selectedCountry.code,
                    country_name: selectedCountry.name,
                    added_at: new Date().toISOString(),
                  });
                } catch (_) {}
              }}>
                <Heart className="w-4 h-4 mr-2" /> Add to Wishlist
              </Button>
              <Button variant="outline" onClick={() => navigate(`/profiles?country=${selectedCountry?.code}`)}>
                <Users className="w-4 h-4 mr-2" /> Profile
              </Button>
              <Button variant="outline" onClick={() => navigate(`/news?country=${selectedCountry?.name}`)}>
                <Newspaper className="w-4 h-4 mr-2" /> News
              </Button>
              <Button variant="outline" asChild>
                <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedCountry?.name + ' travel advisory')}`} target="_blank" rel="noreferrer">
                  Travel Advisory
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
