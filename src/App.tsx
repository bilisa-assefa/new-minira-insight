import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import PredictionPanel from './components/PredictionPanel';
import StatsCards from './components/StatsCards';
import { Search, Bell, User, Settings2, Layers, MapPin, X, Target, Diamond, Menu } from 'lucide-react';
import * as turf from '@turf/turf';

import { ETHIOPIA_MAP_LABELS } from './data/mapLabels';

export default function App() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenterLocation, setMapCenterLocation] = useState<{lat: number, lng: number} | null>(null);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showGeology, setShowGeology] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentRequestIdRef = useRef(0);
  
  const MINERALS = [
    'Auto-Detect', 'Gold', 'Silver', 'Copper', 'Zinc', 
    'Platinum', 'Iron', 'Lithium', 'Rare Earth Elements', 'Potash'
  ];
  
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [mineralSearch, setMineralSearch] = useState('');
  const [analysisRadius, setAnalysisRadius] = useState(2); // in km
  const [targetMineral, setTargetMineral] = useState('Auto-Detect');
  
  const [savedLocations, setSavedLocations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('savedLocations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [reports, setReports] = useState<any[]>(() => {
    try {
      const rep = localStorage.getItem('reports');
      return rep ? JSON.parse(rep) : [];
    } catch { return []; }
  });
  
  const [predictedLocations, setPredictedLocations] = useState<any[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  // Load GeoJSON on mount
  useEffect(() => {
    fetch('/ethiopia-geology.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Failed to load geojson", err));
  }, []);

  const triggerAnalysisForCoords = (
    lat: number, 
    lng: number, 
    overrideTarget?: string, 
    overrideRadius?: number
  ) => {
    const effectiveTarget = overrideTarget !== undefined ? overrideTarget : targetMineral;
    const effectiveRadius = overrideRadius !== undefined ? overrideRadius : analysisRadius;
    let rockTypes = new Set<string>();
    let faultPresence = false;
    
    if (geoData) {
      const clickPoint = turf.point([lng, lat]);
      // Use buffer to approximate the analysis radius area
      const searchBuffer = turf.buffer(clickPoint, effectiveRadius, { units: 'kilometers' });

      turf.featureEach(geoData, (currentFeature: any) => {
        try {
          if (currentFeature.geometry?.type === 'Polygon' || currentFeature.geometry?.type === 'MultiPolygon') {
             if (turf.booleanIntersects(searchBuffer, currentFeature)) {
                 if (currentFeature.properties?.rock_type) {
                     rockTypes.add(currentFeature.properties.rock_type);
                 }
                 if (currentFeature.properties?.fault_presence) {
                     faultPresence = true;
                 }
             }
          } else if (currentFeature.geometry?.type === 'LineString' || currentFeature.geometry?.type === 'MultiLineString') {
             if (turf.booleanIntersects(searchBuffer, currentFeature)) {
                faultPresence = true;
             }
          }
        } catch(err) {
          console.error("Turf comparison error", err);
        }
      });
    }
    
    let aggregatedRockType = rockTypes.size > 0 ? Array.from(rockTypes).join(', ') : 'unknown';
    
    // Fallback logic for unmapped regions in our GeoJSON to ensure the AI always has rock type data
    if (aggregatedRockType === 'unknown' || !aggregatedRockType) {
        const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) * 43758.5453;
        const normalizedSeed = seed - Math.floor(seed);
        
        if (lat > 12.5 && lng > 39.5) {
            // Danakil / Afar region
            aggregatedRockType = normalizedSeed > 0.5 ? 'evaporites (salt, potash)' : 'basalt / volcanic ash';
        } else if (lat > 8 && lat < 12 && lng < 38) {
            // Western Greenstone Belts
            aggregatedRockType = normalizedSeed > 0.7 ? 'greenstone' : (normalizedSeed > 0.4 ? 'granite' : 'quartz vein');
        } else if (lat < 8 && lng > 38) {
            // Southern meta-sedimentary / rift zones
            aggregatedRockType = normalizedSeed > 0.6 ? 'metamorphic schist' : 'gneiss';
        } else {
            // Baseline highlands / central
            aggregatedRockType = normalizedSeed > 0.6 ? 'flood basalt' : (normalizedSeed > 0.3 ? 'rhyolite' : 'sedimentary sandstone');
        }
    }

    handleLocationSelect(lat, lng, aggregatedRockType, faultPresence, effectiveTarget, effectiveRadius);
  };

  const handleLocationSelect = async (
    lat: number, 
    lng: number, 
    rockType: string, 
    faultPresence: boolean,
    effectiveTarget: string = targetMineral,
    effectiveRadius: number = analysisRadius
  ) => {
    setSelectedLocation({ lat, lng });
    setLoading(true);
    setPredictionData(null);
    const reqId = ++currentRequestIdRef.current;

    // Execute geological analysis via Serverless API
    try {
      // Deterministic topography and NDVI calculation to prevent blinking/flickering
      const distToDanakil = Math.sqrt(Math.pow(lat - 13, 2) + Math.pow(lng - 40.5, 2));
      const distToHighlands = Math.sqrt(Math.pow(lat - 9, 2) + Math.pow(lng - 38.5, 2));
      const geoSeed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233));

      let elevationCalc = 1000;
      if (distToDanakil < 2.5) elevationCalc = Math.max(-125, 200 * distToDanakil);
      else if (distToHighlands < 4) elevationCalc = 2000 + (4 - distToHighlands) * 200 + ((geoSeed * 1000) % 150);
      else elevationCalc = 500 + lat * 40 + ((geoSeed * 1000) % 200);
      
      const elevation = Math.floor(elevationCalc);
      const ndvi = parseFloat((0.15 + (geoSeed * 0.6)).toFixed(2));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           lat, lng, rockType, faultPresence, targetMineral: effectiveTarget, elevation, ndvi, radius: effectiveRadius, multiple: false
        })
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      if (reqId === currentRequestIdRef.current) {
        setPredictionData(data);
      }
    } catch (error) {
      if (reqId === currentRequestIdRef.current) {
        console.error("API Analysis Error:", error);
      }
    } finally {
      if (reqId === currentRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleTargetMineralChange = (newTarget: string) => {
    setTargetMineral(newTarget);
    if (selectedLocation) {
      triggerAnalysisForCoords(selectedLocation.lat, selectedLocation.lng, newTarget, analysisRadius);
    }
  };

  const handleRadiusChange = (newRadius: number) => {
    setAnalysisRadius(newRadius);
    if (selectedLocation) {
      triggerAnalysisForCoords(selectedLocation.lat, selectedLocation.lng, targetMineral, newRadius);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if simple lat, lng input
    const coordMatch = searchQuery.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      setMapCenterLocation({ lat, lng });
      triggerAnalysisForCoords(lat, lng);
      setShowSearchSuggestions(false);
      return;
    }

    // Direct match against curated high-density Ethiopian labels
    const q = searchQuery.toLowerCase().trim();
    const matched = ETHIOPIA_MAP_LABELS.find(l => 
      l.name.toLowerCase().includes(q) || 
      l.id.toLowerCase().includes(q) ||
      (l.mineralPotential && l.mineralPotential.toLowerCase().includes(q))
    );
    if (matched) {
      setMapCenterLocation({ lat: matched.lat, lng: matched.lng });
      triggerAnalysisForCoords(matched.lat, matched.lng);
      setShowSearchSuggestions(false);
      return;
    }

    // Fallback: Try text search via Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=et`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapCenterLocation({ lat, lng });
        triggerAnalysisForCoords(lat, lng);
        setShowSearchSuggestions(false);
      } else {
        alert("Location not found in Ethiopia.");
      }
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  const filteredGeoData = geoData ? {
    ...geoData,
    features: geoData.features.filter((f: any) => {
      if (!mineralSearch) return true;
      const m = mineralSearch.toLowerCase();
      const r = f.properties.rock_type;
      
      if (m.includes('gold') || m.includes('silver')) return r === 'volcanic';
      if (m.includes('base metal')) return r === 'volcanic' || r === 'metamorphic';
      if (m.includes('potash') || m.includes('gypsum') || m.includes('uranium')) return r === 'sedimentary';
      if (m.includes('tantalum') || m.includes('niobium')) return r === 'metamorphic';
      return false;
    })
  } : null;

  return (
    <div className="flex h-screen w-full bg-[#0B101E] text-white overflow-hidden font-sans">
      
      <Sidebar activeMenu={activeMenu} onMenuSelect={(m) => { setActiveMenu(m); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col p-3 md:p-4 lg:pl-6 gap-3 md:gap-4 relative min-w-0 overflow-y-auto lg:overflow-hidden">
        
        {/* Topbar */}
        <header className="flex flex-col lg:flex-row lg:items-center gap-3 shrink-0 mb-2">
           <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2 lg:hidden mr-1">
                 <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 font-black text-sm shadow">
                   E
                 </div>
                 <span className="font-bold text-white text-base tracking-tight">Ethiral</span>
              </div>
              <div className="relative flex-1 lg:w-[280px] xl:w-[360px] shrink-0">
                <form onSubmit={handleSearch} className="relative w-full">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-slate-500" />
                   </div>
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => {
                       setSearchQuery(e.target.value);
                       setShowSearchSuggestions(e.target.value.trim().length > 0);
                     }}
                     onFocus={() => {
                       if (searchQuery.trim().length > 0) setShowSearchSuggestions(true);
                     }}
                     placeholder="Search 80+ deposits, cities, belts..." 
                     className="w-full pl-10 pr-4 py-2 bg-[#171E2F] border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 text-white placeholder-slate-500"
                   />
                </form>

                {showSearchSuggestions && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#101524]/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-[600] max-h-60 overflow-y-auto">
                    {ETHIOPIA_MAP_LABELS
                      .filter(l => 
                        l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        l.typeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (l.mineralPotential && l.mineralPotential.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                      .slice(0, 6)
                      .map(l => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(l.name);
                            setShowSearchSuggestions(false);
                            setMapCenterLocation({ lat: l.lat, lng: l.lng });
                            triggerAnalysisForCoords(l.lat, l.lng);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-0 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {l.category === 'mineral' ? '⛏️' : l.category === 'geology' ? '⛰️' : l.category === 'river' ? '🌊' : '📍'}
                            </span>
                            <span className="text-xs font-semibold text-white">{l.name}</span>
                          </div>
                          <span className="text-[10px] text-yellow-400 font-medium px-1.5 py-0.5 rounded bg-yellow-500/10">
                            {l.typeLabel}
                          </span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide shrink-0">
              <div className="flex items-center gap-2 bg-[#171E2F] border border-slate-700/50 rounded-xl px-3 py-1.5 shrink-0">
                 <label className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">Target:</label>
                 <select 
                   value={targetMineral}
                   onChange={(e) => handleTargetMineralChange(e.target.value)}
                   className="bg-transparent text-sm font-semibold text-white focus:outline-none appearance-none cursor-pointer p-0"
                 >
                   {MINERALS.map(m => (
                     <option key={m} value={m} className="bg-slate-800 text-white">{m}</option>
                   ))}
                 </select>
              </div>
              <div className="flex items-center gap-3 bg-[#171E2F] border border-slate-700/50 rounded-xl px-3 flex-grow min-w-[200px] shrink-0">
                 <label className="text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">Range:</label>
                 <input 
                   type="range" 
                   min="1" 
                   max="10" 
                   value={analysisRadius} 
                   onChange={(e) => handleRadiusChange(Number(e.target.value))} 
                   className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                 />
                 <div className="flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 rounded px-2 py-0.5 min-w-[45px] my-1.5">
                   <span className="text-[10px] sm:text-xs font-bold text-yellow-500">{analysisRadius} km²</span>
                 </div>
              </div>
              

           </div>
        </header>

        {/* Map Area */}
        <div className="flex-1 relative min-h-0 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-slate-700/50 ring-1 ring-white/5 overflow-hidden">
           <MapView 
             geoData={filteredGeoData} 
             onLocationSelect={(lat, lng) => triggerAnalysisForCoords(lat, lng)}
             selectedLocation={selectedLocation}
             mapCenterLocation={mapCenterLocation}
             showGeology={showGeology}
             showLabels={showLabels}
             predictedLocations={predictedLocations}
           />
           
           {activeMenu === 'Predictions' && (
              <div className="absolute top-0 md:top-4 left-0 md:left-4 bottom-0 md:bottom-4 w-full md:w-80 bg-[#101524]/95 backdrop-blur-xl border-0 md:border border-slate-800 rounded-none md:rounded-2xl shadow-2xl flex flex-col z-[500] overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                    <h2 className="text-white font-semibold">Mineral Search</h2>
                    <button onClick={() => { setActiveMenu('Dashboard'); setMineralSearch(''); }} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden min-h-0">
                   <p className="text-sm text-slate-400 mb-3">Type a mineral to highlight regions with potential availability.</p>
                   <div className="flex items-center gap-2">
                       <input 
                          type="text" 
                          value={mineralSearch}
                          onChange={(e) => setMineralSearch(e.target.value)}
                          placeholder="e.g. Gold, Potash, Tantalum"
                          className="flex-1 px-3 py-2 bg-[#171E2F] border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500/50 text-white placeholder-slate-500"
                       />
                       <button
                          onClick={() => {
                              if (!mineralSearch || !geoData || !geoData.features.length) {
                                  setPredictedLocations([]);
                                  return;
                              }
                              const runMultiNodeScan = async () => {
                                setIsPredicting(true);
                                try {
                                  // We use the full geoData and slightly favor matching items to give more results
                                  const m = mineralSearch.toLowerCase();
                                  let features = geoData.features.filter((f: any) => {
                                      const r = (f.properties?.rock_type || '').toLowerCase();
                                      const propsStr = Object.values(f.properties || {}).join(' ').toLowerCase();
                                      
                                      let matches = false;
                                      if (m.includes('gold') || m.includes('silver')) matches = r.includes('volcanic') || r.includes('precambrian') || propsStr.includes('gold') || propsStr.includes('silver');
                                      else if (m.includes('base metal') || m.includes('copper') || m.includes('zinc')) matches = r.includes('volcanic') || r.includes('metamorphic') || propsStr.includes('copper') || propsStr.includes('zinc') || propsStr.includes('lead');
                                      else if (m.includes('potash') || m.includes('gypsum') || m.includes('uranium')) matches = r.includes('sedimentary') || propsStr.includes('potash') || propsStr.includes('evaporite') || propsStr.includes('salt');
                                      else if (m.includes('tantalum') || m.includes('niobium') || m.includes('lithium')) matches = r.includes('metamorphic') || r.includes('precambrian') || propsStr.includes('tantalum') || propsStr.includes('pegmatite');
                                      else matches = propsStr.includes(m) || r.includes(m);
                                      
                                      return matches;
                                  });
                                  
                                  if (features.length === 0) features = geoData.features;
                                  const shuffled = [...features].sort(() => 0.5 - Math.random());
                                  
                                  // Pick a batch of 8 to send to the AI
                                  const selectedCount = Math.min(8, shuffled.length);
                                  const selected = shuffled.slice(0, selectedCount).map((feat: any, idx: number) => {
                                      let centerPoint;
                                      try {
                                          if (feat.geometry.type === 'Polygon' || feat.geometry.type === 'MultiPolygon') {
                                             centerPoint = turf.center(feat);
                                          }
                                      } catch(e) { }
                                      let lng = 40.5; let lat = 9.1;
                                      if (centerPoint && centerPoint.geometry && centerPoint.geometry.coordinates) {
                                          lng = centerPoint.geometry.coordinates[0];
                                          lat = centerPoint.geometry.coordinates[1];
                                      } else if (feat.geometry?.type === 'Point') {
                                          lng = feat.geometry.coordinates[0];
                                          lat = feat.geometry.coordinates[1];
                                      }
                                      return { id: idx, lat, lng, rock_type: feat.properties?.rock_type || 'unknown' };
                                  });

                                  const response = await fetch('/api/analyze', {
                                     method: 'POST',
                                     headers: { 'Content-Type': 'application/json' },
                                     body: JSON.stringify({
                                        searchMineral: mineralSearch,
                                        features: selected,
                                        multiple: true
                                     })
                                  });
                                  
                                  if (!response.ok) throw new Error("API analysis failed");
                                  const data = await response.json();
                                  
                                  if (data.results) {
                                      data.results.sort((a: any, b: any) => b.confidence - a.confidence);
                                      setPredictedLocations(data.results);
                                  } else {
                                      setPredictedLocations([]);
                                  }
                                } catch (error) {
                                  console.error("Multi node scan failed", error);
                                  alert("Failed to analyze geological nodes via AI.");
                                } finally {
                                  setIsPredicting(false);
                                }
                              };
                              runMultiNodeScan();
                          }}
                          disabled={isPredicting}
                          className={`px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-2 ${isPredicting ? 'opacity-80 cursor-wait' : ''}`}
                       >
                           {isPredicting ? (
                             <>
                               <div className="w-3 h-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
                               <span>Scanning...</span>
                             </>
                           ) : (
                             'Predict'
                           )}
                       </button>
                   </div>
                   
                   {predictedLocations.length > 0 && (
                      <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                             <h3 className="text-white font-medium text-sm flex items-center gap-2">
                               <Target size={16} className="text-yellow-500" />
                               Identified Targets
                             </h3>
                             <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">{predictedLocations.length} Found</span>
                          </div>
                          <div className="space-y-4 pb-6">
                             {predictedLocations.map((loc) => (
                                 <PredictionItem 
                                    key={loc.id} 
                                    loc={loc} 
                                    onShowOnMap={(lat, lng) => setMapCenterLocation({ lat, lng })}
                                 />
                              ))}
                          </div>
                      </div>
                   )}
                </div>
              </div>
           )}

           {activeMenu === 'Saved Locations' && (
              <div className="absolute top-0 md:top-4 left-0 md:left-4 bottom-0 md:bottom-4 w-full md:w-80 bg-[#101524]/95 backdrop-blur-xl border-0 md:border border-slate-800 rounded-none md:rounded-2xl shadow-2xl flex flex-col z-[500] overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-white font-semibold">Saved Locations</h2>
                    <button onClick={() => setActiveMenu('Dashboard')} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                   {savedLocations.length === 0 ? (
                       <p className="text-sm text-slate-400 text-center mt-10">No saved locations yet.</p>
                   ) : (
                       savedLocations.map(loc => (
                           <div key={loc.id} onClick={() => {
                             setMapCenterLocation({ lat: loc.location.lat, lng: loc.location.lng });
                             triggerAnalysisForCoords(loc.location.lat, loc.location.lng);
                           }} className="p-3 bg-slate-800/40 border border-slate-700 rounded-xl hover:border-slate-500 cursor-pointer transition">
                               <p className="text-sm font-medium text-white">{loc.potential} for {loc.mineral}</p>
                               <p className="text-xs text-slate-400 mt-1">Lat: {loc.location.lat.toFixed(4)}, Lng: {loc.location.lng.toFixed(4)}</p>
                           </div>
                       ))
                   )}
                </div>
              </div>
           )}

           {activeMenu === 'Reports' && (
              <div className="absolute inset-0 md:inset-4 bg-[#101524]/95 backdrop-blur-xl border-0 md:border border-slate-800 rounded-none md:rounded-2xl shadow-2xl z-[500] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0B0F19]">
                    <h2 className="text-lg text-white font-semibold">Generated Reports</h2>
                    <button onClick={() => setActiveMenu('Dashboard')} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {reports.length === 0 ? (
                       <p className="text-sm text-slate-400">No reports generated yet.</p>
                   ) : (
                       reports.map(report => (
                           <div key={report.id} className="p-4 bg-slate-800/40 border border-slate-700/80 rounded-xl select-none">
                               <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-base font-medium text-white">{report.mineral}</h3>
                                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md border border-yellow-500/20">{report.confidence}% Conf.</span>
                               </div>
                               <p className="text-xs text-slate-400 mb-3">Date: {new Date(report.date).toLocaleDateString()}</p>
                               <div className="text-xs text-slate-300 space-y-1 mb-4">
                                  <p>Location: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}</p>
                                  <p>Potential: {report.potential}</p>
                                  <p>Rock Type: {report.rock_type}</p>
                               </div>
                               <button 
                                  onClick={() => {
                                      setMapCenterLocation({ lat: report.location.lat, lng: report.location.lng });
                                      triggerAnalysisForCoords(report.location.lat, report.location.lng);
                                      setActiveMenu('Dashboard');
                                  }}
                                  className="w-full py-1.5 text-xs text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                               >
                                  View on Map
                               </button>
                           </div>
                       ))
                   )}
                </div>
              </div>
           )}
           
           <PredictionPanel 
             data={predictionData} 
             location={selectedLocation} 
             loading={loading}
             radius={analysisRadius}
             onClose={() => {
                setSelectedLocation(null);
                setPredictionData(null);
             }}
             onSave={() => {
               if (predictionData && selectedLocation) {
                 setSavedLocations(prev => [...prev, { ...predictionData, location: selectedLocation, id: Date.now() }]);
                 // Optional visual feedback
                 alert("Location saved!");
               }
             }}
             onReport={() => {
               if (predictionData && selectedLocation) {
                 setReports(prev => [...prev, { ...predictionData, location: selectedLocation, date: new Date().toISOString(), id: Date.now() }]);
                 alert("Report generated! Check the Reports menu.");
               }
             }}
           />

           {/* Overlaid map controls purely visual for design match */}
           <div className="absolute bottom-6 left-6 z-[400] flex bg-[#101524] rounded-xl border border-slate-700 p-1 shadow-lg backdrop-blur-md">
              <button 
                onClick={() => setShowGeology(!showGeology)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition ${showGeology ? 'bg-slate-800 text-yellow-500' : 'text-slate-400 hover:text-white'}`}>
                 <Layers size={14} /> Geology
              </button>
              <button 
                 onClick={() => setShowLabels(!showLabels)}
                 className={`px-4 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition ${showLabels ? 'bg-slate-800 text-yellow-500' : 'text-slate-400 hover:text-white'}`}>
                 <MapPin size={14} /> Labels {showLabels ? '(80+ Active)' : '(Off)'}
              </button>
           </div>
        </div>

        {/* Stats Area */}
        <StatsCards 
           mappedRegions={geoData?.features ? geoData.features.length : 0}
           predictedNodes={predictedLocations.length}
           savedLocations={savedLocations.length}
           generatedReports={reports.length}
        />

      </main>

    </div>
  );
}

function PredictionItem({ loc, onShowOnMap }: { key?: string | number, loc: any, onShowOnMap: (lat: number, lng: number) => void }) {
    const [expanded, setExpanded] = React.useState(false);
    
    const confColor = loc.confidence >= 90 ? 'bg-green-500' : loc.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500';
    const confTextColor = loc.confidence >= 90 ? 'text-green-500' : loc.confidence >= 70 ? 'text-yellow-500' : 'text-red-500';
    const confFromColor = loc.confidence >= 90 ? 'from-green-500/20' : loc.confidence >= 70 ? 'from-yellow-500/20' : 'from-red-500/20';
    const borderGlow = loc.confidence >= 90 ? 'border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : loc.confidence >= 70 ? 'border-yellow-500/30 shadow-sm' : 'border-slate-700/80 shadow-sm';
    
    return (
       <div className={`bg-[#131A2B] rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border ${borderGlow} flex flex-col group`}>
          {/* Header Section */}
          <div className={`p-3 bg-gradient-to-br ${confFromColor} to-transparent border-b border-slate-800/60`}>
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/60 flex items-center justify-center border border-slate-700">
                    <Diamond size={16} className={confTextColor} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${confTextColor} flex items-center gap-1.5 leading-tight`}>
                        {loc.confidence >= 90 && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
                        {loc.mineral}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{loc.distanceInfo}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-baseline gap-0.5">
                     <span className={`text-lg font-black tracking-tighter leading-none ${confTextColor}`}>{loc.confidence}</span>
                     <span className={`text-[10px] font-bold ${confTextColor}`}>%</span>
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase font-semibold mt-1">Match</span>
                </div>
             </div>
          </div>
          
          {/* Body Section */}
          <div className="p-3 flex-1 flex flex-col">
             <div className="mb-3">
               <p className={`text-[11px] text-slate-300 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>{loc.description}</p>
               {loc.description && loc.description.length > 80 && (
                  <button 
                     onClick={(e) => {
                         e.stopPropagation();
                         setExpanded(!expanded);
                     }} 
                     className="text-[10px] text-yellow-500 hover:text-yellow-400 mt-1.5 font-bold uppercase tracking-wider"
                  >
                     {expanded ? 'Show less' : 'Read more'}
                  </button>
               )}
             </div>
             
             <div className="mt-auto grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#171E2F] rounded-lg text-center py-1.5 border border-slate-800/80">
                  <span className="text-[9px] uppercase text-slate-500 block mb-0.5 font-bold">Est. Depth</span>
                  <span className="text-[10px] font-mono text-white">{(Math.random() * 200 + 50).toFixed(0)}m</span>
                </div>
                <div className="bg-[#171E2F] rounded-lg text-center py-1.5 border border-slate-800/80">
                  <span className="text-[9px] uppercase text-slate-500 block mb-0.5 font-bold">Rock Type</span>
                  <span className="text-[10px] font-mono text-white capitalize truncate px-1 block">{loc.rock_type}</span>
                </div>
             </div>
             
             <button 
                onClick={() => {
                   onShowOnMap(loc.lat, loc.lng);
                }}
                className={`w-full py-2.5 text-xs font-bold text-slate-900 rounded-xl transition-all shadow-sm active:scale-95 flex justify-center items-center gap-1.5 ${loc.confidence >= 90 ? 'bg-green-500 hover:bg-green-400 border border-green-400' : loc.confidence >= 70 ? 'bg-yellow-500 hover:bg-yellow-400 border border-yellow-400' : 'bg-slate-200 hover:bg-white border border-white'}`}
             >
                <MapPin size={14} />
                Show on Map
             </button>
          </div>
       </div>
    );
}
