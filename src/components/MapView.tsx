import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo } from 'react';
import { ETHIOPIA_MAP_LABELS, MapLabelItem } from '../data/mapLabels';
import { Sparkles, MapPin, Compass, Layers, Filter } from 'lucide-react';

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
  selectedLocation: { lat: number; lng: number } | null;
  mapCenterLocation: { lat: number; lng: number } | null;
  showLabels: boolean;
  showGeology: boolean;
  predictedLocations?: any[];
}

// Helper to generate distinct Leaflet DivIcons for each label category
function createLabelDivIcon(item: MapLabelItem) {
  let iconEmoji = '📍';
  let badgeClass = 'map-badge-city';

  if (item.category === 'mineral') {
    iconEmoji = item.mineralPotential?.toLowerCase().includes('lithium') ? '⚡' : 
                item.mineralPotential?.toLowerCase().includes('opal') ? '💎' : 
                item.mineralPotential?.toLowerCase().includes('potash') ? '🧪' : '⛏️';
    badgeClass = 'map-badge-mineral';
  } else if (item.category === 'geology') {
    iconEmoji = item.name.toLowerCase().includes('rift') || item.name.toLowerCase().includes('triple') ? '🌋' : '⛰️';
    badgeClass = 'map-badge-geology';
  } else if (item.category === 'river') {
    iconEmoji = '🌊';
    badgeClass = 'map-badge-river';
  }

  const html = `
    <div class="map-badge ${badgeClass}" title="${item.name} (${item.typeLabel})">
      <span class="text-xs leading-none">${iconEmoji}</span>
      <span class="tracking-tight">${item.name}</span>
    </div>
  `;

  return L.divIcon({
    className: 'map-label-div-icon',
    html,
    iconSize: [120, 24],
    iconAnchor: [60, 12]
  });
}

