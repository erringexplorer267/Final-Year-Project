import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface PolarDataPoint {
  angle: number;
  gain_db: number;
}

interface AntennaData {
  plot_metadata: {
    title: string;
  };
  polar_data: PolarDataPoint[];
  analysis: {
    half_power_beamwidth: string;
    lobes: string;
  };
}

const PolarPlotter = ({ data }: { data: AntennaData | null }) => {
  if (!data) return <div className="text-zinc-500 font-mono">Waiting for antenna data...</div>;

  const chartData = {
    labels: data.polar_data.map(d => `${d.angle}°`),
    datasets: [{
      label: 'Gain (dB)',
      data: data.polar_data.map(d => d.gain_db),
      backgroundColor: 'rgba(0, 243, 255, 0.2)', // Neon Cyan fill
      borderColor: '#00f3ff', // Neon Cyan border
      borderWidth: 2,
    }]
  };

  const options = {
    scales: {
      r: {
        min: -40, // Center point
        max: 0,   // Outer ring (Vmax)
        ticks: { color: '#64748b', backdropColor: 'transparent' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-2xl">
      <h3 className="text-cyan-400 font-mono mb-4">{data.plot_metadata.title}</h3>
      <PolarArea data={chartData} options={options} />
      <div className="mt-4 text-[12px] font-mono text-zinc-500">
        <p>Beamwidth: {data.analysis.half_power_beamwidth}</p>
        <p>Pattern: {data.analysis.lobes}</p>
      </div>
    </div>
  );
};

export default PolarPlotter;
