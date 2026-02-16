import React, { useState, useEffect } from 'react';
import { profileTarget } from '../services/geminiService';
import { PortProfile } from '../types';
import { Play, ShieldAlert, ShieldCheck, Activity, Lock, Terminal } from 'lucide-react';

export const Scanner: React.FC = () => {
  const [target, setTarget] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState<{ ports: PortProfile[], summary: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulate console logs during loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      const messages = [
        `Resolving host ${target}...`,
        `Initiating SYN Stealth Scan...`,
        `Scanning first 1000 ports...`,
        `Discovered open port...`,
        `Fingerprinting OS...`,
        `Analyzing service versions...`,
        `Aggregating results...`
      ];
      setLogs(prev => [...prev, messages[Math.floor(Math.random() * messages.length)]]);
    }, 800);
    return () => clearInterval(interval);
  }, [loading, target]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setLoading(true);
    setLogs([`> TARGET ACQUIRED: ${target}`]);
    setScanData(null);

    try {
      const result = await profileTarget(target);
      setScanData(result);
    } catch (err) {
      setLogs(prev => [...prev, `ERROR: Connection terminated by host.`]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-cyber-red border-cyber-red animate-pulse';
      case 'High': return 'text-orange-500 border-orange-500';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      default: return 'text-cyber-blue border-cyber-blue';
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden">
      
      {/* Left Panel: Controls & Terminal */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="bg-cyber-gray/50 border border-cyber-green/30 p-4">
          <form onSubmit={handleScan} className="flex flex-col gap-4">
            <label className="text-xs uppercase tracking-widest opacity-70">Target Designation</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1 bg-black border border-cyber-green/50 p-2 font-mono text-sm focus:outline-none focus:border-cyber-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] placeholder-cyber-green/30"
                placeholder="IP / DOMAIN / SERVICE"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-cyber-green/20 border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black p-2 transition-all flex items-center justify-center"
              >
                {loading ? <Activity className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 bg-black border border-cyber-green/30 p-4 overflow-y-auto font-mono text-xs leading-relaxed relative">
            <div className="absolute top-0 right-0 p-2 opacity-50"><Terminal className="w-4 h-4"/></div>
            {logs.map((log, i) => (
              <div key={i} className="mb-1 text-cyber-green/80">
                <span className="opacity-50 mr-2">{new Date().toLocaleTimeString()}</span>
                {log}
              </div>
            ))}
            {loading && <div className="animate-pulse">_</div>}
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="w-full md:w-2/3 bg-cyber-gray/20 border border-cyber-green/30 flex flex-col overflow-hidden relative">
        {!scanData && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30">
            <ShieldCheck className="w-24 h-24 mb-4" />
            <p className="text-xl tracking-widest">SYSTEM STANDBY</p>
            <p className="text-xs">AWAITING TARGET INPUT</p>
          </div>
        )}

        {loading && !scanData && (
           <div className="flex-1 flex flex-col items-center justify-center text-cyber-green">
             <div className="w-full max-w-md h-2 bg-black border border-cyber-green/30 mb-4 overflow-hidden">
               <div className="h-full bg-cyber-green animate-[scanline_2s_linear_infinite] w-full origin-left"></div>
             </div>
             <p className="animate-pulse">ANALYZING NETWORK TOPOLOGY...</p>
           </div>
        )}

        {scanData && (
          <div className="flex-1 flex flex-col overflow-hidden">
             {/* Summary Header */}
             <div className="p-6 border-b border-cyber-green/20 bg-black/40">
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> SCAN COMPLETE
                </h2>
                <p className="text-sm opacity-80 leading-relaxed max-w-3xl border-l-2 border-cyber-green pl-4">
                  {scanData.summary}
                </p>
             </div>

             {/* Ports Grid */}
             <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanData.ports.map((port, idx) => (
                  <div key={idx} className={`p-4 border bg-black/60 backdrop-blur-sm flex flex-col gap-2 group hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all ${getRiskColor(port.riskLevel)}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-display font-bold">{port.port}</span>
                      <span className="text-xs px-2 py-1 border border-current opacity-80">{port.protocol}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                      {port.state === 'Open' ? <Activity className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {port.service.toUpperCase()}
                    </div>
                    <p className="text-xs opacity-70 mt-1 flex-1">{port.description}</p>
                    {port.vulnerability && (
                      <div className="mt-2 text-xs border-t border-current pt-2 opacity-80 flex items-start gap-1">
                        <ShieldAlert className="w-3 h-3 min-w-[12px] mt-0.5" />
                        <span>{port.vulnerability}</span>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};