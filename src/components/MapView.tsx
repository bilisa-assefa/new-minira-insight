import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import * as turf from '@turf/turf';

// Custom Map Pin Icons
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


interface MapViewProps {
  onLocationSelect: (lat: number, lng: number) => void;
  geoData: any;
  selectedLocation: {lat: number, lng: number} | null;
  mapCenterLocation: {lat: number, lng: number} | null;
  showLabels: boolean;
  showGeology: boolean;
  predictedLocations?: any[];
}

export default function MapView({ onLocationSelect, geoData, selectedLocation, mapCenterLocation, showLabels, showGeology, predictedLocations }: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  // Define style for GeoJSON features based on rock type
  const styleFeature = (feature: any) => {
    switch (feature.properties.rock_type) {
      case 'volcanic': return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4, weight: 2 }; // red
      case 'sedimentary': return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.4, weight: 2 }; // yellow
      case 'metamorphic': return { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.4, weight: 2 }; // green
      default: return { color: '#9ca3af', fillColor: '#9ca3af', fillOpacity: 0.4, weight: 2 }; // gray
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    onLocationSelect(lat, lng);
  };

  useEffect(() => {
    if (map && mapCenterLocation) {
      map.flyTo([mapCenterLocation.lat, mapCenterLocation.lng], 9, { duration: 1.5 });
    }
  }, [mapCenterLocation, map]);

  // Center on Ethiopia
  const center: [number, number] = [9.145, 40.4896];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800/60 shadow-2xl z-0">
      <MapContainer 
        center={center} 
        zoom={6} 
        className="w-full h-full"
        ref={setMap as any}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url={showLabels ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" : "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"}
        />
        
        {/* Semi-transparent dark overlay for the map to match the theme */}
        <div className="absolute inset-0 bg-[#0B101E]/30 pointer-events-none z-[400]" />

        {geoData && showGeology && (
          <GeoJSON 
             key={showGeology ? "show" : "hide"}
             data={geoData} 
             style={styleFeature}
             eventHandlers={{
                 click: (e) => handleMapClick(e as any)
             }}
          />
        )}
        
        {/* We need an invisible plane to catch clicks if we want to click outside polygons */}
        <div className="leaflet-interactive" style={{width: '100%', height: '100%', position: 'absolute', zIndex: 400}}></div>
        
        <MapEvents onClick={handleMapClick} />

        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={yellowIcon}>
             <Popup className="custom-popup">
                <div className="text-slate-900 font-medium">
                    Selected Location<br/>
                    Lat: {selectedLocation.lat.toFixed(4)}&deg; N<br/>
                    Lng: {selectedLocation.lng.toFixed(4)}&deg; E
                </div>
             </Popup>
          </Marker>
        )}

        {predictedLocations && predictedLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={yellowIcon}>
             <Popup className="custom-popup">
                <div className="text-slate-900 font-medium">
                    Predicted: {loc.mineral}<br/>
                    <span className="text-xs font-normal text-slate-600 block mt-1">{loc.distanceInfo}</span>
                    <span className="text-[10px] font-normal text-slate-500 block uppercase tracking-wide mt-1">{loc.rock_type}</span>
                </div>
             </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// Helper component to handle map clicks generally
function MapEvents({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) {
  useMap().on('click', onClick);
  return null;
}
