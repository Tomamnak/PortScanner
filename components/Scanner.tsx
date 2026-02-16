import React, { useState, useEffect, useRef } from 'react';
import { profileTarget } from '../services/geminiService';
import { PortProfile } from '../types';
import { Play, ShieldAlert, ShieldCheck, Activity, Lock, Terminal, Filter, Search, Clock, History, ExternalLink, AlertTriangle } from 'lucide-react';

interface HistoryItem {
  target: string;
  timestamp: number;
  data: { ports: PortProfile[], summary: string };
}

interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
}

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayText(''); // Reset on new text
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 15); // Typing speed
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}</span>;
};

export const Scanner: React.FC = () => {
  const [target, setTarget] = useState('google.com');
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState<{ ports: PortProfile[], summary: string } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // Filter States
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const createLog = (text: string): LogEntry => ({
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}),
    text
  });

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
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [...prev, createLog(randomMsg)]);
    }, 800);
    return () => clearInterval(interval);
  }, [loading, target]);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    
    setLoading(true);
    setLogs([createLog(`> TARGET ACQUIRED: ${target}`)]);
    setScanData(null);
    // Reset filters on new scan
    setRiskFilter('ALL');
    setSearchQuery('');

    try {
      const result = await profileTarget(target);
      setScanData(result);
      
      // Add to history
      setHistory(prev => {
        const newItem: HistoryItem = { target, timestamp: Date.now(), data: result };
        // Remove duplicate if exists (move to top)
        const filtered = prev.filter(item => item.target !== target);
        return [newItem, ...filtered].slice(0, 5); // Keep last 5 entries
      });

    } catch (err) {
      setLogs(prev => [...prev, createLog(`ERROR: Connection terminated by host.`)]);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setTarget(item.target);
    setScanData(item.data);
    setLogs([
      createLog(`> RESTORING SESSION ARCHIVE...`),
      createLog(`> TARGET: ${item.target}`),
      createLog(`> TIMESTAMP: ${new Date(item.timestamp).toLocaleTimeString()}`),
      createLog(`> DATA INTEGRITY: VERIFIED`)
    ]);
    setRiskFilter('ALL');
    setSearchQuery('');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'text-cyber-red border-cyber-red animate-pulse';
      case 'High': return 'text-orange-500 border-orange-500';
      case 'Medium': return 'text-yellow-400 border-yellow-400';
      default: return 'text-cyber-blue border-cyber-blue';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toUpperCase()) {
        case 'CRITICAL': return 'bg-cyber-red text-black border-cyber-red';
        case 'HIGH': return 'bg-orange-500 text-black border-orange-500';
        case 'MEDIUM': return 'bg-yellow-400 text-black border-yellow-400';
        default: return 'bg-cyber-blue text-black border-cyber-blue';
    }
  };

  // Filter Logic
  const filteredPorts = scanData?.ports.filter(port => {
    const matchesRisk = riskFilter === 'ALL' || port.riskLevel.toUpperCase() === riskFilter;
    const matchesSearch = 
      port.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      port.port.toString().includes(searchQuery) ||
      (port.description && port.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRisk && matchesSearch;
  }) || [];

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden">
      
      {/* Left Panel: Controls & Terminal */}
      <div className="w-full md:w-1/3 flex flex-col gap-4 min-w-[300px]">
        {/* Input Form */}
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

        {/* Scan History */}
        {history.length > 0 && (
          <div className="bg-cyber-gray/50 border border-cyber-green/30 p-4 max-h-48 flex flex-col">
             <div className="flex items-center gap-2 mb-3 text-cyber-green/70 border-b border-cyber-green/20 pb-2">
                <History className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest">SESSION HISTORY</span>
             </div>
             <div className="overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {history.map((item) => (
                  <button 
                    key={item.timestamp}
                    onClick={() => loadHistoryItem(item)}
                    className="flex items-center justify-between p-2 text-xs border border-cyber-green/10 bg-black/40 hover:bg-cyber-green/10 hover:border-cyber-green/50 hover:text-cyber-blue transition-all group text-left"
                  >
                    <span className="font-mono font-bold truncate max-w-[120px]">{item.target}</span>
                    <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Terminal Output */}
        <div className="flex-1 bg-black border border-cyber-green/30 p-4 overflow-y-auto font-mono text-xs leading-relaxed relative min-h-[150px]">
            <div className="absolute top-0 right-0 p-2 opacity-50"><Terminal className="w-4 h-4"/></div>
            {logs.map((log) => (
              <div key={log.id} className="mb-1 text-cyber-green/80 break-words">
                <span className="opacity-50 mr-2">[{log.timestamp}]</span>
                <TypewriterText text={log.text} />
              </div>
            ))}
            {loading && <div className="animate-pulse">_</div>}
            <div ref={logsEndRef} />
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

             {/* Filter Toolbar */}
             <div className="px-6 py-3 border-b border-cyber-green/20 bg-black/60 backdrop-blur flex flex-wrap gap-4 items-center z-10 shrink-0">
               <div className="flex items-center gap-2 text-cyber-green/70">
                 <Filter className="w-4 h-4" />
                 <span className="text-xs font-bold tracking-wider">FILTERS:</span>
               </div>
               
               <select 
                 value={riskFilter}
                 onChange={(e) => setRiskFilter(e.target.value)}
                 className="bg-black border border-cyber-green/30 text-xs text-cyber-green px-2 py-1 focus:outline-none focus:border-cyber-green hover:border-cyber-green uppercase cursor-pointer"
               >
                 <option value="ALL">ALL RISKS</option>
                 <option value="CRITICAL">CRITICAL</option>
                 <option value="HIGH">HIGH</option>
                 <option value="MEDIUM">MEDIUM</option>
                 <option value="LOW">LOW</option>
               </select>

               <div className="h-4 w-px bg-cyber-green/20 mx-2 hidden md:block"></div>

               <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                 <Search className="w-4 h-4 text-cyber-green/70" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="SEARCH SERVICE / PORT..."
                   className="bg-transparent border-b border-cyber-green/30 text-xs text-cyber-green w-full py-1 focus:outline-none focus:border-cyber-green placeholder-cyber-green/30"
                 />
               </div>
               
               <div className="text-xs text-cyber-green/50">
                  {filteredPorts.length} MATCHES
               </div>
             </div>

             {/* Ports Grid */}
             <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {filteredPorts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <Filter className="w-12 h-12 mb-2" />
                    <p className="text-sm">NO PORTS MATCH FILTER CRITERIA</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPorts.map((port, idx) => (
                      <div key={idx} className={`p-4 border bg-black/60 backdrop-blur-sm flex flex-col gap-2 group hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all ${getRiskColor(port.riskLevel)}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-2xl font-display font-bold">{port.port}</span>
                          <span className="text-xs px-2 py-1 border border-current opacity-80">{port.protocol}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                          {port.state === 'Open' ? <Activity className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          {port.service.toUpperCase()}
                        </div>
                        <p className="text-xs opacity-70 mt-1">{port.description}</p>
                        
                        {/* Vulnerabilities Section */}
                        {port.vulnerabilities && port.vulnerabilities.length > 0 && (
                          <div className="mt-3 space-y-2">
                             {port.vulnerabilities.map((vuln, vIdx) => (
                               <div key={vIdx} className="border-t border-current/20 pt-2 flex flex-col gap-1">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getSeverityBadgeColor(vuln.severity)}`}>
                                      {vuln.severity}
                                    </span>
                                    <a 
                                      href={`https://nvd.nist.gov/vuln/detail/${vuln.id}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[10px] underline decoration-dotted hover:decoration-solid hover:text-white flex items-center gap-1 opacity-80"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {vuln.id} <ExternalLink className="w-2 h-2" />
                                    </a>
                                  </div>
                                  <div className="flex items-start gap-1.5 opacity-80">
                                     <AlertTriangle className="w-3 h-3 min-w-[12px] mt-0.5 text-current opacity-70" />
                                     <span className="text-[10px] leading-tight">{vuln.description}</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};