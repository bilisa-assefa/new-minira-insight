import { Diamond, AlertCircle, X, MapPin, Database, Activity, Map as MapIcon, ChevronRight, Bookmark, FileText } from 'lucide-react';

interface PredictionData {
  potential: string;
  mineral: string;
  confidence: number;
  ndvi: number;
  elevation: number;
  rock_type: string;
  explanations: string[];
}

interface PredictionPanelProps {
  data: PredictionData | null;
  location: {lat: number, lng: number} | null;
  onClose: () => void;
  onSave: () => void;
  onReport: () => void;
  loading: boolean;
  radius?: number;
}

export default function PredictionPanel({ data, location, onClose, onSave, onReport, loading, radius = 2 }: PredictionPanelProps) {
  if (!data && !loading && !location) return null;

  const isHighPotential = data?.potential.includes('High');
  const bgAccent = data?.confidence ? 
    (data.confidence >= 90 ? 'bg-green-500' : data.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500') 
    : 'bg-yellow-500';
    
  const textAccent = data?.confidence ? 
    (data.confidence >= 90 ? 'text-green-500' : data.confidence >= 70 ? 'text-yellow-500' : 'text-red-500') 
    : 'text-yellow-500';
    
  const gradientClass = data?.confidence ? 
    (data.confidence >= 90 ? 'from-green-500/20 to-green-500/5' : data.confidence >= 70 ? 'from-yellow-500/20 to-yellow-500/5' : 'from-red-500/20 to-red-500/5') 
    : 'from-yellow-500/20 to-yellow-500/5';
    
  const borderClass = data?.confidence ? 
    (data.confidence >= 90 ? 'border-green-500/30' : data.confidence >= 70 ? 'border-yellow-500/30' : 'border-red-500/30') 
    : 'border-yellow-500/30';

  return (
    <div className="absolute top-0 md:top-4 right-0 md:right-4 bottom-0 md:bottom-4 w-full md:w-[340px] bg-[#0B101E]/95 backdrop-blur-xl border-0 md:border border-slate-700/80 rounded-none md:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col z-[500] overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#131A2B]/80 shrink-0">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : bgAccent}`}></div>
           <h2 className="text-white text-sm font-semibold tracking-wide">Area Scan Result</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
           <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide overflow-x-hidden min-h-0 relative">
        {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-6">
               <div className="relative">
                 <div className="w-16 h-16 rounded-full border-4 border-slate-800"></div>
                 <div className="w-16 h-16 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
                 <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500" size={20} />
               </div>
               <div>
                 <p className="text-white font-medium mb-1">Analyzing {radius} km² radius</p>
                 <p className="text-slate-400 text-xs leading-relaxed">Analyzing geological boundaries and local terrain data.</p>
               </div>
            </div>
        ) : data ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                
                {/* Result Hero */}
                <div className="flex flex-col gap-4">
                   <div className="flex justify-between items-start">
                     <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradientClass} border ${borderClass} shadow-lg`}>
                        {data?.confidence && data.confidence >= 90 && (
                            <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-md animate-pulse" />
                        )}
                        <Diamond className={`${textAccent} relative z-10`} size={28} />
                     </div>
                     <div className="text-right">
                       <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Confidence</p>
                       <div className="flex items-baseline justify-end gap-1">
                          <span className={`text-3xl font-black ${textAccent} tracking-tighter`}>{data.confidence}</span>
                          <span className={`text-sm font-medium ${textAccent}`}>%</span>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                       <h3 className={`text-2xl font-black uppercase tracking-tight ${textAccent} drop-shadow-md`}>
                           {data.potential}
                       </h3>
                       <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
                           Target: <span className="text-white font-semibold">{data.mineral}</span>
                       </p>
                       {location && (
                         <div className="mt-3 flex items-center gap-2 bg-[#171E2F] rounded-lg p-2 border border-slate-800">
                           <MapPin size={14} className="text-slate-400" />
                           <p className="text-xs text-slate-400 font-mono">
                               {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                           </p>
                           <div className="ml-auto px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-medium">
                             {radius} km² scan
                           </div>
                         </div>
                       )}
                   </div>
                </div>

                {/* Raw Data Readout */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-[#171E2F] p-3 rounded-xl border border-slate-800/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Primary Rock</p>
                      <p className="text-white text-xs font-mono capitalize leading-tight truncate">{data.rock_type}</p>
                   </div>
                   <div className="bg-[#171E2F] p-3 rounded-xl border border-slate-800/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Terrain</p>
                      <p className="text-white text-xs font-mono">Elev: {data.elevation}m</p>
                      <p className="text-slate-400 text-xs font-mono mt-0.5">NDVI: {data.ndvi.toFixed(2)}</p>
                   </div>
                </div>

                <div className="w-full h-px bg-slate-800" />

                {/* Explanations */}
                <div>
                     <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Activity size={16} className="text-yellow-500" />
                        AI Analysis Drivers
                     </h4>
                     <div className="space-y-3">
                         {data.explanations.map((exp, idx) => (
                             <div key={idx} className="flex gap-3 bg-[#131A2B] p-3 rounded-xl border border-slate-800/50">
                                 <div className="mt-0.5 shrink-0">
                                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold border border-slate-700">
                                       {idx + 1}
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-300 leading-relaxed">{exp}</p>
                             </div>
                         ))}
                     </div>
                </div>

            </div>
        ) : null}
      </div>

      {/* Footer Actions */}
      {data && (
         <div className="p-4 border-t border-slate-800 flex items-center gap-3 bg-[#131A2B] shrink-0">
             <button 
                onClick={onSave} 
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#1A2133] hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all border border-slate-700 shadow-sm hover:shadow active:scale-95"
             >
                 <Bookmark size={16} />
                 Save
             </button>
             <button 
                onClick={onReport} 
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-sm font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(234,179,8,0.25)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] active:scale-95"
             >
                 <FileText size={16} />
                 Report
             </button>
         </div>
      )}
    </div>
  );
}
