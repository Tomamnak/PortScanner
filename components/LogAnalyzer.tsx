import React, { useState, useRef } from 'react';
import { analyzeLog } from '../services/geminiService';
import { FileText, Cpu, AlertTriangle, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const LogAnalyzer: React.FC = () => {
  const [logInput, setLogInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setLogInput(text);
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be selected again if needed
    event.target.value = '';
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="bg-cyber-gray/50 border border-cyber-green/30 p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-display flex items-center gap-2 text-cyber-green">
              <FileText className="w-5 h-5" /> INPUT LOGS
            </h2>
            
            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".txt,.log,.xml,.nmap"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing}
                className="flex items-center gap-2 px-3 py-1 border border-cyber-green/50 text-cyber-green text-xs font-bold hover:bg-cyber-green hover:text-black transition-all disabled:opacity-50"
              >
                <Upload className="w-3 h-3" /> IMPORT FILE
              </button>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-1 bg-cyber-green text-black font-bold text-xs hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_10px_rgba(0,255,65,0.2)]"
              >
                {analyzing ? 'PROCESSING...' : 'INITIATE ANALYSIS'}
              </button>
            </div>
          </div>
          
          <textarea
            className="flex-1 w-full bg-black border border-cyber-green/30 p-4 font-mono text-xs text-cyber-green/80 focus:outline-none focus:border-cyber-green resize-none custom-scrollbar placeholder-cyber-green/30"
            placeholder="PASTE NMAP OUTPUT OR IMPORT LOG FILE..."
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-black border border-cyber-green/30 p-6 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 right-0 p-2 opacity-30">
          <Cpu className="w-6 h-6" />
        </div>
        {!analysis && !analyzing && (
           <div className="h-full flex flex-col items-center justify-center opacity-40">
             <AlertTriangle className="w-16 h-16 mb-4" />
             <p className="tracking-widest">NO DATA DETECTED</p>
           </div>
        )}
        {analyzing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyber-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="animate-pulse tracking-widest">DECRYPTING PATTERNS...</p>
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