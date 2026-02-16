import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full flex flex-col font-mono text-cyber-green bg-cyber-black p-4 md:p-8">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(#003300 1px, transparent 1px), linear-gradient(90deg, #003300 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Top Decoration */}
      <div className="flex justify-between items-center mb-8 border-b border-cyber-green/30 pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-cyber-green animate-pulse"></div>
          <h1 className="text-2xl md:text-4xl font-display uppercase tracking-widest text-cyber-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
            NetVision<span className="text-xs align-top opacity-70"> v2.0.4</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-4 text-xs opacity-60">
          <span>SYS.ONLINE</span>
          <span>NET.CONNECTED</span>
          <span>SEC.ENCRYPTED</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-20 overflow-hidden flex flex-col">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-cyber-green/30 flex justify-between text-xs opacity-50 relative z-20">
        <p>POWERED BY GEMINI-3-FLASH</p>
        <p>CAUTION: FOR EDUCATIONAL & SIMULATION USE ONLY</p>
      </div>
    </div>
  );
};