import React, { useState } from 'react';
import { analyzeLog } from '../services/geminiService';
import { FileText, Cpu, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const LogAnalyzer: React.FC = () => {
  const [logInput, setLogInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!logInput.trim()) return;
    setAnalyzing(true);
    setAnalysis('');
    try {
      const result = await analyzeLog(logInput);
      setAnalysis(result);
    } catch (error) {
      setAnalysis('**ERROR**: Analysis module failed to process input stream.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="bg-cyber-gray/50 border border-cyber-green/30 p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-display flex items-center gap-2">
              <FileText className="w-5 h-5" /> INPUT LOGS
            </h2>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-4 py-2 bg-cyber-green text-black font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {analyzing ? 'PROCESSING...' : 'INITIATE ANALYSIS'}
            </button>
          </div>
          <textarea
            className="flex-1 w-full bg-black border border-cyber-green/30 p-4 font-mono text-xs text-cyber-green/80 focus:outline-none focus:border-cyber-green resize-none custom-scrollbar"
            placeholder="PASTE NMAP OUTPUT OR SERVER LOGS HERE..."
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-black border border-cyber-green/30 p-6 overflow-y-auto relative">
        <div className="absolute top-0 right-0 p-2 opacity-30">
          <Cpu className="w-6 h-6" />
        </div>
        {!analysis && !analyzing && (
           <div className="h-full flex flex-col items-center justify-center opacity-40">
             <AlertTriangle className="w-16 h-16 mb-4" />
             <p>NO DATA DETECTED</p>
           </div>
        )}
        {analyzing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="animate-pulse">DECRYPTING PATTERNS...</p>
            </div>
          </div>
        )}
        {analysis && (
          <div className="prose prose-invert prose-p:text-sm prose-headings:text-cyber-green prose-headings:font-display prose-pre:bg-cyber-gray prose-pre:border prose-pre:border-cyber-green/30 max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};