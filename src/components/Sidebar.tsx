import { 
    LayoutDashboard, Sparkles, FileText, Bookmark, Map, X
} from 'lucide-react';
  
export default function Sidebar({ activeMenu, onMenuSelect, isOpen, setIsOpen }: { activeMenu: string, onMenuSelect: (m: string) => void, isOpen: boolean, setIsOpen: (v: boolean) => void }) {
    const navItems = [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Predictions', icon: Sparkles },
      { name: 'Reports', icon: FileText },
      { name: 'Saved Locations', icon: Bookmark },
    ];
  
    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[990] lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
        <aside className={`fixed inset-y-0 left-0 z-[1000] w-64 h-full bg-[#101524] border-r border-[#1e293b] flex flex-col pt-6 pb-4 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Close button on mobile */}
          <button 
            className="absolute top-4 right-4 text-slate-400 hover:text-white lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
          
          {/* Logo */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-slate-950 font-black text-lg shadow-[0_0_15px_rgba(234,179,8,0.3)]">
             E
          </div>
          <div>
            <h1 className="text-white font-black tracking-tight text-xl leading-tight">Ethiral</h1>
            <p className="text-yellow-500/80 text-[11px] font-medium tracking-wider uppercase">Mineral AI</p>
          </div>
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onMenuSelect(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeMenu === item.name
                  ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-yellow-500 border border-yellow-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>
  
        {/* Geological Zones Legend */}
        <div className="px-6 mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Geological Zones</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-3 h-3 rounded-sm bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    Volcanic
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-3 h-3 rounded-sm bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    Sedimentary
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-3 h-3 rounded-sm bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    Metamorphic
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-3 h-3 rounded-sm bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.5)]"></div>
                    Other
                </div>
            </div>
        </div>

        {/* AI Callout */}
        <div className="mx-4 p-4 rounded-xl border border-yellow-500/20 bg-gradient-to-b from-[#1a2133] to-[#101524] mt-auto">
            <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-yellow-500 shrink-0" />
                <h4 className="text-yellow-500 text-sm font-semibold">AI-Powered Insights</h4>
            </div>
            <p className="text-slate-400 text-xs">Real data. Smarter exploration. Better decisions.</p>
            <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">built by bilisa assefa</span>
            </div>
        </div>
      </aside>
      </>
    );
}
