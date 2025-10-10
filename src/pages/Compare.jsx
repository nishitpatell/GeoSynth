import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, X, ArrowRight, Users, DollarSign, MapPin, Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";
import CountrySearch from "@/components/CountrySearch";
import { toast } from "sonner";
import { enhancedCountryService } from "@/services/enhancedCountryService";

const Compare = () => {
  const { user } = useAuth();
  const [country1, setCountry1] = useState(null);
  const [country2, setCountry2] = useState(null);
  const [country1Data, setCountry1Data] = useState(null);
  const [country2Data, setCountry2Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);

  const handleCountry1Select = (country) => {
    if (country2 && country.code === country2.code) {
      toast.error("Please select different countries to compare");
      return;
    }
    setCountry1(country);
    setCountry1Data(null);
    setComparing(false);
    toast.success(`Selected ${country.name} for comparison`);
  };

  const handleCountry2Select = (country) => {
    if (country1 && country.code === country1.code) {
      toast.error("Please select different countries to compare");
      return;
    }
    setCountry2(country);
    setCountry2Data(null);
    setComparing(false);
    toast.success(`Selected ${country.name} for comparison`);
  };

  const handleCompare = async () => {
    if (!country1 || !country2) {
      toast.error("Please select both countries to compare");
      return;
    }

    setLoading(true);
    setComparing(true);
    
    try {
      const [data1, data2] = await Promise.all([
        enhancedCountryService.getBasicCountryData(country1.code),
        enhancedCountryService.getBasicCountryData(country2.code)
      ]);
      
      setCountry1Data(data1);
      setCountry2Data(data2);
      toast.success("Comparison loaded successfully!");
    } catch (error) {
      console.error("Error loading comparison data:", error);
      toast.error("Failed to load comparison data");
      setComparing(false);
    } finally {
      setLoading(false);
    }
  };

  const clearCountry1 = () => {
    setCountry1(null);
    setCountry1Data(null);
    setComparing(false);
    toast.info("Cleared first country selection");
  };

  const clearCountry2 = () => {
    setCountry2(null);
    setCountry2Data(null);
    setComparing(false);
    toast.info("Cleared second country selection");
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat().format(num);
  };

  const formatArea = (area) => {
    if (!area) return 'N/A';
    return `${formatNumber(area)} km²`;
  };

  const getComparisonIcon = (val1, val2) => {
    if (!val1 || !val2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (val1 > val2) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (val1 < val2) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">First Country</p>
                  {country1 && (
                    <Button variant="ghost" size="sm" onClick={clearCountry1}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {country1 ? (
                  <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                    <Badge className="mb-2 bg-primary text-white">Selected</Badge>
                    <p className="text-lg font-semibold">{country1.name}</p>
                    <p className="text-sm text-muted-foreground">{country1.code}</p>
                  </div>
                ) : (
                  <div className="max-w-full">
                    <CountrySearch 
                      onSelect={handleCountry1Select}
                      compact={true}
                      placeholder="Search first country..."
                      hideQuickActions={true}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Second Country</p>
                  {country2 && (
                    <Button variant="ghost" size="sm" onClick={clearCountry2}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {country2 ? (
                  <div className="p-4 rounded-lg border-2 border-secondary/50 bg-secondary/5">
                    <Badge className="mb-2 bg-secondary text-white">Selected</Badge>
                    <p className="text-lg font-semibold">{country2.name}</p>
                    <p className="text-sm text-muted-foreground">{country2.code}</p>
                  </div>
                ) : (
                  <div className="max-w-full">
                    <CountrySearch 
                      onSelect={handleCountry2Select}
                      compact={true}
                      placeholder="Search second country..."
                      hideQuickActions={true}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleCompare}
              disabled={!country1 || !country2}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare Countries
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            {(!country1 || !country2) && (
              <div className="mt-8 p-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground mb-2">
                  {!country1 && !country2 
                    ? "Select two countries to compare"
                    : country1 
                    ? "Select a second country to compare"
                    : "Select a first country to compare"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the search boxes above to find and select countries
                </p>
              </div>
            )}
            
            {country1 && country2 && !comparing && (
              <div className="mt-8 p-8 text-center border-2 border-dashed rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">
                  Ready to compare {country1.name} and {country2.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the "Compare Countries" button above to load detailed comparison
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {loading && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {comparing && country1Data && country2Data && !loading && (
          <div className="mt-8 space-y-6">
            {/* Demographics Comparison */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Population */}
                  <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-lg bg-muted/50">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Population</p>
                      <p className="text-lg font-bold text-primary">{formatNumber(country1Data.population)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{country1.name}</p>
                    </div>
                    <div className="flex justify-center">
                      {getComparisonIcon(country1Data.population, country2Data.population)}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Population</p>
                      <p className="text-lg font-bold text-secondary">{formatNumber(country2Data.population)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{country2.name}</p>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-lg bg-muted/50">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Area</p>
                      <p className="text-lg font-bold text-primary">{formatArea(country1Data.area)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{country1.name}</p>
                    </div>
                    <div className="flex justify-center">
                      {getComparisonIcon(country1Data.area, country2Data.area)}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Area</p>
                      <p className="text-lg font-bold text-secondary">{formatArea(country2Data.area)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{country2.name}</p>
                    </div>
                  </div>

                  {/* Population Density */}
                  <div className="grid grid-cols-3 gap-4 items-center p-4 rounded-lg bg-muted/50">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Density</p>
                      <p className="text-lg font-bold text-primary">
                        {country1Data.area ? Math.round(country1Data.population / country1Data.area) : 'N/A'} /km²
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{country1.name}</p>
                    </div>
                    <div className="flex justify-center">
                      {getComparisonIcon(
                        country1Data.population / country1Data.area,
                        country2Data.population / country2Data.area
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Density</p>
                      <p className="text-lg font-bold text-secondary">
                        {country2Data.area ? Math.round(country2Data.population / country2Data.area) : 'N/A'} /km²
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{country2.name}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Geography Comparison */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-secondary" />
                  Geography & Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary">{country1.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Capital</span>
                        <span className="font-medium">{country1Data.capital}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Region</span>
                        <span className="font-medium">{country1Data.region}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Subregion</span>
                        <span className="font-medium">{country1Data.subregion || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Landlocked</span>
                        <Badge variant={country1Data.landlocked ? "destructive" : "default"}>
                          {country1Data.landlocked ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-secondary">{country2.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Capital</span>
                        <span className="font-medium">{country2Data.capital}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Region</span>
                        <span className="font-medium">{country2Data.region}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Subregion</span>
                        <span className="font-medium">{country2Data.subregion || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm text-muted-foreground">Landlocked</span>
                        <Badge variant={country2Data.landlocked ? "destructive" : "default"}>
                          {country2Data.landlocked ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages & Culture */}
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  Languages & Culture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-primary mb-3">{country1.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {country1Data.languages?.map((lang, idx) => (
                          <Badge key={idx} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">Currencies</p>
                      <div className="flex flex-wrap gap-2">
                        {country1Data.currencies?.map((curr, idx) => (
                          <Badge key={idx} variant="secondary">{curr}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-secondary mb-3">{country2.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {country2Data.languages?.map((lang, idx) => (
                          <Badge key={idx} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">Currencies</p>
                      <div className="flex flex-wrap gap-2">
                        {country2Data.currencies?.map((curr, idx) => (
                          <Badge key={idx} variant="secondary">{curr}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
