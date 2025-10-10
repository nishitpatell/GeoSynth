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

const GLOBE_IMAGES = {
  texture: '/assets/globe/earth-day.jpg',
  bump: '/assets/globe/earth-topology.png',
};

const GLOBE_THEME = {
  polygonDefault: '#22c55e26', // Green with transparency (hex with alpha)
  polygonHover: '#EAB308', // Golden yellow
  polygonActive: '#F59E0B', // Amber
  stroke: '#0000004D', // Dark borders (hex with alpha)
  background: 'rgba(0,0,0,0)',
};

export const Globe3D = ({ onCountrySelect, className = '' }) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-background to-muted/20 rounded-2xl">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading globe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-background to-muted/20 rounded-2xl">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load globe: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-background to-muted/10">
        {/* Globe Container */}
        <div className="relative w-full h-[600px] flex items-center justify-center">
          <Globe
            ref={globeRef}
            globeImageUrl={GLOBE_IMAGES.texture}
            bumpImageUrl={GLOBE_IMAGES.bump}
            backgroundColor={GLOBE_THEME.background}
            polygonsData={countries}
            polygonAltitude={(d) => (d === hoveredCountry ? 0.04 : 0.005)}
            polygonCapColor={(d) =>
              d === hoveredCountry ? GLOBE_THEME.polygonHover : GLOBE_THEME.polygonDefault
            }
            polygonStrokeColor={() => GLOBE_THEME.stroke}
            polygonSideColor={() => '#22c55e08'}
            onPolygonHover={handleCountryHover}
            onPolygonClick={onPolygonClick}
            polygonsTransitionDuration={300}
            width={undefined}
            height={600}
          />

          {/* Hover Tooltip */}
          {hoveredCountry && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-base font-semibold shadow-lg">
                {hoveredCountry.properties?.name || 'Unknown'}
              </Badge>
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
                  <span className="text-muted-foreground">Countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-secondary border border-secondary" />
                  <span className="text-muted-foreground">Hover to highlight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent border border-accent" />
                  <span className="text-muted-foreground">Click for details</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Globe3D;