export default function MapView({ 
  onLocationSelect, 
  geoData, 
  selectedLocation, 
  mapCenterLocation, 
  showLabels, 
  showGeology, 
  predictedLocations 
}: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [labelCategory, setLabelCategory] = useState<'all' | 'mineral' | 'city' | 'geology' | 'river'>('all');
  const [showFilterPills, setShowFilterPills] = useState(false);

  // Define style for GeoJSON features based on rock type
  const styleFeature = (feature: any) => {
    switch (feature.properties?.rock_type) {
      case 'volcanic': return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.35, weight: 1.5 }; // red
      case 'sedimentary': return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.35, weight: 1.5 }; // yellow
      case 'metamorphic': return { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.35, weight: 1.5 }; // green
      default: return { color: '#9ca3af', fillColor: '#9ca3af', fillOpacity: 0.35, weight: 1.5 }; // gray
    }
  };

  const handleCoordsClick = (lat: number, lng: number) => {
    onLocationSelect(lat, lng);
  };

  useEffect(() => {
    if (map && mapCenterLocation) {
      map.flyTo([mapCenterLocation.lat, mapCenterLocation.lng], 9, { duration: 1.5 });
    }
  }, [mapCenterLocation, map]);

  // Center on Ethiopia
  const center: [number, number] = [9.145, 40.4896];

  // Filtered labels based on category
  const filteredLabels = useMemo(() => {
    if (labelCategory === 'all') return ETHIOPIA_MAP_LABELS;
    return ETHIOPIA_MAP_LABELS.filter(item => item.category === labelCategory);
  }, [labelCategory]);

  const counts = useMemo(() => ({
    all: ETHIOPIA_MAP_LABELS.length,
    mineral: ETHIOPIA_MAP_LABELS.filter(l => l.category === 'mineral').length,
    city: ETHIOPIA_MAP_LABELS.filter(l => l.category === 'city').length,
    geology: ETHIOPIA_MAP_LABELS.filter(l => l.category === 'geology').length,
    river: ETHIOPIA_MAP_LABELS.filter(l => l.category === 'river').length
  }), []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800/60 shadow-2xl z-0">
      <MapContainer 
        center={center} 
        zoom={6} 
        className="w-full h-full"
        ref={setMap as any}
      >
        {/* Base Satellite Tile Layer */}
        <TileLayer
          attribution='&copy; Google Maps'
          url={showLabels ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" : "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"}
        />

        {/* High-Density Reference Labels: ESRI Boundaries & Places */}
        {showLabels && (
          <TileLayer
            attribution='&copy; Esri & Carto'
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            zIndex={350}
            opacity={0.95}
          />
        )}

        {/* Additional High-Density Town & Village Labels from Carto Voyager */}
        {showLabels && (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
            zIndex={360}
            opacity={0.9}
          />
        )}

        {/* Geological Features Layer */}
        {geoData && showGeology && (
          <GeoJSON 
             key={showGeology ? "show" : "hide"}
             data={geoData} 
             style={styleFeature}
             onEachFeature={(feature: any, layer: any) => {
               if (feature?.properties?.name) {
                 layer.bindTooltip(
                   `<b>${feature.properties.name}</b><br/><span style="font-size:10px;text-transform:uppercase;color:#eab308">${feature.properties.rock_type}</span>`, 
                   { 
                     sticky: true,
                     className: 'geology-tooltip',
                     direction: 'top'
                   }
                 );
               }
             }}
             eventHandlers={{
                 click: (e: any) => {
                   if (e?.originalEvent) {
                     L.DomEvent.stopPropagation(e.originalEvent);
                   }
                   if (e?.latlng) {
                     handleCoordsClick(e.latlng.lat, e.latlng.lng);
                   }
                 }
             }}
          />
        )}
        
        {/* General Map Click Handler */}
        <MapEvents onClick={handleCoordsClick} />

        {/* Custom Rich Mineral, City, Geology, and River Basin Labels */}
        {showLabels && filteredLabels.map((item) => {
          const divIcon = createLabelDivIcon(item);
          return (
            <Marker 
              key={item.id} 
              position={[item.lat, item.lng]} 
              icon={divIcon}
              eventHandlers={{
                click: () => {
                  handleCoordsClick(item.lat, item.lng);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="text-slate-900 font-medium min-w-[210px] p-0.5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5 mb-2">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {item.category === 'mineral' ? '⛏️' : item.category === 'geology' ? '⛰️' : item.category === 'river' ? '🌊' : '📍'}
                      {item.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      {item.typeLabel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-2 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {item.mineralPotential && (
                    <div className="text-[11px] text-yellow-300 font-semibold mb-1 flex items-center gap-1">
                      <span>Potential:</span>
                      <span className="text-white font-normal">{item.mineralPotential}</span>
                    </div>
                  )}

                  {item.rockType && (
                    <div className="text-[10px] text-slate-400 mb-2 font-mono">
                      Rock: {item.rockType}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono mb-2">
                    {item.lat.toFixed(4)}&deg; N, {item.lng.toFixed(4)}&deg; E
                  </div>

                  <button 
                    onClick={() => handleCoordsClick(item.lat, item.lng)}
                    className="w-full mt-1 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles size={13} className="text-slate-950" />
                    <span>Run AI Prospecting Scan</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Selected Location Target Pin */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={yellowIcon}>
             <Popup className="custom-popup">
                <div className="text-slate-900 font-medium">
                    <div className="font-bold text-yellow-400 text-sm mb-1 flex items-center gap-1">
                      <MapPin size={14} /> Active Prospecting Target
                    </div>
                    <div className="text-xs text-slate-300 font-mono">
                      Lat: {selectedLocation.lat.toFixed(4)}&deg; N<br/>
                      Lng: {selectedLocation.lng.toFixed(4)}&deg; E
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Click any map point or label to analyze
                    </div>
                </div>
             </Popup>
          </Marker>
        )}

        {/* AI Predicted Mineral Nodes */}
        {predictedLocations && predictedLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={yellowIcon}>
             <Popup className="custom-popup">
                <div className="text-slate-900 font-medium">
                    <div className="text-yellow-400 font-bold text-xs uppercase tracking-wider">
                      AI Predicted: {loc.mineral}
                    </div>
                    <span className="text-xs font-normal text-slate-300 block mt-1">{loc.distanceInfo}</span>
                    <span className="text-[10px] font-normal text-slate-400 block uppercase tracking-wide mt-1">
                      {loc.rock_type}
                    </span>
                    <div className="mt-2 text-[10px] font-bold text-green-400">
                      Confidence: {loc.confidence}%
                    </div>
                </div>
             </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Labels Category Filter & Density HUD (Top-right corner) */}
      {showLabels && (
        <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-[#101524]/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-2.5 py-1.5 shadow-xl text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-200">
              {filteredLabels.length} Map Labels
            </span>
            <button
              onClick={() => setShowFilterPills(!showFilterPills)}
              className="ml-1 p-1 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded transition flex items-center gap-1 text-[10px]"
              title="Filter label categories"
            >
              <Filter size={12} />
              <span className="hidden sm:inline font-medium">Filter</span>
            </button>
          </div>

          {/* Expandable Category Filter Pills */}
          {showFilterPills && (
            <div className="bg-[#101524]/95 backdrop-blur-xl border border-slate-700/90 rounded-xl p-1.5 shadow-2xl flex flex-wrap max-w-[280px] sm:max-w-none gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => setLabelCategory('all')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  labelCategory === 'all' 
                    ? 'bg-yellow-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setLabelCategory('mineral')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  labelCategory === 'mineral' 
                    ? 'bg-yellow-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-800/80 text-yellow-300 hover:text-yellow-200 hover:bg-slate-700'
                }`}
              >
                ⛏️ Mines & Deposits ({counts.mineral})
              </button>
              <button
                onClick={() => setLabelCategory('city')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  labelCategory === 'city' 
                    ? 'bg-yellow-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                📍 Cities & Hubs ({counts.city})
              </button>
              <button
                onClick={() => setLabelCategory('geology')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  labelCategory === 'geology' 
                    ? 'bg-yellow-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-800/80 text-green-300 hover:text-green-200 hover:bg-slate-700'
                }`}
              >
                ⛰️ Geological Belts ({counts.geology})
              </button>
              <button
                onClick={() => setLabelCategory('river')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  labelCategory === 'river' 
                    ? 'bg-yellow-500 text-slate-950 shadow-sm' 
                    : 'bg-slate-800/80 text-cyan-300 hover:text-cyan-200 hover:bg-slate-700'
                }`}
              >
                🌊 Placer Rivers ({counts.river})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper component to handle map clicks generally
function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}
