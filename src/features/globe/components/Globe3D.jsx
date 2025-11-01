/**
 * Globe3D Component
 * 3D interactive globe with Tailwind styling and theme integration
 */

import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { useGlobeData } from '../hooks/useGlobeData';
import { useGlobeInteraction } from '../hooks/useGlobeInteraction';
import { enhancedCountryService } from '@/services/enhancedCountryService';

const GLOBE_IMAGES = {
  texture: '/assets/globe/earth-day.jpg',
  bump: '/assets/globe/earth-topology.png',
};

const GLOBE_THEME = {
  polygonDefault: '#22c55e26', // Primary green with transparency
  polygonHover: '#16a34a', // Deeper primary green
  polygonActive: '#166534', // Forest green
  stroke: '#0000004D',
  background: 'rgba(0,0,0,0)',
};

export const Globe3D = ({ onCountrySelect, className = '', valuesMap = null, min = 0, max = 0, metricLabel = null }) => {
  const globeRef = useRef();
  const navigate = useNavigate();
  const { countries, loading, error } = useGlobeData();
  const {
    hoveredCountry,
    handleCountryHover,
    handleCountryClick,
    zoomToCountry,
    resetView,
    setAutoRotate,
  } = useGlobeInteraction(globeRef);

  const [isInitialized, setIsInitialized] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverLoading, setHoverLoading] = useState(false);
  const hoverCache = useRef(new Map());

  // Initialize globe settings
  useEffect(() => {
    const initializeGlobe = () => {
      if (globeRef.current && globeRef.current.controls && !isInitialized) {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.3;
          controls.enableZoom = true;
          globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2 });
          setIsInitialized(true);
        } else {
          // Retry if controls not ready
          requestAnimationFrame(initializeGlobe);
        }
      }
    };

    if (!loading && countries.length > 0) {
      initializeGlobe();
    }
  }, [loading, countries, isInitialized]);

  // Fetch basic details for hovered country (debounced + cached)
  useEffect(() => {
    let timer;
    const fetchHover = async () => {
      if (!hoveredCountry?.properties) {
        setHoverInfo(null);
        return;
      }
      const code = hoveredCountry.properties.ISO_A3 || hoveredCountry.properties.iso_a3 || hoveredCountry.id;
      if (!code) {
        setHoverInfo(null);
        return;
      }
      if (hoverCache.current.has(code)) {
        setHoverInfo(hoverCache.current.get(code));
        return;
      }
      try {
        setHoverLoading(true);
        const basic = await enhancedCountryService.getBasicCountryData(code);
        const info = {
          code,
          name: basic.name,
          capital: basic.capital,
          area: basic.area,
          population: basic.population,
        };
        hoverCache.current.set(code, info);
        setHoverInfo(info);
      } catch (e) {
        setHoverInfo(null);
      } finally {
        setHoverLoading(false);
      }
    };

    // small debounce to avoid spamming requests while moving
    if (hoveredCountry) {
      timer = setTimeout(fetchHover, 250);
    } else {
      setHoverInfo(null);
    }
    return () => timer && clearTimeout(timer);
  }, [hoveredCountry]);

  // Handle country click
  const onPolygonClick = (country) => {
    if (!country || !country.properties) return;

    handleCountryClick(country);
    
    // Create a compatible country object for the existing system
    const countryData = {
      code: country.properties.ISO_A3 || country.properties.iso_a3 || country.id,
      name: country.properties.name || country.properties.NAME,
      properties: country.properties
    };
    
    if (onCountrySelect) {
      onCountrySelect(countryData);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    globeRef.current.pointOfView({ ...pov, altitude: Math.max(pov.altitude * 0.7, 0.5) }, 300);
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (!globeRef.current) return;
    const pov = globeRef.current.pointOfView();
    globeRef.current.pointOfView({ ...pov, altitude: Math.min(pov.altitude * 1.3, 4) }, 300);
  };

  // Get scaled color based on metric value
  const getScaledColor = (country) => {
    if (!valuesMap || !country) return null;
    const code = country.properties?.ISO_A3 || country.properties?.iso_a3 || country.id;
    const val = valuesMap[code];
    if (val == null || isNaN(val) || max === min) return GLOBE_THEME.polygonDefault;
    const t = Math.max(0, Math.min(1, (val - min) / (max - min)));
    const alpha = 0.2 + 0.6 * t;
    return `#22c55e${Math.round(alpha * 255).toString(16).padStart(2, '0')}`; // green with alpha
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted rounded-2xl">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading globe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-muted rounded-2xl">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load globe: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden border shadow-2xl bg-card">
        {/* Globe Container */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          <Globe
            ref={globeRef}
            globeImageUrl={GLOBE_IMAGES.texture}
            bumpImageUrl={GLOBE_IMAGES.bump}
            backgroundColor={GLOBE_THEME.background}
            polygonsData={countries}
            polygonAltitude={(d) => (d === hoveredCountry ? 0.04 : 0.005)}
            polygonCapColor={(d) => {
              if (d === hoveredCountry) return GLOBE_THEME.polygonHover;
              const scaled = getScaledColor(d);
              return scaled || GLOBE_THEME.polygonDefault;
            }}
            polygonStrokeColor={() => GLOBE_THEME.stroke}
            polygonSideColor={() => '#22c55e08'}
            onPolygonHover={handleCountryHover}
            onPolygonClick={onPolygonClick}
            polygonsTransitionDuration={300}
            width={undefined}
            height={600}
          />

          {/* Hover Info */}
          {hoveredCountry && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="bg-background/95 border border-border rounded-xl shadow-2xl px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="text-sm font-semibold mb-1">
                  {hoverInfo?.name || hoveredCountry.properties?.name || 'Loading...'}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  <div>Capital</div>
                  <div className="text-right">{hoverInfo?.capital ?? (hoverLoading ? '…' : 'N/A')}</div>
                  <div>Population</div>
                  <div className="text-right">{hoverInfo?.population ? hoverInfo.population.toLocaleString() : (hoverLoading ? '…' : 'N/A')}</div>
                  <div>Area</div>
                  <div className="text-right">{hoverInfo?.area ? `${hoverInfo.area.toLocaleString()} km²` : (hoverLoading ? '…' : 'N/A')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-lg"
              onClick={resetView}
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10">
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-3 shadow-lg border-border/50">
              <div className="text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />
                  <span className="text-muted-foreground">{metricLabel || 'Countries'}</span>
                </div>
                {valuesMap && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Low</span>
                    <div className="w-20 h-2 bg-muted rounded overflow-hidden">
                      <div className="h-2 w-full" style={{ background: 'linear-gradient(to right, rgba(34,197,94,0.2), rgba(34,197,94,0.8))' }} />
                    </div>
                    <span>High</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Globe3D;
