import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Scanner } from './components/Scanner';
import { LogAnalyzer } from './components/LogAnalyzer';
import { Tab } from './types';
import { Radar, Terminal, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SCANNER);

  return (
    <Layout>
      {/* Navigation Tabs */}
      <div className="flex border-b border-cyber-green/30 mb-6 bg-black/50 backdrop-blur-sm z-30">
        <button
          onClick={() => setActiveTab(Tab.SCANNER)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider transition-all border-r border-cyber-green/30 hover:bg-cyber-green/10 ${
            activeTab === Tab.SCANNER 
              ? 'text-cyber-black bg-cyber-green' 
              : 'text-cyber-green'
          }`}
        >
          <Radar className="w-4 h-4" /> PROFILER
        </button>
        <button
          onClick={() => setActiveTab(Tab.LOG_ANALYZER)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider transition-all border-r border-cyber-green/30 hover:bg-cyber-green/10 ${
            activeTab === Tab.LOG_ANALYZER 
              ? 'text-cyber-black bg-cyber-green' 
              : 'text-cyber-green'
          }`}
        >
          <Terminal className="w-4 h-4" /> LOG ANALYZER
        </button>
        <button
          onClick={() => setActiveTab(Tab.ABOUT)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider transition-all border-r border-cyber-green/30 hover:bg-cyber-green/10 ml-auto ${
            activeTab === Tab.ABOUT 
              ? 'text-cyber-black bg-cyber-green' 
              : 'text-cyber-green'
          }`}
        >
          <Info className="w-4 h-4" /> INFO
        </button>
      </div>

      {/* Main Content View */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === Tab.SCANNER && <Scanner />}
        {activeTab === Tab.LOG_ANALYZER && <LogAnalyzer />}
        {activeTab === Tab.ABOUT && (
          <div className="h-full flex items-center justify-center p-8 text-center max-w-2xl mx-auto">
            <div className="border border-cyber-green p-8 bg-black/80 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,65,0.1)]">
              <h2 className="text-2xl font-display mb-4 text-cyber-blue">SYSTEM DISCLAIMER</h2>
              <p className="mb-4 opacity-80 leading-relaxed">
                NetVision AI is a <strong>simulation and educational tool</strong>. It uses the Gemini AI model to predict likely open ports and services based on public knowledge of domain types and service architectures.
              </p>
              <p className="mb-6 opacity-80 leading-relaxed text-cyber-red">
                It does <strong>NOT</strong> perform actual packet-level port scanning (TCP/UDP) of remote targets. Real port scanning requires direct raw socket access which browsers prevent for security.
              </p>
              <div className="text-xs font-mono p-4 bg-cyber-gray border border-cyber-green/30 text-left">
                <p>> PROTOCOL: SIMULATION_ONLY</p>
                <p>> ACTIVE_SCAN: DISABLED</p>
                <p>> AI_CORE: ONLINE</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;