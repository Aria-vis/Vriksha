import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { PlantSearchResult } from '../../types/plant';
import { FRESHNESS_METADATA } from '../../config/freshness';
import { Locate } from 'lucide-react';

interface MapContainerProps {
  plants: PlantSearchResult[];
  centerCoords: { lat: number; lng: number } | null;
  selectedPlant: PlantSearchResult | null;
  onSelectPlant: (plant: PlantSearchResult) => void;
  onRequestGPS: () => void;
  isLocating: boolean;
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  plants,
  centerCoords,
  selectedPlant,
  onSelectPlant,
  onRequestGPS,
  isLocating,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const initialCoordsRef = useRef(centerCoords);

  // Initialize MapLibre instance
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultLng = initialCoordsRef.current?.lng ?? 82.9739;
    const defaultLat = initialCoordsRef.current?.lat ?? 25.3176;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [defaultLng, defaultLat],
      zoom: 13,
      pitch: 0,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update center when centerCoords changes
  useEffect(() => {
    if (!mapRef.current || !centerCoords) return;
    mapRef.current.flyTo({
      center: [centerCoords.lng, centerCoords.lat],
      zoom: 13,
      essential: true,
      duration: 1200,
    });
  }, [centerCoords]);



  // Center on selected plant
  useEffect(() => {
    if (!mapRef.current || !selectedPlant) return;
    mapRef.current.flyTo({
      center: [selectedPlant.lng, selectedPlant.lat],
      zoom: 15.5,
      essential: true,
      duration: 1000,
    });
  }, [selectedPlant]);

  // Render HTML markers with freshness colors and pulsing aura
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    plants.forEach((plant) => {
      const meta = FRESHNESS_METADATA[plant.status] || FRESHNESS_METADATA.recently_verified;

      // Custom Marker DOM element
      const el = document.createElement('div');
      el.className = 'vriksha-marker-node cursor-pointer group';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Inner pin styling
      el.innerHTML = `
        <div style="background-color: ${meta.colorHex}; box-shadow: 0 4px 12px ${meta.colorHex}66;" 
             class="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white transition-transform group-hover:scale-125">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 10v12"/>
            <path d="M12 2a5 5 0 0 0-5 5c0 3 5 8 5 8s5-5 5-8a5 5 0 0 0-5-5z"/>
          </svg>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectPlant(plant);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([plant.lng, plant.lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [plants, onSelectPlant]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* MapLibre DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Locate Me FAB */}
      <div className="absolute right-4 bottom-64 sm:bottom-72 z-20 flex flex-col gap-2">
        <button
          onClick={onRequestGPS}
          disabled={isLocating}
          title="Locate me using GPS"
          className="p-3 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-full shadow-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 active:scale-95 transition-all flex items-center justify-center group"
        >
          <Locate
            className={`w-5 h-5 text-brand-green ${
              isLocating ? 'animate-spin text-brand-saffron' : 'group-hover:scale-110'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default MapContainer;
