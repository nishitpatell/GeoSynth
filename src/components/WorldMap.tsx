import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
  onCountryClick?: (country: { code: string; name: string }) => void;
}

const WorldMap = ({ onCountryClick }: WorldMapProps) => {
  const navigate = useNavigate();
  const [tooltipContent, setTooltipContent] = useState("");

  const handleCountryClick = (geo: any) => {
    const countryCode = geo.id;
    const countryName = geo.properties.name;
    
    if (onCountryClick) {
      onCountryClick({ code: countryCode, name: countryName });
    } else {
      navigate(`/country/${countryCode}`);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(geo.properties.name);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={() => handleCountryClick(geo)}
                  data-tooltip-id="country-tooltip"
                  data-tooltip-content={geo.properties.name}
                  style={{
                    default: {
                      fill: "hsl(var(--secondary))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "hsl(var(--accent))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.75,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "hsl(var(--primary))",
                      stroke: "hsl(var(--border))",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip 
        id="country-tooltip" 
        className="!bg-card !text-card-foreground !rounded-lg !shadow-lg !px-3 !py-2"
      />
    </div>
  );
};

export default WorldMap;
