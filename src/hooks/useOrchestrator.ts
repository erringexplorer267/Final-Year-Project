import { useState, useEffect } from 'react';

/**
 * Orchestrator Hook
 * Manages the state of antenna data and handles incoming AI responses or data streams.
 */
export const useOrchestrator = () => {
  const [antennaData, setAntennaData] = useState<any>({
    plot_metadata: { title: "Live Antenna Pattern", current_reading: "0.00" },
    polar_data: [],
    analysis: { half_power_beamwidth: "0°", lobes: "Synchronizing..." }
  });
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(async () => {
      try {
        // Task 3: Zero-Failure Polling via /api bridge
        const response = await fetch('/api/get_data');
        const data = await response.json();
        
        if (data.gain_db !== undefined) {
          setAntennaData((prev: any) => {
            // Use the angle (theta) provided by the backend to ensure sync
            const newPoint = { angle: data.theta, gain_db: data.gain_db };
            
            // Check if we already have this angle to avoid duplicates
            const filteredPoints = prev.polar_data.filter((p: any) => p.angle !== data.theta);
            const updatedPoints = [...filteredPoints, newPoint].sort((a, b) => a.angle - b.angle);
            
            return {
              ...prev,
              polar_data: updatedPoints,
              plot_metadata: {
                ...prev.plot_metadata,
                current_reading: data.current_v.toFixed(2)
              }
            };
          });
        }
      } catch (e) {
        console.warn("Bridge connection failed. Retrying...");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleAIResponse = (aiResponse: string) => {
    try {
      const parsedData = JSON.parse(aiResponse);
      setAntennaData(parsedData);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }
  };

  return {
    antennaData,
    setAntennaData,
    isScanning,
    setIsScanning,
    handleAIResponse
  };
};
