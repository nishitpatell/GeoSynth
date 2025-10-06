import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sample country data - in production, this would come from an API
const countries = [
  { code: "USA", name: "United States" },
  { code: "GBR", name: "United Kingdom" },
  { code: "FRA", name: "France" },
  { code: "DEU", name: "Germany" },
  { code: "JPN", name: "Japan" },
  { code: "CHN", name: "China" },
  { code: "IND", name: "India" },
  { code: "BRA", name: "Brazil" },
  { code: "AUS", name: "Australia" },
  { code: "CAN", name: "Canada" },
  { code: "MEX", name: "Mexico" },
  { code: "RUS", name: "Russia" },
  { code: "ITA", name: "Italy" },
  { code: "ESP", name: "Spain" },
  { code: "KOR", name: "South Korea" },
];

const CountrySearch = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredCountries = useMemo(() => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelect = (countryCode: string) => {
    navigate(`/country/${countryCode}`);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a country..."
            className="pl-10 bg-card border-border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No countries found.</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => handleSelect(country.code)}
                  className="cursor-pointer"
                >
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySearch;
