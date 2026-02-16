import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col font-mono text-cyber-green bg-cyber-black p-4 md:p-8 relative overflow-hidden selection:bg-cyber-green selection:text-black">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Static Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: `linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* 2. Rolling Scanline (Simulates Refresh Rate) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] animate-scanline bg-gradient-to-b from-transparent via-cyber-green to-transparent h-[30%] w-full" />
      
      {/* 3. Vignette (Corner Darkening) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.8)_100%)]" />

      {/* 4. Horizontal Micro-lines (Interlace effect) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.1]" 
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 3px)' }} 
      />

      {/* --- UI LAYER --- */}

      {/* Top Decoration */}
      <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-cyber-green/30 pb-4 relative z-20 animate-[fadeIn_0.6s_ease-out]">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-cyber-green animate-pulse shadow-[0_0_15px_#00ff41]"></div>
          <h1 className="text-2xl md:text-4xl font-display uppercase tracking-[0.2em] text-cyber-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)] group-hover:text-white transition-colors duration-300">
            NetVision<span className="text-[10px] md:text-xs align-top opacity-60 ml-2">v2.1.0</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest opacity-60 font-bold">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>SYS.ONLINE</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyber-green/50"></span>NET.SECURE</span>
        </div>
      </div>

      {/* Main Content Area - with Slide Up Transition */}
      <div className="flex-1 relative z-20 overflow-hidden flex flex-col animate-[slideUp_0.5s_cubic-bezier(0.2,0.8,0.2,1)_0.2s_both]">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-cyber-green/30 flex flex-col md:flex-row justify-between items-center text-[10px] opacity-40 relative z-20 font-display tracking-widest uppercase gap-2">
        <p className="hover:opacity-100 transition-opacity duration-300">Neural Network Interface // Gemini-3-Flash</p>
        <p className="text-cyber-red/80 hover:text-cyber-red transition-colors cursor-alert">:: SIMULATION MODE :: EDUCATIONAL USE ONLY ::</p>
      </div>

      {/* Inline Styles for specific animations not in Tailwind config */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};