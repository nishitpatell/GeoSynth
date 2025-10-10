import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Globe, TrendingUp, MapPin, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countries, popularCountries, trendingCountries } from "@/data/countries";

const CountrySearch = ({ onSelect, compact = false, placeholder, hideQuickActions = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Auto-focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return [];
    return countries.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.code.toLowerCase().includes(search.toLowerCase()) ||
      country.region.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8); // Limit results for better UX
  }, [search]);

  const shouldShowSuggestions = !search.trim();

  const handleSelect = (countryCode, countryName) => {
    if (onSelect) {
      onSelect({ code: countryCode, name: countryName });
    } else {
      navigate(`/country/${countryCode}`);
    }
    setOpen(false);
    setSearch("");
    setSelectedIndex(-1);
  };

  const handleQuickSelect = (countryCode, countryName) => {
    if (onSelect) {
      onSelect({ code: countryCode, name: countryName });
    } else {
      navigate(`/country/${countryCode}`);
    }
    setOpen(false);
    setSearch("");
    setSelectedIndex(-1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1);
    // Keep popover open while typing
    if (!open) {
      setOpen(true);
    }
  };

  const handleInputClick = () => {
    setOpen(true);
    // Focus the input
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!open) return;

    // Handle keyboard navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && filteredCountries[selectedIndex]) {
      e.preventDefault();
      const country = filteredCountries[selectedIndex];
      handleSelect(country.code, country.name);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handlePopoverOpenChange = (newOpen) => {
    // Only allow closing if user explicitly clicks outside or presses Escape
    // Don't close when typing
    if (!newOpen && search.trim()) {
      // Keep open if user is still typing
      return;
    }
    setOpen(newOpen);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Enhanced Search Input */}
      <Popover open={open} onOpenChange={handlePopoverOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <div className={`relative transition-all duration-500 ${isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none z-10" />
              <Input
                ref={inputRef}
                placeholder={placeholder || "Search countries, regions, or explore by name..."}
                className={`pl-12 ${compact ? 'pr-4 py-2 text-base' : 'pr-20 py-4 text-lg'} bg-white dark:bg-black border-2 border-black dark:border-white hover:border-primary focus:border-primary transition-all duration-200 rounded-md`}
                value={search}
                onChange={handleSearchChange}
                onClick={handleInputClick}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {!compact && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-secondary text-secondary-foreground border border-secondary rounded-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className={`${compact ? 'w-[400px]' : 'w-[600px]'} p-0 mt-2 border-2 border-black dark:border-white rounded-lg`} align="center">
          <div className="bg-white dark:bg-black">
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
                            className="justify-start h-auto p-3 hover:bg-muted border border-border transition-all duration-200 rounded-md"
                            onClick={() => handleQuickSelect(country.code, country.name)}
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
                              className="hover:bg-accent/20 border border-border hover:border-accent transition-all duration-200"
                              onClick={() => handleQuickSelect(code, country?.name)}
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
                      {filteredCountries.map((country, index) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => handleSelect(country.code, country.name)}
                          className={`cursor-pointer p-4 transition-colors border-l-4 ${
                            index === selectedIndex 
                              ? 'bg-primary/10 border-primary' 
                              : 'border-transparent hover:bg-muted'
                          }`}
                          onMouseEnter={() => setSelectedIndex(index)}
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
      {!hideQuickActions && (
      <div className={`flex justify-center gap-3 mt-6 transition-all duration-700 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-muted border-2 border-border hover:border-primary transition-all duration-200"
          onClick={() => navigate('/compare')}
        >
          Compare Countries
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-muted border-2 border-border hover:border-accent transition-all duration-200"
          onClick={() => navigate('/wishlist')}
        >
          My Wishlist
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:bg-muted border-2 border-border hover:border-secondary transition-all duration-200"
          onClick={() => navigate('/currency')}
        >
          Currency Converter
        </Button>
      </div>
      )}
    </div>
  );
};

export default CountrySearch;
