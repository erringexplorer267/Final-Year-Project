import React, { useState } from 'react';
import PolarPlotter from './components/PolarPlotter';
import { useOrchestrator } from './hooks/useOrchestrator';

/**
 * Main Dashboard Component
 */
const App = () => {
  const { antennaData, isScanning, setIsScanning, handleAIResponse } = useOrchestrator();

  // For testing: simulate receiving an AI response for final analysis
  const runFinalAnalysis = () => {
    setIsScanning(false);
    const mockResponse = JSON.stringify({
      plot_metadata: { title: "Analyzed Antenna Pattern" },
      polar_data: antennaData.polar_data,
      analysis: {
        half_power_beamwidth: "55.4°",
        lobes: "Highly directional, minimal side lobes"
      }
    });
    handleAIResponse(mockResponse);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white p-8 font-sans selection:bg-cyan-500/30">
      <header className="mb-12 flex justify-between items-end border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded-sm uppercase tracking-tighter">System Ready</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">
            ANTENNA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">DIGITAL TWIN</span>
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">RF Characterization & Vision Intelligence</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`px-6 py-2 rounded-full font-mono text-xs transition-all border ${
              isScanning 
                ? "bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20" 
                : "bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20"
            }`}
          >
            {isScanning ? "[ Terminate Scan ]" : "[ Resume Scan ]"}
          </button>
          <button 
            onClick={runFinalAnalysis}
            className="bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-6 py-2 rounded-full hover:bg-cyan-500/20 transition-all font-mono text-xs"
          >
            [ Generate Analysis ]
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Vision & Meter */}
        <div className="xl:col-span-5 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-400">Vision Intelligence</h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">FPS: 30.0</span>
            </div>
            
            <div className="bg-[#141822] aspect-video rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl group">
              <img 
                src="/api/video_feed" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                alt="Live Vision Feed"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="flex flex-col items-center gap-4">
                      <div class="w-12 h-12 border-2 border-dashed border-zinc-700 rounded-full animate-spin"></div>
                      <p class="text-zinc-600 font-mono text-xs tracking-widest uppercase">Establishing Feed Connection...</p>
                    </div>
                  `;
                }}
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded border border-white/10">
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Stream
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="bg-[#141822] p-6 rounded-2xl border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-2">Meter Reading</label>
              <div className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">
                {antennaData?.plot_metadata?.current_reading || "00.00"}
              </div>
            </div>
            <div className="bg-[#141822] p-6 rounded-2xl border border-white/5">
              <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-2">Latest Gain</label>
              <div className="text-4xl font-black text-green-400 font-mono tracking-tighter">
                {antennaData?.polar_data?.length > 0 ? antennaData.polar_data[antennaData.polar_data.length - 1].gain_db : "-00.0"}
                <span className="text-sm font-normal text-zinc-600 ml-1">dB</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Polar Plot */}
        <div className="xl:col-span-7">
          <section className="h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f3ff] animate-pulse" />
              <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-400">Radiation Pattern Analysis</h2>
            </div>
            
            <div className="h-[calc(100%-2rem)]">
              <PolarPlotter data={antennaData} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
