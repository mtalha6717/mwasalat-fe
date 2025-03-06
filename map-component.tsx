'use client';

import { useState, useRef, useEffect } from 'react';
import {
  GoogleMap,
  Autocomplete,
  LoadScriptNext,
} from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  onLocationSelect: (
    location: { lat: number; lng: number },
    address: string
  ) => void;
  currentAddress: string;
}

export function MapComponent({
  center,
  onLocationSelect,
  currentAddress,
}: MapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // When center changes, update the marker position
    if (map && marker) {
      marker.setPosition(center);
      map.panTo(center);
    }
  }, [center, map, marker]);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);

    // Create a marker at the initial center
    const newMarker = new google.maps.Marker({
      position: center,
      map: map,
      draggable: true,
    });

    setMarker(newMarker);

    // Add event listener for marker drag end
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        const newLocation = {
          lat: position.lat(),
          lng: position.lng(),
        };

        // Get address from coordinates (reverse geocoding)
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newLocation }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            onLocationSelect(newLocation, results[0].formatted_address);
          } else {
            onLocationSelect(newLocation, 'Unknown location');
          }
        });
      }
    });

    // Add click event to map to move marker
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng && newMarker) {
        newMarker.setPosition(e.latLng);

        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        // Get address from coordinates (reverse geocoding)
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newLocation }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            onLocationSelect(newLocation, results[0].formatted_address);
          } else {
            onLocationSelect(newLocation, 'Unknown location');
          }
        });
      }
    });
  };

  const onAutocompleteLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    setSearchBox(autocomplete);
  };

  const onPlaceChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        if (map) {
          map.panTo(newLocation);
          map.setZoom(15);
        }

        if (marker) {
          marker.setPosition(newLocation);
        }

        onLocationSelect(
          newLocation,
          place.formatted_address || 'Selected location'
        );
      }
    }
  };

  return (
    <div className="h-full relative">
      <div className="absolute top-2 left-2 right-2 z-10 bg-white rounded-md shadow-md">
        <div className="relative">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for a location..."
                className="pl-10 pr-4 py-2 w-full"
                defaultValue={currentAddress}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </Autocomplete>
        </div>
      </div>
      <LoadScriptNext
        googleMapsApiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={14}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        />
      </LoadScriptNext>
    </div>
  );
}
