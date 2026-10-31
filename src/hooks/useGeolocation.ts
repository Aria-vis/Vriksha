import { useState, useEffect, useCallback } from 'react';

export interface CityPreset {
  name: string;
  nameHi: string;
  lat: number;
  lng: number;
}

export const INDIAN_CITY_PRESETS: Record<string, CityPreset> = {
  varanasi: { name: 'Varanasi', nameHi: 'वाराणसी', lat: 25.3176, lng: 82.9739 },
  patna: { name: 'Patna', nameHi: 'पटना', lat: 25.5941, lng: 85.1376 },
  delhi: { name: 'New Delhi', nameHi: 'नई दिल्ली', lat: 28.6139, lng: 77.2090 },
  bengaluru: { name: 'Bengaluru', nameHi: 'बेंगलुरु', lat: 12.9716, lng: 77.5946 },
  mumbai: { name: 'Mumbai', nameHi: 'मुंबई', lat: 19.0760, lng: 72.8777 },
  kolkata: { name: 'Kolkata', nameHi: 'कोलकाता', lat: 22.5726, lng: 88.3639 },
  chennai: { name: 'Chennai', nameHi: 'चेन्नई', lat: 13.0827, lng: 80.2707 },
};

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>({
    lat: INDIAN_CITY_PRESETS.varanasi!.lat,
    lng: INDIAN_CITY_PRESETS.varanasi!.lng,
  });
  const [activeCityName, setActiveCityName] = useState<string>('Varanasi');
  const [isUsingGPS, setIsUsingGPS] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestGPSLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsUsingGPS(true);
        setActiveCityName('Current Location');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation access failed or denied:', err.message);
        setError('Location access was denied or timed out. Using default city.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  const selectCityPreset = useCallback((presetKey: string) => {
    const preset = INDIAN_CITY_PRESETS[presetKey];
    if (preset) {
      setCoords({ lat: preset.lat, lng: preset.lng });
      setActiveCityName(preset.name);
      setIsUsingGPS(false);
      setError(null);
    }
  }, []);

  // Try requesting GPS on initial mount if available
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestGPSLocation();
        }
      }).catch(() => {
        // Permissions API not supported on some browsers
      });
    }
  }, [requestGPSLocation]);

  return {
    coords,
    activeCityName,
    isUsingGPS,
    isLocating,
    error,
    requestGPSLocation,
    selectCityPreset,
    cityPresets: INDIAN_CITY_PRESETS,
  };
}
