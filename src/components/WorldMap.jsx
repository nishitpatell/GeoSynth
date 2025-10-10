import { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Globe } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = ({ onCountryClick }) => {
  const navigate = useNavigate();
  const [tooltipContent, setTooltipContent] = useState("");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCountryClick = (geo) => {
    const countryCode = geo.id;
    const countryName = geo.properties.name;
    
    // Add click animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (onCountryClick) {
      onCountryClick({ 
        code: countryCode, 
        name: countryName,
        flag: getCountryFlag(countryCode)
      });
    } else {
      navigate(`/country/${countryCode}`);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 8));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 1));
  };

  const handleReset = () => {
    setZoom(1);
    setCenter([0, 0]);
  };

  const getCountryFlag = (countryCode) => {
    // Simple flag mapping - in production, use a proper flag API
    const flagMap = {
      'USA': '🇺🇸', 'GBR': '🇬🇧', 'FRA': '🇫🇷', 'DEU': '🇩🇪', 'JPN': '🇯🇵',
      'CHN': '🇨🇳', 'IND': '🇮🇳', 'BRA': '🇧🇷', 'AUS': '🇦🇺', 'CAN': '🇨🇦',
      'ITA': '🇮🇹', 'ESP': '🇪🇸', 'RUS': '🇷🇺', 'KOR': '🇰🇷', 'MEX': '🇲🇽'
    };
    return flagMap[countryCode] || '🌍';
  };

  const getCountryColor = (geo) => {
    if (hoveredCountry === geo.rsmKey) {
      return "hsl(var(--primary))";
    }
    return "hsl(var(--secondary))";
  };

  const getCountryHoverColor = (geo) => {
    return "hsl(var(--accent))";
  };

  return (
    <div className="w-full h-full min-h-[600px] relative bg-gradient-to-br from-background to-muted/20 rounded-2xl overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
          onClick={handleZoomIn}
          disabled={zoom >= 8}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/50">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Globe className="w-4 h-4 text-primary" />
            Interactive World Map
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary border" />
              <span>Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent border" />
              <span>Hover to explore</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary border" />
              <span>Click for details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Map */}
      <div className={`w-full h-full transition-all duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <ComposableMap
          ref={mapRef}
          projectionConfig={{
            scale: 147,
            center: center,
          }}
          className="w-full h-full"
          style={{
            filter: hoveredCountry ? 'brightness(1.1)' : 'brightness(1)',
            transition: 'filter 0.3s ease'
          }}
        >
          <ZoomableGroup zoom={zoom} center={center}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isHovered = hoveredCountry === geo.rsmKey;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltipContent(geo.properties.name);
                        setHoveredCountry(geo.rsmKey);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                        setHoveredCountry(null);
                      }}
                      onClick={() => handleCountryClick(geo)}
                      data-tooltip-id="country-tooltip"
                      data-tooltip-content={`${getCountryFlag(geo.id)} ${geo.properties.name}`}
                      style={{
                        default: {
                          fill: getCountryColor(geo),
                          stroke: "hsl(var(--border))",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 0.3s ease",
                          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
                        },
                        hover: {
                          fill: getCountryHoverColor(geo),
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                          filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                          transform: 'scale(1.02)',
                          transition: "all 0.2s ease",
                        },
                        pressed: {
                          fill: "hsl(var(--primary))",
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 1.5,
                          outline: "none",
                          filter: 'brightness(1.4) drop-shadow(0 0 12px rgba(0,0,0,0.4))',
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Enhanced Tooltip */}
      <Tooltip 
        id="country-tooltip" 
        className="!bg-white/95 dark:!bg-gray-900/95 !text-foreground !rounded-xl !shadow-2xl !px-4 !py-3 !border !border-border/50 !backdrop-blur-sm"
        style={{
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1000
        }}
      />

      {/* Floating Action Hint */}
      {!hoveredCountry && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-border/50 animate-pulse">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="w-4 h-4" />
              Click any country to explore
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldMap;
