import { Layers, MapPin, Target, Database } from 'lucide-react';

export default function StatsCards({ 
  mappedRegions, 
  predictedNodes, 
  savedLocations, 
  generatedReports 
}: { 
  mappedRegions: number;
  predictedNodes: number;
  savedLocations: number;
  generatedReports: number;
}) {
  const stats = [
    {
      title: "Mapped Regions",
      value: mappedRegions.toString(),
      subtitle: "Geological zones",
      icon: Layers,
      color: "text-blue-400",
      bgCol: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      title: "Predicted Nodes",
      value: predictedNodes.toString(),
      subtitle: "AI discovery targets",
      icon: Target,
      color: "text-red-400",
      bgCol: "bg-red-400/10",
      borderColor: "border-red-400/20"
    },
    {
      title: "Saved Locations",
      value: savedLocations.toString(),
      subtitle: "Bookmarked anomalies",
      icon: MapPin,
      color: "text-green-400",
      bgCol: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      title: "Generated Reports",
      value: generatedReports.toString(),
      subtitle: "Exported analyses",
      icon: Database,
      color: "text-cyan-400",
      bgCol: "bg-cyan-400/10",
      borderColor: "border-cyan-400/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:h-[110px] shrink-0">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#101524] rounded-2xl border border-slate-800 p-3 lg:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-slate-700 transition-colors gap-2 sm:gap-0">
            <div className="flex flex-col h-full justify-between w-full sm:w-auto">
                <span className="text-slate-400 font-medium text-[10px] lg:text-xs whitespace-nowrap">{s.title}</span>
                <div className="flex items-baseline gap-2 mt-1 sm:mt-0">
                   <h4 className={`text-xl lg:text-2xl font-bold ${s.color}`}>{s.value}</h4>
                   <span className="text-slate-500 text-[9px] lg:text-[10px] hidden xl:inline">{s.subtitle}</span>
                </div>
            </div>
            
            <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 ${s.bgCol} border ${s.borderColor}`}>
               <s.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${s.color}`} />
            </div>
        </div>
      ))}
    </div>
  );
}
