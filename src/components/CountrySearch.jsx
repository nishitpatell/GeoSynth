import { useState, useMemo, useEffect } from "react";
import { Search, Globe, TrendingUp, MapPin, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Enhanced country data with additional information
const countries = [
  { code: "USA", name: "United States", flag: "🇺🇸", region: "Americas", popular: true },
  { code: "GBR", name: "United Kingdom", flag: "🇬🇧", region: "Europe", popular: true },
  { code: "FRA", name: "France", flag: "🇫🇷", region: "Europe", popular: true },
  { code: "DEU", name: "Germany", flag: "🇩🇪", region: "Europe", popular: true },
  { code: "JPN", name: "Japan", flag: "🇯🇵", region: "Asia", popular: true },
  { code: "CHN", name: "China", flag: "🇨🇳", region: "Asia", popular: true },
  { code: "IND", name: "India", flag: "🇮🇳", region: "Asia", popular: true },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", region: "Americas", popular: true },
  { code: "AUS", name: "Australia", flag: "🇦🇺", region: "Oceania", popular: true },
  { code: "CAN", name: "Canada", flag: "🇨🇦", region: "Americas", popular: true },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", region: "Americas", popular: false },
  { code: "RUS", name: "Russia", flag: "🇷🇺", region: "Europe", popular: false },
  { code: "ITA", name: "Italy", flag: "🇮🇹", region: "Europe", popular: true },
  { code: "ESP", name: "Spain", flag: "🇪🇸", region: "Europe", popular: true },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", region: "Asia", popular: false },
  { code: "NLD", name: "Netherlands", flag: "🇳🇱", region: "Europe", popular: false },
  { code: "CHE", name: "Switzerland", flag: "🇨🇭", region: "Europe", popular: false },
  { code: "SWE", name: "Sweden", flag: "🇸🇪", region: "Europe", popular: false },
  { code: "NOR", name: "Norway", flag: "🇳🇴", region: "Europe", popular: false },
  { code: "SGP", name: "Singapore", flag: "🇸🇬", region: "Asia", popular: false },
];

const popularCountries = countries.filter(c => c.popular);
const trendingCountries = ["JPN", "KOR", "SGP", "CHE", "NOR"];

const CountrySearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    return countries.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.region.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8); // Limit results for better UX
  }, [search]);

  const shouldShowSuggestions = !search.trim() && showSuggestions;

  const handleSelect = (countryCode) => {
    navigate(`/country/${countryCode}`);
    setOpen(false);
    setSearch("");
  };

  const handleQuickSelect = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  const handleSearchFocus = () => {
    setOpen(true);
    setShowSuggestions(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setOpen(true);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Enhanced Search Input */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={`relative transition-all duration-500 ${isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search countries, regions, or explore by name..."
                className="pl-12 pr-4 py-4 text-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-muted hover:border-primary/50 focus:border-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                value={search}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-[600px] p-0 mt-2 border-0 shadow-2xl" align="center">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-border/50">
            <Command>
              <CommandList className="max-h-80">
                {shouldShowSuggestions ? (
                  <div className="p-6">
                    {/* Popular Countries */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm text-muted-foreground">Popular Destinations</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {popularCountries.slice(0, 6).map((country) => (
                          <Button
                            key={country.code}
                            variant="ghost"
                            className="justify-start h-auto p-3 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200"
                            onClick={() => handleQuickSelect(country.code)}
                          >
                            <span className="text-lg mr-3">{country.flag}</span>
                            <div className="text-left">
                              <div className="font-medium text-sm">{country.name}</div>
                              <div className="text-xs text-muted-foreground">{country.region}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Trending Countries */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-secondary" />
                        <h3 className="font-semibold text-sm text-muted-foreground">Trending Now</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingCountries.map((code) => {
                          const country = countries.find(c => c.code === code);
                          return (
                            <Button
                              key={code}
                              variant="outline"
                              size="sm"
                              className="hover:bg-secondary/10 hover:border-secondary transition-all duration-200"
                              onClick={() => handleQuickSelect(code)}
                            >
                              <span className="mr-2">{country?.flag}</span>
                              {country?.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <CommandEmpty className="py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No countries found for "{search}"</p>
                        <p className="text-xs text-muted-foreground">Try searching by country name or region</p>
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => handleSelect(country.code)}
                          className="cursor-pointer p-4 hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-xl">{country.flag}</span>
                            <div className="flex-1">
                              <div className="font-medium">{country.name}</div>
                              <div className="text-sm text-muted-foreground">{country.region}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {country.code}
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Quick Action Buttons */}
      <div className={`flex justify-center gap-3 mt-6 transition-all duration-700 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
          onClick={() => navigate('/compare')}
        >
          Compare Countries
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-secondary/5 hover:border-secondary/30 transition-all duration-200"
          onClick={() => navigate('/wishlist')}
        >
          My Wishlist
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-accent/5 hover:border-accent/30 transition-all duration-200"
          onClick={() => navigate('/currency')}
        >
          Currency Converter
        </Button>
      </div>
    </div>
  );
};

export default CountrySearch;
